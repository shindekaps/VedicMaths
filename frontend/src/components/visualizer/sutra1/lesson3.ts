import type { LessonModel, Frame, LineNode } from '../types';
import { cell, sym } from '../helpers';

export function buildLesson3(p: any): LessonModel {
  const den = p.den || 19;
  const prev = Math.floor(den / 10), eka = prev + 1;

  let period = (() => { let r = 10 % den, k = 1; while (r !== 1 && k < den) { r = (r * 10) % den; k++; } return k; })();

  const digits: number[] = [], carriesAt: number[] = [];
  let cur = 1, carry = 0;
  for (let i = 0; i < period; i++) {
    digits.push(cur);
    const t = cur * eka + carry;
    carriesAt.push(carry);
    cur = t % 10; carry = Math.floor(t / 10);
  }
  const decimal = digits.slice().reverse().join('');
  const frames: Frame[] = [];

  function strip(shown: number, activeRtl: number): LineNode {
    let html = '<div class="vvm-strip">';
    for (let disp = 0; disp < period; disp++) {
      const rtl = period - 1 - disp;
      let cls = 'vvm-dc';
      if (rtl < shown) {
        if (rtl === activeRtl) cls += ' active';
        else if (rtl === 0) cls += ' seed';
        else cls += ' done';
        let carryHtml = carriesAt[rtl] ? `<span class="vvm-carry">+${carriesAt[rtl]}</span>` : '';
        html += `<div class="${cls}">${digits[rtl]}${carryHtml}</div>`;
      } else {
        html += `<div class="${cls}">·</div>`;
      }
    }
    html += '</div>';
    return { type: 'flow', html };
  }

  function flowBox(dv: any, cy: any, mult: any, total: any, out: any): LineNode {
    let html = '<div class="vvm-flow">';
    const add = (t: string, c: string) => html += `<span class="${c}">${t}</span>`;
    add(String(dv), 'vvm-k'); add(' × ', 'vvm-o'); add(String(mult), 'vvm-m');
    if (cy) { add(' + ', 'vvm-o'); add(String(cy), 'vvm-c'); }
    if (total !== null && total !== undefined) {
      add(' = ', 'vvm-o'); add(String(total), '');
      add(' → write ', 'vvm-o'); add(String(out.d), 'vvm-m');
      if (out.c) { add(', carry ', 'vvm-o'); add(String(out.c), 'vvm-c'); }
    }
    html += '</div>';
    return { type: 'flow', html };
  }

  frames.push({
    cap: `Turn <b>1/${den}</b> into a recurring decimal — with <b>no long division at all</b>.`,
    log: [['', `1 / ${den}`]],
    lines: [{ id: 'p1', label: 'problem', nodes: [cell('1', ''), sym('÷'), cell(String(den), '', { id: 'den' })] }],
    wires: [], flyers: []
  });

  frames.push({
    cap: `The denominator ends in <b>9</b>. Its <span class="vvm-hl">previous</span> part is <span class="vvm-hl">${prev}</span>, so our multiplier is <span class="vvm-hl2">${eka}</span>.`,
    log: [['', `previous = ${prev}`], ['', `multiplier = ${prev}+1 = ${eka}`]],
    lines: [
      { id: 'p2', label: 'problem', nodes: [cell('1', ''), sym('÷'), cell(String(prev), 'prev', { id: 'pv', tag: 'previous' }), cell('9', 'tail')] },
      { id: 'm1', label: 'multiplier', nodes: [cell(String(prev), 'prev', { id: 'pv2' }), sym('+'), cell('1', '', { sm: true }), sym('='), cell(String(eka), 'eka', { id: 'mul', pop: true, tag: '+1' })] }
    ],
    wires: [{ fromKey: 'pv', toKey: 'pv2', color: '#f0b429' }], flyers: []
  });

  frames.push({
    cap: `Build the digits <b>right to left</b>. Seed the rightmost with <span class="vvm-hl3">1</span>, then repeat: <b>digit × ${eka} + carry</b>.`,
    log: [['', `seed rightmost = <span class="vvm-v">1</span>`], ['note', `rule: digit × ${eka} + carry`]],
    lines: [
      { id: 'd1', label: 'digits', nodes: [strip(1, 0)] },
      { id: 'r1', label: 'rule', nodes: [flowBox('?', 0, eka, null, null)] }
    ],
    wires: [], flyers: []
  });

  let cv = 1, cy = 0;
  for (let i = 1; i < period; i++) {
    const t = cv * eka + cy, nd = t % 10, nc = Math.floor(t / 10);
    const dv = cv, cyIn = cy, idx = i;
    frames.push({
      cap: `<b>${dv}</b>×${eka}${cyIn ? ' + ' + cyIn : ''} = <b>${t}</b> → write <span class="vvm-hl2">${nd}</span>${nc ? `, carry <span style="color:var(--warn);font-weight:700">${nc}</span>` : ''}`,
      log: [[String(idx), `${dv} × ${eka}${cyIn ? ' + ' + cyIn : ''} = ${t} → write <span class="vvm-v">${nd}</span>${nc ? ` c${nc}` : ''}`]],
      lines: [
        { id: `d_${idx}`, label: 'digits', nodes: [strip(idx + 1, idx)] },
        { id: `w_${idx}`, label: 'working', nodes: [flowBox(dv, cyIn, eka, t, { d: nd, c: nc })] }
      ],
      wires: [], flyers: []
    });
    cv = nd; cy = nc;
  }

  frames.push({
    cap: `After <b>${period}</b> digits the pattern starts repeating — that's the full cycle. Read it <b>left to right</b>.`,
    log: [['', `cycle length = ${period}`], ['sum', `1/${den} = 0.${decimal}…`]],
    lines: [
      { id: 'df', label: 'digits', nodes: [strip(period, -1)] },
      { id: 'af', label: 'answer', nodes: [{ type: 'flow', html: `<div class="vvm-flow">0.${decimal}</div>` }] }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Lesson 3 – Recurring decimals for denominators ending in 9',
    ruleHTML: 'Multiplier = <code>previous + 1</code>. Seed the rightmost digit with <code>1</code>, build right-left using <code>digit × multiplier + carry</code>.',
    frames,
    note: `Cycle length is the order of 10 mod ${den} — ${period} digits here.`
  };
}
