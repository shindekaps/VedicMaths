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

  frames.push({
    cap: `Multiply <b>${a} × ${b}</b> using Base <b>${base}</b> (${zeros} zeros).`,
    log: [['', `${a} × ${b} (Base ${base})`]],
    lines: [{
      id: `prob_${++lineIdSeq}`, label: 'problem',
      nodes: [cell(String(a), 'prev'), sym('x'), cell(String(b), 'prev')]
    }],
    wires: [], flyers: []
  });

  frames.push({
    cap: `Find excesses from Base ${base}: <b>${a}</b> is <span class="vvm-hl2">+${exc1}</span>, and <b>${b}</b> is <span class="vvm-hl2">+${exc2}</span>.`,
    log: [['1', `excesses: +${exc1}, +${exc2}`]],
    lines: [
      { id: `exc_${++lineIdSeq}`, label: 'excesses', nodes: [
        cell(`${a}`, 'prev'), sym('→'), cell(`+${exc1}`, 'eka', { tag: 'excess' }),
        cell(`${b}`, 'prev'), sym('→'), cell(`+${exc2}`, 'eka', { tag: 'excess' })
      ]}
    ],
    wires: [], flyers: []
  });

  frames.push({
    cap: `Calculate Left-Hand Side (LHS) by cross-addition: <b>${a} + ${exc2} = ${lhs}</b> (or ${b} + ${exc1} = ${lhs}).`,
    log: [['2', `LHS = ${a} + ${exc2} = ${lhs}`]],
    lines: [
      { id: `lhs_${++lineIdSeq}`, label: 'LHS', nodes: [
        cell(String(a), 'prev'), sym('+'), cell(String(exc2), 'eka'), sym('='), cell(String(lhs), 'res', { pop: true })
      ]}
    ],
    wires: [], flyers: []
  });

  frames.push({
    cap: `Calculate Right-Hand Side (RHS) by multiplying excesses: <b>(+${exc1}) × (+${exc2}) = ${rhsVal}</b>. Pad to ${zeros} digits: <b>${rhsStr}</b>.`,
    log: [['3', `RHS = (+${exc1}) × (+${exc2}) = ${rhsStr}`]],
    lines: [
      { id: `rhs_${++lineIdSeq}`, label: 'RHS', nodes: [
        cell(`+${exc1}`, 'eka'), sym('x'), cell(`+${exc2}`, 'eka'), sym('='), cell(rhsStr, 'res', { pop: true })
      ]}
    ],
    wires: [], flyers: []
  });

  const finalSlots: LineNode[] = [];
  String(lhs).split('').forEach((ch, i) => finalSlots.push(cell(ch, 'res', { id: `ansL_${i}` })));
  rhsStr.split('').forEach((ch, i) => finalSlots.push(cell(ch, 'res', { id: `ansR_${i}` })));

  frames.push({
    cap: `Join LHS and RHS: <b>${lhs} | ${rhsStr} = ${ans}</b>.`,
    log: [['', `answer = ${lhs} | ${rhsStr}`], ['sum', `${a} × ${b} = ${ans}`]],
    lines: [
      { id: `ans_${++lineIdSeq}`, label: 'answer', nodes: finalSlots }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Nikhilam Lesson 3 – Multiplication Above the Base',
    ruleHTML: 'Cross-add for LHS, multiply excesses for RHS.',
    frames,
    note: `Base ${base}`
  };
}
