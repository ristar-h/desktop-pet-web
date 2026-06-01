import { useFrameAnimation } from "../hooks/useFrameAnimation";
import { HeartDeco, SparkleDeco, WavyUnderline, StarDeco } from "./Decorations";

interface DownloadSectionProps {
  /** 下载链接（同源相对路径触发原地下载，否则会被当作导航） */
  downloadUrl: string;
  /** 浏览器下载时保存的文件名 */
  downloadFilename?: string;
  version: string;
  fileSize: string;
  githubUrl?: string;
}

/**
 * 第四屏：仪式感下载区 + Footer
 *  - 中央 idle 动画的小女孩
 *  - 标语 + 大下载按钮
 *  - 系统要求小字
 *  - 底部 Footer
 */
export function DownloadSection({
  downloadUrl,
  downloadFilename,
  version,
  fileSize,
  githubUrl,
}: DownloadSectionProps) {
  const { frameUrl } = useFrameAnimation("idle");

  return (
    <section
      id="download"
      className="snap-section"
      style={{ position: "relative", justifyContent: "space-between" }}
    >
      {/* 装饰 */}
      <SparkleDeco
        size={20}
        color="var(--accent)"
        className="float-deco"
        style={{ top: "12%", left: "14%", animation: "shimmerStar 2.8s ease-in-out infinite" }}
      />
      <SparkleDeco
        size={14}
        color="var(--butter)"
        className="float-deco"
        style={{ top: "22%", right: "16%", animation: "shimmerStar 2.4s ease-in-out infinite", animationDelay: "0.6s" }}
      />
      <HeartDeco
        size={16}
        className="float-deco"
        style={{ top: "30%", left: "10%", animation: "float 4.5s ease-in-out infinite" }}
      />
      <StarDeco
        size={18}
        color="var(--sage)"
        className="float-deco"
        style={{ bottom: "28%", right: "12%", animation: "floatSlow 5s ease-in-out infinite", animationDelay: "1s" }}
      />

      {/* 主内容 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          maxWidth: 720,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* idle 小女孩 */}
        <div
          style={{
            width: 200,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            animation: "fadeUp 0.6s ease-out",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 8,
              width: 140,
              height: 12,
              borderRadius: "50%",
              background: "rgba(80, 50, 30, 0.08)",
              filter: "blur(6px)",
              zIndex: 0,
            }}
          />
          <img
            src={frameUrl}
            alt="桌宠"
            style={{
              width: 180,
              height: 180,
              objectFit: "contain",
              position: "relative",
              zIndex: 1,
            }}
            draggable={false}
          />
        </div>

        {/* 标题 */}
        <div style={{ textAlign: "center", animation: "fadeUp 0.7s ease-out 0.1s backwards" }}>
          <p
            style={{
              fontSize: 12,
              color: "var(--accent)",
              letterSpacing: 4,
              fontFamily: "var(--font-en)",
              fontStyle: "italic",
              marginBottom: 10,
            }}
          >
            — bring her home —
          </p>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: "var(--ink)",
              letterSpacing: 4,
              fontFamily: "var(--font-cn)",
              margin: 0,
            }}
          >
            让 TA 来 你 的 桌 面 吧
          </h2>
          <div style={{ marginTop: 16 }}>
            <WavyUnderline width={120} color="var(--accent)" />
          </div>
          <p
            style={{
              fontSize: 14,
              color: "var(--ink-soft)",
              marginTop: 18,
              letterSpacing: 1.5,
              fontFamily: "var(--font-cn)",
              fontStyle: "italic",
            }}
          >
            给键盘前的你 · 一份小小的陪伴
          </p>
        </div>

        {/* 大下载按钮 */}
        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            animation: "fadeUp 0.8s ease-out 0.2s backwards",
          }}
        >
          <a
            href={downloadUrl}
            download={downloadFilename ?? true}
            className="btn-primary"
            style={{
              padding: "16px 56px",
              fontSize: 16,
              letterSpacing: 4,
            }}
          >
            <span style={{ fontFamily: "var(--font-en)", fontSize: 18 }}>↓</span>
            下 载 macOS 版
          </a>
          <p
            style={{
              fontSize: 12,
              color: "var(--ink-muted)",
              letterSpacing: 1,
              fontFamily: "var(--font-num)",
              fontStyle: "italic",
            }}
          >
            v{version} · {fileSize}
          </p>
          <p
            style={{
              fontSize: 11,
              color: "var(--ink-muted)",
              letterSpacing: 1,
              fontFamily: "var(--font-en)",
              marginTop: -4,
            }}
          >
            · macOS 12+ · Apple Silicon · Intel ·
          </p>

          {/* API key 前置说明 */}
          <div
            style={{
              marginTop: 18,
              padding: "12px 18px",
              background: "var(--paper-elevated)",
              border: "1px dashed var(--accent-border)",
              borderRadius: "var(--radius-md)",
              maxWidth: 380,
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "var(--ink-soft)",
                letterSpacing: 0.5,
                lineHeight: 1.7,
                fontFamily: "var(--font-cn)",
                margin: 0,
                textAlign: "center",
              }}
            >
              <span style={{ color: "var(--accent)" }}>ⓘ</span>{" "}
              首次启动需配置 Evolink API key，
              <a
                href="https://docs.evolink.ai/cn/quickstart"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  borderBottom: "1px dashed var(--accent-border)",
                  paddingBottom: 1,
                }}
              >
                获取教程
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer githubUrl={githubUrl} />
    </section>
  );
}

function Footer({ githubUrl }: { githubUrl?: string }) {
  return (
    <footer
      style={{
        width: "100%",
        maxWidth: 1100,
        margin: "0 auto",
        paddingTop: 24,
        borderTop: "1px dashed var(--ink-faint)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <p
        style={{
          fontSize: 12,
          color: "var(--ink-muted)",
          fontFamily: "var(--font-cn)",
          letterSpacing: 0.5,
          margin: 0,
        }}
      >
        <span style={{ fontFamily: "var(--font-num)" }}>© 2026</span>
        <span style={{ margin: "0 10px", color: "var(--ink-faint)" }}>·</span>
        made with <span style={{ fontSize: 13 }}>🍵</span>
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 12,
          fontFamily: "var(--font-en)",
          letterSpacing: 1,
        }}
      >
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--ink-soft)", textDecoration: "none", transition: "color 0.18s" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--ink-soft)";
            }}
          >
            GitHub
          </a>
        )}
      </div>
    </footer>
  );
}
