import { useEffect, useState } from "react";
import { useFrameAnimation } from "../hooks/useFrameAnimation";
import { LeafDeco, SparkleDeco, WavyUnderline } from "./Decorations";
import type { ActionKey } from "../data/actions";

const SCENARIOS: { action: ActionKey; trigger: string; result: string; emoji: string }[] = [
  { action: "walk", trigger: "鼠标长时间不动", result: "TA 自己走起来", emoji: "🐾" },
  { action: "sleep", trigger: "你离开太久", result: "TA 安静地睡了", emoji: "💤" },
  { action: "happy", trigger: "你点了 TA 一下", result: "TA 高兴地跳跳", emoji: "✨" },
  { action: "looking_around", trigger: "走累了", result: "TA 张望四周", emoji: "👀" },
];

/**
 * 第三屏：智能行为展示
 *  - 模拟 Mac 桌面，桌宠在桌面右下角播放当前 demo 动作
 *  - 4 张行为说明卡片，每 4 秒自动切换
 */
export function BehaviorSection() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const current = SCENARIOS[scenarioIdx];
  const { frameUrl } = useFrameAnimation(current.action);

  // 自动轮播场景
  useEffect(() => {
    const t = setInterval(() => {
      setScenarioIdx((prev) => (prev + 1) % SCENARIOS.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="behavior" className="snap-section" style={{ position: "relative" }}>
      <LeafDeco
        size={20}
        className="float-deco"
        style={{ top: "12%", left: "10%", animation: "floatSlow 5s ease-in-out infinite" }}
      />
      <SparkleDeco
        size={12}
        color="var(--rose)"
        className="float-deco"
        style={{ top: "16%", right: "14%", animation: "shimmerStar 2.6s ease-in-out infinite" }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* 标题 */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p
            style={{
              fontSize: 12,
              color: "var(--accent)",
              letterSpacing: 4,
              fontFamily: "var(--font-en)",
              fontStyle: "italic",
              marginBottom: 8,
            }}
          >
            — she has feelings —
          </p>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "var(--ink)",
              letterSpacing: 4,
              fontFamily: "var(--font-cn)",
              margin: 0,
            }}
          >
            她 有 自 己 的 小 情 绪
          </h2>
          <div style={{ marginTop: 16 }}>
            <WavyUnderline width={100} color="var(--accent)" />
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--ink-soft)",
              marginTop: 18,
              letterSpacing: 1,
              fontFamily: "var(--font-cn)",
              fontStyle: "italic",
            }}
          >
            根据你的鼠标和键盘行为，自动切换不同动作
          </p>
        </div>

        {/* 桌面模拟 + 当前场景 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1.2fr) minmax(260px, 1fr)",
            gap: 32,
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* 左：桌面截图模拟 */}
          <DesktopFrame frameUrl={frameUrl} />

          {/* 右：行为说明卡片 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SCENARIOS.map((s, idx) => {
              const isActive = idx === scenarioIdx;
              return (
                <div
                  key={s.action}
                  onClick={() => setScenarioIdx(idx)}
                  style={{
                    padding: "14px 18px",
                    background: isActive ? "var(--accent-bg)" : "var(--paper-elevated)",
                    border: isActive
                      ? "1.5px solid var(--accent)"
                      : "1px solid rgba(168, 155, 145, 0.25)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    transform: isActive ? "translateX(6px)" : "translateX(0)",
                    boxShadow: isActive ? "var(--shadow-card)" : "var(--shadow-soft)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--ink-muted)",
                          margin: 0,
                          fontFamily: "var(--font-cn)",
                          fontStyle: "italic",
                          letterSpacing: 0.5,
                        }}
                      >
                        {s.trigger}
                      </p>
                      <p
                        style={{
                          fontSize: 14,
                          color: isActive ? "var(--accent)" : "var(--ink)",
                          margin: "2px 0 0",
                          fontFamily: "var(--font-cn)",
                          fontWeight: isActive ? 500 : 400,
                          letterSpacing: 0.5,
                        }}
                      >
                        {s.result}
                      </p>
                    </div>
                    {isActive && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--accent)",
                          fontFamily: "var(--font-en)",
                          fontStyle: "italic",
                          opacity: 0.85,
                        }}
                      >
                        now
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <span>almost there</span>
        <span className="arrow">↓</span>
      </div>
    </section>
  );
}

/**
 * 模拟 Mac 桌面：暖纸底色 + 几个文档图标 + 桌宠在右下角动
 */
function DesktopFrame({ frameUrl }: { frameUrl: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 10",
        background: "linear-gradient(140deg, #efe5d1 0%, #e8dac3 100%)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid rgba(168, 155, 145, 0.3)",
        boxShadow: "var(--shadow-pop)",
        overflow: "hidden",
        animation: "fadeUp 0.6s ease-out",
      }}
    >
      {/* 顶栏（模拟 macOS 菜单栏） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 22,
          background: "rgba(252, 248, 240, 0.7)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          gap: 14,
          borderBottom: "1px solid rgba(168, 155, 145, 0.15)",
        }}
      >
        <span style={{ fontSize: 11, color: "var(--ink-soft)", fontFamily: "var(--font-en)" }}>🐾</span>
        <span
          style={{
            fontSize: 10,
            color: "var(--ink-soft)",
            fontFamily: "var(--font-en)",
            letterSpacing: 0.5,
          }}
        >
          Finder
        </span>
        <span style={{ fontSize: 10, color: "var(--ink-muted)", fontFamily: "var(--font-en)" }}>File</span>
        <span style={{ fontSize: 10, color: "var(--ink-muted)", fontFamily: "var(--font-en)" }}>Edit</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: "var(--ink-muted)", fontFamily: "var(--font-num)" }}>10:24</span>
      </div>

      {/* 桌面文件 */}
      <DesktopIcon emoji="📄" label="工作文档.docx" top="22%" left="10%" />
      <DesktopIcon emoji="🖼" label="假期照片" top="22%" left="28%" />
      <DesktopIcon emoji="📊" label="周报.xlsx" top="50%" left="10%" />
      <DesktopIcon emoji="📝" label="灵感笔记" top="50%" left="28%" />

      {/* 桌宠（右下角，循环播放当前 demo 动作） */}
      <div
        style={{
          position: "absolute",
          right: "8%",
          bottom: "10%",
          width: 100,
          height: 100,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 4,
            width: 60,
            height: 6,
            borderRadius: "50%",
            background: "rgba(80, 50, 30, 0.15)",
            filter: "blur(4px)",
          }}
        />
        <img
          src={frameUrl}
          alt="pet"
          style={{ width: 92, height: 92, objectFit: "contain", position: "relative" }}
          draggable={false}
        />
      </div>

      {/* Dock（底部） */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "5px 10px",
          background: "rgba(252, 248, 240, 0.8)",
          backdropFilter: "blur(8px)",
          borderRadius: 12,
          display: "flex",
          gap: 8,
          border: "1px solid rgba(168, 155, 145, 0.2)",
        }}
      >
        {["🌐", "📨", "📅", "💬", "🎵"].map((e) => (
          <span key={e} style={{ fontSize: 18 }}>
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}

function DesktopIcon({
  emoji,
  label,
  top,
  left,
}: {
  emoji: string;
  label: string;
  top: string;
  left: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: 70,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: "rgba(252, 248, 240, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          boxShadow: "0 1px 2px rgba(80, 50, 30, 0.08)",
          border: "1px solid rgba(168, 155, 145, 0.2)",
        }}
      >
        {emoji}
      </div>
      <span
        style={{
          fontSize: 9,
          color: "var(--ink-soft)",
          fontFamily: "var(--font-cn)",
          textShadow: "0 1px 2px rgba(252, 248, 240, 0.8)",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}
