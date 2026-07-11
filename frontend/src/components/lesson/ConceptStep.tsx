import type { ConceptData, Rule } from '../../types/lesson';

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

export const ConceptStep = ({ stepData }: { stepData: any }) => {
  const data = parseStepData(stepData) as ConceptData;
  return (
    <div className="flex flex-col h-full bg-white rounded-[38px] p-8 text-ink shadow-2xl">
      <h2 className="text-2xl font-black mb-2">{data.title}</h2>
      <div className="bg-violet-50 p-4 rounded-xl mb-4">
        <p className="text-xl font-bold font-mono text-violet">{data.formula}</p>
        <p className="text-xs text-sub">{data.formulaNote}</p>
      </div>
      <div className="space-y-3">
        {data.rules.map((rule: Rule, i: number) => (
          <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <span className="text-xl">{rule.icon}</span>
            <span className="text-sm font-semibold">{rule.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
