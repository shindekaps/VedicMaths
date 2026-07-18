import { motion } from 'framer-motion';
import { useUserStats, useProgress, useDailyStats, useLeaderboard } from '../api/stats';
import { useAuthStore } from '../stores/authStore';
import { VedicBackground } from '../components/VedicBackground';
import { StatCard } from '../components/StatCard';
import { BadgeCard } from '../components/BadgeCard';
import { LeaderboardRow } from '../components/LeaderboardRow';
import { VedicLoader } from '../components/VedicLoader';

export const ProgressView = () => {
  const { user } = useAuthStore();
  const { data: statsRes, isLoading: isStatsLoading } = useUserStats();
  const { data: progressRes, isLoading: isProgressLoading } = useProgress();
  const { data: dailyStatsRes, isLoading: isDailyLoading } = useDailyStats();
  const { data: leaderboardRes, isLoading: isLeaderboardLoading } = useLeaderboard();

  const firstName = user?.firstName || 'Learner';

  const stats = statsRes?.success ? statsRes.data.stats : null;
  const progress = progressRes?.success ? progressRes.data : null;
  const dailyStats = dailyStatsRes?.success ? dailyStatsRes.data : null;
  const leaderboard = leaderboardRes?.success ? leaderboardRes.data : [];

  const currentStreak = dailyStats?.streak ?? stats?.currentStreak ?? 0;
  const totalXP = dailyStats?.xp ?? stats?.totalXP ?? 0;
  const sutrasDone = progress?.overallProgress?.sutrasCompleted ?? stats?.sutraCompleted ?? 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  const isLoading = isStatsLoading || isProgressLoading || isDailyLoading || isLeaderboardLoading;

  if (isLoading) {
    return (
      <div role="status" className="min-h-screen bg-bg flex items-center justify-center">
        <VedicLoader message="Polishing your medals… 🎖️" />
      </div>
    );
  }

  // Predefined list of total possible badges to show achievements vs locked ones (highly engaging for kids!)
  const ALL_BADGES = [
    { id: 'first_win', name: 'First Win', icon: '🏆', desc: 'Solved first question!' },
    { id: 'streak_10', name: '10-Day Streak', icon: '🔥', desc: 'Trained 10 days in a row' },
    { id: 'math_wizard', name: 'Math Wizard', icon: '⚡', desc: 'Solved 100 questions' },
    { id: 'sutra_master', name: 'Sutra Master', icon: '👑', desc: 'Completed 5 sutras' },
  ];

  return (
    <div className="bg-bg min-h-screen pb-20 relative overflow-hidden font-['Nunito',sans-serif]">
      <VedicBackground variant="light" />

      {/* ── HEADER BANNER ── */}
      <motion.div
        className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 pt-10 pb-8 text-white shadow-2xl relative overflow-hidden text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="absolute top-[-30px] right-[-20px] w-44 h-44 bg-saffron/15 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-10px] w-36 h-36 bg-teal/15 rounded-full blur-[40px] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
          <div className="text-4xl animate-bounce mb-3" style={{ animationDuration: '3s' }}>🎖️</div>
          <h2 className="text-3xl font-serif font-black tracking-tight">{firstName}'s Achievements</h2>
          <p className="text-xs text-white/70 mt-1.5">Track your progress and climb the leaderboards!</p>
          
          {/* Stat Cards Row */}
          <div className="grid grid-cols-3 gap-4 mt-8 w-full">
            <StatCard
              icon="🔥"
              label="Streak"
              value={`${currentStreak} Days`}
              layout="vertical"
            />
            <StatCard
              icon="⭐"
              label="XP Points"
              value={totalXP.toLocaleString()}
              layout="vertical"
            />
            <StatCard
              icon="📚"
              label="Sutras Done"
              value={`${sutrasDone}/16`}
              layout="vertical"
            />
          </div>
        </div>
      </motion.div>

      {/* ── MAIN BODY CONTENT ── */}
      <div className="max-w-2xl mx-auto px-6 mt-8 flex flex-col gap-8">
        
        {/* Badges Section */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-sub mb-4 flex items-center gap-1.5">
            🏅 Badges Gallery
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ALL_BADGES.map((badge) => {
              // Check if user has unlocked this badge (from stats.badges)
              const isUnlocked = stats?.badges?.some(b => b.badgeId === badge.id || b.name === badge.name) ?? false;

              return (
                <BadgeCard
                  key={badge.id}
                  id={badge.id}
                  name={badge.name}
                  icon={badge.icon}
                  desc={badge.desc}
                  isUnlocked={isUnlocked}
                />
              );
            })}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-sub mb-4 flex items-center gap-1.5">
            🏆 Arena Leaderboard
          </h3>

          <motion.div
            className="bg-white rounded-[36px] p-3 shadow-card border border-violet-100/50 flex flex-col gap-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {leaderboard.map((player) => {
              const isCurrentUser = player.name.toLowerCase().includes('kapil') || player.name.toLowerCase().includes('you');

              return (
                <LeaderboardRow
                  key={player.rank}
                  rank={player.rank}
                  avatar={player.avatar}
                  name={player.name}
                  streak={player.streak}
                  level={player.level}
                  xp={player.xp}
                  isCurrentUser={isCurrentUser}
                  variants={itemVariants}
                />
              );
            })}

            {leaderboard.length === 0 && (
              <div className="text-center py-10 text-sub text-xs font-bold">
                No players on the leaderboard yet!
              </div>
            )}
          </motion.div>
        </section>

      </div>
    </div>
  );
};

export default ProgressView;
