import React from 'react';

export const RishiCharacter: React.FC = () => {
  return (
    <svg width="105" height="105" viewBox="0 0 120 120" className="select-none pointer-events-none">
      {/* Halo/Glow */}
      <circle cx="60" cy="55" r="34" fill="#FDE047" opacity="0.25" className="animate-pulse" />
      
      {/* Hair (Long flowing wavy brown/grey hair behind) */}
      <path d="M30 45 C20 60, 25 100, 42 105 C45 90, 38 60, 40 45" fill="#5C4033" />
      <path d="M90 45 C100 60, 95 100, 78 105 C75 90, 82 60, 80 45" fill="#5C4033" />

      {/* Body / Saffron Robe (Bare right shoulder, draped over left) */}
      {/* Base Skin body */}
      <path d="M38 85 C38 75, 82 75, 82 85 L78 110 L42 110 Z" fill="#FED7AA" />
      {/* Saffron Angavastra draped from left shoulder to right waist */}
      <path d="M36 82 C38 74, 55 78, 62 88 L52 110 L38 110 Z" fill="#FF6B35" />
      <path d="M36 82 C42 82, 68 95, 78 106 L74 110 L48 110 Z" fill="#EA580C" /> {/* Draped folds */}

      {/* Beard (tapered flowing Indian Rishi beard) */}
      <path d="M42 62 C42 105, 78 105, 78 62 C78 75, 42 75, 42 62" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
      <path d="M47 62 C47 98, 73 98, 73 62 Z" fill="#FFFFFF" />

      {/* Face */}
      <circle cx="60" cy="54" r="20" fill="#FED7AA" />

      {/* Tripundra Tilak (Three horizontal lines on forehead + red dot) */}
      {/* Line 1 */}
      <line x1="52" y1="41" x2="68" y2="41" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      {/* Line 2 */}
      <line x1="50" y1="43" x2="70" y2="43" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      {/* Line 3 */}
      <line x1="52" y1="45" x2="68" y2="45" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      {/* Red dot in center */}
      <circle cx="60" cy="43" r="2" fill="#EF4444" />

      {/* Eyes (happy arches) */}
      <path d="M50 53 Q54 50 56 53" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      <path d="M64 53 Q66 50 70 53" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

      {/* Rosy Cheeks */}
      <circle cx="47" cy="58" r="2.5" fill="#F472B6" opacity="0.7" />
      <circle cx="73" cy="58" r="2.5" fill="#F472B6" opacity="0.7" />

      {/* Smile */}
      <path d="M57 60 Q60 63 63 60" fill="none" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />

      {/* Hair topknot bun (Juda) */}
      <circle cx="60" cy="30" r="9" fill="#5C4033" />
      {/* Rudraksha string around the bun */}
      <circle cx="55" cy="34" r="2" fill="#92400E" />
      <circle cx="60" cy="35" r="2" fill="#92400E" />
      <circle cx="65" cy="34" r="2" fill="#92400E" />
      <circle cx="53" cy="30" r="2" fill="#92400E" />
      <circle cx="67" cy="30" r="2" fill="#92400E" />

      {/* Rudraksha Mala (Necklace of brown beads) */}
      <circle cx="48" cy="78" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
      <circle cx="52" cy="81" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
      <circle cx="57" cy="83" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
      <circle cx="63" cy="83" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
      <circle cx="68" cy="81" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
      <circle cx="72" cy="78" r="2.5" fill="#92400E" stroke="#78350F" strokeWidth="0.5" />
    </svg>
  );
};
