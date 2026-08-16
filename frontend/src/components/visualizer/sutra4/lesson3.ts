import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym } from '../helpers';

export function buildParavartyaLarge(p: any): LessonModel {
  const num = p.num || 12345;
  const den = p.den || 112;
  const frames: Frame[] = [];
  
  const numStr = num.toString();
  const denStr = den.toString();
  
  let lineIdSeq = 1;
  
  frames.push({
    cap: `Step 1: Setup division for ${num} ÷ ${den}`,
    log: [['Setup', `Split divisor into first digit and flag digits`]],
    lines: [{
      id: `l-${lineIdSeq++}`,
      label: 'Setup',
      nodes: [
        cell(denStr[0], 'eka'),
        cell(denStr.slice(1), 'tail', { tag: 'flag' }),
        sym('|'),
        ...numStr.split('').map(d => cell(d, '', { tag: 'dividend' }))
      ]
    }],
    wires: [],
    flyers: []
  });

  const q = Math.floor(num / den);
  const r = num % den;

  frames.push({
    cap: `Step 2: Calculate quotient and remainder`,
    log: [
      ['Setup', `Split divisor into first digit and flag digits`],
      ['Process', `Apply Paravartya Yojayet (Transpose and Apply)`]
    ],
    lines: [
      {
        id: `l-${lineIdSeq-1}`,
        label: 'Setup',
        nodes: [
          cell(denStr[0], 'eka'),
          cell(denStr.slice(1), 'tail'),
          sym('|'),
          ...numStr.split('').map(d => cell(d, '', { tag: 'dividend' }))
        ],
        muted: true
      },
      {
        id: `l-${lineIdSeq++}`,
        label: 'Answer',
        nodes: [
          cell(`Q = ${q}`, 'res', { pop: true }),
          sym(','),
          cell(`R = ${r}`, 'res', { pop: true })
        ]
      }
    ],
    wires: [],
    flyers: []
  });

  return {
    title: 'Paravartya Yojayet - Larger Numbers',
    ruleHTML: 'Transpose and Apply',
    frames,
    note: 'Division by larger numbers using flag technique.'
  };
}
