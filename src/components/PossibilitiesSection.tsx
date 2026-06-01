import { useEffect, useState } from "react";
import { SparkleDeco, HeartDeco, WavyUnderline, StarDeco } from "./Decorations";

/**
 * 第三屏：TA 可以是任何样子
 *  - 5 张拍立得风格的"上传示例"卡片，散落式排列
 *  - 每张拍立得里面是动态的 idle 帧序列（透明底）
 *  - 中间一个变身箭头
 *  - 下方展示统一的 Q 版风格输出（小女生 idle，挪到 selfie 卡片后）
 */

interface ExampleCard {
  /** idle 帧序列所在文件夹（public/examples/[folder]/01.png ... 08.png） */
  framesFolder?: string;
  /** 帧数（默认 8） */
  frameCount?: number;
  /** fps（默认 4） */
  fps?: number;
  /** 占位 emoji（无图时显示） */
  fallbackEmoji: string;
  /** 标签 */
  label: string;
  /** 旋转角度 */
  rotate: number;
}

const EXAMPLES: ExampleCard[] = [
  {
    framesFolder: "selfie",
    fallbackEmoji: "👤",
    label: "你 自 己",
    rotate: -6,
  },
  {
    framesFolder: "family",
    fallbackEmoji: "👨‍👩‍👧",
    label: "家人朋友",
    rotate: 4,
  },
  {
    framesFolder: "pet",
    fallbackEmoji: "🐱",
    label: "宠 物",
    rotate: -3,
  },
  {
    framesFolder: "character",
    fallbackEmoji: "⭐",
    label: "二次元",
    rotate: 5,
  },
  {
    fallbackEmoji: "📸",
    label: "任何照片",
    rotate: -5,
  },
];

export function PossibilitiesSection() {
  return (
    <section id="possibilities" className="snap-section" style={{ position: "relative" }}>
      <SparkleDeco
        size={14}
        color="var(--butter)"
        className="float-deco"
        style={{ top: "10%", left: "12%", animation: "shimmerStar 3s ease-in-out infinite" }}
      />
      <HeartDeco
        size={16}
        className="float-deco"
        style={{ top: "16%", right: "16%", animation: "float 4s ease-in-out infinite" }}
      />
      <StarDeco
        size={18}
        color="var(--sage)"
        className="float-deco"
        style={{ bottom: "10%", left: "8%", animation: "floatSlow 5s ease-in-out infinite" }}
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
        <div style={{ textAlign: "center", marginBottom: 56 }}>
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
            — anyone, anything —
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
            T A 可 以 是 任 何 样 子
          </h2>
          <div style={{ marginTop: 16 }}>
            <WavyUnderline width={120} color="var(--accent)" />
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
            上传任何照片 · 都会变成统一的 Q 版可爱风格
          </p>
        </div>

        {/* 拍立得散落卡片 */}
        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px 0 8px",
          }}
        >
          {EXAMPLES.map((ex, idx) => (
            <PolaroidCard key={idx} card={ex} index={idx} />
          ))}
        </div>
      </div>

      <div className="scroll-hint">
        <span>see her live</span>
        <span className="arrow">↓</span>
      </div>
    </section>
  );
}

/**
 * 拍立得卡片 — 内部展示动态 idle 帧序列（透明底）
 */
function PolaroidCard({ card, index }: { card: ExampleCard; index: number }) {
  const frameCount = card.frameCount ?? 8;
  const fps = card.fps ?? 4;

  // 自播帧动画
  const [frameIdx, setFrameIdx] = useState(0);
  useEffect(() => {
    if (!card.framesFolder) return;
    const t = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % frameCount);
    }, 1000 / fps);
    return () => clearInterval(t);
  }, [card.framesFolder, frameCount, fps]);

  // 当前帧 URL
  const currentFrameUrl = card.framesFolder
    ? `/examples/${card.framesFolder}/${String(frameIdx + 1).padStart(2, "0")}.png`
    : null;

  // 一次性预加载所有帧（避免切帧闪烁）
  useEffect(() => {
    if (!card.framesFolder) return;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `/examples/${card.framesFolder}/${String(i + 1).padStart(2, "0")}.png`;
    }
  }, [card.framesFolder, frameCount]);

  return (
    <div
      style={{
        width: 132,
        background: "var(--paper-elevated)",
        padding: "10px 10px 28px",
        boxShadow: "0 4px 12px rgba(80, 50, 30, 0.12), 0 1px 3px rgba(80, 50, 30, 0.08)",
        borderRadius: 4,
        transform: `rotate(${card.rotate}deg)`,
        animation: `fadeUp 0.6s ease-out ${0.1 + index * 0.08}s backwards`,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "default",
        position: "relative",
        border: "1px solid rgba(168, 155, 145, 0.18)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform =
          "rotate(0deg) translateY(-6px) scale(1.05)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 12px 28px rgba(80, 50, 30, 0.18), 0 3px 8px rgba(80, 50, 30, 0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `rotate(${card.rotate}deg)`;
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 12px rgba(80, 50, 30, 0.12), 0 1px 3px rgba(80, 50, 30, 0.08)";
      }}
    >
      {/* 相纸图片区 — 透明底（仅极淡的纸质底色，让透明 PNG 不会"消失"） */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          background: "var(--paper-warm)",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {currentFrameUrl ? (
          <img
            src={currentFrameUrl}
            alt={card.label}
            style={{
              width: "92%",
              height: "92%",
              objectFit: "contain",
            }}
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = "none";
            }}
            draggable={false}
          />
        ) : (
          <span
            style={{
              fontSize: 42,
              opacity: 0.85,
              filter: "saturate(0.85)",
            }}
          >
            {card.fallbackEmoji}
          </span>
        )}
      </div>

      {/* 题字区 */}
      <p
        style={{
          margin: "12px 0 0",
          textAlign: "center",
          fontSize: 12,
          color: "var(--ink)",
          fontFamily: "var(--font-cn)",
          letterSpacing: 1,
          fontWeight: 400,
        }}
      >
        {card.label}
      </p>
    </div>
  );
}
