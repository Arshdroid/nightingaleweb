import test from 'node:test';
import assert from 'node:assert/strict';
import {
  REEL_DURATION_SECONDS,
  REEL_TOTAL_FRAMES,
  computeScrollFrameState,
  getFramePath,
} from './scrollReel';

test('computeScrollFrameState clamps progress between 0 and 1 across 9.5s reel', () => {
  const start = computeScrollFrameState(0, 1200);
  assert.equal(start.progress, 0);
  assert.equal(start.frameIndex, 0);
  assert.equal(start.elapsedSeconds, 0);
  assert.equal(start.isComplete, false);
  assert.equal(start.durationSeconds, REEL_DURATION_SECONDS);
  assert.equal(start.totalFrames, REEL_TOTAL_FRAMES);

  const mid = computeScrollFrameState(600, 1200);
  assert.equal(mid.progress, 0.5);
  assert.equal(mid.frameIndex, Math.floor(0.5 * REEL_TOTAL_FRAMES));
  assert.equal(mid.elapsedSeconds, 4.8);
  assert.equal(mid.isComplete, false);

  const end = computeScrollFrameState(1500, 1200);
  assert.equal(end.progress, 1);
  assert.equal(end.frameIndex, REEL_TOTAL_FRAMES - 1);
  assert.equal(end.elapsedSeconds, 9.5);
  assert.equal(end.isComplete, true);
});

test('getFramePath returns correct padded webp and jpg paths', () => {
  assert.equal(getFramePath(1, true), '/frames/frame_001.webp');
  assert.equal(getFramePath(238, true), '/frames/frame_238.webp');
  assert.equal(getFramePath(100, false), '/frames/frame_100.jpg');
  assert.equal(getFramePath(0, true), '/frames/frame_001.webp');
  assert.equal(getFramePath(999, true), '/frames/frame_238.webp');
});
