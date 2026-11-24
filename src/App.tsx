import React, { useRef } from 'react';
import { MotionConfig } from 'motion/react';
import { AboutSection } from './components/AboutSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { ContactAndFooterSection } from './components/ContactAndFooterSection';
import { HalloweenSpiderWebs } from './components/HalloweenSpiderWebs';
import { HeroBanner } from './components/HeroBanner';
import { Navbar } from './components/Navbar';
import { ScheduleAndFacultySection } from './components/ScheduleAndFacultySection';

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
      <div className="min-h-screen bg-black text-white selection:bg-neutral-900 selection:text-white">
        <Navbar onOpenSearch={handleOpenSearch} />

        <main>
          {/* Pitch-Black Hero */}
          <HeroBanner />

          {/* Soft Off-White & Cool-Gray Content Sheet with Interactive Halloween Spider Webs */}
          <div className="relative z-20 bg-[#F4F5F7] text-neutral-900 rounded-t-[2rem] border-t border-neutral-200 shadow-2xl overflow-hidden">
            <HalloweenSpiderWebs />
            <div className="relative z-20">
              <AboutSection />
              <ScheduleAndFacultySection />
              <AnnouncementsSection searchInputRef={searchInputRef} />
              <ContactAndFooterSection />
            </div>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}
