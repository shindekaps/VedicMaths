import { motion } from 'framer-motion';
import { useUserStats, useProgress, useDailyStats, useLeaderboard } from '../api/stats';
import { useAuthStore } from '../stores/authStore';
import { MandalaDecor } from '../components/MandalaDecor';

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
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const isLoading = isStatsLoading || isProgressLoading || isDailyLoading || isLeaderboardLoading;

  if (isLoading) {
    return (
      <div role="status" className="min-h-screen bg-[#F8F4FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-violet/20 border-t-violet"></div>
          <span className="text-sm font-bold text-sub">Polishing your medals… 🎖️</span>
        </div>
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
    <div className="bg-[#F8F4FF] min-h-screen pb-20 relative overflow-hidden font-['Nunito',sans-serif]">
      {/* Background elements */}
      <div className="absolute right-[-40px] top-[260px] opacity-[0.02] pointer-events-none rotate-45">
        <MandalaDecor size={300} />
      </div>
      <div className="absolute left-[-50px] bottom-[120px] opacity-[0.015] pointer-events-none">
        <MandalaDecor size={260} />
      </div>

      {/* ── HEADER BANNER ── */}
      <motion.div
        className="bg-gradient-to-br from-indigo-950 via-[#4C1D95] to-violet-800 p-8 pt-16 pb-12 text-white rounded-b-[48px] shadow-2xl relative overflow-hidden text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="absolute top-[-30px] right-[-20px] w-44 h-44 bg-saffron/15 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-10px] w-36 h-36 bg-teal/15 rounded-full blur-[40px] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10 flex flex-col items-center">
          <div className="text-4xl animate-bounce mb-3" style={{ animationDuration: '3s' }}>🎖️</div>
          <h2 className="text-3xl font-serif font-black tracking-tight">{firstName}'s Achievements</h2>
          <p className="text-xs text-violet-200 mt-1.5 opacity-80">Track your progress and climb the leaderboards!</p>
          
          {/* Stat Cards Row */}
          <div className="grid grid-cols-3 gap-4 mt-8 w-full">
            {[
              { val: `${currentStreak} Days`, label: 'Streak', icon: '🔥', color: 'from-amber-400 to-saffron' },
              { val: totalXP.toLocaleString(), label: 'XP Points', icon: '⭐', color: 'from-yellow-300 to-amber-500' },
              { val: `${sutrasDone}/16`, label: 'Sutras Done', icon: '📚', color: 'from-violet-400 to-indigo-500' }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-4 text-center border border-white/15 shadow-lg relative overflow-hidden group"
                whileHover={{ scale: 1.04, y: -2 }}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xl font-black text-white">{item.val}</div>
                <div className="text-[9px] text-violet-200 font-extrabold uppercase tracking-wider mt-0.5">{item.label}</div>
              </motion.div>
            ))}
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
                <motion.div
                  key={badge.id}
                  className={`flex flex-col items-center bg-white rounded-3xl p-5 border shadow-sm text-center relative overflow-hidden group transition-all ${
                    isUnlocked
                      ? 'border-violet-100/50 hover:shadow-card-hover'
                      : 'border-gray-200/50 opacity-50 bg-slate-50/40'
                  }`}
                  whileHover={isUnlocked ? { scale: 1.06, rotate: [0, -1, 1, 0], transition: { duration: 0.3 } } : {}}
                >
                  {/* Badge Emoji */}
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl mb-3 shadow-inner ${
                    isUnlocked ? 'bg-violet-50/70 text-4xl' : 'bg-slate-100 text-slate-300 filter grayscale'
                  }`}>
                    {isUnlocked ? badge.icon : '🔒'}
                  </div>

                  <span className="text-xs font-black text-ink">{badge.name}</span>
                  <span className="text-[9px] text-sub mt-1 leading-snug font-medium max-w-[90px]">{badge.desc}</span>

                  {/* Ribbon or master banner if unlocked */}
                  {isUnlocked && (
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                  )}
                </motion.div>
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
                <motion.div
                  key={player.rank}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, transition: { type: 'spring', stiffness: 300 } }}
                  className={`p-4 flex items-center gap-4 rounded-3xl border-2 transition-all ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-amber-50/40 to-violet-50/40 border-violet-200 shadow-sm'
                      : 'bg-transparent border-transparent hover:bg-slate-50/50'
                  }`}
                >
                  {/* Rank badge */}
                  <span className="font-serif font-black w-8 text-center text-lg flex-shrink-0">
                    {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                  </span>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-100 to-indigo-100 flex items-center justify-center font-bold text-sm text-violet flex-shrink-0 shadow-inner">
                    {player.avatar || '👤'}
                  </div>

                  {/* Profile info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-black text-ink truncate">
                        {player.name}
                      </span>
                      {player.streak > 0 && (
                        <span className="text-[10px] font-bold text-saffron bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          🔥{player.streak}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-extrabold text-sub uppercase tracking-wider">
                      {player.level || 'Apprentice'}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <span className="font-serif text-sm font-black text-violet">
                      {player.xp.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-black text-sub uppercase block mt-0.5">
                      XP Points
                    </span>
                  </div>
                </motion.div>
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
