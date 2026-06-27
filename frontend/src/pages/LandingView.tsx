import { useState } from "react";
import { theme } from "@/theme";
import { MandalaDecor } from "@/components/MandalaDecor";

interface LandingViewProps {
  setActive: (id: string) => void;
}

const LandingView = ({ setActive }: LandingViewProps) => {
  return (
    <div className="bg-background min-h-screen overflow-hidden">
      {/* Hero: Saffron gradient background */}
      <div className="bg-gradient-to-br from-primary to-orange-800 p-16 relative overflow-hidden text-white">
        <div className="absolute top-[-20px] right-[-20px] pointer-events-none">
          <MandalaDecor size={300} opacity={0.2} color="white" />
        </div>
        
        <div className="relative max-w-3xl">
          <h1 className="font-sans text-6xl font-bold leading-tight mb-6 tracking-tighter">
            Master Vedic<br />
            Mathematics
          </h1>
          <p className="text-white/90 text-lg leading-relaxed mb-8 max-w-lg">
            The world's fastest mental math system, distilled into interactive lessons, games, and adaptive practice.
          </p>
          
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setActive("curriculum")} className="bg-white text-primary rounded-[8px] px-7 py-4 text-sm font-bold hover:bg-lightGray">
              Start Learning Free →
            </button>
            <button onClick={() => setActive("lesson")} className="bg-transparent text-white border border-white rounded-[8px] px-6 py-4 text-sm font-bold hover:bg-white/10">
              Watch Demo Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;
