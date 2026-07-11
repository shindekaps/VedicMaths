import { cardClass, headerClass } from '../styles';
import { parseStepData } from '@/utils/dataParser';

export const ConceptExplanation = ({ data }: { data: any }) => {
  const parsed = parseStepData(data);
  return (
    <div className={cardClass}>
      <h1 className={headerClass}>{parsed.title}</h1>
      <p className="text-sub mb-6">{parsed.explanation}</p>
      <div className="space-y-2">
        {parsed.examples?.map((ex: string, i: number) => (
          <div key={i} className="p-3 bg-bg rounded-lg text-sm font-semibold text-ink">
            {ex}
          </div>
        ))}
      </div>
    </div>
  );
};
