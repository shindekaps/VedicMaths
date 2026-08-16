import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym } from '../helpers';

export function buildYavadunam1000(p: any): LessonModel {
  const n = p.n || 998;
  const base = 1000;
  const deficiency = base - n;
  const isDeficient = deficiency >= 0;
  const dStr = Math.abs(deficiency).toString();
  const lhs = n + (isDeficient ? -Math.abs(deficiency) : Math.abs(deficiency));
  const rhs = Math.pow(Math.abs(deficiency), 2);
  const rhsStr = rhs.toString().padStart(3, '0');
  const ans = `${lhs}${rhsStr}`;
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  // Frame 1
  log.push(['Setup', `n = ${n}, base = ${base}, ${isDeficient ? 'deficiency' : 'excess'} = ${dStr}`]);
  frames.push({
    cap: `Identify the base (${base}) and find the ${isDeficient ? 'deficiency' : 'excess'} for ${n}.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Find Difference',
        nodes: [
          cell(n.toString(), 'eka', { tag: 'number' }),
          sym(isDeficient ? 'below' : 'above'),
          cell(base.toString(), '', { tag: 'base' }),
          sym('→'),
          cell(dStr, 'tail', { tag: isDeficient ? 'deficiency' : 'excess', pop: true })
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  // Frame 2
  const opStr = isDeficient ? 'Lessen' : 'Increase';
  const opSym = isDeficient ? '-' : '+';
  log.push(['LHS', `${n} ${opSym} ${dStr} = ${lhs}`]);
  frames.push({
    cap: `${opStr} the number by its difference to get the Left Hand Side (LHS).`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'LHS',
        nodes: [
          cell(n.toString()),
          sym(opSym),
          cell(dStr),
          sym('='),
          cell(lhs.toString(), 'res', { tag: 'LHS', pop: true })
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  // Frame 3
  log.push(['RHS', `Square difference: ${dStr}² = ${rhsStr}`]);
  frames.push({
    cap: `Square the difference for the Right Hand Side (RHS). Pad to 3 digits since base is 1000.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'RHS',
        nodes: [
          cell(dStr),
          sym('²'),
          sym('='),
          cell(rhsStr, 'res', { tag: 'RHS', pop: true })
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  // Frame 4
  log.push(['Result', `${lhs} | ${rhsStr} = ${ans}`]);
  frames.push({
    cap: `Combine LHS and RHS to get the final answer.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Final Answer',
        nodes: [
          cell(lhs.toString(), 'res'),
          sym('|'),
          cell(rhsStr, 'res'),
          sym('='),
          cell(ans, 'res', { tag: 'Answer', pop: true })
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  return {
    title: 'Sutra 10 - Yavadunam: Squaring near 1000',
    ruleHTML: '<em>Yavadunam</em> is similarly applied to larger bases like 1000.',
    frames,
    note: `Using 3 padded digits on the RHS for base 1000.`
  };
}
