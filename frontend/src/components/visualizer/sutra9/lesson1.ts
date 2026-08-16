import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym } from '../helpers';

export function buildChalanaSequence(p: any): LessonModel {
  const first = p.first || 2;
  const diff = p.diff || 3;
  const n = p.n || 10;
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  const terms: number[] = [];
  for (let i = 0; i < 4; i++) {
    terms.push(first + i * diff);
  }
  
  // Frame 1
  log.push(['Setup', `Arithmetic Sequence starting at ${first}, difference ${diff}`]);
  frames.push({
    cap: `Identify the sequence parameters: first term = ${first}, common difference = ${diff}.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Sequence',
        nodes: [
          ...terms.map(t => cell(t.toString())),
          cell('...', 'muted')
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  // Frame 2
  log.push(['Goal', `Find the ${n}th term`]);
  const nthTerm = first + (n - 1) * diff;
  frames.push({
    cap: `To find the ${n}th term, use the formula: a_n = a_1 + (n-1)d`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Formula',
        nodes: [
          cell(`a_${n}`, 'eka', { tag: 'nth term' }),
          sym('='),
          cell(first.toString(), '', { tag: 'a_1' }),
          sym('+'),
          sym('('),
          cell(n.toString(), '', { tag: 'n' }),
          sym('-'),
          cell('1'),
          sym(')'),
          sym('×'),
          cell(diff.toString(), '', { tag: 'd' })
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  // Frame 3
  log.push(['Solve', `a_${n} = ${first} + ${n-1} × ${diff} = ${nthTerm}`]);
  frames.push({
    cap: `Substitute and calculate: ${first} + ${(n-1)} × ${diff} = ${nthTerm}`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Result',
        nodes: [
          cell(`a_${n}`),
          sym('='),
          cell(nthTerm.toString(), 'res', { pop: true })
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  return {
    title: 'Sutra 9 - Chalana-Kalanabyham: Arithmetic Sequences',
    ruleHTML: '<em>Chalana-Kalanabyham</em> means "Differences and Similarities". Here we use differences to find the nth term of a sequence.',
    frames,
    note: `Used for arithmetic sequences and calculating specific terms based on initial differences.`
  };
}
