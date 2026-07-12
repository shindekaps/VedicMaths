import { api } from './client';
import { useQuery } from '@tanstack/react-query';

export interface UserStats {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  sutraCompleted: number;
  lessonsCompleted: number;
  assessmentsPassed: number;
  totalTimeSpent: number;
  averageScore: number;
  badges: Array<{
    badgeId: string;
    name: string;
    icon: string;
    unlockedAt: string;
  }>;
  recentActivity: Array<{
    type: string;
    sutraId: number;
    lessonId: string;
    score: number;
    timestamp: string;
  }>;
}

export interface DailyStats {
  streak: number;
  xp: number;
  activeTimeLimit: number;
  activeTimeToday: number;
  questionsSolved: number;
  accuracy: number;
}

export interface ProgressStats {
  overallProgress: {
    totalSutras: number;
    sutrasCompleted: number;
    totalLessons: number;
    lessonsCompleted: number;
    totalTimeSpent: number;
    averageScore: number;
  };
  sutraProgress: Array<{
    sutraId: number;
    name: string;
    status: string;
    lessonsCompleted: number;
    totalLessons: number;
    completionPercentage: number;
  }>;
}

export const fetchStats = (): Promise<{ success: boolean; data: { stats: UserStats } }> =>
  api.get('/stats');

export const fetchDailyStats = (): Promise<{ success: boolean; data: DailyStats }> =>
  api.get('/stats/daily');

export const fetchProgress = (): Promise<{ success: boolean; data: ProgressStats }> =>
  api.get('/progress');

export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: fetchStats,
  });
};

export const useDailyStats = () => {
  return useQuery({
    queryKey: ['dailyStats'],
    queryFn: fetchDailyStats,
  });
};

export const useProgress = () => {
  return useQuery({
    queryKey: ['progress'],
    queryFn: fetchProgress,
  });
};

export interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  level: string;
  avatar: string;
}

export const fetchLeaderboard = (): Promise<{ success: boolean; data: LeaderboardUser[] }> =>
  api.get('/leaderboard');

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
  });
};
