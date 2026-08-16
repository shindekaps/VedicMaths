import type { LessonModel, Frame, LineNode } from '../types';
import { cell, sym } from '../helpers';

export function buildNikhilamMulBelow(p: any): LessonModel {
  const a = p.a || 94;
  const b = p.b || 92;
  const maxNum = Math.max(a, b);
  let base = 10;
  while (base < maxNum) base *= 10;
  
  const def1 = base - a;
  const def2 = base - b;
  const lhs = a - def2;
  const rhsVal = def1 * def2;
  const zeros = String(base).length - 1;
  const rhsStr = String(rhsVal).padStart(zeros, '0');
  const ans = a * b;

  const frames: Frame[] = [];
  let lineIdSeq = 0;

  // Frame 1: Setup
  frames.push({
    cap: `Multiply <b>${a} × ${b}</b> using Base <b>${base}</b> (${zeros} zeros).`,
    log: [['', `${a} × ${b} (Base ${base})`]],
    lines: [{
      id: `prob_${++lineIdSeq}`, label: 'problem',
      nodes: [cell(String(a), 'prev', { id: 'num_a' }), sym('x'), cell(String(b), 'prev', { id: 'num_b' })]
    }],
    wires: [], flyers: []
  });

  // Frame 2: Deficiencies & Wires
  frames.push({
    cap: `Find deficiencies from Base ${base}: <b>${a}</b> is <span class="vvm-hl3">-${def1}</span>, and <b>${b}</b> is <span class="vvm-hl3">-${def2}</span>.`,
    log: [['1', `deficiencies: -${def1}, -${def2}`]],
    lines: [
      { id: `def_${++lineIdSeq}`, label: 'deficiencies', nodes: [
        cell(`${a}`, 'prev', { id: 'a_num' }), sym('→'), cell(`-${def1}`, 'tail', { id: 'd1', tag: 'deficiency' }),
        cell(`${b}`, 'prev', { id: 'b_num' }), sym('→'), cell(`-${def2}`, 'tail', { id: 'd2', tag: 'deficiency' })
      ]}
    ],
    wires: [
      { fromKey: 'a_num', toKey: 'd1', color: '#ec4899' },
      { fromKey: 'b_num', toKey: 'd2', color: '#ec4899' }
    ],
    flyers: []
  });

  // Frame 3: Cross Subtraction for LHS with Cross Wire
  frames.push({
    cap: `Calculate Left-Hand Side (LHS) by cross-subtraction: <b>${a} - ${def2} = ${lhs}</b> (or ${b} - ${def1} = ${lhs}).`,
    log: [['2', `LHS = ${a} - ${def2} = ${lhs}`]],
    lines: [
      { id: `def_${++lineIdSeq}`, label: 'cross-sub', nodes: [
        cell(`${a}`, 'prev', { id: 'lhs_a' }), sym('→'), cell(`-${def1}`, 'tail', { id: 'lhs_d1' }),
        cell(`${b}`, 'prev', { id: 'lhs_b' }), sym('→'), cell(`-${def2}`, 'tail', { id: 'lhs_d2' })
      ]},
      { id: `lhs_res_${++lineIdSeq}`, label: 'LHS result', nodes: [
        cell(String(a), 'prev'), sym('-'), cell(String(def2), 'tail'), sym('='), cell(String(lhs), 'res', { id: 'lhs_val', pop: true })
      ]}
    ],
    wires: [
      { fromKey: 'lhs_a', toKey: 'lhs_d2', color: '#6366f1' },
      { fromKey: 'lhs_b', toKey: 'lhs_d1', color: '#6366f1' }
    ],
    flyers: []
  });

  // Frame 4: RHS Vertical Multiplication of Deficiencies with Wires
  frames.push({
    cap: `Calculate Right-Hand Side (RHS) by multiplying deficiencies: <b>(-${def1}) × (-${def2}) = ${rhsVal}</b>. Pad to ${zeros} digits: <b>${rhsStr}</b>.`,
    log: [['3', `RHS = (-${def1}) × (-${def2}) = ${rhsStr}`]],
    lines: [
      { id: `def_rhs_${++lineIdSeq}`, label: 'deficiencies', nodes: [
        cell(`-${def1}`, 'tail', { id: 'rhs_d1' }), sym('x'), cell(`-${def2}`, 'tail', { id: 'rhs_d2' })
      ]},
      { id: `rhs_res_${++lineIdSeq}`, label: 'RHS result', nodes: [
        cell(`-${def1}`, 'tail'), sym('x'), cell(`-${def2}`, 'tail'), sym('='), cell(rhsStr, 'res', { id: 'rhs_val', pop: true })
      ]}
    ],
    wires: [
      { fromKey: 'rhs_d1', toKey: 'rhs_d2', color: '#f59e0b' }
    ],
    flyers: []
  });

  // Frame 5: Joining LHS | RHS
  const finalSlots: LineNode[] = [];
  String(lhs).split('').forEach((ch, i) => finalSlots.push(cell(ch, 'res', { id: `ansL_${i}`, pop: true })));
  finalSlots.push(sym('|'));
  rhsStr.split('').forEach((ch, i) => finalSlots.push(cell(ch, 'res', { id: `ansR_${i}`, pop: true })));

  frames.push({
    cap: `Join LHS and RHS: <b>${lhs} | ${rhsStr} = ${ans}</b>.`,
    log: [['', `answer = ${lhs} | ${rhsStr}`], ['sum', `${a} × ${b} = ${ans}`]],
    lines: [
      { id: `ans_${++lineIdSeq}`, label: 'answer', nodes: finalSlots }
    ],
    wires: [
      { fromKey: 'lhs_val', toKey: 'ansL_0', color: '#10b981' },
      { fromKey: 'rhs_val', toKey: 'ansR_0', color: '#10b981' }
    ],
    flyers: []
  });

  return {
    title: 'Nikhilam Lesson 2 – Multiplication Below the Base',
    ruleHTML: 'Cross-subtract for LHS, multiply deficiencies for RHS.',
    frames,
    note: `Base ${base}`
  };
}
