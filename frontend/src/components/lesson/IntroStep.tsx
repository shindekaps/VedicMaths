// Utility to convert the awkward Key-Value array format into a usable object
const parseStepData = (stepArray: Array<{ Key: string; Value: any }>) => {
  const data: any = {};
  stepArray.forEach((item) => {
    if (Array.isArray(item.Value) && item.Value.length > 0 && item.Value[0].Key) {
        data[item.Key] = parseStepData(item.Value);
    } else {
        data[item.Key] = item.Value;
    }
  });
  return data;
};

export const IntroStep = ({ stepData }: { stepData: any }) => {
  const data = parseStepData(stepData);
  return (
    <div className="flex flex-col h-full bg-white rounded-[38px] p-8 text-ink shadow-2xl">
      {/* Top Bar matching design */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-extrabold text-sub tracking-widest uppercase">Sutra 03</span>
        <span className="text-[10px] font-extrabold text-sub tracking-widest uppercase">0 XP</span>
      </div>
      
      {/* Centered Intro Body */}
      <div className="flex flex-col items-center flex-grow justify-center text-center">
        <div className="text-6xl mb-4">✖️</div>
        <h1 className="text-4xl font-black font-serif text-ink mb-1">Urdhva-Tiryagbhyam</h1>
        <p className="text-violet font-extrabold text-lg mb-6">Vertically & Crosswise</p>
        <p className="text-sub text-base mb-8 leading-relaxed max-w-[400px]">{data.description}</p>
        
        {/* 'What you'll learn' section */}
        <div className="w-full text-left bg-bg p-6 rounded-3xl border border-[#E9D5FF]">
          <h3 className="font-extrabold text-ink mb-4">What you'll learn</h3>
          <ul className="space-y-3">
            {data.whatYouLearn.map((item: string, i: number) => (
              <li key={i} className="flex gap-3 items-center text-sm font-semibold text-sub">
                <div className="w-2 h-2 rounded-full bg-green" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
