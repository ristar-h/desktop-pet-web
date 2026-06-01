/**
 * 动作配置：与 App 端一致
 * frameCount = 该动作有多少帧；fps = 播放帧率；loop = 是否循环
 */
export type ActionKey =
  | "idle"
  | "walk"
  | "sleep"
  | "happy"
  | "sad"
  | "stretch"
  | "looking_around";

export interface ActionSpec {
  key: ActionKey;
  label: string;
  emoji: string;
  fps: number;
  loop: boolean;
  desc: string;
}

export const ACTIONS: ActionSpec[] = [
  { key: "idle", label: "待 机", emoji: "🌿", fps: 4, loop: true, desc: "安静地站着" },
  { key: "walk", label: "散 步", emoji: "🍃", fps: 4, loop: true, desc: "迈着小步子" },
  { key: "happy", label: "开 心", emoji: "✨", fps: 5, loop: false, desc: "蹦蹦跳跳" },
  { key: "stretch", label: "伸懒腰", emoji: "🌸", fps: 4, loop: false, desc: "舒展身子" },
  { key: "looking_around", label: "张 望", emoji: "👀", fps: 4, loop: false, desc: "好奇看看" },
  { key: "sleep", label: "睡 觉", emoji: "💤", fps: 2, loop: true, desc: "进入梦乡" },
  { key: "sad", label: "委 屈", emoji: "🥺", fps: 4, loop: false, desc: "有点失落" },
];

/** 默认每个动作 8 帧，从 01.png 到 08.png */
export const DEFAULT_FRAME_COUNT = 8;

/** 资源根路径 */
export const AVATAR_ROOT = "/avatars/main";

/**
 * 取某动作的某帧的图片 URL
 */
export function getFrameUrl(action: ActionKey, frameIndex: number): string {
  const n = String(frameIndex + 1).padStart(2, "0");
  return `${AVATAR_ROOT}/${action}/${n}.png`;
}

/**
 * 取某动作的所有帧 URL 数组
 */
export function getActionFrames(
  action: ActionKey,
  count: number = DEFAULT_FRAME_COUNT
): string[] {
  return Array.from({ length: count }, (_, i) => getFrameUrl(action, i));
}
