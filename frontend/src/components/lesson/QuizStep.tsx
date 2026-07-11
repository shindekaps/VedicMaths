import type { QuizData } from '../../types/lesson';

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

export const QuizStep = ({ stepData }: { stepData: any }) => {
  const data = parseStepData(stepData) as QuizData;
  return (
    <div className="flex flex-col h-full bg-white rounded-[38px] p-8 text-ink shadow-2xl">
      <h2 className="text-2xl font-black mb-4">{data.title}</h2>
      <p className="text-xl mb-6">{data.question}</p>
      <div className="space-y-3">
        {data.options.map((option: string, i: number) => (
          <button key={i} className="w-full p-4 border rounded-xl font-bold hover:bg-violet-50 transition-colors">
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};