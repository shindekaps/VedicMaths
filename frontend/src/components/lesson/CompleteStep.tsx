import type { CompleteData } from '../../types/lesson';

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

export const CompleteStep = ({ stepData }: { stepData: any }) => {
  const data = parseStepData(stepData) as CompleteData;
  return (
    <div className="flex flex-col h-full bg-white rounded-[38px] p-8 text-ink shadow-2xl items-center justify-center text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-3xl font-black mb-2">{data.title}</h2>
      <p className="text-lg text-sub mb-6">{data.message}</p>
      <div className="text-2xl font-bold text-saffron">{"★".repeat(data.stars)}</div>
    </div>
  );
};