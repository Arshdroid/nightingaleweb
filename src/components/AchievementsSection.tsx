import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Trophy, Award, Star } from 'lucide-react';

const SLIDES = [
  {
    image: '/images/school/achievement_1.webp',
    title: 'National Education Day Award',
    subtitle: '26th National Education & International Literacy Day · 2072',
    description:
      'Nightingale International Boarding Secondary School recognized at the national level for outstanding contributions to quality education and literacy.',
    icon: Trophy,
    accent: 'from-neutral-600 to-neutral-900',
    badge: 'National Honor',
  },
  {
    image: '/images/school/achievement_2.webp',
    title: 'SEE-2079 Outstanding Award',
    subtitle: 'PABSON – District Executive Committee, Lalitpur',
    description:
      "Presented by the Private & Boarding Schools' Organization Nepal (PABSON) in recognition of outstanding performance in the Secondary Education Examination (SEE-2079).",
    icon: Award,
    accent: 'from-neutral-600 to-neutral-900',
    badge: 'Academic Excellence',
  },
  {
    image: '/images/school/achievement_3.webp',
    title: 'Lalitpur Mahanagarpaalika Certificate of Excellence',
    subtitle: 'Lalitpur Metropolitan City Office',
    description:
      'Awarded by Lalitpur Mahanagarpaalika in recognition of exemplary academic achievement — placing among the top schools in the metropolitan area.',
    icon: Star,
    accent: 'from-neutral-600 to-neutral-900',
    badge: 'City Recognition',
  },
];

const AUTO_PLAY_MS = 4500;

export function AchievementsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (idx: number, dir: 1 | -1) => {
      setDirection(dir);
      setCurrent((idx + SLIDES.length) % SLIDES.length);
    },
    []
  );

  const next = useCallback(() => go(current + 1, 1), [current, go]);
  const prev = useCallback(() => go(current - 1, -1), [current, go]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  const slide = SLIDES[current];
  const Icon = slide.icon;

  return (
    <section
      id="achievements"
      className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/10 text-neutral-300 border border-white/20 mb-4">
            Our Achievements
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Medals &amp; Recognition
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base">
            A legacy of excellence — awards and recognition earned by our
            students, faculty, and institution.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
          {/* Image pane */}
          <div className="relative w-full lg:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex-shrink-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={current}
                src={slide.image}
                alt={slide.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ x: direction * 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -60, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              />
            </AnimatePresence>

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

            {/* Badge */}
            <span
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${slide.accent} shadow-lg`}
            >
              {slide.badge}
            </span>

            {/* Prev / Next arrows */}
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-neutral-700 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-neutral-700 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Text pane */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${slide.accent} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">
                    {slide.title}
                  </h3>
                  <p className="text-neutral-400 text-sm font-medium">
                    {slide.subtitle}
                  </p>
                </div>

                <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="flex items-center gap-2.5 mt-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i, i > current ? 1 : -1)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 bg-white'
                      : 'w-2 bg-neutral-600 hover:bg-neutral-400'
                  }`}
                />
              ))}
              <span className="ml-auto text-xs text-neutral-500 tabular-nums">
                {current + 1} / {SLIDES.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-neutral-800 rounded-full overflow-hidden w-full">
              <motion.div
                key={`progress-${current}-${paused}`}
                className={`h-full bg-gradient-to-r ${slide.accent}`}
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                animate={{ scaleX: paused ? undefined : 1 }}
                transition={{ duration: AUTO_PLAY_MS / 1000, ease: 'linear' }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
