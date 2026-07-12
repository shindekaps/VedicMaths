import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSutras } from '../api/lessons';
import { useProgress } from '../api/stats';
import { toast } from 'react-hot-toast';
import { MandalaDecor } from '../components/MandalaDecor';

interface CurriculumViewProps {
  navigateToLesson: (sutraID: string) => void;
}

const TABS = ['All', 'Easy', 'Medium', 'Hard'];

const RISHI_QUOTES = [
  "Math is just a game of patterns! 🧩",
  "Calculate faster than a calculator! ⚡",
  "Let's unlock the secrets of numbers! 🗝️",
  "Vedic math is mental magic! 🪄",
  "Ready to train your super brain? 🧠",
  "Fun fact: Vedic math is thousands of years old! 📜"
];

const RishiCharacter = () => (
  <svg width="105" height="105" viewBox="0 0 120 120" className="select-none pointer-events-none">
    {/* Halo/Glow */}
    <circle cx="60" cy="55" r="34" fill="#FDE047" opacity="0.25" className="animate-pulse" />
    
    {/* Hair (Long flowing wavy brown/grey hair behind) */}
    <path d="M30 45 C20 60, 25 100, 42 105 C45 90, 38 60, 40 45" fill="#5C4033" />
    <path d="M90 45 C100 60, 95 100, 78 105 C75 90, 82 60, 80 45" fill="#5C4033" />

    {/* Body / Saffron Robe (Bare right shoulder, draped over left) */}
    {/* Base Skin body */}
    <path d="M38 85 C38 75, 82 75, 82 85 L78 110 L42 110 Z" fill="#FED7AA" />
    {/* Saffron Angavastra draped from left shoulder to right waist */}
    <path d="M36 82 C38 74, 55 78, 62 88 L52 110 L38 110 Z" fill="#FF6B35" />
    <path d="M36 82 C42 82, 68 95, 78 106 L74 110 L48 110 Z" fill="#EA580C" /> {/* Draped folds */}

    {/* Beard (tapered flowing Indian Rishi beard) */}
    <path d="M42 62 C42 105, 78 105, 78 62 C78 75, 42 75, 42 62" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
    <path d="M47 62 C47 98, 73 98, 73 62 Z" fill="#FFFFFF" />

    {/* Face */}
    <circle cx="60" cy="54" r="20" fill="#FED7AA" />

    {/* Tripundra Tilak (Three horizontal lines on forehead + red dot) */}
    {/* Line 1 */}
    <line x1="52" y1="41" x2="68" y2="41" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    {/* Line 2 */}
    <line x1="50" y1="43" x2="70" y2="43" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    {/* Line 3 */}
    <line x1="52" y1="45" x2="68" y2="45" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    {/* Red dot in center */}
    <circle cx="60" cy="43" r="2" fill="#EF4444" />

    {/* Eyes (happy arches) */}
    <path d="M50 53 Q54 50 56 53" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    <path d="M64 53 Q66 50 70 53" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

    {/* Rosy Cheeks */}
    <circle cx="47" cy="58" r="2.5" fill="#F472B6" opacity="0.7" />
    <circle cx="73" cy="58" r="2.5" fill="#F472B6" opacity="0.7" />

    {/* Smile */}
    <path d="M57 60 Q60 63 63 60" fill="none" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />

    {/* Hair topknot bun (Juda) */}
    <circle cx="60" cy="30" r="9" fill="#5C4033" />
    {/* Rudraksha string around the bun */}
    <circle cx="55" cy="34" r="2" fill="#92400E" />
    <circle cx="60" cy="35" r="2" fill="#92400E" />
    <circle cx="65" cy="34" r="2" fill="#92400E" />
    <circle cx="53" cy="30" r="2" fill="#92400E" />
    <circle cx="67" cy="30" r="2" fill="#92400E" />

    {/* Rudraksha Mala (Necklace of brown beads) */}
    <circle cx="48" cy="78" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
    <circle cx="52" cy="81" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
    <circle cx="57" cy="83" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
    <circle cx="63" cy="83" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
    <circle cx="68" cy="81" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
    <circle cx="72" cy="78" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
  </svg>
);

// Expert pedagogical classification for Vedic Mathematics Sutras
const getDifficulty = (index: number): 'Easy' | 'Medium' | 'Hard' => {
  if (index <= 5) return 'Easy';
  if (index <= 10) return 'Medium';
  return 'Hard';
};

export const CurriculumView = ({ navigateToLesson }: CurriculumViewProps) => {
  const rishiQuote = useMemo(() => {
    return RISHI_QUOTES[Math.floor(Math.random() * RISHI_QUOTES.length)];
  }, []);

  const { data: sutras, isLoading: isSutrasLoading, error: sutrasError } = useSutras();
  const { data: progressRes, isLoading: isProgressLoading } = useProgress();
  const [activeTab, setActiveTab] = useState('All');

  const progress = progressRes?.success ? progressRes.data : null;

  // Determine status of each sutra dynamically based on progress database
  const sutraStatusMap = useMemo(() => {
    const map: Record<number, { status: 'completed' | 'in_progress' | 'locked'; percent: number }> = {};
    if (!sutras) return map;

    // First pass: map existing statuses from database progress
    sutras.forEach((s) => {
      const match = progress?.sutraProgress?.find((p) => p.sutraId === s.sutraId);
      if (match) {
        let status: 'completed' | 'in_progress' | 'locked' = 'locked';
        if (match.status.toLowerCase() === 'completed') status = 'completed';
        else if (match.status.toLowerCase() === 'in_progress') status = 'in_progress';
        
        map[s.sutraId] = {
          status,
          percent: match.completionPercentage || 0,
        };
      }
    });

    // Second pass: apply lock/unlock rules sequentially if records are missing
    sutras.sort((a, b) => a.order - b.order).forEach((s, idx) => {
      if (!map[s.sutraId]) {
        // If it's the very first sutra, it's unlocked by default
        if (idx === 0) {
          map[s.sutraId] = { status: 'in_progress', percent: 0 };
        } else {
          // Check if previous sutra is completed
          const prevSutra = sutras[idx - 1];
          const prevStatus = map[prevSutra.sutraId]?.status;
          if (prevStatus === 'completed') {
            map[s.sutraId] = { status: 'in_progress', percent: 0 };
          } else {
            map[s.sutraId] = { status: 'locked', percent: 0 };
          }
        }
      }
    });

    return map;
  }, [sutras, progress]);

  const filteredSutras = useMemo(() => {
    if (!sutras) return [];
    
    return sutras
      .filter((s) => {
        // Filter by Difficulty tab
        const difficulty = getDifficulty(s.sutraId);
        return activeTab === 'All' || difficulty === activeTab;
      })
      .sort((a, b) => a.order - b.order);
  }, [sutras, activeTab]);

  const handleSutraClick = (sutraId: number, id: string) => {
    const statusInfo = sutraStatusMap[sutraId];
    if (statusInfo?.status === 'locked') {
      toast.error(`Oops! 🔒 Sutra ${sutraId} is sleeping. Complete preceding lessons to wake it up! ⏰`, {
        icon: '🔒',
        style: {
          borderRadius: '24px',
          background: '#FF6B35',
          color: '#fff',
          fontWeight: '900',
          fontSize: '13px',
          fontFamily: "'Nunito', sans-serif",
          boxShadow: '0 10px 25px rgba(255, 107, 53, 0.25)',
          border: '2px solid #fff',
        },
      });
      return;
    }
    navigateToLesson(id);
  };

  const isLoading = isSutrasLoading || isProgressLoading;

  if (isLoading) {
    return (
      <div role="status" className="min-h-screen bg-[#F8F4FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet/20 border-t-violet"></div>
          <span className="text-sm font-bold text-sub">Waking up the math formulas… ⏰</span>
        </div>
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
      {/* Playful Floating Math Symbols (For Children) */}
      <div className="absolute top-24 left-6 text-violet-200/20 text-4xl select-none pointer-events-none font-bold animate-pulse">+</div>
      <div className="absolute top-48 right-12 text-saffron/15 text-5xl select-none pointer-events-none font-bold animate-bounce" style={{ animationDuration: '3s' }}>×</div>
      <div className="absolute bottom-36 left-10 text-teal-200/20 text-4xl select-none pointer-events-none font-bold animate-bounce" style={{ animationDuration: '4s' }}>÷</div>
      <div className="absolute bottom-60 right-8 text-gold/15 text-5xl select-none pointer-events-none font-bold animate-pulse">−</div>

      {/* Decors */}
      <div className="absolute right-[-60px] top-[140px] opacity-[0.02] pointer-events-none">
        <MandalaDecor size={320} />
      </div>

      {/* ── HEADER BANNER ── */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 pt-16 pb-10 text-white rounded-b-[48px] shadow-2xl relative overflow-hidden">
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

          {/* Animating Rishi with speech bubble */}
          <div className="flex items-center gap-4 self-center md:self-auto select-none">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
              className="relative bg-white/10 backdrop-blur-md border border-white/20 p-4.5 rounded-3xl max-w-[200px] shadow-lg"
            >
              {/* Speech bubble pointer */}
              <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white/10" />
              <p className="text-[11px] font-black text-white leading-normal">
                {rishiQuote}
              </p>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="flex-shrink-0"
            >
              <RishiCharacter />
            </motion.div>
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
              const statusInfo = sutraStatusMap[s.sutraId] || { status: 'locked', percent: 0 };
              const isLocked = statusInfo.status === 'locked';
              const difficulty = getDifficulty(s.sutraId);

              // Colors based on status
              const statusBadgeStyles = {
                completed: 'bg-emerald-50 text-success border border-emerald-100',
                in_progress: 'bg-amber-50 text-saffron border border-amber-100',
                locked: 'bg-gray-100 text-slate-400 border border-gray-200/60',
              }[statusInfo.status];

              // Children-friendly names
              const difficultyLabel =
                difficulty === 'Easy' ? '🌱 Starter' : difficulty === 'Medium' ? '🚀 Explorer' : '⚡ Wizard';

              const statusLabel =
                statusInfo.status === 'completed'
                  ? '🏆 Mastered!'
                  : statusInfo.status === 'in_progress'
                  ? '🔥 Learning'
                  : '🔒 Locked';

              return (
                <motion.div
                  key={s.id}
                  layout
                  onClick={() => handleSutraClick(s.sutraId, s.id)}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={
                    isLocked
                      ? { rotate: [-1, 1, -1, 1, 0], transition: { duration: 0.3 } } // Playful lock shake
                      : { scale: 1.03, y: -4, transition: { type: 'spring', stiffness: 300, damping: 12 } } // Bouncy hover
                  }
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-5 p-6 bg-white border-2 border-violet-100/50 rounded-3xl transition-all duration-200 relative overflow-hidden ${
                    isLocked
                      ? 'opacity-60 cursor-not-allowed border-dashed bg-slate-50/50'
                      : 'hover:shadow-card-hover hover:border-violet-200 cursor-pointer shadow-sm'
                  }`}
                >
                  {/* Left: Sutra original emoji icon */}
                  <div
                    style={{ backgroundColor: isLocked ? '#E2E8F0' : s.color || '#7C3AED' }}
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white font-serif font-black text-xl shadow-inner shadow-black/15 select-none flex-shrink-0 ${
                      isLocked ? 'opacity-60 filter grayscale-[50%]' : ''
                    }`}
                  >
                    {s.icon || s.sutraId}
                  </div>

                  {/* Center: Info fields */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusBadgeStyles}`}>
                        {statusLabel}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-red-50 text-red-600 border border-red-100'
                        }`}
                      >
                        {difficultyLabel}
                      </span>
                    </div>

                    <h3 className="font-serif text-sm font-black text-ink truncate mt-1">
                      {s.name}
                    </h3>
                    
                    <p className="text-[11px] text-sub font-bold italic mt-0.5 truncate">
                      {s.sanskritName || s.description}
                    </p>

                    {/* Progress Fill bar (only for In Progress / Completed) */}
                    {!isLocked && statusInfo.percent > 0 && (
                      <div className="mt-2.5">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet to-indigo rounded-full"
                            style={{ width: `${statusInfo.percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Chevron or Action */}
                  <div className="flex-shrink-0 text-violet font-bold text-base pl-2">
                    {isLocked ? (
                      <span className="text-slate-300">🔒</span>
                    ) : (
                      <span className="text-lg">➜</span>
                    )}
                  </div>
                </motion.div>
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
