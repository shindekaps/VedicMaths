import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useDailyStats, useProgress, useUserStats } from '../api/stats';
import { MandalaDecor } from '../components/MandalaDecor';

interface DashboardViewProps {
  setActive: (id: string) => void;
}

export const DashboardView = ({ setActive }: DashboardViewProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const { data: dailyStatsRes, isLoading: isDailyLoading } = useDailyStats();
  const { data: progressRes, isLoading: isProgressLoading } = useProgress();
  const { data: statsRes, isLoading: isStatsLoading } = useUserStats();

  const firstName = user?.firstName || 'Learner';
  const avatarLetter = firstName.charAt(0).toUpperCase();

  const dailyStats = dailyStatsRes?.success ? dailyStatsRes.data : null;
  const progress = progressRes?.success ? progressRes.data : null;
  const stats = statsRes?.success ? statsRes.data.stats : null;

  const currentStreak = dailyStats?.streak ?? stats?.currentStreak ?? 0;
  const totalXP = dailyStats?.xp ?? stats?.totalXP ?? 0;

  const sutrasPercentage = progress?.overallProgress?.totalSutras
    ? Math.round((progress.overallProgress.sutrasCompleted / progress.overallProgress.totalSutras) * 100)
    : 0;

  const lessonsPercentage = progress?.overallProgress?.totalLessons
    ? Math.round((progress.overallProgress.lessonsCompleted / progress.overallProgress.totalLessons) * 100)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="bg-bg min-h-screen pb-24 md:pb-8 flex flex-col relative overflow-hidden">
      {/* Background Decorative Mandala */}
      <div className="absolute right-[-40px] top-[180px] opacity-[0.03] rotate-45 pointer-events-none">
        <MandalaDecor size={280} opacity={1} />
      </div>
      <div className="absolute left-[-60px] bottom-[100px] opacity-[0.02] -rotate-12 pointer-events-none">
        <MandalaDecor size={240} opacity={1} />
      </div>

      {/* ── HEADER ── */}
      <motion.div
        className="bg-gradient-to-br from-violet-900 via-indigo-900 to-navy p-8 pt-16 pb-12 text-white rounded-b-[48px] shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Soft header background blur orbs */}
        <div className="absolute top-[-50px] right-[-30px] w-48 h-48 bg-saffron/15 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute bottom-[-40px] left-1/4 w-36 h-36 bg-violet/20 rounded-full blur-[40px] pointer-events-none" />

        <div className="max-w-4xl mx-auto flex justify-between items-center relative z-20">
          <div>
            <span className="text-violet-200 text-xs font-bold tracking-wider uppercase opacity-75">Good Day 👋</span>
            <h2 className="text-3xl font-serif font-black tracking-tight mt-1">{firstName}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gold to-saffron flex items-center justify-center font-bold text-lg text-white shadow-lg border border-white/20 select-none">
            {avatarLetter}
          </div>
        </div>

        {/* Stats Row */}
        <div className="max-w-4xl mx-auto mt-8 flex gap-4">
          <motion.div
            className="flex items-center gap-3 bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 shadow-md hover:bg-white/12 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-[10px] text-violet-200 uppercase font-extrabold tracking-wider">Streak</div>
              <div className="text-base font-black">{currentStreak} Days</div>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-3 bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 shadow-md hover:bg-white/12 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-2xl">⭐</span>
            <div>
              <div className="text-[10px] text-violet-200 uppercase font-extrabold tracking-wider">Total XP</div>
              <div className="text-base font-black">{totalXP.toLocaleString()}</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── BODY CONTENT ── */}
      <div className="max-w-4xl w-full mx-auto px-6 mt-8 flex-1 flex flex-col gap-8">
        
        {/* Module Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Curriculum */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover border border-violet-100/50 flex flex-col gap-4 cursor-pointer relative overflow-hidden group transition-all duration-300"
            onClick={() => setActive('curriculum')}
            whileHover={{ y: -3 }}
          >
            <div className="flex justify-between items-start">
              <div className="text-4xl bg-violet-50 rounded-2xl w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">📖</div>
              <span className="text-xs font-bold text-violet bg-violet-50 px-3 py-1 rounded-full">Learn</span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-black text-ink">Curriculum</h3>
              <p className="text-xs text-sub mt-1">Master 16 formulas systematically</p>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-[10px] font-bold text-sub mb-1">
                <span>Overall Progress</span>
                <span>{sutrasPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet to-indigo rounded-full"
                  style={{ width: `${sutrasPercentage || 5}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Practice Quiz */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover border border-violet-100/50 flex flex-col gap-4 cursor-pointer relative overflow-hidden group transition-all duration-300"
            onClick={() => setActive('practice')}
            whileHover={{ y: -3 }}
          >
            <div className="flex justify-between items-start">
              <div className="text-4xl bg-amber-50 rounded-2xl w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">✏️</div>
              <span className="text-xs font-bold text-saffron bg-amber-50 px-3 py-1 rounded-full">Test</span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-black text-ink">Practice Quiz</h3>
              <p className="text-xs text-sub mt-1">Dynamic self-paced sessions</p>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-[10px] font-bold text-sub mb-1">
                <span>Accuracy</span>
                <span>{dailyStats?.accuracy ?? stats?.averageScore ?? 80}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-saffron rounded-full"
                  style={{ width: `${dailyStats?.accuracy ?? stats?.averageScore ?? 80}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Games View */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover border border-violet-100/50 flex flex-col gap-4 cursor-pointer relative overflow-hidden group transition-all duration-300"
            onClick={() => setActive('games')}
            whileHover={{ y: -3 }}
          >
            <div className="flex justify-between items-start">
              <div className="text-4xl bg-emerald-50 rounded-2xl w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">🎮</div>
              <span className="text-xs font-bold text-success bg-emerald-50 px-3 py-1 rounded-full">Fun</span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-black text-ink">Game Mode</h3>
              <p className="text-xs text-sub mt-1">Challenge your speed limits</p>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-[10px] font-bold text-sub mb-1">
                <span>Solved Today</span>
                <span>{dailyStats?.questionsSolved ?? 0} Problems</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal to-success rounded-full"
                  style={{ width: `${Math.min((dailyStats?.questionsSolved ?? 0) * 10, 100) || 5}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Your Stats / Progress */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-6 shadow-card hover:shadow-card-hover border border-violet-100/50 flex flex-col gap-4 cursor-pointer relative overflow-hidden group transition-all duration-300"
            onClick={() => setActive('progress')}
            whileHover={{ y: -3 }}
          >
            <div className="flex justify-between items-start">
              <div className="text-4xl bg-pink-50 rounded-2xl w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">📊</div>
              <span className="text-xs font-bold text-pink bg-pink-50 px-3 py-1 rounded-full">Analytics</span>
            </div>
            <div>
              <h3 className="font-serif text-lg font-black text-ink">Your Stats</h3>
              <p className="text-xs text-sub mt-1">Detailed performance logs</p>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-[10px] font-bold text-sub mb-1">
                <span>Lessons Mastery</span>
                <span>{lessonsPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink to-rose-500 rounded-full"
                  style={{ width: `${lessonsPercentage || 5}%` }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── ADDITIONAL STATS & BADGES SECTION ── */}
        <motion.div
          className="bg-white rounded-3xl p-6 shadow-card border border-violet-100/50 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Unlocked Badges */}
          <div>
            <h4 className="font-serif font-black text-base text-ink mb-4 flex items-center gap-2">
              🏆 Unlocked Badges
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {stats?.badges && stats.badges.length > 0 ? (
                stats.badges.map((b) => (
                  <motion.div
                    key={b.badgeId}
                    className="flex flex-col items-center bg-gray-50 border border-gray-100 rounded-2xl p-4 min-w-[90px] text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-3xl filter drop-shadow-sm">{b.icon}</span>
                    <span className="text-[10px] font-bold text-ink mt-2 truncate w-16">{b.name}</span>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 w-full text-sub text-xs">
                  <span>🎯 Complete lessons to unlock badges!</span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="font-serif font-black text-base text-ink mb-4 flex items-center gap-2">
              ⏱️ Recent Activity
            </h4>
            <div className="flex flex-col gap-3">
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.slice(0, 3).map((act, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 rounded-xl p-3 border border-gray-100/80">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {act.type === 'lesson_completed' ? '✅' : '📝'}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-ink">
                          {act.type === 'lesson_completed' ? 'Lesson Completed' : 'Practice Completed'}
                        </div>
                        <div className="text-[9px] text-sub">Sutra {act.sutraId}</div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-violet">+{act.score}%</span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 w-full text-sub text-xs">
                  <span>📝 No recent activity found.</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
