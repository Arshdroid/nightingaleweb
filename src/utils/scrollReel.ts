export interface ScrollFrameState {
  progress: number;
  frameIndex: number;
  totalFrames: number;
  elapsedSeconds: number;
  durationSeconds: number;
  isComplete: boolean;
  formattedTime: string;
}

export const REEL_DURATION_SECONDS = 9.5;
export const REEL_FPS = 25;
export const REEL_TOTAL_FRAMES = 238;

export function computeScrollFrameState(
  scrollY: number,
  scrollableDistance: number,
  totalFrames: number = REEL_TOTAL_FRAMES,
  durationSeconds: number = REEL_DURATION_SECONDS
): ScrollFrameState {
  const safeDistance = Math.max(1, scrollableDistance);
  const rawProgress = scrollY / safeDistance;
  const progress = Math.min(1, Math.max(0, rawProgress));
  const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));
  const elapsedSeconds = Number((progress * durationSeconds).toFixed(1));
  const isComplete = progress >= 0.995;

  const wholeSec = Math.floor(elapsedSeconds);
  const tenths = Math.round((elapsedSeconds - wholeSec) * 10);
  const formattedSec = wholeSec < 10 ? `0${wholeSec}` : `${wholeSec}`;
  const totalWholeSec = Math.floor(durationSeconds);
  const totalTenths = Math.round((durationSeconds - totalWholeSec) * 10);
  const formattedTotalSec = totalWholeSec < 10 ? `0${totalWholeSec}` : `${totalWholeSec}`;
  const formattedTime = `00:${formattedSec}.${tenths} / 00:${formattedTotalSec}.${totalTenths}`;

  return {
    progress,
    frameIndex,
    totalFrames,
    elapsedSeconds,
    durationSeconds,
    isComplete,
    formattedTime,
  };
}

export function getFramePath(index: number, useWebp: boolean = true): string {
  const clampedIndex = Math.max(1, Math.min(REEL_TOTAL_FRAMES, index));
  const paddedIndex = String(clampedIndex).padStart(3, '0');
  return `/frames/frame_${paddedIndex}.${useWebp ? 'webp' : 'jpg'}`;
}
