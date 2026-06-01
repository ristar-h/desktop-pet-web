/**
 * 手绘风装饰元素 — 用极简 SVG 画的小星星、心形、波浪线、箭头等
 * 全部走暖墨色系，风格统一
 */

interface DecoProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** 手绘小星星 */
export function StarDeco({ size = 16, color = "var(--accent)", className, style }: DecoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z" />
    </svg>
  );
}

/** 实心小星星（4角） */
export function SparkleDeco({ size = 12, color = "var(--accent)", className, style }: DecoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M12 0 C12 6 12 6 24 12 C12 18 12 18 12 24 C12 18 12 18 0 12 C12 6 12 6 12 0 Z" />
    </svg>
  );
}

/** 手绘小心 */
export function HeartDeco({ size = 16, color = "var(--rose)", className, style }: DecoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M12 21 C12 21 4 14 4 8 C4 5 6 3 9 3 C10.5 3 12 4.5 12 4.5 C12 4.5 13.5 3 15 3 C18 3 20 5 20 8 C20 14 12 21 12 21 Z" />
    </svg>
  );
}

/** 手绘小叶子 */
export function LeafDeco({ size = 18, color = "var(--sage)", className, style }: DecoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M5 19 C5 12 10 5 19 5 C19 14 14 19 5 19 Z" />
      <path d="M5 19 L13 11" />
    </svg>
  );
}

/** 标题下方手绘波浪线 */
export function WavyUnderline({
  width = 80,
  color = "var(--accent)",
  className,
  style,
}: {
  width?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={width}
      height="8"
      viewBox="0 0 80 8"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d="M2 4 Q 12 0, 22 4 T 42 4 T 62 4 T 78 4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 手绘箭头（指向右） */
export function ArrowDeco({
  width = 60,
  color = "var(--ink-faint)",
  className,
  style,
}: {
  width?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={width}
      height="20"
      viewBox="0 0 60 20"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <path
        d="M2 10 Q 18 4, 32 10 T 56 10"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M52 6 L56 10 L52 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** 手绘小云朵 */
export function CloudDeco({ size = 32, color = "var(--ink-faint)", className, style }: DecoProps) {
  return (
    <svg
      width={size}
      height={(size * 18) / 32}
      viewBox="0 0 32 18"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M7 14 C3 14 2 10 4 8 C4 5 7 3 10 4 C11 2 14 1 16 3 C19 1 23 3 23 7 C26 7 28 9 27 12 C28 14 26 16 23 14 Z" />
    </svg>
  );
}

/* ============================================================
   功能卡 Icon — 手绘风格（笔触感、略不规则）
   ============================================================ */

/** Step 1: 手绘相机 */
export function CameraIcon({
  size = 44,
  color = "var(--ink)",
  accent = "var(--butter)",
  className,
  style,
}: {
  size?: number;
  color?: string;
  accent?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* 相机机身（略带弧度的方框） */}
      <path
        d="M 8 24 Q 8 19 13 19 L 22 19 L 25 13 Q 26 12 27 12 L 37 12 Q 38 12 39 13 L 42 19 L 51 19 Q 56 19 56 24 L 55.5 49 Q 55 53 50 53 L 14 53 Q 9 53 8.5 48.5 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* 镜头外圈 */}
      <ellipse
        cx="32"
        cy="36"
        rx="11"
        ry="10.5"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* 镜头内圈 */}
      <circle cx="32" cy="36" r="6" stroke={color} strokeWidth="1.5" fill={accent} fillOpacity="0.4" />
      {/* 镜头中心高光 */}
      <circle cx="29.5" cy="33.5" r="1.5" fill={color} opacity="0.6" />
      {/* 闪光灯小圆 */}
      <circle cx="48" cy="25" r="1.8" fill={accent} stroke={color} strokeWidth="1" />
      {/* 顶部小提示 - 一颗小星 */}
      <path
        d="M 18 8 L 18.7 10 L 20.5 10.5 L 18.7 11 L 18 13 L 17.3 11 L 15.5 10.5 L 17.3 10 Z"
        fill={accent}
      />
    </svg>
  );
}

/** Step 2: 手绘星星簇（魔法/AI） */
export function SparkleClusterIcon({
  size = 44,
  color = "var(--accent)",
  className,
  style,
}: DecoProps & { color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* 中心大星（4 角光芒） */}
      <path
        d="M 32 14 C 32 25 32 25 47 32 C 32 39 32 39 32 50 C 32 39 32 39 17 32 C 32 25 32 25 32 14 Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 右上小星 */}
      <path
        d="M 50 16 C 50 21 50 21 56 23 C 50 25 50 25 50 30 C 50 25 50 25 44 23 C 50 21 50 21 50 16 Z"
        fill={color}
        opacity="0.7"
      />
      {/* 左下小星 */}
      <path
        d="M 14 44 C 14 48 14 48 19 50 C 14 52 14 52 14 56 C 14 52 14 52 9 50 C 14 48 14 48 14 44 Z"
        fill={color}
        opacity="0.55"
      />
      {/* 一颗小点 */}
      <circle cx="50" cy="46" r="1.6" fill={color} opacity="0.45" />
    </svg>
  );
}

/** Step 3: 手绘小角色（陪伴） */
export function CompanionIcon({
  size = 44,
  color = "var(--ink)",
  cheek = "var(--rose)",
  className,
  style,
}: {
  size?: number;
  color?: string;
  cheek?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* 头（圆，略不规则） */}
      <path
        d="M 32 10 C 21 10 14 18 14 27 C 14 36 21 42 32 42 C 43 42 50 36 50 27 C 50 18 43 10 32 10 Z"
        stroke={color}
        strokeWidth="2"
        fill="var(--paper-elevated)"
        strokeLinejoin="round"
      />
      {/* 头发刘海（简约几笔） */}
      <path
        d="M 18 22 Q 22 14 28 17 Q 32 13 36 17 Q 42 14 46 22"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 左眼 */}
      <ellipse cx="25" cy="28" rx="1.4" ry="2" fill={color} />
      {/* 右眼 */}
      <ellipse cx="39" cy="28" rx="1.4" ry="2" fill={color} />
      {/* 腮红 */}
      <circle cx="22" cy="33" r="2.4" fill={cheek} opacity="0.55" />
      <circle cx="42" cy="33" r="2.4" fill={cheek} opacity="0.55" />
      {/* 嘴巴 - 小圆口 */}
      <path
        d="M 30 35 Q 32 37 34 35"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* 身体（小连衣裙轮廓） */}
      <path
        d="M 22 42 L 18 56 Q 18 58 20 58 L 44 58 Q 46 58 46 56 L 42 42"
        stroke={color}
        strokeWidth="2"
        fill="var(--paper-elevated)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 头顶一颗小星 */}
      <path
        d="M 50 12 L 50.7 14 L 52.5 14.5 L 50.7 15 L 50 17 L 49.3 15 L 47.5 14.5 L 49.3 14 Z"
        fill="var(--accent)"
      />
    </svg>
  );
}
