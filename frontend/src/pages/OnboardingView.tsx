import { useState } from "react";

interface OnboardingViewProps {
  setActive: (id: string) => void;
}

export const OnboardingView = ({ setActive }: OnboardingViewProps) => {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-[#4C1D95] to-saffron flex flex-col items-center justify-center text-center p-6 text-white">
      {step === 0 && (
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="w-24 h-24 bg-white/20 rounded-[26px] flex items-center justify-center text-5xl mb-6 backdrop-blur-md border border-white/30">🧮</div>
          <h1 className="font-serif text-5xl font-black mb-4">Vedic Math</h1>
          <p className="text-lg opacity-80 mb-8 max-w-[220px]">Master Vedic Mathematics the fun way</p>
          <div className="flex gap-2">
            <div className="w-6 h-2 rounded-full bg-gold"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
            <div className="w-2 h-2 rounded-full bg-white/40"></div>
          </div>
          <button onClick={() => setStep(1)} className="mt-12 bg-white text-violet px-12 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform">Next</button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col w-full max-w-sm bg-white text-ink p-8 rounded-[32px] animate-fadeIn">
          <div className="w-full h-40 bg-gradient-to-br from-violet-100 to-pink-50 rounded-2xl flex items-center justify-center text-6xl mb-6">🎯</div>
          <h2 className="font-serif text-2xl font-black mb-2">Who's Learning Today?</h2>
          <p className="text-sub text-sm mb-8">Choose your age group so we can personalize your Vedic Math journey!</p>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            {["5–10", "11–15", "16–18", "Adult"].map(age => (
              <button key={age} className="border-2 border-gray-100 rounded-2xl p-4 font-bold hover:border-violet transition-colors">
                {age}
              </button>
            ))}
          </div>
          
          <button onClick={() => setActive("dashboard")} className="bg-gradient-to-r from-violet to-saffron text-white py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform">
            Let's Begin
          </button>
        </div>
      )}
    </div>
  );
};

export default OnboardingView;
