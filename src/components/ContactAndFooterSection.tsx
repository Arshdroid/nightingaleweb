import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Mail,
  MapPin,
  Maximize,
  Minimize,
  Pause,
  Phone,
  Play,
} from 'lucide-react';
import { SCHOOL_INFO } from '../utils/schoolData';

export const ContactAndFooterSection: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);

  const isActiveRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const scrollPosRef = useRef<number>(0);
  const isResettingRef = useRef<boolean>(false);
  const loopTimeoutRef = useRef<number | null>(null);
  const watchdogRef = useRef<number | null>(null);
  const prevScrollBehaviorRef = useRef<string | null>(null);

  // Speed in pixels per second — gentle enough to read each section as it passes
  const SCROLL_SPEED = 125;

  const getScrollingElement = (): HTMLElement =>
    (document.scrollingElement as HTMLElement | null) || document.documentElement;

  // Track Fullscreen status
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen request failed:', err);
    }
  };

  const stopTour = useCallback(() => {
    isActiveRef.current = false;
    setIsTourActive(false);
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (loopTimeoutRef.current !== null) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
    if (watchdogRef.current !== null) {
      clearInterval(watchdogRef.current);
      watchdogRef.current = null;
    }
    isResettingRef.current = false;
    document.documentElement.classList.remove('tour-scrolling');
    if (prevScrollBehaviorRef.current !== null) {
      document.documentElement.style.scrollBehavior = prevScrollBehaviorRef.current;
      prevScrollBehaviorRef.current = null;
    }
  }, []);

  // Advances the page from the wall clock, not from per-tick deltas: some
  // smart-board browsers throttle or freeze rAF while a canvas is being
  // redrawn, and a delta-clamped loop then stalls at a few px per second.
  const stepScroll = useCallback(() => {
    if (!isActiveRef.current || isResettingRef.current) return;

    const root = getScrollingElement();
    const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    const target = Math.min(elapsed * SCROLL_SPEED, maxScroll);

    scrollPosRef.current = target;
    window.scrollTo(0, target);
    // Some embedded browsers ignore window.scrollTo during other scroll work;
    // writing scrollTop as well covers them.
    if (Math.abs(root.scrollTop - target) > 2) {
      root.scrollTop = target;
    }

    if (target >= maxScroll - 0.5) {
      isResettingRef.current = true;
      // Pause briefly at the bottom, then jump back to the top
      loopTimeoutRef.current = window.setTimeout(() => {
        if (!isActiveRef.current) return;
        window.scrollTo(0, 0);
        root.scrollTop = 0;

        loopTimeoutRef.current = window.setTimeout(() => {
          if (!isActiveRef.current) return;
          scrollPosRef.current = 0;
          startTimeRef.current = performance.now();
          isResettingRef.current = false;
        }, 500);
      }, 1600);
    }
  }, [SCROLL_SPEED]);

  const rafLoop = useCallback(() => {
    if (!isActiveRef.current) return;
    stepScroll();
    rafIdRef.current = requestAnimationFrame(rafLoop);
  }, [stepScroll]);

  const startTour = useCallback(() => {
    stopTour();
    isActiveRef.current = true;
    setIsTourActive(true);

    // The stylesheet enables smooth scrolling; every programmatic step would
    // restart a smooth animation and stall on slow devices (smart boards).
    // The class forces instant scrolling on every element for the whole tour.
    prevScrollBehaviorRef.current = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.documentElement.classList.add('tour-scrolling');

    window.scrollTo(0, 0);
    scrollPosRef.current = 0;
    startTimeRef.current = performance.now();
    isResettingRef.current = false;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(rafLoop);
    // Watchdog: keeps the tour advancing even when rAF is throttled or frozen
    watchdogRef.current = window.setInterval(stepScroll, 100);
  }, [rafLoop, stepScroll, stopTour]);

  const toggleTour = useCallback(() => {
    if (isTourActive) {
      stopTour();
    } else {
      startTour();
    }
  }, [isTourActive, startTour, stopTour]);

  // Stop auto-scrolling on manual user interruption (wheel, touch, key press)
  useEffect(() => {
    const handleUserInterruption = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-tour-btn="true"]')) {
        return;
      }
      if (isActiveRef.current && !isResettingRef.current) {
        stopTour();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Space', 'Home', 'End'].includes(e.code)
      ) {
        if (isActiveRef.current) {
          stopTour();
        }
      }
    };

    window.addEventListener('wheel', handleUserInterruption, { passive: true });
    window.addEventListener('touchmove', handleUserInterruption, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserInterruption);
      window.removeEventListener('touchmove', handleUserInterruption);
      window.removeEventListener('keydown', handleKeyDown);
      stopTour();
    };
  }, [stopTour]);

  return (
    <>
      <section
        id="contact"
        className="w-full py-16 lg:py-24 border-b border-[#13273F]/15"
      >
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#13273F]/65 mb-2">
              Get in Touch · {SCHOOL_INFO.blockName} &amp; Main Office
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#13273F] tracking-tight">
              {SCHOOL_INFO.fullName}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-[#13273F]">
            <div className="glass-card-light p-5 flex items-start gap-3.5 hover:border-neutral-500/60 transition-colors">
              <MapPin className="w-5 h-5 text-[#13273F] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#13273F]/65">
                  Campus Address
                </p>
                <p className="font-medium text-[#13273F] mt-0.5">{SCHOOL_INFO.address}</p>
              </div>
            </div>

            <div className="glass-card-light p-5 flex items-start gap-3.5 hover:border-neutral-500/60 transition-colors">
              <Phone className="w-5 h-5 text-[#13273F] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#13273F]/65">
                  Main School Telephone
                </p>
                <p className="font-mono-tabular font-medium text-[#13273F] mt-0.5">
                  <a href="tel:015435663" className="hover:text-[#13273F]/75 hover:underline">
                    015435663
                  </a>
                  ,{' '}
                  <a href="tel:015430743" className="hover:text-[#13273F]/75 hover:underline">
                    015430743
                  </a>
                </p>
              </div>
            </div>

            <div className="glass-card-light p-5 flex items-start gap-3.5 hover:border-neutral-500/60 transition-colors">
              <Phone className="w-5 h-5 text-[#13273F] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#13273F]/65">
                  Block D Direct Contact (Grades 7 – 10)
                </p>
                <p className="font-mono-tabular font-medium text-[#13273F] mt-0.5">
                  <a href="tel:015451791" className="hover:text-[#13273F]/75 hover:underline">
                    {SCHOOL_INFO.blockDPhone}
                  </a>
                </p>
              </div>
            </div>

            <div className="glass-card-light p-5 flex items-start gap-3.5 hover:border-neutral-500/60 transition-colors">
              <Mail className="w-5 h-5 text-[#13273F] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[#13273F]/65">
                  Official Email
                </p>
                <p className="font-medium text-[#13273F] mt-0.5">
                  <a href={`mailto:${SCHOOL_INFO.email}`} className="hover:text-[#13273F]/75 hover:underline">
                    {SCHOOL_INFO.email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider">
            <a
              href={SCHOOL_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill-light px-5 py-2.5 rounded-full text-[#13273F] hover:bg-[#13273F] hover:text-white hover:border-neutral-900 transition-colors"
            >
              Facebook
            </a>
            <a
              href={SCHOOL_INFO.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill-light px-5 py-2.5 rounded-full text-[#13273F] hover:bg-[#13273F] hover:text-white hover:border-neutral-900 transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://maps.google.com/?q=Nightingale+International+Secondary+School+Kopundole+Lalitpur"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill-light px-5 py-2.5 rounded-full text-[#13273F] hover:bg-[#13273F] hover:text-white hover:border-neutral-900 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Interactive Google Map embed of Block D & Nightingale Campus */}
          <div className="glass-card-light overflow-hidden rounded-2xl border border-[#13273F]/20 shadow-sm mt-8">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#13273F]/15 bg-white/60">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#13273F] shrink-0" />
                <span className="font-display font-bold text-sm sm:text-base text-[#13273F]">
                  Block D &amp; Campus Location · Kopundole, Lalitpur, Nepal
                </span>
              </div>
              <a
                href="https://maps.google.com/?q=Nightingale+International+Secondary+School+Kopundole+Lalitpur"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#13273F] hover:text-[#13273F]/75 underline underline-offset-4"
              >
                <span>View Full Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="w-full h-80 sm:h-96 bg-neutral-200">
              <iframe
                title="Nightingale International Secondary School Block D Google Map"
                src="https://maps.google.com/maps?q=Nightingale+International+Secondary+School,+Kopundole,+Lalitpur&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer with Navigation, Auto Scroll & Fullscreen Button */}
      <footer className="w-full bg-[#F4F5F7] text-[#13273F]/75 py-8 border-t border-[#13273F]/15/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={SCHOOL_INFO.logoSrc}
              alt="Nightingale Logo"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className="w-6 h-6 object-contain rounded-full"
            />
            <span>
              © {SCHOOL_INFO.fullName} · {SCHOOL_INFO.address}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <a href="#about" className="hover:text-[#13273F] transition-colors">
              About Us
            </a>
            <a href="#faculty" className="hover:text-[#13273F] transition-colors">
              Teachers
            </a>
            <a href="#announcements" className="hover:text-[#13273F] transition-colors">
              Announcements
            </a>
            <a href="#gallery" className="hover:text-[#13273F] transition-colors">
              Gallery
            </a>
            <a href="#contact" className="hover:text-[#13273F] transition-colors">
              Contact
            </a>

            <span className="h-3 w-px bg-neutral-300 hidden sm:inline-block" aria-hidden="true" />

            {/* Small Auto Scroll white button at the bottom */}
            <button
              data-tour-btn="true"
              type="button"
              onClick={toggleTour}
              aria-label={isTourActive ? 'Stop Auto Scroll' : 'Start Auto Scroll'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-xs transition-all cursor-pointer font-medium ${
                isTourActive
                  ? 'bg-[#13273F] text-white border-neutral-900 hover:bg-neutral-700 hover:text-white'
                  : 'border-[#13273F]/20 bg-white hover:bg-neutral-50 hover:border-neutral-500 text-[#13273F] hover:text-[#13273F]'
              }`}
            >
              {isTourActive ? (
                <>
                  <Pause className="w-3 h-3 fill-current text-white" />
                  <span>Stop Scroll</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current text-[#13273F]" />
                  <span>Auto Scroll</span>
                </>
              )}
            </button>

            {/* Full Screen Toggle Button in the footer */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#13273F]/20 bg-white hover:bg-neutral-50 hover:border-neutral-500 text-[#13273F] hover:text-[#13273F] shadow-xs transition-all cursor-pointer font-medium"
            >
              {isFullscreen ? (
                <Minimize className="w-3 h-3 text-[#13273F]/85" />
              ) : (
                <Maximize className="w-3 h-3 text-[#13273F]/85" />
              )}
              <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
