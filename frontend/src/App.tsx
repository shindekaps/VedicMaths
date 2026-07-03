import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavBar } from './components/NavBar';
import OnboardingView from './pages/OnboardingView';
import { CurriculumView } from './pages/CurriculumView';
import { LeaderboardView } from './pages/LeaderboardView';
import { DashboardView } from './pages/DashboardView';
import { ProgressView } from './pages/ProgressView';
import { QuizView } from './pages/QuizView';
import { GamesView } from './pages/GamesView';
import { LessonView } from './pages/LessonView';
import { PracticeView } from './pages/PracticeView';

// Create a client for React Query
const queryClient = new QueryClient();

// App component sets up routing and global providers
function App() {
  const [view, setView] = useState("onboarding");

  // Determine if we should show the full app layout (nav bar, etc)
  const isAuthView = ['onboarding'].includes(view);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col overflow-hidden bg-bg text-ink">
        {!isAuthView && <NavBar active={view} setActive={setView} />}
        
        <div className={`flex-1 overflow-y-auto ${!isAuthView ? 'md:pt-16 pb-16 md:pb-0' : ''}`}>
          {view === 'onboarding' && <OnboardingView setActive={setView} />}
          {view === 'curriculum' && <CurriculumView setActive={setView} />}
          {view === 'leaderboard' && <LeaderboardView />}
          {view === 'dashboard' && <DashboardView setActive={setView} />}
          {view === 'progress' && <ProgressView />}
          {view === 'quiz' && <QuizView />}
          {view === 'games' && <GamesView />}
          {view === 'lesson' && <LessonView setActive={setView} sutraID="60d5ec49f1f0a8001f3b1e01" />}
          {view === 'practice' && <PracticeView sutraID="60d5ec49f1f0a8001f3b1e01" />}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
