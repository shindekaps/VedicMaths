import { cardClass, headerClass, subHeaderClass } from '../styles';
import { parseStepData } from '@/utils/dataParser';

export const SutraShowcase = ({ data }: { data: any }) => {
  const parsed = parseStepData(data);
  return (
    <div className={cardClass + " bg-navy text-white text-center"}>
      <h3 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">The Sutra</h3>
      <div className="text-3xl font-black text-gold mb-2">{parsed.name}</div>
      <div className="text-lg text-white/90 mb-6">{parsed.meaning}</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 p-4 rounded-xl text-left">
          <div className="text-xs text-gold font-bold uppercase">Ekadhika</div>
          <div className="text-sm">{parsed.breakdown?.ekadhika}</div>
        </div>
        <div className="bg-white/10 p-4 rounded-xl text-left">
          <div className="text-xs text-gold font-bold uppercase">Purvena</div>
          <div className="text-sm">{parsed.breakdown?.purvena}</div>
        </div>
      </div>
    </div>
  );
};
