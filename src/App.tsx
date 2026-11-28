import React, { useRef } from 'react';
import { MotionConfig } from 'motion/react';
import { AboutSection } from './components/AboutSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { ContactAndFooterSection } from './components/ContactAndFooterSection';
import { GallerySection } from './components/GallerySection';
import { HalloweenSpiderWebs } from './components/HalloweenSpiderWebs';
import { HeroBanner } from './components/HeroBanner';
import { Navbar } from './components/Navbar';
import { ScheduleAndFacultySection } from './components/ScheduleAndFacultySection';
import { Scroll3DBackground } from './components/Scroll3DBackground';

export default function App() {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenSearch = () => {
    const el = document.getElementById('announcements');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#13273F] text-[#E9D4C3] selection:bg-[#4E0000] selection:text-[#E9D4C3]">
        <Navbar onOpenSearch={handleOpenSearch} />

        <main>
          {/* Mystic Navy Hero */}
          <HeroBanner />

          {/* Mother of Pearl Content Sheet with Mystic Navy & Red Inferno 3D */}
          <div className="relative z-20 bg-[#E9D4C3] text-[#13273F] rounded-t-[2rem] border-t border-[#13273F]/15 shadow-2xl overflow-x-clip">
            <Scroll3DBackground />
            <HalloweenSpiderWebs />
            <div className="relative z-20">
              <AboutSection />
              <ScheduleAndFacultySection />
              <AnnouncementsSection searchInputRef={searchInputRef} />
              <GallerySection />
              <ContactAndFooterSection />
            </div>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}
