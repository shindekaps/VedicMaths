import { cardClass, headerClass } from '../styles';
import { parseStepData } from '@/utils/dataParser';

export const WorkedExample = ({ data }: { data: any }) => {
  const parsed = parseStepData(data);
  return (
    <div className={cardClass + " bg-green-50 border border-green-100"}>
      <h1 className={headerClass + " text-green-800"}>{parsed.title}</h1>
      <div className="text-2xl font-black text-center my-6 p-4 bg-white rounded-xl text-green-700">{parsed.problem}</div>
      <div className="space-y-4">
        {parsed.steps?.map((step: any, i: number) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-xl">
            <span className="font-bold text-green-600 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">{step.num}</span>
            <div>
              <div className="font-bold text-ink">{step.title}</div>
              <div className="text-sm text-sub">{step.calc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
