import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

const GALLERY_IMAGES: GalleryItem[] = [
  {
    id: 'welcome-sign',
    src: '/images/gallery/welcome-exhibition-sign.webp',
    alt: 'Robot greeter sign reading Welcome to Art & Science Exhibition 2083',
    caption: 'Welcome to Art & Science Exhibition 2083',
  },
  {
    id: 'exhibition-banner',
    src: '/images/gallery/exhibition-banner-2083.jpg',
    alt: 'Decorated Science, Art & Craft Exhibition 2083 banner on the school wall',
    caption: 'Science, Art & Craft Exhibition 2083',
  },
  {
    id: 'robot-project',
    src: '/images/gallery/robot-science-project.jpg',
    alt: 'Handmade robot science project built by students on display in the courtyard',
    caption: 'Student-Built Robot Project',
  },
  {
    id: 'science-fun-chemistry',
    src: '/images/gallery/science-fun-chemistry-wall.jpg',
    alt: 'Science Fun wall display with paper flasks, test tubes and molecule decorations',
    caption: 'Science Fun — Chemistry Wall Display',
  },
  {
    id: 'science-fun-bulletin',
    src: '/images/gallery/science-fun-bulletin.jpg',
    alt: 'Science Fun bulletin board with molecule art and student drawings',
    caption: 'Science Fun Bulletin Board',
  },
  {
    id: 'clean-school',
    src: '/images/gallery/clean-school-display.jpg',
    alt: 'Clean School, Green School posters drawn by students below the Science Fun display',
    caption: 'Clean School, Green School Posters',
  },
  {
    id: 'motivational-posters',
    src: '/images/gallery/student-motivational-posters.jpg',
    alt: 'Hand-made motivational posters and sketches displayed by students on a classroom wall',
    caption: 'Motivational Posters by Students',
  },
  {
    id: 'classroom-displays',
    src: '/images/gallery/classroom-subject-displays.jpg',
    alt: 'Classroom wall displays for English, Mathematics and Nepal studies projects',
    caption: 'English, Math & Nepal Classroom Displays',
  },
  {
    id: 'gate-celebration',
    src: '/images/gallery/school-gate-celebration.jpg',
    alt: 'Nightingale School main gate decorated with colourful balloons for a celebration',
    caption: 'School Gate Celebration',
  },
  {
    id: 'see-results',
    src: '/images/gallery/see-results-2082.jpg',
    alt: 'SEE Result 2082 congratulation board with GPA 4 achieving students',
    caption: 'SEE 2082 Results — GPA 4 Achievers',
  },
  {
    id: 'excursion-boating',
    src: '/images/gallery/excursion-boating.jpg',
    alt: 'Students in life jackets on a boat during an evening educational excursion',
    caption: 'Educational Excursion — Boating at Dusk',
  },
  {
    id: 'football-match',
    src: '/images/gallery/football-match.jpg',
    alt: 'Students playing a football match on the school futsal court',
    caption: 'Inter-School Football Match',
  },
  {
    id: 'computer-lab',
    src: '/images/gallery/computer-lab.jpg',
    alt: 'Students working at desktop computers in the school computer lab',
    caption: 'Ultra-Modern Computer Lab',
  },
  {
    id: 'cultural-dance',
    src: '/images/gallery/cultural-dance.jpg',
    alt: 'Nightingale students performing a cultural dance at a national stadium event',
    caption: 'Cultural Dance — Olympic Day 2022',
  },
  {
    id: 'student-award-apcyc',
    src: '/images/gallery/student-award-apcyc.jpg',
    alt: 'Nightingale student Abhinav Gauli receiving an international award certificate on stage',
    caption: 'Student Honoured at APCYC 2019',
  },
  {
    id: 'teacher-award',
    src: '/images/gallery/teacher-award.jpg',
    alt: 'Nightingale teacher holding a framed Lalitpur Metropolitan City award certificate',
    caption: 'Teacher Awarded by Lalitpur Metropolitan City',
  },
  {
    id: 'staff-team',
    src: '/images/gallery/staff-team.jpg',
    alt: 'Nightingale International Secondary School faculty and staff group photo in the courtyard',
    caption: 'Faculty & Staff Team',
  },
  {
    id: 'student-activity',
    src: '/images/gallery/student-activity.jpg',
    alt: 'Young Nightingale student in a yellow uniform taking part in a school activity',
    caption: 'Student Life at Nightingale',
  },
];

const AUTOPLAY_MS = 3500;

export const GallerySection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const total = GALLERY_IMAGES.length;

  const goTo = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Slides advance only while the carousel is on screen, so the photos are
  // already sliding by the time the Auto Scroll tour reaches this section.
  // Tracked via scroll position rather than IntersectionObserver: some
  // smart-board browsers stall intersection updates when rendering lags.
  useEffect(() => {
    const updateVisibility = () => {
      const el = viewportRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setInView(rect.bottom > 0 && rect.top < window.innerHeight);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!inView || hovered || selected) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [inView, hovered, selected, total]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  return (
    <section
      id="gallery"
      className="w-full py-16 lg:py-24 border-b border-[#13273F]/15"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#13273F]/20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4E0000] mb-2">
              Campus Moments · Art &amp; Science Exhibition
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#13273F] tracking-tight">
              Photo Gallery
            </h2>
          </div>
          <p className="text-sm text-[#13273F]/75 max-w-md">
            Highlights from our Science, Art &amp; Craft Exhibition 2083, classroom displays,
            sports, SEE results and campus celebrations.
          </p>
        </div>

        <div
          ref={viewportRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Nightingale photo gallery"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative mt-8 rounded-2xl overflow-hidden bg-[#13273F] border border-[#13273F]/20 shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E0000]"
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {GALLERY_IMAGES.map((item, i) => (
              <div
                key={item.id}
                className="w-full shrink-0"
                aria-hidden={i !== index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}`}
              >
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  aria-label={`Open ${item.caption}`}
                  className="group relative block w-full aspect-[4/3] sm:aspect-[16/9] cursor-zoom-in text-left focus-visible:outline-none"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13273F]/85 via-[#13273F]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
                    <p className="font-display text-base sm:text-xl font-semibold text-[#E9D4C3] drop-shadow-md">
                      {item.caption}
                    </p>
                    <span className="w-9 h-9 shrink-0 rounded-full bg-[#4E0000] text-[#E9D4C3] flex items-center justify-center shadow-md group-hover:bg-[#6B0B0B] transition-colors">
                      <Expand className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Slide counter */}
          <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#13273F]/80 text-[#E9D4C3] text-xs font-mono-tabular font-semibold border border-[#E9D4C3]/25">
            {String(index + 1).padStart(2, '0')} / {total}
          </span>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#13273F]/75 text-[#E9D4C3] border border-[#E9D4C3]/25 flex items-center justify-center hover:bg-[#4E0000] transition-colors cursor-pointer shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#13273F]/75 text-[#E9D4C3] border border-[#E9D4C3]/25 flex items-center justify-center hover:bg-[#4E0000] transition-colors cursor-pointer shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Progress bar */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-[#13273F]/40" aria-hidden="true">
            <div
              className="h-full bg-[#4E0000] transition-[width] duration-700 ease-linear"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.alt}
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 bg-[#13273F]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-[#13273F] border border-[#E9D4C3]/20 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close image preview"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-[#4E0000] text-[#E9D4C3] flex items-center justify-center hover:bg-[#6B0B0B] transition-colors cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selected.src}
              alt={selected.alt}
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full max-h-[80vh] object-contain bg-black/40"
            />
            <div className="px-6 py-4 border-t border-[#E9D4C3]/15 flex items-center justify-between">
              <p className="font-display text-sm sm:text-base font-semibold text-[#E9D4C3]">
                {selected.caption}
              </p>
              <span className="text-xs font-mono-tabular text-[#E9D4C3]/65">
                Nightingale Gallery
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
