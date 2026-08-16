import type { LessonModel, Frame, LineNode } from '../types';
import { cell, sym } from '../helpers';

export function buildNikhilamSub(p: any): LessonModel {
  const base = p.base || 1000;
  const num = p.num || 387;
  const ans = base - num;
  
  const baseStr = String(base);
  const zeros = baseStr.length - 1;
  const numStr = String(num).padStart(zeros, '0');
  const digits = numStr.split('');
  
  let lastNonZeroIdx = digits.length - 1;
  while (lastNonZeroIdx >= 0 && digits[lastNonZeroIdx] === '0') lastNonZeroIdx--;

  const frames: Frame[] = [];
  let lineIdSeq = 0;

  frames.push({
    cap: `We want to compute <b>${base} - ${num}</b> using <i>All from 9 and Last from 10</i>.`,
    log: [['', `${base} - ${num}`]],
    lines: [{ id: `prob_${++lineIdSeq}`, label: 'problem', nodes: [cell(baseStr, 'res'), sym('-'), cell(numStr, 'tail')] }],
    wires: [], flyers: []
  });

  const stepNodes: LineNode[] = [];
  const resultDigits: string[] = [];

  digits.forEach((d, i) => {
    const isTrailingZero = i > lastNonZeroIdx;
    const isLast = i === lastNonZeroIdx;
    const fromVal = isLast ? 10 : 9;
    const resDigit = isTrailingZero ? '0' : String(fromVal - parseInt(d, 10));
    resultDigits.push(resDigit);

    stepNodes.push(cell(d, isTrailingZero ? 'muted' : isLast ? 'tail' : 'prev', { id: `d_${i}` }));
  });

  frames.push({
    cap: `Identify the digits: apply <b>'All from 9'</b> to leading digits, and <b>'Last from 10'</b> to the last non-zero digit (${digits[lastNonZeroIdx]}).`,
    log: [['1', `Rule: Subtract non-last digits from 9, last active digit from 10`]],
    lines: [{ id: `step1_${++lineIdSeq}`, label: 'digits', nodes: stepNodes }],
    wires: [], flyers: []
  });

  const calcLines: LineNode[] = [];
  digits.forEach((d, i) => {
    const isTrailingZero = i > lastNonZeroIdx;
    const isLast = i === lastNonZeroIdx;
    const fromVal = isLast ? 10 : 9;
    const resDigit = resultDigits[i];
    
    if (isTrailingZero) {
      calcLines.push(cell(d, 'muted'));
    } else {
      calcLines.push(cell(`${fromVal}-${d}=${resDigit}`, 'res'));
    }
  });

  frames.push({
    cap: `Calculate each position: ${digits.map((d, i) => i > lastNonZeroIdx ? `${d}` : i === lastNonZeroIdx ? `(10 - ${d} = ${resultDigits[i]})` : `(9 - ${d} = ${resultDigits[i]})`).join(', ')}.`,
    log: [['2', `Result digits: ${resultDigits.join('')}`]],
    lines: [
      { id: `step2_${++lineIdSeq}`, label: 'digits', muted: true, nodes: stepNodes },
      { id: `step2_calc_${++lineIdSeq}`, label: 'subtraction', nodes: calcLines }
    ],
    wires: [], flyers: []
  });

  const finalAnswerStr = String(ans);
  const ansNodes: LineNode[] = finalAnswerStr.split('').map((ch, i) => cell(ch, 'res', { id: `ans_${i}` }));

  frames.push({
    cap: `Combine the digits to get the final answer: <b>${base} - ${num} = ${ans}</b>.`,
    log: [['', `answer = ${ans}`], ['sum', `${base} - ${num} = ${ans}`]],
    lines: [
      { id: `step3_${++lineIdSeq}`, label: 'result', nodes: ansNodes }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Nikhilam Lesson 1 – Subtraction from Powers of 10',
    ruleHTML: 'Subtract every digit from 9 EXCEPT the last non-zero digit, which is subtracted from 10.',
    frames,
    note: 'Works for any power of 10 base.'
  };
}
