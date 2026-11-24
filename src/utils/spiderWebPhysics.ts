export interface Point {
  x: number;
  y: number;
}

export interface WebAnchor {
  id: string;
  /** Normalized X (0..1) relative to container width */
  nx: number;
  /** Y offset in pixels from top of the white content sheet */
  y: number;
  /** Radius of the web in pixels */
  radius: number;
  /** Start angle in radians */
  startAngle: number;
  /** End angle in radians */
  endAngle: number;
  /** Number of radial spokes */
  spokes: number;
  /** Number of concentric spiral rings */
  rings: number;
}

export interface WebVibrationState {
  amplitude: number;
  velocity: number;
  phase: number;
}

export interface SpiderState {
  id: string;
  webId: string;
  /** Base X in pixels */
  baseX: number;
  /** Base Y in pixels */
  baseY: number;
  /** Current X offset */
  offsetX: number;
  /** Current Y offset (e.g. dropping on silk thread) */
  offsetY: number;
  /** Vertical velocity for drop/bounce */
  vy: number;
  /** Target drop distance in pixels */
  targetDrop: number;
  /** Leg wiggle phase */
  legPhase: number;
  /** Scale multiplier for hover/click */
  scale: number;
  /** Whether spider is currently dropping/excited */
  excited: boolean;
}

export const DEFAULT_WEB_ANCHORS: WebAnchor[] = [
  {
    id: 'web-top-left',
    nx: 0,
    y: 0,
    radius: 230,
    startAngle: 0,
    endAngle: Math.PI * 0.5,
    spokes: 9,
    rings: 7,
  },
  {
    id: 'web-top-right',
    nx: 1,
    y: 20,
    radius: 210,
    startAngle: Math.PI * 0.5,
    endAngle: Math.PI,
    spokes: 8,
    rings: 6,
  },
  {
    id: 'web-mid-left',
    nx: 0,
    y: 920,
    radius: 190,
    startAngle: -Math.PI * 0.35,
    endAngle: Math.PI * 0.4,
    spokes: 8,
    rings: 6,
  },
  {
    id: 'web-mid-right',
    nx: 1,
    y: 1580,
    radius: 215,
    startAngle: Math.PI * 0.6,
    endAngle: Math.PI * 1.35,
    spokes: 9,
    rings: 7,
  },
  {
    id: 'web-bottom-left',
    nx: 0,
    y: 2350,
    radius: 200,
    startAngle: -Math.PI * 0.4,
    endAngle: Math.PI * 0.35,
    spokes: 8,
    rings: 6,
  },
];

export function createInitialVibrations(
  anchors: WebAnchor[] = DEFAULT_WEB_ANCHORS
): Record<string, WebVibrationState> {
  const map: Record<string, WebVibrationState> = {};
  for (const anchor of anchors) {
    map[anchor.id] = { amplitude: 0, velocity: 0, phase: 0 };
  }
  return map;
}

export function pluckWeb(
  state: WebVibrationState,
  impulse: number = 14
): WebVibrationState {
  return {
    amplitude: Math.min(24, state.amplitude + impulse * 0.5),
    velocity: state.velocity + impulse,
    phase: state.phase,
  };
}

export function stepWebVibration(
  state: WebVibrationState,
  dt: number
): WebVibrationState {
  const clampedDt = Math.min(0.05, Math.max(0.001, dt));
  const stiffness = 180;
  const damping = 6.5;

  const force = -stiffness * state.amplitude - damping * state.velocity;
  const nextVelocity = state.velocity + force * clampedDt;
  const nextAmplitude = state.amplitude + nextVelocity * clampedDt;
  const nextPhase = state.phase + clampedDt * 18;

  if (Math.abs(nextAmplitude) < 0.02 && Math.abs(nextVelocity) < 0.02) {
    return { amplitude: 0, velocity: 0, phase: nextPhase };
  }

  return {
    amplitude: nextAmplitude,
    velocity: nextVelocity,
    phase: nextPhase,
  };
}

export function computeWebGeometry(
  anchor: WebAnchor,
  containerWidth: number,
  vibration: WebVibrationState
): {
  origin: Point;
  spokes: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  rings: string[];
} {
  const origin: Point = {
    x: anchor.nx * containerWidth,
    y: anchor.y,
  };

  const spokes: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const spokeAngles: number[] = [];

  for (let i = 0; i < anchor.spokes; i++) {
    const t = anchor.spokes === 1 ? 0.5 : i / (anchor.spokes - 1);
    const angle = anchor.startAngle + t * (anchor.endAngle - anchor.startAngle);
    spokeAngles.push(angle);

    const wobble =
      Math.sin(vibration.phase + i * 1.3) * vibration.amplitude * 0.45;
    const endX = origin.x + Math.cos(angle) * anchor.radius + wobble;
    const endY = origin.y + Math.sin(angle) * anchor.radius + wobble * 0.5;

    spokes.push({
      x1: origin.x,
      y1: origin.y,
      x2: Number(endX.toFixed(2)),
      y2: Number(endY.toFixed(2)),
    });
  }

  const rings: string[] = [];
  for (let r = 1; r <= anchor.rings; r++) {
    const ringRatio = r / anchor.rings;
    const baseR = anchor.radius * (0.18 + 0.82 * ringRatio);
    const points: Point[] = [];

    for (let i = 0; i < spokeAngles.length; i++) {
      const angle = spokeAngles[i];
      const wave =
        Math.sin(vibration.phase + r * 0.9 + i * 1.1) *
        vibration.amplitude *
        ringRatio;
      const px = origin.x + Math.cos(angle) * (baseR + wave);
      const py = origin.y + Math.sin(angle) * (baseR + wave);
      points.push({ x: px, y: py });
    }

    if (points.length >= 2) {
      let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const midX = (p0.x + p1.x) * 0.5;
        const midY = (p0.y + p1.y) * 0.5;
        const sagFactor = 0.93;
        const ctrlX = origin.x + (midX - origin.x) * sagFactor;
        const ctrlY = origin.y + (midY - origin.y) * sagFactor;
        d += ` Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
      }
      rings.push(d);
    }
  }

  return { origin, spokes, rings };
}

export function createInitialSpiders(
  anchors: WebAnchor[] = DEFAULT_WEB_ANCHORS,
  containerWidth: number = 1440
): SpiderState[] {
  return anchors.map((anchor, idx) => {
    const midAngle = (anchor.startAngle + anchor.endAngle) * 0.5;
    const dist = anchor.radius * 0.52;
    const baseX = anchor.nx * containerWidth + Math.cos(midAngle) * dist;
    const baseY = anchor.y + Math.sin(midAngle) * dist;
    return {
      id: `spider-${idx + 1}`,
      webId: anchor.id,
      baseX,
      baseY,
      offsetX: 0,
      offsetY: 0,
      vy: 0,
      targetDrop: 0,
      legPhase: idx * 1.4,
      scale: 1,
      excited: false,
    };
  });
}

export function triggerSpiderDrop(spider: SpiderState): SpiderState {
  const nextDrop = spider.targetDrop > 20 ? 0 : 72;
  return {
    ...spider,
    targetDrop: nextDrop,
    vy: nextDrop > 0 ? 180 : -160,
    excited: true,
    scale: 1.22,
  };
}

export function stepSpiderState(
  spider: SpiderState,
  dt: number,
  cursor?: Point | null
): SpiderState {
  const clampedDt = Math.min(0.05, Math.max(0.001, dt));
  const stiffness = 120;
  const damping = 8.5;

  const dy = spider.targetDrop - spider.offsetY;
  const ay = stiffness * dy - damping * spider.vy;
  const nextVy = spider.vy + ay * clampedDt;
  const nextOffsetY = spider.offsetY + nextVy * clampedDt;

  let targetOffsetX = 0;
  let nextScale = spider.scale + (1 - spider.scale) * Math.min(1, clampedDt * 8);

  if (cursor) {
    const worldX = spider.baseX + spider.offsetX;
    const worldY = spider.baseY + nextOffsetY;
    const dx = cursor.x - worldX;
    const distY = cursor.y - worldY;
    const dist = Math.hypot(dx, distY);
    if (dist < 140 && dist > 1) {
      targetOffsetX = (dx / dist) * 8;
      nextScale = Math.max(nextScale, 1.12);
    }
  }

  const nextOffsetX =
    Math.abs(targetOffsetX - spider.offsetX) < 0.05
      ? targetOffsetX
      : spider.offsetX + (targetOffsetX - spider.offsetX) * Math.min(1, clampedDt * 8);
  const legSpeed = spider.excited || Math.abs(nextVy) > 5 ? 22 : 6;
  const nextLegPhase = spider.legPhase + clampedDt * legSpeed;
  const stillExcited =
    Math.abs(dy) > 2 || Math.abs(nextVy) > 5 || spider.targetDrop > 0;

  return {
    ...spider,
    offsetX: nextOffsetX,
    offsetY: nextOffsetY,
    vy: nextVy,
    legPhase: nextLegPhase,
    scale: nextScale,
    excited: stillExcited,
  };
}
