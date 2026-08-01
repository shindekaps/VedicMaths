import React, { useState, useLayoutEffect } from 'react';
import type { FlyerDef } from './types';

export const Flyer = ({ def, containerRef }: { def: FlyerDef, containerRef: React.RefObject<HTMLDivElement> }) => {
  const [style, setStyle] = useState<any>({ opacity: 0 });

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const a = containerRef.current.querySelector(`[data-k="${def.fromKey}"]`);
    const b = containerRef.current.querySelector(`[data-k="${def.toKey}"]`);
    if (!a || !b) return;

    const bb = containerRef.current.getBoundingClientRect();
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    
    setStyle({
      left: ra.left - bb.left,
      top: ra.top - bb.top,
      minWidth: ra.width,
      height: ra.height,
      opacity: 1,
      transform: 'translate(0px, 0px)'
    });

    const t1 = setTimeout(() => {
      setStyle((prev: any) => ({
        ...prev,
        transform: `translate(${rb.left - ra.left}px, ${rb.top - ra.top}px)`
      }));
    }, 50);

    const t2 = setTimeout(() => {
      setStyle((prev: any) => ({ ...prev, opacity: 0 }));
    }, 620);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [def, containerRef]);

  return <div className="vvm-flyer" style={style}>{def.text}</div>;
};
