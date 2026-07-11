import type { VisualData, Step } from '../../types/lesson';

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

export const VisualStep = ({ stepData }: { stepData: any }) => {
  const data = parseStepData(stepData) as VisualData;
  return (
    <div className="flex flex-col h-full bg-navy rounded-[38px] p-8 text-white shadow-2xl">
      <h2 className="text-xl font-black mb-1 opacity-70">Worked Example</h2>
      <h1 className="text-3xl font-bold mb-6">{data.title}</h1>
      <div className="bg-white/10 p-6 rounded-3xl mb-8">
        <div className="text-center text-4xl font-mono font-black mb-4">{data.problem}</div>
      </div>
      <div className="space-y-4">
        {data.steps.map((step: Step, i: number) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-violet flex items-center justify-center font-bold text-sm">
                {step.num}
            </div>
            <div>
              <div className="font-bold">{step.title}</div>
              <div className="text-xs text-white/60">{step.calc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};