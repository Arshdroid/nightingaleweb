import React, { useEffect, useState } from 'react';
import { ArrowRight, Menu, Search, X } from 'lucide-react';
import { SCHOOL_INFO } from '../utils/schoolData';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide when scrolling down past top threshold; reveal immediately on scroll up
      const isScrollingDown = currentScrollY > lastScrollY;
      const shouldHide = currentScrollY > 60 && isScrollingDown;
      setHiddenOnScroll(shouldHide);
      if (shouldHide) {
        setDrawerOpen(false);
      }
      lastScrollY = Math.max(0, currentScrollY);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full glass-nav-bar transition-all duration-300 ${
        hiddenOnScroll
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          className="flex items-center gap-2.5 sm:gap-3 text-white whitespace-nowrap shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white rounded-full"
        >
          <img
            src={SCHOOL_INFO.logoSrc}
            alt="Nightingale International Secondary School Logo"
            referrerPolicy="no-referrer"
            decoding="async"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 rounded-full"
          />
          <span className="font-display text-base sm:text-lg font-bold tracking-wider uppercase text-white">
            {SCHOOL_INFO.shortName}
          </span>
        </a>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-white"
        >
          <a
            href="#home"
            className="hover:underline underline-offset-8 decoration-white transition-opacity hover:opacity-80 whitespace-nowrap shrink-0"
          >
            Home
          </a>
          <a
            href="#about"
            className="hover:underline underline-offset-8 decoration-white transition-opacity hover:opacity-80 whitespace-nowrap shrink-0"
          >
            About Us
          </a>
          <a
            href="#faculty"
            className="hover:underline underline-offset-8 decoration-white transition-opacity hover:opacity-80 whitespace-nowrap shrink-0"
          >
            Teachers
          </a>
          <a
            href="#announcements"
            className="hover:underline underline-offset-8 decoration-white transition-opacity hover:opacity-80 whitespace-nowrap shrink-0"
          >
            Announcements
          </a>
          <a
            href="#gallery"
            className="hover:underline underline-offset-8 decoration-white transition-opacity hover:opacity-80 whitespace-nowrap shrink-0"
          >
            Gallery
          </a>
          <a
            href="#contact"
            className="hover:underline underline-offset-8 decoration-white transition-opacity hover:opacity-80 whitespace-nowrap shrink-0"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Search, Menu Drawer & Primary Action */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search announcements and schedules"
            className="p-2 sm:p-2.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          <span className="h-4 w-px bg-white/25 hidden sm:inline-block" aria-hidden="true" />

          <button
            type="button"
            onClick={() => setDrawerOpen((prev) => !prev)}
            aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={drawerOpen}
            className="p-2 sm:p-2.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full glass-btn-cta text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Expandable School Directory & Mobile Navigation Drawer */}
      {drawerOpen && (
        <div className="bg-[#13273F]/95 backdrop-blur-2xl border-t border-white/15 px-6 py-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">
                Navigation
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#home" onClick={() => setDrawerOpen(false)} className="hover:underline">
                    Home — Block D Banner
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={() => setDrawerOpen(false)} className="hover:underline">
                    About Us &amp; Block D
                  </a>
                </li>
                <li>
                  <a
                    href="#faculty"
                    onClick={() => setDrawerOpen(false)}
                    className="hover:underline"
                  >
                    Teacher &amp; Incharge Contacts
                  </a>
                </li>
                <li>
                  <a
                    href="#announcements"
                    onClick={() => setDrawerOpen(false)}
                    className="hover:underline"
                  >
                    Announcements &amp; Notices
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    onClick={() => setDrawerOpen(false)}
                    className="hover:underline"
                  >
                    Photo Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={() => setDrawerOpen(false)}
                    className="hover:underline"
                  >
                    Admission &amp; Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">
                Block D Leadership
              </p>
              <ul className="space-y-2 text-sm">
                <li>Senior Incharge: Meena Ale (Grade 7)</li>
                <li>Senior Incharge: Deepa Thapa (Grade 8)</li>
                <li>Supervisor: Varsha Agrawal (Grade 9)</li>
                <li className="font-mono-tabular">Block D Direct: {SCHOOL_INFO.blockDPhone}</li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">
                Campus Location
              </p>
              <p className="text-sm text-white">
                {SCHOOL_INFO.fullName}, {SCHOOL_INFO.address}
              </p>
              <p className="text-xs text-white/75 mt-2">{SCHOOL_INFO.email}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
