import React, { useState, useLayoutEffect } from 'react';
import type { WireDef } from './types';

export const WireSVG = ({ wires, containerRef }: { wires: WireDef[], containerRef: React.RefObject<HTMLDivElement> }) => {
  const [paths, setPaths] = useState<any[]>([]);

  useLayoutEffect(() => {
    if (!containerRef.current || wires.length === 0) {
      setPaths([]);
      return;
    }
    
    const timer = setTimeout(() => {
      const bb = containerRef.current!.getBoundingClientRect();
      const newPaths = wires.map(w => {
        const a = containerRef.current!.querySelector(`[data-k="${w.fromKey}"]`);
        const b = containerRef.current!.querySelector(`[data-k="${w.toKey}"]`);
        if (!a || !b) return null;

        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const x1 = ra.left - bb.left + ra.width / 2, y1 = ra.bottom - bb.top;
        const x2 = rb.left - bb.left + rb.width / 2, y2 = rb.top - bb.top;
        const dy = Math.max(26, (y2 - y1) * 0.55);
        return {
          d: `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`,
          color: w.color || '#4cc2ff',
          x2, y2
        };
      }).filter(Boolean);
      
      setPaths(newPaths);
    }, 150);

    return () => clearTimeout(timer);
  }, [wires, containerRef]);

  return (
    <svg className="vvm-wires">
      {paths.map((p, i) => (
        <g key={i}>
          <path
            d={p.d} fill="none" stroke={p.color} strokeWidth="2"
            strokeLinecap="round" strokeDasharray="600 600" opacity=".75"
            className="vvm-wire-path"
            style={{ animation: `drawWire 0.55s ease forwards ${i * 0.1}s` }}
          />
          <circle 
            cx={p.x2} cy={p.y2} r="3.5" fill={p.color}
            className="vvm-wire-head"
            style={{ animation: `fadeIn 0.3s ease forwards ${i * 0.1 + 0.5}s` }}
          />
        </g>
      ))}
    </svg>
  );
};
