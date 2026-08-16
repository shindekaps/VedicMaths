import type { LessonModel, Frame, LineNode } from '../types';
import { cell, sym } from '../helpers';

export function buildNikhilamMulAbove(p: any): LessonModel {
  const a = p.a || 108;
  const b = p.b || 107;
  const minNum = Math.min(a, b);
  let base = 10;
  while (base * 10 <= minNum) base *= 10;
  
  const exc1 = a - base;
  const exc2 = b - base;
  const lhs = a + exc2;
  const rhsVal = exc1 * exc2;
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

  // Frame 2: Excesses & Wires
  frames.push({
    cap: `Find excesses from Base ${base}: <b>${a}</b> is <span class="vvm-hl2">+${exc1}</span>, and <b>${b}</b> is <span class="vvm-hl2">+${exc2}</span>.`,
    log: [['1', `excesses: +${exc1}, +${exc2}`]],
    lines: [
      { id: `exc_${++lineIdSeq}`, label: 'excesses', nodes: [
        cell(`${a}`, 'prev', { id: 'a_num' }), sym('→'), cell(`+${exc1}`, 'eka', { id: 'e1', tag: 'excess' }),
        cell(`${b}`, 'prev', { id: 'b_num' }), sym('→'), cell(`+${exc2}`, 'eka', { id: 'e2', tag: 'excess' })
      ]}
    ],
    wires: [
      { fromKey: 'a_num', toKey: 'e1', color: '#6366f1' },
      { fromKey: 'b_num', toKey: 'e2', color: '#6366f1' }
    ],
    flyers: []
  });

  // Frame 3: Cross Addition for LHS
  frames.push({
    cap: `Calculate Left-Hand Side (LHS) by cross-addition: <b>${a} + ${exc2} = ${lhs}</b> (or ${b} + ${exc1} = ${lhs}).`,
    log: [['2', `LHS = ${a} + ${exc2} = ${lhs}`]],
    lines: [
      { id: `exc_${++lineIdSeq}`, label: 'cross-add', nodes: [
        cell(`${a}`, 'prev', { id: 'lhs_a' }), sym('→'), cell(`+${exc1}`, 'eka', { id: 'lhs_e1' }),
        cell(`${b}`, 'prev', { id: 'lhs_b' }), sym('→'), cell(`+${exc2}`, 'eka', { id: 'lhs_e2' })
      ]},
      { id: `lhs_res_${++lineIdSeq}`, label: 'LHS result', nodes: [
        cell(String(a), 'prev'), sym('+'), cell(String(exc2), 'eka'), sym('='), cell(String(lhs), 'res', { id: 'lhs_val', pop: true })
      ]}
    ],
    wires: [
      { fromKey: 'lhs_a', toKey: 'lhs_e2', color: '#10b981' },
      { fromKey: 'lhs_b', toKey: 'lhs_e1', color: '#10b981' }
    ],
    flyers: []
  });

  // Frame 4: Multiply Excesses for RHS
  frames.push({
    cap: `Calculate Right-Hand Side (RHS) by multiplying excesses: <b>(+${exc1}) × (+${exc2}) = ${rhsVal}</b>. Pad to ${zeros} digits: <b>${rhsStr}</b>.`,
    log: [['3', `RHS = (+${exc1}) × (+${exc2}) = ${rhsStr}`]],
    lines: [
      { id: `exc_rhs_${++lineIdSeq}`, label: 'excesses', nodes: [
        cell(`+${exc1}`, 'eka', { id: 'rhs_e1' }), sym('x'), cell(`+${exc2}`, 'eka', { id: 'rhs_e2' })
      ]},
      { id: `rhs_res_${++lineIdSeq}`, label: 'RHS result', nodes: [
        cell(`+${exc1}`, 'eka'), sym('x'), cell(`+${exc2}`, 'eka'), sym('='), cell(rhsStr, 'res', { id: 'rhs_val', pop: true })
      ]}
    ],
    wires: [
      { fromKey: 'rhs_e1', toKey: 'rhs_e2', color: '#f59e0b' }
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
    title: 'Nikhilam Lesson 3 – Multiplication Above the Base',
    ruleHTML: 'Cross-add for LHS, multiply excesses for RHS.',
    frames,
    note: `Base ${base}`
  };
}
