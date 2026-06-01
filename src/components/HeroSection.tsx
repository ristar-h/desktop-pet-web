import { useEffect, useState } from "react";
import { ACTIONS, type ActionKey } from "../data/actions";
import { useFrameAnimation } from "../hooks/useFrameAnimation";
import { SparkleDeco, HeartDeco, LeafDeco, WavyUnderline, CloudDeco } from "./Decorations";

/**
 * 首屏 Hero Section
 *  - 大角色动画（中央，~260px）
 *  - 标语
 *  - 下方 7 个动作小卡片（hover 切换大角色动作）
 *  - 滚动提示
 */
export function HeroSection() {
  const [currentAction, setCurrentAction] = useState<ActionKey>("idle");
  const [hoveredAction, setHoveredAction] = useState<ActionKey | null>(null);

  // 实际播放的动作 = hover 中的（如果有），否则 = 当前选中
  const activeAction = hoveredAction ?? currentAction;
  const { frameUrl } = useFrameAnimation(activeAction);

  // 一次性预加载所有动作的所有帧（避免切换闪一下）
  useEffect(() => {
    ACTIONS.forEach((spec) => {
      for (let i = 0; i < 8; i++) {
        const url = `/avatars/main/${spec.key}/${String(i + 1).padStart(2, "0")}.png`;
        const img = new Image();
        img.src = url;
      }
    });
  }, []);

  return (
    <section id="hero" className="snap-section" style={{ position: "relative" }}>
      {/* 飘浮的小装饰 */}
      <SparkleDeco
        size={18}
        color="var(--accent)"
        className="float-deco"
        style={{ top: "18%", left: "12%", animation: "shimmerStar 3s ease-in-out infinite" }}
      />
      <SparkleDeco
        size={14}
        color="var(--butter)"
        className="float-deco"
        style={{ top: "26%", right: "16%", animation: "shimmerStar 2.6s ease-in-out infinite", animationDelay: "0.5s" }}
      />
      <HeartDeco
        size={18}
        className="float-deco"
        style={{ top: "32%", left: "8%", animation: "float 4s ease-in-out infinite" }}
      />
      <LeafDeco
        size={22}
        className="float-deco"
        style={{ bottom: "30%", right: "10%", animation: "floatSlow 5s ease-in-out infinite", animationDelay: "1s" }}
      />
      <CloudDeco
        size={42}
        className="float-deco"
        style={{ top: "14%", right: "22%", opacity: 0.5 }}
      />
      <CloudDeco
        size={36}
        className="float-deco"
        style={{ top: "20%", left: "22%", opacity: 0.4 }}
      />

      {/* 主内容容器 */}
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
          zIndex: 2,
          position: "relative",
        }}
      >
        {/* 大角色 */}
        <div
          style={{
            width: 260,
            height: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            animation: "fadeUp 0.6s ease-out",
          }}
        >
          {/* 角色阴影 */}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              width: 180,
              height: 14,
              borderRadius: "50%",
              background: "rgba(80, 50, 30, 0.08)",
              filter: "blur(8px)",
              zIndex: 0,
            }}
          />
          <img
            src={frameUrl}
            alt={activeAction}
            style={{
              width: 240,
              height: 240,
              objectFit: "contain",
              imageRendering: "auto",
              position: "relative",
              zIndex: 1,
            }}
            draggable={false}
          />
          {/* 示例形象小标签（手账便签风） */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: -8,
              padding: "5px 12px",
              background: "var(--paper-elevated)",
              border: "1px dashed var(--accent)",
              borderRadius: 999,
              fontSize: 10,
              color: "var(--accent)",
              fontFamily: "var(--font-cn)",
              letterSpacing: 0.5,
              transform: "rotate(8deg)",
              boxShadow: "var(--shadow-soft)",
              zIndex: 2,
              whiteSpace: "nowrap",
            }}
          >
            示例 · 由用户照片生成
          </div>
        </div>

        {/* 标语 */}
        <div style={{ textAlign: "center", marginTop: 8, animation: "fadeUp 0.7s ease-out 0.1s backwards" }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: "var(--ink)",
              letterSpacing: 6,
              lineHeight: 1.4,
              margin: 0,
              fontFamily: "var(--font-cn)",
            }}
          >
            你 的 桌 面 ， 多 一 个 安 静 的 伙 伴
          </h1>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
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
            上传任何照片 · 自己 · 家人 · 宠物 · TA 都能变身
          </p>
        </div>

        {/* 动作选择器 */}
        <div
          style={{
            marginTop: 28,
            padding: "20px 28px 24px",
            background: "var(--paper-elevated)",
            border: "1px solid rgba(168, 155, 145, 0.25)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-card)",
            animation: "fadeUp 0.8s ease-out 0.2s backwards",
            maxWidth: "fit-content",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "var(--ink-muted)",
              textAlign: "center",
              marginBottom: 14,
              letterSpacing: 1.5,
              fontFamily: "var(--font-cn)",
              fontStyle: "italic",
            }}
          >
            ✦ 选一个动作看看她在做什么 ✦
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {ACTIONS.map((spec, idx) => {
              const isActive = currentAction === spec.key;
              const isHovered = hoveredAction === spec.key;
              const tilt = idx % 2 === 0 ? -1 : 1;
              const thumbnailUrl = `/avatars/main/${spec.key}/01.png`;
              return (
                <button
                  key={spec.key}
                  onClick={() => setCurrentAction(spec.key)}
                  onMouseEnter={() => setHoveredAction(spec.key)}
                  onMouseLeave={() => setHoveredAction(null)}
                  style={{
                    width: 84,
                    padding: "10px 6px 8px",
                    background: isActive ? "var(--accent-bg)" : "var(--paper-warm)",
                    border: isActive
                      ? "1.5px solid var(--accent)"
                      : "1px solid rgba(168, 155, 145, 0.3)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "var(--font-cn)",
                    transition: "all 0.22s ease",
                    transform: isHovered
                      ? `rotate(0deg) translateY(-3px)`
                      : `rotate(${tilt}deg)`,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 8,
                      background: isActive ? "rgba(196, 112, 75, 0.06)" : "var(--paper-elevated)",
                      border: isActive
                        ? "1px solid var(--accent-border)"
                        : "1px solid rgba(168, 155, 145, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      transition: "all 0.22s ease",
                    }}
                  >
                    <img
                      src={thumbnailUrl}
                      alt={spec.label}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      draggable={false}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: isActive ? "var(--accent)" : "var(--ink-soft)",
                      fontWeight: isActive ? 500 : 400,
                      letterSpacing: 0.5,
                    }}
                  >
                    {spec.label}
                  </span>
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        top: -7,
                        right: -7,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "var(--paper-elevated)",
                        border: "1.5px solid var(--accent)",
                        color: "var(--accent)",
                        fontSize: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 1px 3px rgba(196, 112, 75, 0.2)",
                      }}
                    >
                      ✦
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 滚动提示 */}
      <div className="scroll-hint">
        <span>scroll</span>
        <span className="arrow">↓</span>
      </div>
    </section>
  );
}
