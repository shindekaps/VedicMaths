import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useDailyStats, useProgress, useUserStats } from '../api/stats';
import { VedicBackground } from '../components/VedicBackground';
import { StatCard } from '../components/StatCard';
import { DashboardModuleCard } from '../components/DashboardModuleCard';

interface DashboardViewProps {
  setActive: (id: string) => void;
}

export const DashboardView = ({ setActive }: DashboardViewProps) => {
  const { user } = useAuthStore();
  const { data: dailyStatsRes } = useDailyStats();
  const { data: progressRes } = useProgress();
  const { data: statsRes } = useUserStats();

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
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="bg-bg min-h-screen pb-24 md:pb-8 flex flex-col relative overflow-hidden">
      <VedicBackground variant="light" />

      {/* ── HEADER ── */}
      <motion.div
        className="bg-gradient-to-br from-violet-900 via-indigo-900 to-navy px-8 pt-8 pb-6 text-white shadow-2xl relative overflow-hidden"
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
          <StatCard
            icon="🔥"
            label="Streak"
            value={`${currentStreak} Days`}
            layout="horizontal"
          />
          <StatCard
            icon="⭐"
            label="Total XP"
            value={totalXP.toLocaleString()}
            layout="horizontal"
          />
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
          <DashboardModuleCard
            emoji="📖"
            emojiBgColor="bg-violet-50"
            badgeLabel="Learn"
            badgeTextColor="text-violet"
            badgeBgColor="bg-violet-50"
            title="Curriculum"
            description="Master 16 formulas systematically"
            progressLabel="Overall Progress"
            progressValue={sutrasPercentage}
            progressValueText={`${sutrasPercentage}%`}
            progressBarColor="from-violet to-indigo"
            onClick={() => setActive('curriculum')}
            variants={itemVariants}
          />

          {/* Practice Quiz */}
          <DashboardModuleCard
            emoji="✏️"
            emojiBgColor="bg-amber-50"
            badgeLabel="Test"
            badgeTextColor="text-saffron"
            badgeBgColor="bg-amber-50"
            title="Practice Quiz"
            description="Dynamic self-paced sessions"
            progressLabel="Accuracy"
            progressValue={dailyStats?.accuracy ?? stats?.averageScore ?? 80}
            progressValueText={`${dailyStats?.accuracy ?? stats?.averageScore ?? 80}%`}
            progressBarColor="from-gold to-saffron"
            onClick={() => setActive('practice')}
            variants={itemVariants}
          />

          {/* Games View */}
          <DashboardModuleCard
            emoji="🎮"
            emojiBgColor="bg-emerald-50"
            badgeLabel="Fun"
            badgeTextColor="text-success"
            badgeBgColor="bg-emerald-50"
            title="Game Mode"
            description="Challenge your speed limits"
            progressLabel="Solved Today"
            progressValue={Math.min((dailyStats?.questionsSolved ?? 0) * 10, 100)}
            progressValueText={`${dailyStats?.questionsSolved ?? 0} Problems`}
            progressBarColor="from-teal to-success"
            onClick={() => setActive('games')}
            variants={itemVariants}
          />

          {/* Your Stats / Progress */}
          <DashboardModuleCard
            emoji="📊"
            emojiBgColor="bg-pink-50"
            badgeLabel="Analytics"
            badgeTextColor="text-pink"
            badgeBgColor="bg-pink-50"
            title="Your Stats"
            description="Detailed performance logs"
            progressLabel="Lessons Mastery"
            progressValue={lessonsPercentage}
            progressValueText={`${lessonsPercentage}%`}
            progressBarColor="from-pink to-rose-500"
            onClick={() => setActive('progress')}
            variants={itemVariants}
          />
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
