import React, { useState } from 'react';
import { Check, Copy, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { BLOCK_D_FACULTY, SCHOOL_INFO } from '../utils/schoolData';

export const ScheduleAndFacultySection: React.FC = () => {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyBlockPhone = async () => {
    try {
      await navigator.clipboard.writeText(SCHOOL_INFO.blockDPhone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <section
      id="faculty"
      className="w-full py-16 lg:py-24 border-b border-[#13273F]/15"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#13273F]/20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#13273F]/65 mb-2">
                School Leadership &amp; Grade Incharges
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#13273F] tracking-tight">
                Teachers &amp; Leadership Directory
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#13273F]/75">
                Block D Direct Contact:
              </span>
              <button
                type="button"
                onClick={handleCopyBlockPhone}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#13273F] text-white text-xs font-mono-tabular font-semibold hover:bg-neutral-700 transition-colors cursor-pointer shadow-sm"
              >
                <span>{SCHOOL_INFO.blockDPhone}</span>
                {copiedPhone ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {BLOCK_D_FACULTY.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card-light p-6 sm:p-7 flex flex-col justify-between gap-6 hover:border-neutral-400/60 hover:shadow-lg transition-all"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#13273F]/65">
                    {member.role} · {member.grade}
                  </p>
                  <h3 className="font-display text-2xl font-bold text-[#13273F] mt-2">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#13273F]/75 mt-1">
                    {member.block} — {SCHOOL_INFO.fullName}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-[#13273F]/15 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#13273F]/85 shrink-0" aria-hidden="true" />
                    <a
                      href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                      className="font-mono-tabular text-[#13273F] hover:text-[#13273F]/75 hover:underline"
                    >
                      {member.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#13273F]/65 shrink-0" aria-hidden="true" />
                    <a
                      href={`mailto:${member.email}`}
                      className="text-[#13273F] hover:text-[#13273F]/75 hover:underline truncate"
                    >
                      {member.email}
                    </a>
                  </div>
                  <p className="text-xs text-[#13273F]/65 pt-1">{member.officeHours}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
