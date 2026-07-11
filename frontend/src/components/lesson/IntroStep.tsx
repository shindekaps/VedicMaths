import { cardClass, headerClass, subHeaderClass, bodyTextClass, stepLabelClass } from './styles';

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

export const IntroStep = ({ stepData, sutraTitle }: { stepData: any, sutraTitle: string }) => {
  const data = parseStepData(stepData);
  return (
    <div className={cardClass + " bg-navy text-white"}>
      <div className="flex justify-between items-center mb-6">
        <span className={stepLabelClass + " text-white/70"}>Lesson</span>
        <span className={stepLabelClass + " text-white/70"}>0 XP</span>
      </div>
      
      <div className="flex flex-col items-center flex-grow justify-center text-center">
        <div className="text-6xl mb-6">✖️</div>
        <h1 className={headerClass + " text-white"}>{sutraTitle}</h1>
        <p className={subHeaderClass + " text-gold"}>{sutraTitle}</p>
        <p className={`${bodyTextClass} text-white/80 mb-8 max-w-[400px]`}>{data.description}</p>
        
        <div className="w-full text-left bg-white/10 p-6 rounded-3xl border border-white/10">
          <h3 className="font-extrabold text-white mb-4">What you'll learn</h3>
          <ul className="space-y-3">
            {data.whatYouLearn && data.whatYouLearn.map((item: string, i: number) => (
              <li key={i} className="flex gap-3 items-center text-sm font-semibold text-white/70">
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
