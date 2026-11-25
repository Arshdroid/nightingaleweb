import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ChevronDown, GraduationCap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SCHOOL_INFO } from '../utils/schoolData';
import { REEL_TOTAL_FRAMES, getFramePath } from '../utils/scrollReel';

type DeviceTier = 'low' | 'mid' | 'high';

// Only frame decimation is tiered. Frame resolution and draw size stay untouched
// so normal machines keep the exact same smooth reel as before.
const FRAME_STEP: Record<DeviceTier, number> = {
  low: 4,
  mid: 2,
  high: 1,
};

function detectDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'high';
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;

  if (memory <= 2 || cores <= 2) return 'low';
  if (memory <= 4 || coarse) return 'mid';
  return 'high';
}

export const HeroBanner: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const tier = useMemo(detectDeviceTier, []);
  const step = FRAME_STEP[tier];

  // Frames to load, in playback order (1, 1+step, ..., last frame)
  const frameList = useMemo(() => {
    const list: number[] = [];
    for (let frame = 1; frame <= REEL_TOTAL_FRAMES; frame += step) {
      list.push(frame);
    }
    if (list[list.length - 1] !== REEL_TOTAL_FRAMES) {
      list.push(REEL_TOTAL_FRAMES);
    }
    return list;
  }, [step]);

  // Cache of loaded HTMLImageElement objects
  const imagesMapRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const activeFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);

  // Motion scroll progress across the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Layer 1: Entrance Hero typography (0.0 -> 0.28)
  const layer1Opacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const layer1Y = useTransform(scrollYProgress, [0, 0.28], [0, -70]);
  const layer1Scale = useTransform(scrollYProgress, [0, 0.28], [1, 0.95]);

  // Render a specific frame onto the canvas with cover sizing
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = canvas.getContext('2d', { alpha: false });
      ctxRef.current = ctx;
    }
    if (!ctx) return;

    // Find the best image to render (exact frame or closest loaded neighbor)
    const map = imagesMapRef.current;
    let img: HTMLImageElement | undefined = map.get(frameNum);

    if (!img) {
      let bestDist = Infinity;
      let bestFrame = -1;
      for (const loadedIdx of map.keys()) {
        const dist = Math.abs(loadedIdx - frameNum);
        if (dist < bestDist) {
          bestDist = dist;
          bestFrame = loadedIdx;
        }
      }
      img = bestFrame > 0 ? map.get(bestFrame) : undefined;
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const hRatio = canvasWidth / imgWidth;
    const vRatio = canvasHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const destWidth = imgWidth * ratio;
    const destHeight = imgHeight * ratio;
    const shiftX = (canvasWidth - destWidth) / 2;
    const shiftY = (canvasHeight - destHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight, shiftX, shiftY, destWidth, destHeight);
    activeFrameRef.current = frameNum;
  }, []);

  // Resize canvas to match display size with DPR scaling
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      drawFrame(activeFrameRef.current);
    }
  }, [drawFrame]);

  // Progressive image preloader (frame 1 → keyframes → everything else)
  useEffect(() => {
    let isMounted = true;
    const map = imagesMapRef.current;

    const loadSingleFrame = (idx: number): Promise<HTMLImageElement | null> => {
      if (map.has(idx)) return Promise.resolve(map.get(idx)!);
      return new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = getFramePath(idx, true);
        img.onload = () => {
          if (!isMounted) return resolve(null);
          map.set(idx, img);
          if (idx === 1 || idx === activeFrameRef.current) {
            drawFrame(idx);
          }
          resolve(img);
        };
        img.onerror = () => {
          // Fallback to jpg if webp fails
          const fallback = new Image();
          fallback.decoding = 'async';
          fallback.src = getFramePath(idx, false);
          fallback.onload = () => {
            if (!isMounted) return resolve(null);
            map.set(idx, fallback);
            if (idx === activeFrameRef.current) drawFrame(idx);
            resolve(fallback);
          };
          fallback.onerror = () => resolve(null);
        };
      });
    };

    // Priority 1: first frame for instant paint
    loadSingleFrame(1).then(() => {
      if (isMounted) {
        resizeCanvas();
        drawFrame(activeFrameRef.current);
      }
    });

    // Priority 2: every 8th frame of the reel for coarse scrub fallback
    const keyframes = frameList.filter((_, i) => i % 8 === 0 && i !== 0);
    const keyframeSet = new Set(keyframes);
    const remainingFrames = frameList.filter((f) => f !== 1 && !keyframeSet.has(f));

    // Chunked loader with controlled concurrency
    const loadQueue = async (queue: number[], concurrency: number = 6) => {
      let index = 0;
      const workers = Array.from({ length: concurrency }, async () => {
        while (index < queue.length && isMounted) {
          const frameNum = queue[index++];
          await loadSingleFrame(frameNum);
        }
      });
      await Promise.all(workers);
    };

    (async () => {
      await loadQueue(keyframes, 6);
      if (isMounted) {
        await loadQueue(remainingFrames, 6);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [drawFrame, resizeCanvas, frameList]);

  // Window resize listener
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Keep the canvas in sync if the page was restored at a scrolled position
  useEffect(() => {
    const syncTarget = () => {
      const section = containerRef.current;
      if (!section) return;
      const distance = section.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      const scrolled = -section.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, scrolled / distance));
      const target = Math.min(
        REEL_TOTAL_FRAMES,
        Math.max(1, Math.round(progress * (REEL_TOTAL_FRAMES - 1)) + 1)
      );
      if (target !== activeFrameRef.current) {
        activeFrameRef.current = target;
        drawFrame(target);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) syncTarget();
    };
    window.addEventListener('pageshow', syncTarget);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('pageshow', syncTarget);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [drawFrame]);

  // Sync scroll position to frame rendering
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const clamped = Math.min(1, Math.max(0, progress));
      const targetFrame = Math.min(
        REEL_TOTAL_FRAMES,
        Math.max(1, Math.round(clamped * (REEL_TOTAL_FRAMES - 1)) + 1)
      );

      if (targetFrame !== activeFrameRef.current) {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
          drawFrame(targetFrame);
        });
      }
    });

    return () => {
      unsubscribe();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawFrame, scrollYProgress]);

  // Quick scroll to About Us section
  const handleScrollToContent = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      aria-label="Nightingale International Secondary School Interactive Reel"
      className="relative w-full h-[320vh] bg-black text-white"
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen h-svh w-full overflow-hidden flex flex-col justify-between">
        {/* Background Canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
        />

        {/* Cinematic Film Vignette & Dynamic Lighting Gradients */}
        <div
          className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-black/80 via-black/35 to-black/85"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-70 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/80"
          aria-hidden="true"
        />

        {/* Top Spacer for Translucent Fixed Navbar */}
        <div className="relative z-20 pt-24" />

        {/* LAYER 1: Giant Display Wordmark & Initial Headline (Progress 0.0 - 0.28) */}
        <motion.div
          style={{ opacity: layer1Opacity, y: layer1Y, scale: layer1Scale }}
          className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 my-auto text-center select-none pointer-events-none"
        >
          <h1
            aria-label="Nightingale International Secondary School"
            className="font-display font-bold uppercase text-white tracking-tight leading-[0.92] text-[clamp(2.5rem,10vw,8.5rem)] flex justify-center overflow-hidden drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
          >
            {SCHOOL_INFO.shortName.split('').map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 48, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </h1>

          <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.3em] font-mono-tabular text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-xl mx-auto">
            {SCHOOL_INFO.fullName}
          </p>
        </motion.div>

        {/* BOTTOM SECTION: Welcome Headline & Floating Scroll Cue (fades as user scrolls into reel) */}
        <motion.div
          style={{ opacity: layer1Opacity }}
          className="relative z-20 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pointer-events-none"
        >
          {/* Bottom-Left Welcome Text */}
          <div className="max-w-xl select-none">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white mb-2 drop-shadow-md">
              <GraduationCap className="w-4 h-4 shrink-0 text-white" aria-hidden="true" />
              <span>
                {SCHOOL_INFO.blockName} ({SCHOOL_INFO.blockGradeRange}) · Kopundole
              </span>
            </div>
            <p className="font-display font-bold text-white leading-[1.08] tracking-tight text-[clamp(1.75rem,3.5vw,2.75rem)] [text-wrap:balance] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Leading the Way in Secondary Education
            </p>
          </div>

          {/* Bottom-Right Floating Minimalist Scroll Cue */}
          <motion.a
            href="#about"
            onClick={handleScrollToContent}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-xs font-mono-tabular uppercase tracking-widest text-white/80 hover:text-white transition-colors flex items-center gap-2 cursor-pointer z-30 pb-2 select-none pointer-events-auto"
          >
            <span>Scroll ↓</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
