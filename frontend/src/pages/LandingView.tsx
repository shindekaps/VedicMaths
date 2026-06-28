import { MandalaDecor } from "@/components/MandalaDecor";

interface LandingViewProps {
  setActive: (id: string) => void;
}

export const LandingView = ({ setActive }: LandingViewProps) => {
  return (
    <div className="bg-bg min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-saffron to-yellow-100 py-24 px-4 text-center text-white relative">
        <h1 className="text-5xl font-bold mb-4">Master Vedic Math</h1>
        <p className="text-xl mb-8">Learn Ancient Techniques, Modern Way</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => setActive("curriculum")} className="bg-white text-saffron px-8 py-3 rounded-lg font-bold hover:shadow-lg">
            Get Started
          </button>
          <button onClick={() => setActive("lesson")} className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-saffron">
            Learn More
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="bg-white py-6 px-4 text-center border-b border-border">
        <div className="max-w-6xl mx-auto flex justify-around">
          <div>
            <div className="text-3xl font-bold text-saffron">16</div>
            <div className="text-gray-600 text-sm">Vedic Sutras</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-saffron">50K+</div>
            <div className="text-gray-600 text-sm">Students</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-saffron">98%</div>
            <div className="text-gray-600 text-sm">Mastery Rate</div>
          </div>
        </div>
      </div>

      {/* Features Cards */}
      <div className="bg-cream py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border-l-4 border-gold rounded-lg p-6 shadow-md hover:shadow-lg">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-lg font-bold text-primary mb-2">Lessons</h3>
            <p className="text-sm text-ink">Animated step-by-step explanations</p>
          </div>
          <div className="bg-card border-l-4 border-gold rounded-lg p-6 shadow-md hover:shadow-lg">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-bold text-primary mb-2">Practice</h3>
            <p className="text-sm text-ink">Adaptive difficulty system</p>
          </div>
          <div className="bg-card border-l-4 border-gold rounded-lg p-6 shadow-md hover:shadow-lg">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-lg font-bold text-primary mb-2">Compete</h3>
            <p className="text-sm text-ink">Global leaderboards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
