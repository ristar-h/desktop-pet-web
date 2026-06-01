import { useEffect, useRef, useState } from "react";
import type { ActionKey } from "../data/actions";
import { ACTIONS, getActionFrames } from "../data/actions";

/**
 * useFrameAnimation — 帧动画 Hook
 *
 * 接收一个 actionKey，返回当前帧 URL。
 * - 内部用 setInterval 按 action 的 fps 循环播放
 * - 切换 action 时帧索引重置为 0
 * - 非循环动作播完最后一帧后停留
 * - 组件卸载时自动清理 timer
 */
export function useFrameAnimation(actionKey: ActionKey) {
  const [frameIndex, setFrameIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 找到对应 spec
  const spec = ACTIONS.find((a) => a.key === actionKey)!;
  const frames = getActionFrames(actionKey);

  useEffect(() => {
    // 每次切换动作：重置到第 0 帧
    setFrameIndex(0);

    // 清理上一次的 timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const interval = 1000 / spec.fps;

    timerRef.current = setInterval(() => {
      setFrameIndex((prev) => {
        const next = prev + 1;
        if (next >= frames.length) {
          if (spec.loop) {
            return 0;
          } else {
            // 非循环：停在最后一帧
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return prev;
          }
        }
        return next;
      });
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [actionKey, spec.fps, spec.loop, frames.length]);

  return {
    frameUrl: frames[frameIndex],
    frameIndex,
    totalFrames: frames.length,
  };
}
