import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ANNOUNCEMENTS,
  AnnouncementCategory,
  filterAnnouncements,
} from '../utils/schoolData';

const CATEGORIES: AnnouncementCategory[] = ['All', 'Schedule', 'Holiday', 'Academic'];

interface AnnouncementsSectionProps {
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  searchInputRef,
}) => {
  const [category, setCategory] = useState<AnnouncementCategory>('All');
  const [query, setQuery] = useState('');

  const filtered = filterAnnouncements(ANNOUNCEMENTS, category, query);

  return (
    <section
      id="announcements"
      className="w-full py-16 lg:py-24 border-b border-[#13273F]/15/80"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#13273F]/15">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#13273F] mb-2">
              Official Notices &amp; Updates · Nightingale International School
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#13273F] tracking-tight">
              Announcements &amp; Circulars
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#13273F]/65 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <label htmlFor="announcement-search" className="sr-only">
                Search announcements
              </label>
              <input
                ref={searchInputRef}
                id="announcement-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notices..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full bg-white border border-[#13273F]/20 text-sm text-[#13273F] placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            {/* Category Filter Buttons */}
            <div
              role="group"
              aria-label="Filter announcements by category"
              className="flex flex-wrap items-center gap-1.5"
            >
              {CATEGORIES.map((cat) => {
                const active = cat === category;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#13273F] text-white border-neutral-900 shadow-sm'
                        : 'glass-pill-light text-[#13273F]/85 hover:text-[#13273F] hover:border-neutral-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Announcements List + Notice Board Side Image */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 pt-8 items-start">
          <div>
            {filtered.length === 0 ? (
              <div className="py-12 text-center glass-card-light">
                <p className="text-base text-[#13273F]">
                  No announcements match your current filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCategory('All');
                    setQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-full border border-neutral-900 text-xs font-semibold text-[#13273F] hover:bg-[#13273F] hover:text-white transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filtered.map((item, idx) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 'some' }}
                    transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.2), ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card-light p-6 flex flex-col md:flex-row md:items-start gap-4 md:gap-10 hover:border-neutral-400/50 transition-colors"
                  >
                    <div className="md:w-56 shrink-0 flex items-center gap-2 text-xs font-mono-tabular text-[#13273F]/65">
                      <span>{item.date}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`uppercase font-sans font-bold ${
                          item.category === 'Schedule' ? 'text-[#4E0000] font-bold' : 'text-[#13273F]/65'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-display text-lg sm:text-xl font-bold text-[#13273F]">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#13273F]/85 leading-relaxed mt-2 max-w-[75ch]">
                        {item.summary}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <figure className="glass-card-light overflow-hidden">
              <img
                src="/images/gallery/see-results-2082-board.jpg"
                alt="SEE Result 2082 congratulation board listing the six GPA 4 achievers and GPA A+ counts"
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/3] object-cover object-top"
              />
              <figcaption className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#4E0000]">
                  Notice Board · SEE Result 2082
                </p>
                <h3 className="font-display text-lg font-bold text-[#13273F] mt-1">
                  Six GPA 4 Achievers
                </h3>
                <p className="text-sm text-[#13273F]/80 leading-relaxed mt-2">
                  Hearty congratulations to Abiral Giri, Diya Prava Kayastha, Prashaman Karki,
                  Shubhangi Jaiswal, Sejal Lamichhane and Utsav Ghimire for scoring a perfect GPA 4,
                  with 115 students earning GPA A+.
                </p>
              </figcaption>
            </figure>

            <figure className="glass-card-light overflow-hidden">
              <img
                src="/images/gallery/notice-board.jpg"
                alt="Block D notice board covered with circulars, exam schedules, library notices, lost and found slips and cricket tournament sign-ups"
                loading="lazy"
                decoding="async"
                className="w-full h-auto"
              />
              <figcaption className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#4E0000]">
                  Notice Board · Block D
                </p>
                <h3 className="font-display text-lg font-bold text-[#13273F] mt-1">
                  On the Campus Board
                </h3>
                <p className="text-sm text-[#13273F]/80 leading-relaxed mt-2">
                  Exam schedules, circulars, library notices and event sign-ups are pinned outside
                  the Block D office — check back regularly for the latest updates.
                </p>
              </figcaption>
            </figure>
          </aside>
        </div>
      </div>
    </section>
  );
};
