import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSutras } from '../api/lessons';
import { useProgress } from '../api/stats';

import { VedicBackground } from '../components/VedicBackground';
import { SutraCard } from '../components/SutraCard';
import { useSutraStatus } from '../hooks/useSutraStatus';
import { getDifficulty } from '../utils/mathUtils';
import { VedicLoader } from '../components/VedicLoader';

interface CurriculumViewProps {
  navigateToLesson: (sutraID: string) => void;
}

const TABS = ['All', 'Easy', 'Medium', 'Hard'];

export const CurriculumView = ({ navigateToLesson }: CurriculumViewProps) => {
  const { data: sutras, isLoading: isSutrasLoading, error: sutrasError } = useSutras();
  const { data: progressRes, isLoading: isProgressLoading } = useProgress();
  const [activeTab, setActiveTab] = useState('All');

  const progress = progressRes?.success ? progressRes.data : null;

  // Use the extracted custom hook to compute status mapping
  const sutraStatusMap = useSutraStatus(sutras, progress);

  const filteredSutras = useMemo(() => {
    if (!sutras) return [];
    
    return sutras
      .filter((s) => {
        const difficulty = getDifficulty(s.sutraId);
        return activeTab === 'All' || difficulty === activeTab;
      })
      .sort((a, b) => a.order - b.order);
  }, [sutras, activeTab]);

  const handleSutraClick = (_sutraId: number, id: string) => {
    navigateToLesson(id);
  };

  const isLoading = isSutrasLoading || isProgressLoading;

  if (isLoading) {
    return (
      <div role="status" className="min-h-screen bg-[#F8F4FF] flex items-center justify-center">
        <VedicLoader message="Waking up the math formulas… ⏰" />
      </div>
    );
  }

  if (sutrasError) {
    return (
      <div className="min-h-screen bg-[#F8F4FF] flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-3xl p-8 max-w-sm border border-red-100 shadow-xl">
          <span className="text-4xl">⚠️</span>
          <h3 className="font-serif text-lg font-black text-ink mt-4">Failed to load</h3>
          <p className="text-xs text-sub mt-2">Could not retrieve the Vedic curriculum map from server.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4FF] pb-20 relative overflow-hidden">
      <VedicBackground variant="light" />

      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 px-6 pt-8 pb-5 text-white shadow-2xl relative overflow-hidden">
        {/* Glowing orbs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-saffron/15 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute bottom-[-50px] left-10 w-48 h-48 bg-violet-600/10 rounded-full blur-[50px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-serif font-black tracking-tight mb-2">16 Vedic Sutras</h2>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed max-w-md">
              Your structured learning journey to mental math mastery. Unlock ancient math formulas step-by-step.
            </p>

            {/* Tabs row */}
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-3">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-gold text-slate-950 shadow-md scale-[1.03]'
                      : 'bg-white/10 text-slate-300 hover:bg-white/15'
                  }`}
                >
                  {tab === 'All' ? '🌟 All' : tab === 'Easy' ? '🌱 Starter' : tab === 'Medium' ? '🚀 Explorer' : '⚡ Wizard'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SUTRAS LIST ── */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredSutras.map((s) => {
              const statusInfo = sutraStatusMap[s.sutraId] || { status: 'in_progress', percent: 0 };
              const difficulty = getDifficulty(s.sutraId);

              return (
                <SutraCard
                  key={s.id}
                  sutraId={s.sutraId}
                  name={s.name}
                  sanskritName={s.sanskritName}
                  description={s.description}
                  color={s.color}
                  icon={s.icon}
                  status={statusInfo.status}
                  percent={statusInfo.percent}
                  difficulty={difficulty}
                  onClick={() => handleSutraClick(s.sutraId, s.id)}
                />
              );
            })}
          </AnimatePresence>

          {filteredSutras.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-3xl border border-violet-100/50 p-6 col-span-full"
            >
              <span className="text-4xl">🧩</span>
              <h3 className="text-sm font-black text-ink mt-2">No formulas found!</h3>
              <p className="text-xs text-sub mt-1">Choose another difficulty tab above.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CurriculumView;
