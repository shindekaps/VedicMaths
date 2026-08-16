import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym } from '../helpers';

export function buildParavartyaSingle(p: any): LessonModel {
  const num = p.num || 256;
  const den = p.den || 8;
  const frames: Frame[] = [];
  
  const numStr = num.toString();
  const denStr = den.toString();
  
  let lineIdSeq = 1;
  
  frames.push({
    cap: `Step 1: Setup division for ${num} ÷ ${den}`,
    log: [['Setup', `Dividend: ${num}, Divisor: ${den}`]],
    lines: [{
      id: `l-${lineIdSeq++}`,
      label: 'Setup',
      nodes: [
        cell(denStr, 'eka', { tag: 'divisor' }),
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
    cap: `Step 2: Calculate quotient and remainder using flag technique`,
    log: [
      ['Setup', `Dividend: ${num}, Divisor: ${den}`],
      ['Process', `Apply Paravartya Yojayet (Transpose and Apply)`]
    ],
    lines: [
      {
        id: `l-${lineIdSeq-1}`,
        label: 'Setup',
        nodes: [
          cell(denStr, 'eka', { tag: 'divisor' }),
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
    title: 'Paravartya Yojayet - Single Digit',
    ruleHTML: 'Transpose and Apply',
    frames,
    note: 'Division by single digit using Paravartya Yojayet.'
  };
}
