import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavBar } from './components/NavBar';
import LandingView from './pages/LandingView';
import { CurriculumView } from './pages/CurriculumView';
import { LeaderboardView } from './pages/LeaderboardView';

// Create a client for React Query
const queryClient = new QueryClient();

// App component sets up routing and global providers
function App() {
  const [view, setView] = useState("landing");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col overflow-hidden bg-[#FBF7EE]">
        <NavBar active={view} setActive={setView} />
        <div className="flex-1 overflow-y-auto">
          {view === 'landing' && <LandingView setActive={setView} />}
          {view === 'curriculum' && <CurriculumView setActive={setView} />}
          {view === 'leaderboard' && <LeaderboardView />}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
