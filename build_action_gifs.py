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
    "全家福.jpg",
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
    # KM 论坛的 HTML 白名单不识别 <figcaption> 标签，导致图说没样式 / 直接被剥掉。
    # 把所有 figcaption 换成 <p>（基础标签 100% 兼容），并赋予更显眼的图说样式。
    inlined = convert_figcaption_to_p(inlined)
    print("  CSS 已全部内联到 style=\"\" 属性")
    return inlined


def convert_figcaption_to_p(html: str) -> str:
    """把 <figcaption ...> 替换为带图说样式的 <p>，</figcaption> 替换为 </p>。"""
    caption_style = (
        "margin:14px auto 0; max-width:560px; text-align:center; "
        "color:#6E6259; font-size:14px; font-style:italic; "
        "line-height:1.65; padding:0 12px;"
    )
    html = re.sub(
        r"<figcaption\b[^>]*>",
        f'<p style="{caption_style}">',
        html,
    )
    html = html.replace("</figcaption>", "</p>")
    return html


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


def build_km_html() -> Path:
    """从 BLOG_forum.html 派生一个『KM 上传指引版』。

    KM 论坛会过滤所有外部域名的 <img>，必须用 KM 编辑器手动上传图片。
    这一版把每个 <img> 替换成红色虚线占位框，框里写清"应该在这里插入哪张图、
    本地路径在哪"，方便用户对照着 public/ 里的文件逐张上传。
    """
    src = (ROOT / "BLOG_forum.html").read_text(encoding="utf-8")

    counter = {"n": 0}

    # public/ 下文件 → 友好说明
    file_hints = {
        "today.jpg": "8 帧精灵图（today.jpg，约 130 KB）",
        "动作切换.jpg": "状态机示意图（动作切换.jpg，约 300 KB）",
        "welcomepage.jpg": "网站首页第一屏（welcomepage.jpg）",
        "welcomepage2.jpg": "网站第四屏 / 桌面演示（welcomepage2.jpg）",
        "验证1.jpg": "第一次安装的拦截弹窗（验证1.jpg）",
        "验证2.jpg": "系统设置 → 仍要打开（验证2.jpg）",
        "验证3.jpg": "二次确认对话框（验证3.jpg）",
        "演示视频封面.jpg": "演示视频封面图（演示视频封面.jpg）",
        "演示视频.mp4": "真机演示视频（演示视频.mp4，约 1.9 MB）",
    }

    def make_placeholder(filename: str, friendly: str) -> str:
        counter["n"] += 1
        idx = counter["n"]
        return (
            f'<div style="margin:24px auto; padding:24px 20px; '
            f'border:2px dashed #C4704B; border-radius:6px; '
            f'background:#FFF5EB; text-align:center; max-width:560px;">'
            f'<div style="font-size:13px; color:#C4704B; font-weight:600; '
            f'letter-spacing:1px; margin-bottom:8px;">📌 占位 {idx:02d}</div>'
            f'<div style="font-size:15px; color:#5A4A3C; line-height:1.7; '
            f'margin-bottom:6px;">请在此处用 KM 编辑器「插入图片」上传：</div>'
            f'<div style="font-size:14px; color:#8A6A4A; '
            f'font-family:Menlo,Consolas,monospace;">{friendly}</div>'
            f'<div style="font-size:12px; color:#9C8B7A; margin-top:8px;">'
            f'本地路径：<code>desktop-pet-web/public/{filename}</code></div>'
            f'</div>'
        )

    # 1) 先处理演示视频整段 <figure>（含封面图 + 跳转链接），替换成单一视频占位
    #    必须先于 img 替换执行，否则内部封面图会先被识别为图片占位、再被视频整段覆盖，
    #    造成 placeholder 编号被多算一个。
    video_block_pattern = re.compile(
        r'<figure[^>]*>\s*<a[^>]*href="https://my-pet-heart\.vercel\.app/[^"]*\.mp4[^"]*"[^>]*>.*?</figure>',
        flags=re.DOTALL,
    )

    def make_video_placeholder(_m: re.Match) -> str:
        counter["n"] += 1
        idx = counter["n"]
        return (
            f'<div style="margin:32px auto; padding:28px 24px; '
            f'border:2px dashed #C4704B; border-radius:6px; '
            f'background:#FFF5EB; text-align:center; max-width:600px;">'
            f'<div style="font-size:13px; color:#C4704B; font-weight:600; '
            f'letter-spacing:1px; margin-bottom:10px;">🎬 占位 {idx:02d} · 演示视频</div>'
            f'<div style="font-size:15px; color:#5A4A3C; line-height:1.7; '
            f'margin-bottom:8px;">如 KM 允许上传视频：用 KM 编辑器直接上传 '
            f'<code style="font-family:Menlo,Consolas,monospace;">演示视频.mp4</code>。</div>'
            f'<div style="font-size:14px; color:#6E6356; line-height:1.7; '
            f'margin-bottom:8px;">如果 KM 不允许视频：用「插入图片」上传 '
            f'<code style="font-family:Menlo,Consolas,monospace;">演示视频封面.jpg</code>，'
            f'并把它做成超链接，跳转到下面这个地址：</div>'
            f'<div style="font-size:13px; color:#C4704B; word-break:break-all;">'
            f'https://my-pet-heart.vercel.app/</div>'
            f'<div style="font-size:12px; color:#9C8B7A; margin-top:10px; '
            f'line-height:1.6;">真机演示：上传照片生成 Q 版形象、切换形象、走路 / 睡觉 / 开心 / 拖拽 等状态在桌面上的实际表现。</div>'
            f'</div>'
        )

    out = video_block_pattern.sub(make_video_placeholder, src)

    # 2) 替换剩下的所有 vercel <img>（动作 GIF + 普通插图）
    def repl_vercel_img(m: re.Match) -> str:
        url = m.group(0)
        from urllib.parse import unquote
        path = unquote(url).split("my-pet-heart.vercel.app/", 1)[1]
        fname = path.split("/")[-1]
        # 动作 GIF 用动作名称
        if path.startswith("blog-actions/"):
            action = fname.replace(".gif", "")
            friendly = f"{action} 动作 GIF（public/blog-actions/{fname}）"
            return make_placeholder(f"blog-actions/{fname}", friendly)
        friendly = file_hints.get(fname, fname)
        return make_placeholder(fname, friendly)

    def repl_img_tag(m: re.Match) -> str:
        img_tag = m.group(0)
        src_match = re.search(r'src="(https://my-pet-heart\.vercel\.app/[^"]+)"', img_tag)
        if not src_match:
            return img_tag
        return repl_vercel_img(src_match)

    out = re.sub(r'<img\b[^>]*src="https://my-pet-heart\.vercel\.app[^"]*"[^>]*>',
                 repl_img_tag, out)

    # 3) 在最开头加一个使用说明卡片
    intro = (
        '<div style="margin:0 auto 28px; padding:18px 22px; max-width:600px; '
        'background:#FFFAF0; border:1px solid #E8DFD0; border-left:4px solid #C4704B; '
        'border-radius:4px; font-size:14px; line-height:1.75; color:#5A4A3C;">'
        f'<div style="font-weight:600; margin-bottom:6px;">📋 KM 论坛上传说明（共 {counter["n"]} 处占位）</div>'
        '本文里的所有图片 / 视频已被换成红色虚线占位框。粘贴到 KM 编辑器后，请按占位框里写的「本地路径」'
        '和「占位编号」从 <code style="font-family:Menlo,Consolas,monospace;">desktop-pet-web/public/</code> 里逐张上传。'
        '上传完一张后，把对应的占位框整段删掉即可。'
        '<br><span style="color:#9C8B7A; font-size:12px;">这一步因为 KM 不允许外部域名图片，所以图片必须用 KM 编辑器内置的"插入图片"上传到 KM 自己的图床。</span>'
        '</div>'
    )
    # 把 intro 插在第一个 <h1> 之前
    out = out.replace('<h1', intro + '<h1', 1)

    out_path = ROOT / "BLOG_km.html"
    out_path.write_text(out, encoding="utf-8")
    print(f"\nKM 上传指引版 -> {out_path.name}  ({counter['n']} 个占位框)")
    return out_path


def build_wechat_html(gif_paths: dict[str, Path]) -> Path:
    """生成微信公众号排版版 'BLOG_forum copy.html'。

    特点：
    - 排版风格按公众号习惯：系统字体、17px 字号、1.95 行高、24px 段间距、移动端为主
    - 所有 CSS 全部 inline（公众号会剥 <style> 和 class）
    - 图片用 base64 内联保留：公众号 PC 编辑器粘贴 base64 图片时会自动识别并上传到素材库
    - 视频换成"占位提示卡"：公众号不接受任何 <video>，必须用编辑器顶部「视频」按钮单独插入
    - h2 装饰用真实 span 节点（::before 公众号也不支持）
    """
    src_html = (ROOT / "BLOG.html").read_text(encoding="utf-8")

    # 1) 在原 <style> 末尾追加一份「公众号风格覆盖」CSS，CSS 后定义优先级更高
    wechat_overrides = """
/* === 公众号专用覆盖：移动端友好 / 系统字体 / 大字号大段距 === */
html, body {
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif !important;
  font-size: 17px !important;
  line-height: 1.95 !important;
  background: #FFFFFF !important;
}
.article {
  max-width: 100% !important;
  padding: 24px 0 60px !important;
}
h1.title {
  font-size: 26px !important;
  letter-spacing: 1px !important;
  margin: 0 0 14px !important;
}
.meta {
  font-size: 13px !important;
  margin: 0 0 40px !important;
  letter-spacing: 0.5px !important;
}
h2 {
  font-size: 21px !important;
  margin-top: 56px !important;
  margin-bottom: 18px !important;
  padding-left: 0 !important;
  letter-spacing: 0.5px !important;
}
p {
  margin: 0 0 24px !important;
  letter-spacing: 0.3px !important;
  text-align: justify !important;
}
.divider {
  margin: 44px 0 !important;
  letter-spacing: 18px !important;
  font-size: 13px !important;
}
code {
  font-size: 14.5px !important;
  padding: 1px 6px !important;
  background: #F6EFE0 !important;
}
a {
  color: #C4704B !important;
  border-bottom: 1px solid rgba(196, 112, 75, 0.3) !important;
}
.actions-grid {
  /* 公众号容器宽度有限，4 列改 2 列 */
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 16px 12px !important;
}
.install-guide .ig-steps {
  /* 同理，3 列改 1 列堆叠 */
  grid-template-columns: 1fr !important;
  gap: 14px !important;
}
.install-guide .ig-step img {
  height: auto !important;
  max-height: 240px !important;
}
"""
    src_html = src_html.replace("</style>", wechat_overrides + "\n</style>", 1)

    # 2) 把动作 GIF 的 <img data-action="xxx"> 替换为 base64 内联
    def replace_action_img(m: re.Match) -> str:
        full = m.group(0)
        action = m.group("action")
        if action not in gif_paths:
            return full
        data_uri = to_data_uri(gif_paths[action])
        cleaned = re.sub(r'\s+data-(action|frames|fps)="[^"]*"', "", full)
        if 'src="' in cleaned:
            cleaned = re.sub(r'\s+src="[^"]*"', "", cleaned)
        return cleaned.replace("<img", f'<img src="{data_uri}"', 1)

    new_html = re.sub(
        r'<img[^>]*data-action="(?P<action>[^"]+)"[^>]*>',
        replace_action_img,
        src_html,
    )

    # 3) 普通插图：base64 内联
    for fname in EXTRA_FIGURES:
        fpath = ROOT / "public" / fname
        if not fpath.exists():
            continue
        data_uri = to_data_uri(fpath)
        pattern = re.compile(rf'src=["\']{re.escape(fname)}["\']')
        new_html = pattern.sub(f'src="{data_uri}"', new_html)

    # 4) 演示视频整段替换为「公众号视频组件提示」
    video_placeholder = (
        '<section style="margin:32px auto; padding:24px 20px; '
        'border:2px dashed #C4704B; border-radius:6px; '
        'background:#FFF5EB; text-align:center;">'
        '<p style="margin:0 0 10px; font-size:13px; color:#C4704B; '
        'font-weight:600; letter-spacing:1px;">🎬 这里要插入演示视频</p>'
        '<p style="margin:0 0 8px; font-size:15px; color:#5A4A3C; line-height:1.7;">'
        '请用公众号编辑器顶部工具栏的「视频」按钮插入。</p>'
        '<p style="margin:0 0 8px; font-size:14px; color:#6E6356; line-height:1.7;">'
        '推荐做法：先把 <code style="font-family:Menlo,monospace; background:#F6EFE0; padding:1px 6px;">演示视频.mp4</code> '
        '上传到腾讯视频，公众号视频选择器里搜索后插入。</p>'
        '<p style="margin:0; font-size:13px; color:#9C8B7A; line-height:1.6;">'
        '真机演示：上传照片生成 Q 版形象、切换形象、走路 / 睡觉 / 开心 / 拖拽 等状态在桌面上的实际表现。</p>'
        '</section>'
    )
    new_html = re.sub(
        r'<figure\s+class="demo-video">.*?</figure>',
        video_placeholder,
        new_html,
        flags=re.DOTALL,
    )

    # 5) 去 <script>
    new_html = re.sub(r"<script\b[^>]*>.*?</script>", "", new_html, flags=re.DOTALL)

    # 6) premailer 内联所有 CSS、去 class、去残留 <style>、补回伪元素装饰
    new_html = inline_all_css(new_html)

    out_path = ROOT / "BLOG_forum copy.html"
    out_path.write_text(new_html, encoding="utf-8")
    print(f"\n微信公众号排版版 -> {out_path.name}  ({out_path.stat().st_size/1024:5.1f} KB)")
    return out_path


def main() -> None:
    print("生成 GIF：")
    gif_paths: dict[str, Path] = {}
    for action, frames, fps in ACTIONS:
        gif_paths[action] = build_gif(action, frames, fps)

    build_forum_html(gif_paths)
    build_km_html()
    build_wechat_html(gif_paths)
    print("\n完成。")


if __name__ == "__main__":
    main()
