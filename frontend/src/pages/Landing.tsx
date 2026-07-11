// Landing page component
const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-[#4C1D95] to-saffron flex flex-col items-center justify-center text-center p-6 text-white">
      <div className="flex flex-col items-center animate-fadeIn">
        <div className="w-24 h-24 bg-white/20 rounded-[26px] flex items-center justify-center text-5xl mb-6 backdrop-blur-md border border-white/30">🧮</div>
        <h1 className="font-serif text-5xl font-black mb-4">Vedic Math</h1>
        <p className="text-lg opacity-80 mb-8 max-w-[220px]">Master Vedic Mathematics the fun way</p>
        <div className="flex gap-2">
          <div className="w-6 h-2 rounded-full bg-gold"></div>
          <div className="w-2 h-2 rounded-full bg-white/40"></div>
          <div className="w-2 h-2 rounded-full bg-white/40"></div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
