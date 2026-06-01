import { useEffect, useState } from "react";

interface NavBarProps {
  /** 点击下载时滚到底部下载区（仍触发） */
  onDownloadClick: () => void;
  /** 同时让浏览器原地下载的 dmg 路径 */
  downloadUrl?: string;
  /** 浏览器保存的文件名 */
  downloadFilename?: string;
  githubUrl?: string;
}

/**
 * 顶栏（sticky 吸顶，毛玻璃白底，但用纯暖纸代替毛玻璃保持手账感）
 * - 首屏：下载按钮是透明描边
 * - 滚动后：下载按钮变成实色填充
 * - 点击下载按钮：触发浏览器原地下载 + 同步把页面滚到底部仪式感区域
 */
export function NavBar({ onDownloadClick, downloadUrl, downloadFilename, githubUrl }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      // 当滚动距离超过半屏时切换样式
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 100,
        background: scrolled ? "rgba(250, 246, 238, 0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? "1px dashed var(--ink-faint)" : "1px solid transparent",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        padding: "0 36px",
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
          color: "var(--ink)",
        }}
      >
        <span style={{ fontSize: 22 }}>🐾</span>
        <span
          style={{
            fontFamily: "var(--font-cn)",
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: 2,
          }}
        >
          桌面宠物
        </span>
      </a>

      <div style={{ flex: 1 }} />

      {/* 右侧链接组 */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              textDecoration: "none",
              fontFamily: "var(--font-en)",
              letterSpacing: 1,
              transition: "color 0.2s ease",
            }}
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
        {/* 下载按钮：用 <a download> 触发浏览器原地下载；同时附带滚动到底部以呼应仪式感 */}
        <a
          href={downloadUrl ?? "#download"}
          download={downloadFilename ?? true}
          onClick={() => {
            onDownloadClick();
          }}
          className={"btn-nav-download" + (scrolled ? " scrolled" : "")}
        >
          <span style={{ fontFamily: "var(--font-en)" }}>↓</span>
          下载
        </a>
      </div>
    </nav>
  );
}
