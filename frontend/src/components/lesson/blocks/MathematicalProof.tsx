import { cardClass, headerClass } from '../styles';
import { parseStepData } from '@/utils/dataParser';

export const MathematicalProof = ({ data }: { data: any }) => {
  const parsed = parseStepData(data);
  return (
    <div className={cardClass + " bg-bg border border-violet-100"}>
      <h1 className={headerClass}>{parsed.title}</h1>
      <div className="space-y-4">
        {parsed.steps?.map((step: string, i: number) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
            <span className="font-bold text-violet">{i + 1}</span>
            <span className="text-sm text-ink">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
