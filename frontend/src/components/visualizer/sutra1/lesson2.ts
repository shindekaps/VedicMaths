import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildLesson2(p: any): LessonModel {
  const a = p.a, b = p.b;
  const prevStr = p.prev !== undefined ? String(p.prev) : String(Math.floor(a / 10));
  const laStr = p.la !== undefined ? String(p.la) : String(a % 10);
  const lbStr = p.lb !== undefined ? String(p.lb) : String(b % 10);
  
  const prev = Number(prevStr), la = Number(laStr), lb = Number(lbStr);
  const k = p.k || 1;
  
  const eka = prev + 1, left = prev * eka, right = la * lb;
  const padding = k * 2;
  const R = String(right).padStart(padding, '0'), L = String(left), P = prevStr;
  const ans = a * b;
  const frames: Frame[] = [];

  let lineIdSeq = 0;

  const problem = (pc: string, tc: string): LineDef => ({
    id: `prob_${++lineIdSeq}`,
    label: 'problem',
    nodes: [
      cell(P, pc, { id: 'p1' }), cell(laStr, tc, { id: 'la' }), sym('x'),
      cell(P, pc, { id: 'p2' }), cell(lbStr, tc, { id: 'lb' })
    ]
  });

  frames.push({
    cap: `Multiply <b>${a} × ${b}</b> - but check the shape of the numbers first.`,
    log: [['', `${a} × ${b}`]],
    lines: [problem('', '')],
    wires: [], flyers: []
  });

  const sumGoal = Math.pow(10, k);
  frames.push({
    cap: `Two conditions: the leading parts <span class="vvm-hl">match</span> (${prev} and ${prev}), and the last parts <span class="vvm-hl3">add to ${sumGoal}</span> (${la} + ${lb} = ${sumGoal}).`,
    log: [['', `previous: ${prev} = ${prev} ✓`], ['', `${la} + ${lb} = ${sumGoal} ✓`]],
    lines: [
      problem('prev', 'tail'),
      {
        id: `check_${++lineIdSeq}`, label: 'check',
        nodes: [
          cell(laStr, 'tail', { id: 'c1' }), sym('+'), cell(lbStr, 'tail', { id: 'c2' }),
          sym('='), cell(String(sumGoal), 'eka', { pop: true })
        ]
      }
    ],
    wires: [{ fromKey: 'la', toKey: 'c1', color: '#4cc2ff' }, { fromKey: 'lb', toKey: 'c2', color: '#4cc2ff' }],
    flyers: []
  });

  frames.push({
    cap: `Same sutra: <span class="vvm-hl2">one more than the previous</span> → ${prev} + 1 = <span class="vvm-hl2">${eka}</span>.`,
    log: [['', `ekādhika = ${prev} + 1 = <span class="vvm-v">${eka}</span>`]],
    lines: [
      problem('prev', 'tail'),
      {
        id: `eka_${++lineIdSeq}`, label: 'ekādhika',
        nodes: [
          cell(P, 'prev', { id: 'p3' }), sym('+'), cell('1', '', { sm: true }), sym('='),
          cell(String(eka), 'eka', { id: 'e', pop: true, tag: '+1' })
        ]
      }
    ],
    wires: [{ fromKey: 'p1', toKey: 'p3', color: '#f0b429' }],
    flyers: []
  });

  frames.push({
    cap: `Left half = <span class="vvm-hl">${prev}</span> × <span class="vvm-hl2">${eka}</span> = <b>${left}</b>.`,
    log: [['1', `left = ${prev} × ${eka} = <span class="vvm-v">${left}</span>`]],
    lines: [
      problem('prev', 'tail'),
      {
        id: `eka_${++lineIdSeq}`, label: 'ekādhika', muted: true,
        nodes: [
          cell(P, 'prev', { id: 'p3' }), sym('+'), cell('1', '', { sm: true }), sym('='), cell(String(eka), 'eka', { id: 'e' })
        ]
      },
      {
        id: `left_${++lineIdSeq}`, label: 'left half',
        nodes: [
          cell(P, 'prev', { id: 'p4' }), sym('x'), cell(String(eka), 'eka', { id: 'e2' }), sym('='),
          cell(L, 'res', { id: 'L', pop: true })
        ]
      }
    ],
    wires: [{ fromKey: 'p3', toKey: 'p4', color: '#f0b429' }, { fromKey: 'e', toKey: 'e2', color: '#3fb950' }],
    flyers: []
  });

  frames.push({
    cap: `Right half = the two last parts multiplied = <b>${la} × ${lb} = ${right}</b>${right < Math.pow(10, padding - 1) ? ` → padded to <b>${R}</b>` : ''}. Always twice as many digits as the matching suffix.`,
    log: [['2', `right = ${la} × ${lb} = <span class="vvm-v">${R}</span>`]],
    lines: [
      problem('prev', 'tail'),
      {
        id: `left_${++lineIdSeq}`, label: 'left half', muted: true,
        nodes: [cell(L, 'res', { id: 'L' })]
      },
      {
        id: `right_${++lineIdSeq}`, label: 'right half',
        nodes: [
          cell(laStr, 'tail', { id: 'r1' }), sym('x'), cell(lbStr, 'tail', { id: 'r2' }), sym('='),
          cell(R, 'res', { id: 'R', pop: true })
        ]
      }
    ],
    wires: [{ fromKey: 'la', toKey: 'r1', color: '#4cc2ff' }, { fromKey: 'lb', toKey: 'r2', color: '#4cc2ff' }],
    flyers: []
  });

  const finalSlots: LineNode[] = [];
  L.split('').forEach((ch, i) => finalSlots.push(cell(ch, 'res', { id: 'aL' + i })));
  R.split('').forEach((ch, i) => finalSlots.push(cell(ch, 'res', { id: 'aR' + i })));

  frames.push({
    cap: `Join them: <b>${a} × ${b} = ${ans}</b>.`,
    log: [['', `answer = ${left} | ${R}`], ['sum', `${a} × ${b} = ${ans}`]],
    lines: [
      problem('prev', 'tail'),
      { id: `left_${++lineIdSeq}`, label: 'left half', muted: true, nodes: [cell(L, 'res', { id: 'L' })] },
      { id: `right_${++lineIdSeq}`, label: 'right half', muted: true, nodes: [cell(R, 'res', { id: 'R' })] },
      { id: `div_${++lineIdSeq}`, label: null, nodes: [divider()] },
      { id: `ans_${++lineIdSeq}`, label: 'answer', nodes: finalSlots }
    ],
    wires: [
      { fromKey: 'L', toKey: 'aL0', color: '#bc8cff' },
      { fromKey: 'R', toKey: 'aR0', color: '#bc8cff' }
    ],
    flyers: [
      { fromKey: 'L', toKey: 'aL0', text: L },
      { fromKey: 'R', toKey: 'aR0', text: R }
    ]
  });

  return {
    title: 'Lesson 2 – Same leading part, last digits adding to 10',
    ruleHTML: 'Left = <code>prev × (prev+1)</code>. Right = <code>product of the last digits</code>, always padded to twice the length.',
    frames,
    note: `Also covers cases where suffixes sum to 100, 1000, etc.`
  };
}
