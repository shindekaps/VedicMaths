import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavBar } from './components/NavBar';
import { AuthPage } from './pages/AuthPage';
import OnboardingView from './pages/OnboardingView';
import { CurriculumView } from './pages/CurriculumView';
import { LeaderboardView } from './pages/LeaderboardView';
import { DashboardView } from './pages/DashboardView';
import { ProgressView } from './pages/ProgressView';
import { QuizView } from './pages/QuizView';
import { GamesView } from './pages/GamesView';
import { LessonView } from './pages/LessonView';
import { PracticeView } from './pages/PracticeView';
import { useAuthStore } from './stores/authStore';
import { Toaster } from 'react-hot-toast';

// Create a client for React Query
const queryClient = new QueryClient();

// App component sets up routing and global providers
function App() {
  const [view, setView] = useState("dashboard");
  const [selectedSutraID, setSelectedSutraID] = useState<string>("");
  const { isAuthenticated } = useAuthStore();

  // Show auth page if not logged in
  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthPage onSuccess={() => setView("dashboard")} />
      </QueryClientProvider>
    );
  }

  // Determine if we should show the full app layout (nav bar, etc)
  const isAuthView = ['onboarding'].includes(view);

  const navigateToLesson = (sutraID: string) => {
    setSelectedSutraID(sutraID);
    setView('lesson');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={`h-screen flex flex-col overflow-hidden ${view === 'lesson' ? 'bg-[#0F172A]' : 'bg-bg'} text-ink`}>
        {!isAuthView && <NavBar active={view} setActive={setView} />}
        
        <div className={`flex-1 overflow-y-auto ${!isAuthView ? 'md:pt-16 pb-16 md:pb-0' : ''}`}>
          {view === 'onboarding' && <OnboardingView setActive={setView} />}
          {view === 'curriculum' && <CurriculumView navigateToLesson={navigateToLesson} />}
          {view === 'leaderboard' && <LeaderboardView />}
          {view === 'dashboard' && <DashboardView setActive={setView} />}
          {view === 'progress' && <ProgressView />}
          {view === 'quiz' && <QuizView />}
          {view === 'games' && <GamesView />}
          {view === 'lesson' && <LessonView setActive={setView} sutraID={selectedSutraID} />}
          {view === 'practice' && <PracticeView sutraID={selectedSutraID} />}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
