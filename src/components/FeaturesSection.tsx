import { ArrowDeco, SparkleDeco, WavyUnderline, CameraIcon, SparkleClusterIcon, CompanionIcon } from "./Decorations";

const STEPS = [
  {
    Icon: CameraIcon,
    title: "上传照片",
    desc: "人物 / 宠物 / 任意照片",
    detail: "随手一张就行，不需要构图完美",
    accent: "var(--butter)",
    tilt: -1.5,
  },
  {
    Icon: SparkleClusterIcon,
    title: "AI 绘制",
    desc: "自动生成 8 种动作",
    detail: "Q 版风格，3-5 分钟即得",
    accent: "var(--accent)",
    tilt: 0.5,
  },
  {
    Icon: CompanionIcon,
    title: "桌面陪伴",
    desc: "她会自己活动",
    detail: "走路 · 睡觉 · 偶尔伸懒腰",
    accent: "var(--sage)",
    tilt: 1.5,
  },
];

/**
 * 第二屏：三步功能介绍
 */
export function FeaturesSection() {
  return (
    <section id="features" className="snap-section" style={{ position: "relative" }}>
      <SparkleDeco
        size={14}
        color="var(--butter)"
        className="float-deco"
        style={{ top: "12%", left: "8%", animation: "shimmerStar 3s ease-in-out infinite" }}
      />
      <SparkleDeco
        size={10}
        color="var(--accent-soft)"
        className="float-deco"
        style={{ top: "20%", right: "12%", animation: "shimmerStar 2.4s ease-in-out infinite", animationDelay: "0.8s" }}
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
            — how it works —
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
            三 步 ， 得 到 一 个 桌 面 伙 伴
          </h2>
          <div style={{ marginTop: 16 }}>
            <WavyUnderline width={100} color="var(--accent)" />
          </div>
        </div>

        {/* 三步卡片 */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* 卡片 */}
              <StepCard
                Icon={step.Icon}
                title={step.title}
                desc={step.desc}
                detail={step.detail}
                accent={step.accent}
                tilt={step.tilt}
                index={idx}
              />
              {/* 箭头（不是最后一个） */}
              {idx < STEPS.length - 1 && (
                <ArrowDeco
                  width={56}
                  color="var(--ink-faint)"
                  style={{ flexShrink: 0 }}
                />
              )}
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 56,
            fontSize: 13,
            color: "var(--ink-muted)",
            letterSpacing: 1.5,
            fontFamily: "var(--font-cn)",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          ── 简单到，可能比你冲一杯咖啡还快 ──
        </p>
      </div>

      <div className="scroll-hint">
        <span>more</span>
        <span className="arrow">↓</span>
      </div>
    </section>
  );
}

function StepCard({
  Icon,
  title,
  desc,
  detail,
  accent,
  tilt,
  index,
}: {
  Icon: React.ComponentType<{ size?: number }>;
  title: string;
  desc: string;
  detail: string;
  accent: string;
  tilt: number;
  index: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: 220,
        padding: "32px 24px 28px",
        background: "var(--paper-elevated)",
        border: "1px solid rgba(168, 155, 145, 0.3)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transform: `rotate(${tilt}deg)`,
        animation: `fadeUp 0.6s ease-out ${0.1 + index * 0.12}s backwards`,
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "rotate(0deg) translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-pop)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `rotate(${tilt}deg)`;
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
      }}
    >
      {/* 序号印章 */}
      <span
        style={{
          position: "absolute",
          top: -12,
          right: -10,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "var(--paper-elevated)",
          border: `1.5px solid ${accent}`,
          color: accent,
          fontSize: 14,
          fontFamily: "var(--font-en)",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        {index + 1}
      </span>

      {/* 手绘 Icon 容器 */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "var(--paper-warm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          border: `1.5px dashed ${accent}`,
        }}
      >
        <Icon size={48} />
      </div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: "var(--ink)",
          letterSpacing: 2,
          margin: "0 0 8px",
          fontFamily: "var(--font-cn)",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "var(--ink-soft)",
          margin: "0 0 6px",
          fontFamily: "var(--font-cn)",
          letterSpacing: 0.5,
        }}
      >
        {desc}
      </p>
      <p
        style={{
          fontSize: 11,
          color: "var(--ink-muted)",
          margin: 0,
          fontFamily: "var(--font-cn)",
          fontStyle: "italic",
          letterSpacing: 0.5,
        }}
      >
        {detail}
      </p>
    </div>
  );
}
