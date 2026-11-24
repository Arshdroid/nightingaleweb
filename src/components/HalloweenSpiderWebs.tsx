import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_WEB_ANCHORS,
  Point,
  SpiderState,
  WebVibrationState,
  computeWebGeometry,
  createInitialSpiders,
  createInitialVibrations,
  pluckWeb,
  stepSpiderState,
  stepWebVibration,
  triggerSpiderDrop,
} from '../utils/spiderWebPhysics';

interface HalloweenSpark {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  kind: 'bat' | 'ember';
}

export const HalloweenSpiderWebs: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(1440);
  const [vibrations, setVibrations] = useState<Record<string, WebVibrationState>>(() =>
    createInitialVibrations(DEFAULT_WEB_ANCHORS)
  );
  const [spiders, setSpiders] = useState<SpiderState[]>(() =>
    createInitialSpiders(DEFAULT_WEB_ANCHORS, 1440)
  );
  const [sparks, setSparks] = useState<HalloweenSpark[]>([]);

  const cursorRef = useRef<Point | null>(null);
  const lastPluckRef = useRef<Record<string, number>>({});
  const sparkIdRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);

  const startPhysicsLoop = useCallback(() => {
    if (rafIdRef.current !== null) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      let stillAnimating = false;

      setVibrations((prev) => {
        let changed = false;
        const next: Record<string, WebVibrationState> = {};
        for (const key of Object.keys(prev)) {
          const updated = stepWebVibration(prev[key], dt);
          next[key] = updated;
          if (updated.amplitude !== 0 || updated.velocity !== 0) {
            stillAnimating = true;
          }
          if (
            updated.amplitude !== prev[key].amplitude ||
            updated.velocity !== prev[key].velocity
          ) {
            changed = true;
          }
        }
        return changed ? next : prev;
      });

      setSpiders((prev) => {
        let changed = false;
        const next = prev.map((sp) => {
          const updated = stepSpiderState(sp, dt, cursorRef.current);
          const isMoving =
            Math.abs(updated.targetDrop - updated.offsetY) > 0.05 ||
            Math.abs(updated.vy) > 0.05 ||
            Math.abs(updated.offsetX) > 0.05 ||
            Math.abs(updated.scale - 1) > 0.005;

          if (isMoving) {
            stillAnimating = true;
          }
          if (
            updated.offsetX !== sp.offsetX ||
            updated.offsetY !== sp.offsetY ||
            updated.vy !== sp.vy ||
            updated.scale !== sp.scale ||
            updated.excited !== sp.excited
          ) {
            changed = true;
          }
          return updated;
        });
        return changed ? next : prev;
      });

      if (stillAnimating) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Track container width for responsive corner/edge web anchors
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0) {
        setWidth(rect.width);
        setSpiders((prev) =>
          prev.map((sp, idx) => {
            const anchor = DEFAULT_WEB_ANCHORS[idx];
            if (!anchor) return sp;
            const midAngle = (anchor.startAngle + anchor.endAngle) * 0.5;
            const dist = anchor.radius * 0.52;
            return {
              ...sp,
              baseX: anchor.nx * rect.width + Math.cos(midAngle) * dist,
              baseY: anchor.y + Math.sin(midAngle) * dist,
            };
          })
        );
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Cursor proximity plucking on the white content sheet (only runs on mousemove, never on scroll)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        cursorRef.current = null;
        return;
      }

      cursorRef.current = { x, y };
      const now = performance.now();

      for (const anchor of DEFAULT_WEB_ANCHORS) {
        const originX = anchor.nx * rect.width;
        const originY = anchor.y;
        const dist = Math.hypot(x - originX, y - originY);
        const last = lastPluckRef.current[anchor.id] ?? 0;

        if (dist < anchor.radius * 1.05 && now - last > 380) {
          lastPluckRef.current[anchor.id] = now;
          setVibrations((prev) => ({
            ...prev,
            [anchor.id]: pluckWeb(prev[anchor.id], 10),
          }));
          startPhysicsLoop();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [startPhysicsLoop]);

  const spawnHalloweenBurst = (x: number, y: number) => {
    const newSparks: HalloweenSpark[] = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.4;
      const speed = 28 + Math.random() * 26;
      return {
        id: sparkIdRef.current++,
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 14,
        kind: i % 2 === 0 ? 'bat' : 'ember',
      };
    });

    setSparks((prev) => [...prev.slice(-18), ...newSparks]);
    setTimeout(() => {
      const ids = new Set(newSparks.map((s) => s.id));
      setSparks((prev) => prev.filter((s) => !ids.has(s.id)));
    }, 850);
  };

  const handleSpiderInteract = (spiderId: string, webId: string) => {
    setVibrations((prev) => ({
      ...prev,
      [webId]: pluckWeb(prev[webId], 18),
    }));

    setSpiders((prev) =>
      prev.map((sp) => {
        if (sp.id !== spiderId) return sp;
        spawnHalloweenBurst(sp.baseX + sp.offsetX, sp.baseY + sp.offsetY);
        return triggerSpiderDrop(sp);
      })
    );

    startPhysicsLoop();
  };

  return (
    <>
      {/* Localized Corner/Edge SVG Spider Webs (zero full-page SVG rasterization) */}
      <div
        ref={containerRef}
        data-testid="halloween-spider-webs"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden select-none"
      >
        {DEFAULT_WEB_ANCHORS.map((anchor, idx) => {
          const vib = vibrations[anchor.id] ?? {
            amplitude: 0,
            velocity: 0,
            phase: 0,
          };
          const geom = computeWebGeometry(anchor, width, vib);
          const isVibrating = Math.abs(vib.amplitude) > 0.25;
          const pad = 32;
          const boxSize = anchor.radius * 2 + pad * 2;
          const left = geom.origin.x - anchor.radius - pad;
          const top = geom.origin.y - anchor.radius - pad;
          const spider = spiders[idx];

          return (
            <svg
              key={anchor.id}
              width={boxSize}
              height={boxSize}
              viewBox={`${left} ${top} ${boxSize} ${boxSize}`}
              style={{
                transform: `translate3d(${left}px, ${top}px, 0)`,
              }}
              className="absolute top-0 left-0 overflow-visible"
              aria-hidden="true"
            >
              {/* Radial silk spokes */}
              {geom.spokes.map((spoke, sIdx) => (
                <line
                  key={`spoke-${sIdx}`}
                  x1={spoke.x1}
                  y1={spoke.y1}
                  x2={spoke.x2}
                  y2={spoke.y2}
                  stroke={isVibrating ? '#18181B' : '#52525B'}
                  strokeOpacity={isVibrating ? 0.55 : 0.28}
                  strokeWidth={isVibrating ? 1.35 : 1}
                  strokeLinecap="round"
                />
              ))}

              {/* Concentric curved silk rings */}
              {geom.rings.map((d, rIdx) => (
                <path
                  key={`ring-${rIdx}`}
                  d={d}
                  fill="none"
                  stroke={isVibrating ? '#18181B' : '#3F3F46'}
                  strokeOpacity={isVibrating ? 0.5 : 0.24}
                  strokeWidth={isVibrating ? 1.25 : 0.95}
                />
              ))}

              {/* Silk drop thread for this web's spider */}
              {spider && (
                <line
                  x1={spider.baseX}
                  y1={spider.baseY - 26}
                  x2={spider.baseX + spider.offsetX}
                  y2={spider.baseY + spider.offsetY}
                  stroke="#18181B"
                  strokeOpacity={0.55}
                  strokeWidth={1.25}
                  strokeDasharray="3 2"
                />
              )}
            </svg>
          );
        })}
      </div>

      {/* Interactive Halloween Spiders & Sparks Layer (z-30, pointer-events-none except spider buttons) */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden select-none">
        {spiders.map((spider, idx) => {
          const x = spider.baseX + spider.offsetX;
          const y = spider.baseY + spider.offsetY;

          return (
            <button
              key={spider.id}
              type="button"
              data-testid={spider.id}
              data-dropped={spider.targetDrop > 0 ? 'true' : 'false'}
              aria-label={`Interact with Halloween spider ${idx + 1}`}
              onClick={() => handleSpiderInteract(spider.id, spider.webId)}
              onMouseEnter={() => {
                setVibrations((prev) => ({
                  ...prev,
                  [spider.webId]: pluckWeb(prev[spider.webId], 12),
                }));
                startPhysicsLoop();
              }}
              style={{
                transform: `translate3d(${(x - 24).toFixed(1)}px, ${(y - 24).toFixed(1)}px, 0) scale(${spider.scale.toFixed(3)})`,
              }}
              className="pointer-events-auto absolute top-0 left-0 w-12 h-12 flex items-center justify-center rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                {/* Left 4 Legs (GPU-composited CSS wiggle) */}
                <g
                  className="spider-legs-left"
                  stroke="#18181B"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 16 18 L 8 12 L 4 16" />
                  <path d="M 15 20 L 6 19 L 3 24" />
                  <path d="M 15 22 L 7 25 L 4 31" />
                  <path d="M 17 24 L 10 30 L 8 36" />
                </g>

                {/* Right 4 Legs (GPU-composited CSS wiggle) */}
                <g
                  className="spider-legs-right"
                  stroke="#18181B"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M 24 18 L 32 12 L 36 16" />
                  <path d="M 25 20 L 34 19 L 37 24" />
                  <path d="M 25 22 L 33 25 L 36 31" />
                  <path d="M 23 24 L 30 30 L 32 36" />
                </g>

                {/* Spider Abdomen (charcoal black with monochrome gray marking) */}
                <ellipse cx="20" cy="24" rx="6.2" ry="7.2" fill="#18181B" />
                <path
                  d="M 18 21.5 L 22 21.5 L 20.6 24 L 22 26.5 L 18 26.5 L 19.4 24 Z"
                  fill="#52525B"
                />

                {/* Spider Cephalothorax (head) */}
                <circle cx="20" cy="15.5" r="4" fill="#27272A" />

                {/* Glowing Halloween Amber Eyes */}
                <circle cx="18.5" cy="14.2" r="1.1" fill="#E4E4E7" />
                <circle cx="21.5" cy="14.2" r="1.1" fill="#E4E4E7" />
              </svg>
            </button>
          );
        })}

        {/* Halloween Bat & Ember Sparks on Click */}
        {sparks.map((spark) => (
          <div
            key={spark.id}
            style={{
              transform: `translate3d(${(spark.x + spark.dx).toFixed(1)}px, ${(spark.y + spark.dy).toFixed(1)}px, 0)`,
            }}
            className="pointer-events-none absolute top-0 left-0 transition-all duration-700 ease-out opacity-85"
          >
            {spark.kind === 'bat' ? (
              <svg width="16" height="10" viewBox="0 0 16 10" fill="#18181B">
                <path d="M8 3C6.5 1 3.5 0.5 0 2C2.2 3.5 3.5 5.5 4 8C5.5 6.5 7 6.5 8 8C9 6.5 10.5 6.5 12 8C12.5 5.5 13.8 3.5 16 2C12.5 0.5 9.5 1 8 3Z" />
              </svg>
            ) : (
              <span className="block w-2 h-2 rounded-full bg-neutral-500" />
            )}
          </div>
        ))}
      </div>
    </>
  );
};
