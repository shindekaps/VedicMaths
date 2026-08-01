import React, { useState, useEffect } from 'react';
import type { LineDef, LineNode } from './types';
import { Cell } from './Cell';

const NodeRenderer = ({ node }: { node: LineNode }) => {
  switch (node.type) {
    case 'cell': return <Cell def={node.def} />;
    case 'sym': return <span className={`vvm-sym ${node.big ? 'big' : ''}`}>{node.text}</span>;
    case 'divider': return <div className="vvm-divider"></div>;
    case 'flow': return <div className="vvm-flow" dangerouslySetInnerHTML={{ __html: node.html }} />;
    default: return null;
  }
};

export const Line = ({ def, isNew }: { def: LineDef, isNew: boolean }) => {
  const [inClass, setInClass] = useState(!isNew);
  
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setInClass(true), 90);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  return (
    <div className={`vvm-line ${inClass ? 'in' : ''} ${def.muted ? 'muted' : ''}`}>
      {def.label && <div className="vvm-line-label">{def.label}</div>}
      {def.nodes.map((n, i) => <NodeRenderer key={i} node={n} />)}
    </div>
  );
};
