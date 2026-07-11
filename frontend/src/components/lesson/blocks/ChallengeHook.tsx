import { cardClass } from '../styles';
import { parseStepData } from '@/utils/dataParser';

export const ChallengeHook = ({ data }: { data: any }) => {
  const parsed = parseStepData(data);
  return (
    <div className={cardClass + " bg-gradient-to-br from-violet-600 to-saffron-600 text-white"}>
      <h3 className="text-white/80 font-bold uppercase tracking-widest mb-2">Challenge</h3>
      <div className="text-2xl font-black mb-4">{parsed.problem}</div>
      <p className="text-white/90">{parsed.narrative}</p>
    </div>
  );
};
