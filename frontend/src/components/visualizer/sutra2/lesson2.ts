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
    cap: `Find deficiencies from Base ${base}: <b>${a}</b> is <span class="vvm-hl3">-${def1}</span>, and <b>${b}</b> is <span class="vvm-hl3">-${def2}</span>.`,
    log: [['1', `deficiencies: -${def1}, -${def2}`]],
    lines: [
      { id: `def_${++lineIdSeq}`, label: 'deficiencies', nodes: [
        cell(`${a}`, 'prev'), sym('→'), cell(`-${def1}`, 'tail', { tag: 'deficiency' }),
        cell(`${b}`, 'prev'), sym('→'), cell(`-${def2}`, 'tail', { tag: 'deficiency' })
      ]}
    ],
    wires: [], flyers: []
  });

  frames.push({
    cap: `Calculate Left-Hand Side (LHS) by cross-subtraction: <b>${a} - ${def2} = ${lhs}</b> (or ${b} - ${def1} = ${lhs}).`,
    log: [['2', `LHS = ${a} - ${def2} = ${lhs}`]],
    lines: [
      { id: `lhs_${++lineIdSeq}`, label: 'LHS', nodes: [
        cell(String(a), 'prev'), sym('-'), cell(String(def2), 'tail'), sym('='), cell(String(lhs), 'res', { pop: true })
      ]}
    ],
    wires: [], flyers: []
  });

  frames.push({
    cap: `Calculate Right-Hand Side (RHS) by multiplying deficiencies: <b>(-${def1}) × (-${def2}) = ${rhsVal}</b>. Pad to ${zeros} digits: <b>${rhsStr}</b>.`,
    log: [['3', `RHS = (-${def1}) × (-${def2}) = ${rhsStr}`]],
    lines: [
      { id: `rhs_${++lineIdSeq}`, label: 'RHS', nodes: [
        cell(`-${def1}`, 'tail'), sym('x'), cell(`-${def2}`, 'tail'), sym('='), cell(rhsStr, 'res', { pop: true })
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
    title: 'Nikhilam Lesson 2 – Multiplication Below the Base',
    ruleHTML: 'Cross-subtract for LHS, multiply deficiencies for RHS.',
    frames,
    note: `Base ${base}`
  };
}
