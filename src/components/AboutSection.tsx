import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ABOUT_TABS, AboutSectionTab, SCHOOL_INFO, SCHOOL_PHOTOS } from '../utils/schoolData';

export const AboutSection: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<AboutSectionTab['id']>('block-d');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const activeTab = ABOUT_TABS.find((t) => t.id === activeTabId) ?? ABOUT_TABS[0];
  const featuredPhoto = SCHOOL_PHOTOS[activePhotoIdx] ?? SCHOOL_PHOTOS[0];

  return (
    <section id="about" className="w-full py-16 lg:py-24 border-b border-[#13273F]/15/80">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header & Interactive About Us Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.02 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#13273F]/15"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#13273F]/65 mb-2">
              {SCHOOL_INFO.fullName} · Motto: “{SCHOOL_INFO.motto}”
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#13273F] tracking-tight">
              About Us &amp; {SCHOOL_INFO.blockName}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="About Nightingale Sections"
            className="flex flex-wrap items-center gap-2"
          >
            {ABOUT_TABS.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#13273F] text-white border-neutral-900 shadow-sm'
                      : 'glass-pill-light text-[#13273F]/85 hover:text-[#13273F] hover:border-neutral-500'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 2-Column Content & Editorial Campus Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 items-start">
          {/* Left Column: Exact Narrative Text inside Smooth Glass Card */}
          <div className="lg:col-span-6 glass-card-light p-6 sm:p-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#13273F]">
                  {activeTab.heading}
                </h3>

                <div className="space-y-4 text-base leading-relaxed text-[#13273F]/85 max-w-[70ch]">
                  {activeTab.paragraphs.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {activeTab.highlights && activeTab.highlights.length > 0 && (
                  <div className="pt-4 border-t border-[#13273F]/15">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-[#13273F]/65 mb-3">
                      Key Highlights
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#13273F]">
                      {activeTab.highlights.map((item, idx) => (
                        <li
                          key={idx}
                          className="p-3.5 rounded-2xl border border-[#13273F]/15 bg-neutral-100/80 flex items-start gap-2.5"
                        >
                          <span className="font-mono-tabular text-xs font-bold text-[#13273F]/65">
                            0{idx + 1}.
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Key Institutional Facts Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#13273F]/15">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-3.5 rounded-2xl bg-neutral-100/90 border border-[#13273F]/15/80"
              >
                <p className="font-mono-tabular text-lg font-bold text-[#13273F]">30+ Yrs</p>
                <p className="text-xs text-[#13273F]/75 mt-1">Excellence</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-3.5 rounded-2xl bg-neutral-100/90 border border-[#13273F]/15/80"
              >
                <p className="font-mono-tabular text-lg font-bold text-[#13273F]">Grades 7–10</p>
                <p className="text-xs text-[#13273F]/75 mt-1">Block D</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-3.5 rounded-2xl bg-neutral-100/90 border border-[#13273F]/15/80"
              >
                <p className="font-mono-tabular text-lg font-bold text-[#13273F]">01-5451791</p>
                <p className="text-xs text-[#13273F]/75 mt-1">Direct Line</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-3.5 rounded-2xl bg-neutral-100/90 border border-[#13273F]/15/80"
              >
                <p className="font-mono-tabular text-lg font-bold text-[#13273F]">Kopundole</p>
                <p className="text-xs text-[#13273F]/75 mt-1">Lalitpur</p>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Interactive Editorial Campus Spotlight & Filmstrip */}
          <div className="lg:col-span-6 space-y-4">
            {/* Large Featured Stage with Smooth Crossfade */}
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-[#13273F]/15/90 shadow-lg bg-[#13273F]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={featuredPhoto.id}
                  src={featuredPhoto.src}
                  alt={featuredPhoto.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <p className="font-mono-tabular text-xs uppercase tracking-widest text-white/75">
                  0{activePhotoIdx + 1} / 0{SCHOOL_PHOTOS.length} · Campus Life
                </p>
                <h4 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                  {featuredPhoto.title}
                </h4>
                <p className="text-sm text-white/85 mt-1.5 max-w-lg">{featuredPhoto.caption}</p>
              </div>
            </div>

            {/* Interactive Editorial Index Selector */}
            <div className="glass-card-light p-3 divide-y divide-neutral-200/70">
              {SCHOOL_PHOTOS.map((photo, idx) => {
                const isSelected = idx === activePhotoIdx;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-full px-4 py-3.5 flex items-center justify-between gap-4 text-left rounded-2xl transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-neutral-900 to-neutral-800 text-white shadow-sm'
                        : 'text-[#13273F] hover:bg-neutral-100/70 hover:text-[#13273F]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={`font-mono-tabular text-xs font-semibold ${
                          isSelected ? 'text-white font-bold' : 'text-neutral-400'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                      <span className="font-display text-sm font-semibold truncate">
                        {photo.title}
                      </span>
                    </div>
                    <ArrowUpRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-white/90 translate-x-0.5 -translate-y-0.5' : 'text-neutral-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
