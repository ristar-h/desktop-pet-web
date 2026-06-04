"""
把每个动作的 PNG 帧序列压成一张 GIF，并生成论坛版 HTML（资源走 Vercel 公网 URL）。

使用：
    python3 build_action_gifs.py

输出：
    blog-actions/{action}.gif         独立 GIF 文件
    public/blog-actions/{action}.gif  同步副本（vercel 部署后可公开访问）
    BLOG_forum.html                   论坛版（资源 src 都指向 https://my-pet-heart.vercel.app/...）

生成完之后需要 vercel deploy 一下，让论坛 HTML 引用的 URL 可访问。
"""

from __future__ import annotations

import base64
import io
import re
import shutil
import urllib.parse
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).parent
SRC_ROOT = ROOT / "public" / "avatars" / "main"
OUT_DIR = ROOT / "blog-actions"
PUBLIC_GIF_DIR = ROOT / "public" / "blog-actions"
OUT_DIR.mkdir(exist_ok=True)
PUBLIC_GIF_DIR.mkdir(exist_ok=True)

# 论坛版资源指向的公网域名
PUBLIC_BASE_URL = "https://my-pet-heart.vercel.app"

# 与 BLOG.html 里 data-fps 保持一致
ACTIONS = [
    ("idle",           8, 6),
    ("happy",          8, 10),
    ("walk",           8, 10),
    ("looking_around", 8, 6),
    ("sleep",          6, 3),
    ("stretch",        8, 8),
    ("sad",            6, 5),
    ("drag",           6, 8),
]


def build_gif(action: str, frames: int, fps: float) -> Path:
    """从 PNG 帧序列生成 GIF。"""
    images: list[Image.Image] = []
    for i in range(1, frames + 1):
        p = SRC_ROOT / action / f"{i:02d}.png"
        im = Image.open(p).convert("RGBA")
        # 缩到 168x168（在视网膜屏上更清晰，CSS 显示为 84px）
        im = im.resize((168, 168), Image.LANCZOS)

        # GIF 不支持 alpha 半透明，用白色背景合成（与卡片底色匹配）
        bg = Image.new("RGB", im.size, (251, 247, 239))  # #FBF7EF
        bg.paste(im, mask=im.split()[3])
        images.append(bg)

    out_path = OUT_DIR / f"{action}.gif"
    duration_ms = int(1000 / fps)
    images[0].save(
        out_path,
        save_all=True,
        append_images=images[1:],
        duration=duration_ms,
        loop=0,
        optimize=True,
        disposal=2,
    )
    # 同步一份到 public/blog-actions/ 让 vercel 部署后能直接访问
    public_copy = PUBLIC_GIF_DIR / f"{action}.gif"
    shutil.copyfile(out_path, public_copy)
    print(f"  {action:18s} -> {out_path.name}  ({out_path.stat().st_size/1024:5.1f} KB, {fps} fps)")
    return out_path


def to_data_uri(path: Path) -> str:
    data = path.read_bytes()
    b64 = base64.b64encode(data).decode("ascii")
    suffix = path.suffix.lower().lstrip(".")
    mime = {
        "gif": "image/gif",
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "mp4": "video/mp4",
    }[suffix]
    return f"data:{mime};base64,{b64}"


# 普通博客插图：列出文件名，论坛版会替换为 https://my-pet-heart.vercel.app/<filename>
EXTRA_FIGURES = [
    "today.jpg",
    "动作切换.jpg",
    "welcomepage.jpg",
    "welcomepage2.jpg",
    "验证1.jpg",
    "验证2.jpg",
    "验证3.jpg",
]


def public_url(path: str) -> str:
    """把站内相对路径转成 vercel 公网 URL，并对中文文件名做 URL 编码。"""
    # 中文 / 空格等需要 percent-encode；保留 / 和 - . _
    encoded = urllib.parse.quote(path, safe="/-._")
    return f"{PUBLIC_BASE_URL}/{encoded.lstrip('/')}"


def build_forum_html(gif_paths: dict[str, Path]) -> Path:
    """生成论坛兼容版本：资源 src 全部指向 vercel 公网 URL，去掉 <script>。"""
    src_html = (ROOT / "BLOG.html").read_text(encoding="utf-8")

    # 1) 用公网 GIF URL 替换 <img data-action="xxx" ...> 的 src（动作动图）
    def replace_img(m: re.Match) -> str:
        full = m.group(0)
        action = m.group("action")
        if action not in gif_paths:
            return full
        gif_url = public_url(f"blog-actions/{action}.gif")
        # 删除 data-action / data-frames / data-fps，加上真实 src
        cleaned = re.sub(r'\s+data-(action|frames|fps)="[^"]*"', "", full)
        if 'src="' in cleaned:
            cleaned = re.sub(r'\s+src="[^"]*"', "", cleaned)
        cleaned = cleaned.replace("<img", f'<img src="{gif_url}"', 1)
        return cleaned

    new_html = re.sub(
        r'<img[^>]*data-action="(?P<action>[^"]+)"[^>]*>',
        replace_img,
        src_html,
    )

    # 2) 替换普通博客插图（today.jpg、动作切换.jpg、welcomepage.jpg、验证 1/2/3 等）
    for fname in EXTRA_FIGURES:
        url = public_url(fname)
        pattern = re.compile(rf'src=["\']{re.escape(fname)}["\']')
        new_html, n = pattern.subn(f'src="{url}"', new_html)
        print(f"  替换 {fname:24s} -> {url}  ({n} 处)")

    # 3) 把演示视频整段替换成「封面图 + 链接」结构。
    #    KM / 大多数论坛会把 <video> 标签整体过滤掉，没法原地播放；
    #    退化成「带播放按钮的封面图，点击跳转到 Vercel 网站观看」最稳。
    poster_url = public_url("演示视频封面.jpg")
    video_url = public_url("演示视频.mp4")
    site_url = f"{PUBLIC_BASE_URL}/"
    demo_block = (
        f'<figure style="margin:32px 0; text-align:center;">'
        f'<a href="{video_url}" target="_blank" rel="noopener" '
        f'style="display:inline-block; position:relative; max-width:100%; text-decoration:none;">'
        f'<img src="{poster_url}" alt="演示视频封面" '
        f'style="max-width:100%; height:auto; display:block; margin:0 auto; '
        f'border-radius:4px; border:1px solid #E8DFD0; background:#FBF7EF;">'
        # 中央播放图标（圆 + 三角）用纯 inline 样式画
        f'<span style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); '
        f'width:72px; height:72px; border-radius:50%; background:rgba(0,0,0,0.55); '
        f'box-shadow:0 4px 14px rgba(0,0,0,0.25);"></span>'
        f'<span style="position:absolute; top:50%; left:50%; '
        f'transform:translate(-40%,-50%); width:0; height:0; '
        f'border-left:20px solid #FFFDF8; border-top:13px solid transparent; '
        f'border-bottom:13px solid transparent;"></span>'
        f'</a>'
        f'<figcaption style="margin-top:12px; color:#8A7E72; font-size:13px; '
        f'font-style:italic; line-height:1.6; padding:0 8px;">'
        f'真机演示：上传照片生成 Q 版形象、切换形象、走路 / 睡觉 / 开心 / 拖拽 等状态在桌面上的实际表现。'
        f'<br>（点上图可在新窗口播放视频；也可以直接访问 '
        f'<a href="{site_url}" target="_blank" rel="noopener" '
        f'style="color:#C4704B; border-bottom:1px solid rgba(196,112,75,0.3);">my-pet-heart.vercel.app</a>）'
        f'</figcaption></figure>'
    )
    # 用宽松匹配（class 已被 BLOG.html 写死，但这里还没经过 premailer，所以仍带 class）
    new_html, n = re.subn(
        r'<figure\s+class="demo-video">.*?</figure>',
        demo_block,
        new_html,
        flags=re.DOTALL,
    )
    print(f"  演示视频区块替换为「封面图+链接」  ({n} 处)")

    # 4) 去掉 <script>...</script> 块（论坛会过滤）
    new_html = re.sub(
        r"<script\b[^>]*>.*?</script>",
        "",
        new_html,
        flags=re.DOTALL,
    )

    # 5) 把 <style> 里的 CSS 全部内联到每个元素的 style="" 属性上。
    #    KM 等论坛会过滤掉 <style> 标签和 class 属性，所以必须把样式直接挂到元素上。
    new_html = inline_all_css(new_html)

    out_path = ROOT / "BLOG_forum.html"
    out_path.write_text(new_html, encoding="utf-8")
    print(f"\n论坛版 HTML  -> {out_path.name}  ({out_path.stat().st_size/1024:5.1f} KB)")
    return out_path


def inline_all_css(html: str) -> str:
    """用 premailer 把 <style> 中的 CSS 全部内联到元素 style="" 上，并去掉 class。"""
    try:
        from premailer import Premailer
    except ImportError:
        print("  ! 未安装 premailer，跳过 CSS 内联（论坛粘贴可能样式丢失）")
        print("    安装：pip3 install --user --break-system-packages premailer")
        return html

    p = Premailer(
        html=html,
        remove_classes=True,           # 去掉所有 class 属性
        keep_style_tags=False,         # 把 <style> 标签删掉
        strip_important=False,         # 保留 !important
        cssutils_logging_level="CRITICAL",
        disable_validation=True,
        disable_leftover_css=True,     # 不保留无法内联的伪类（论坛也用不上）
        cache_css_parsing=False,
        # 不要把 CSS 的 width/height 自动写成 HTML 属性。
        # premailer 默认会做这件事，但 <video width="100%"> 是非法属性
        # （video 的 width 只接受像素整数），会导致视频以 0 宽度渲染、无法播放。
        disable_basic_attributes=["width", "height", "bgcolor"],
    )
    inlined = p.transform()
    # premailer 会把无法内联的伪元素 / @media 留在一个 <style> 块里，
    # 但论坛会把整段 <style> 过滤掉，留着没用反而占体积，干脆删掉。
    inlined = re.sub(r"<style\b[^>]*>.*?</style>", "", inlined, flags=re.DOTALL)
    # 论坛环境不支持 ::before / ::after 等伪元素，把原本靠伪元素绘制的
    # 小装饰用真实节点补回来：h2 前面的暖橘竖线、<li> 前面的破折号。
    inlined = restore_pseudo_decorations(inlined)
    print("  CSS 已全部内联到 style=\"\" 属性")
    return inlined


def restore_pseudo_decorations(html: str) -> str:
    """把 ::before / ::after 装饰用内联 <span> 节点补回来（仅论坛版用）。"""
    # 1) h2 标题：左侧加一条 3px × 0.9em 的暖橘竖线
    h2_bar = (
        '<span style="display:inline-block; width:3px; height:18px; '
        'background:#C4704B; border-radius:1px; vertical-align:-3px; '
        'margin-right:12px;"></span>'
    )

    def deco_h2(m: re.Match) -> str:
        opening = m.group(0)
        # 原来的 padding-left:16px 是给绝对定位的小圆点占位用的，
        # 现在用真实节点了，去掉这个内边距让标题更贴左。
        opening = re.sub(r"padding-left:\s*16px;?\s*", "", opening)
        return opening + h2_bar

    html = re.sub(r"<h2\b[^>]*>", deco_h2, html)

    # 2) <li> 前面加一个暖橘色破折号
    li_dash = (
        '<span style="color:#C4704B; font-weight:600; '
        'margin-right:10px;">—</span>'
    )
    html = re.sub(r"(<li\b[^>]*>)", lambda m: m.group(1) + li_dash, html)

    return html


def main() -> None:
    print("生成 GIF：")
    gif_paths: dict[str, Path] = {}
    for action, frames, fps in ACTIONS:
        gif_paths[action] = build_gif(action, frames, fps)

    build_forum_html(gif_paths)
    print("\n完成。")


if __name__ == "__main__":
    main()
