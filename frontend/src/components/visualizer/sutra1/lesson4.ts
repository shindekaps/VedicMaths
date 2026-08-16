import type { LessonModel, Frame, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildLesson4(p: any): LessonModel {
  const num = String(p.num || 4275), den = p.den || 19;
  const prev = Math.floor(den / 10), eka = prev + 1;
  const frames: Frame[] = [];

  const chainVals = [num];
  let cur = num, guard = 0;
  const ops = [];
  while (cur.length > 2 && guard++ < 14) {
    const last = Number(cur.slice(-1)), rest = Number(cur.slice(0, -1));
    const nxt = rest + last * eka;
    ops.push({ from: cur, last, rest, nxt });
    cur = String(nxt);
    chainVals.push(cur);
  }
  const finalN = Number(cur), divisible = finalN % den === 0;

  function chainView(upto: number, badLast: boolean): LineNode {
    let html = '<div class="vvm-chain">';
    chainVals.slice(0, upto + 1).forEach((v, i) => {
      if (i) html += '<span class="vvm-harrow">→</span>';
      const isLast = i === upto;
      let cls = 'vvm-node';
      if (isLast && upto === chainVals.length - 1) cls += badLast ? ' bad' : ' fin';
      else if (isLast) cls += ' on';
      html += `<div class="${cls}">${v}</div>`;
    });
    html += '</div>';
    return { type: 'flow', html };
  }

  frames.push({
    cap: `Is <b>${num}</b> divisible by <b>${den}</b>? The sutra gives a test with no division.`,
    log: [['', `${num} ÷ ${den} ?`]],
    lines: [{ id: 'p1', label: 'problem', nodes: [cell(num, '', { id: 'n' }), sym('÷'), cell(String(den), '', { id: 'd' })] }],
    wires: [], flyers: []
  });

  frames.push({
    cap: `Divisor ends in 9, previous part <span class="vvm-hl">${prev}</span>. The <b>osculator</b> is one more: <span class="vvm-hl2">${eka}</span>.`,
    log: [['', `previous = ${prev}`], ['', `osculator = <span class="vvm-v">${eka}</span>`]],
    lines: [
      { id: 'd1', label: 'divisor', nodes: [cell(String(prev), 'prev', { id: 'pv', tag: 'previous' }), cell('9', 'tail')] },
      { id: 'o1', label: 'osculator', nodes: [cell(String(prev), 'prev', { id: 'pv2' }), sym('+'), cell('1', '', { sm: true }), sym('='), cell(String(eka), 'eka', { id: 'os', pop: true, tag: '+1' })] }
    ],
    wires: [{ fromKey: 'pv', toKey: 'pv2', color: '#f0b429' }], flyers: []
  });

  ops.forEach((o, i) => {
    frames.push({
      cap: `Chop the last digit <span class="vvm-hl3">${o.last}</span> off <b>${o.from}</b>. Multiply it by the osculator (${o.last} × ${eka} = ${o.last * eka}) and add to what's left: <b>${o.rest} + ${o.last * eka} = <span class="vvm-v">${o.nxt}</span></b>.`,
      log: [[String(i + 1), `${o.rest} + ${o.last}×${eka} = <span class="vvm-v">${o.nxt}</span>`]],
      lines: [
        { id: `s_${i}`, label: 'split', nodes: [cell(String(o.rest), 'prev', { id: 'rest', tag: 'keep' }), cell(String(o.last), 'tail', { id: 'last', tag: 'chop' })] },
        { id: `o_${i}`, label: 'osculate', nodes: [cell(String(o.rest), 'prev', { id: 'r2' }), sym('+'), cell(String(o.last), 'tail', { id: 'l2' }), sym('x'), cell(String(eka), 'eka', { sm: true }), sym('='), cell(String(o.nxt), 'res', { id: 'nx', pop: true })] },
        { id: `div_${i}`, label: null, nodes: [divider()] },
        { id: `c_${i}`, label: 'chain', nodes: [chainView(i + 1, false)] }
      ],
      wires: [{ fromKey: 'rest', toKey: 'r2', color: '#f0b429' }, { fromKey: 'last', toKey: 'l2', color: '#4cc2ff' }], flyers: []
    });
  });

  frames.push({
    cap: divisible
      ? `We land on <b>${finalN}</b> — a multiple of ${den}. So <b>${num}</b> IS divisible by ${den}.`
      : `We land on <b>${finalN}</b> — not a multiple of ${den}. So <b>${num}</b> is NOT divisible by ${den}.`,
    log: divisible
      ? [['', `${finalN} = ${den} × ${finalN / den} ✓`], ['sum', `${num} ÷ ${den} = ${Number(num) / den}`]]
      : [['', `${finalN} is not a multiple of ${den} ✗`], ['sum', `${num} is not divisible by ${den}`]],
    lines: [
      { id: 'cf', label: 'chain', nodes: [chainView(chainVals.length - 1, !divisible)] },
      { id: 'vf', label: 'verdict', nodes: [{ type: 'flow', html: `<div class="vvm-flow">${divisible ? `${finalN} = ${den} × ${finalN / den} ✓` : `${finalN} ÷ ${den} leaves ${finalN % den} ✗`}</div>` }] }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Lesson 4 – Vestanam: divisibility using the ekādhika osculator',
    ruleHTML: 'Osculator = <code>previous + 1</code>. Drop the last digit, multiply it by the osculator, add to the rest, repeat.',
    frames,
    note: `Keep osculating until the number is small enough to recognise.`
  };
}
