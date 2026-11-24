import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_WEB_ANCHORS,
  computeWebGeometry,
  createInitialSpiders,
  createInitialVibrations,
  pluckWeb,
  stepSpiderState,
  stepWebVibration,
  triggerSpiderDrop,
} from './spiderWebPhysics';

test('pluckWeb excites vibration and stepWebVibration damps it back to rest', () => {
  const initial = createInitialVibrations(DEFAULT_WEB_ANCHORS);
  const plucked = pluckWeb(initial['web-top-left'], 16);
  assert.ok(plucked.amplitude > 0);
  assert.ok(plucked.velocity > 0);

  let state = plucked;
  for (let i = 0; i < 300; i++) {
    state = stepWebVibration(state, 0.016);
  }
  assert.equal(state.amplitude, 0);
  assert.equal(state.velocity, 0);
});

test('computeWebGeometry generates expected spokes and concentric rings', () => {
  const anchor = DEFAULT_WEB_ANCHORS[0];
  const geom = computeWebGeometry(anchor, 1440, {
    amplitude: 4,
    velocity: 0,
    phase: 0.5,
  });
  assert.equal(geom.origin.x, 0);
  assert.equal(geom.origin.y, 0);
  assert.equal(geom.spokes.length, anchor.spokes);
  assert.equal(geom.rings.length, anchor.rings);
  assert.ok(geom.rings[0].startsWith('M '));
});

test('triggerSpiderDrop toggles drop target and stepSpiderState moves spider along silk thread', () => {
  const spiders = createInitialSpiders(DEFAULT_WEB_ANCHORS, 1440);
  assert.equal(spiders.length, DEFAULT_WEB_ANCHORS.length);

  const dropped = triggerSpiderDrop(spiders[0]);
  assert.equal(dropped.targetDrop, 72);
  assert.equal(dropped.excited, true);

  let s = dropped;
  for (let i = 0; i < 120; i++) {
    s = stepSpiderState(s, 0.016, { x: s.baseX + 40, y: s.baseY + 70 });
  }
  assert.ok(Math.abs(s.offsetY - 72) < 2);

  const retracted = triggerSpiderDrop(s);
  assert.equal(retracted.targetDrop, 0);
});
