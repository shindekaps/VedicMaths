import type { LessonModel, Frame, LineDef, LineNode, CellDef } from './types';

function cell(text: string, cls?: string, opts: any = {}): LineNode {
  return {
    type: 'cell',
    def: {
      text,
      cls,
      sm: opts.sm,
      pop: opts.pop,
      tag: opts.tag,
      carry: opts.carry,
      id: opts.id
    }
  };
}

function sym(text: string, big?: boolean): LineNode {
  return { type: 'sym', text, big };
}

function divider(): LineNode {
  return { type: 'divider' };
}

export function buildLesson1(p: any): LessonModel {
  const n = p.n, prev = Math.floor(n / 10), eka = prev + 1;
  const left = prev * eka, ans = left * 100 + 25;
  const P = String(prev), L = String(left);
  const frames: Frame[] = [];

  let currentLines: LineDef[] = [];
  let lineIdSeq = 0;

  const problem = (pc: string, tc: string): LineDef => ({
    id: `prob_${++lineIdSeq}`,
    label: 'problem',
    nodes: [
      cell(P, pc, { id: 'p', tag: pc === 'prev' ? 'previous' : '' }),
      cell('5', tc, { id: 't', tag: tc === 'tail' ? 'last' : '' }),
      sym('²', true)
    ]
  });

  frames.push({
    cap: `We want <b>${n}²</b>. The only thing that matters: it <b>ends in 5</b>.`,
    log: [['', `${n}² → ends in 5`]],
    lines: [problem('', '')],
    wires: [], flyers: []
  });

  frames.push({
    cap: `Split it. Everything before the 5 is the <span class="vvm-hl">previous</span> part — here <span class="vvm-hl">${prev}</span>.`,
    log: [['', `previous = <span class="vvm-v">${prev}</span>`], ['', `last digit = 5`]],
    lines: [problem('prev', 'tail')],
    wires: [], flyers: []
  });

  frames.push({
    cap: `The sutra: <span class="vvm-hl2">one more than the previous</span>. So ${prev} + 1 = <span class="vvm-hl2">${eka}</span>.`,
    log: [['', `ekādhika = ${prev} + 1 = <span class="vvm-v">${eka}</span>`]],
    lines: [
      problem('prev', 'tail'),
      {
        id: `eka_${++lineIdSeq}`, label: 'ekādhika',
        nodes: [
          cell(P, 'prev', { id: 'p2' }), sym('+'), cell('1', '', { sm: true }), sym('='),
          cell(String(eka), 'eka', { id: 'e', pop: true, tag: '+1' })
        ]
      }
    ],
    wires: [{ fromKey: 'p', toKey: 'p2', color: '#f0b429' }],
    flyers: []
  });

  frames.push({
    cap: `Left half = previous × its ekādhika = <span class="vvm-hl">${prev}</span> × <span class="vvm-hl2">${eka}</span> = <b>${left}</b>.`,
    log: [['1', `left = ${prev} × ${eka} = <span class="vvm-v">${left}</span>`]],
    lines: [
      problem('prev', 'tail'),
      {
        id: `eka_${++lineIdSeq}`, label: 'ekādhika', muted: true,
        nodes: [
          cell(P, 'prev', { id: 'p2' }), sym('+'), cell('1', '', { sm: true }), sym('='),
          cell(String(eka), 'eka', { id: 'e' })
        ]
      },
      {
        id: `left_${++lineIdSeq}`, label: 'left half',
        nodes: [
          cell(P, 'prev', { id: 'p3' }), sym('x'), cell(String(eka), 'eka', { id: 'e2' }), sym('='),
          cell(L, 'res', { id: 'L', pop: true })
        ]
      }
    ],
    wires: [
      { fromKey: 'p2', toKey: 'p3', color: '#f0b429' },
      { fromKey: 'e', toKey: 'e2', color: '#3fb950' }
    ],
    flyers: []
  });

  frames.push({
    cap: `Right half is always <b>25</b>, because the last digits are 5 × 5.`,
    log: [['2', `right = 5 × 5 = <span class="vvm-v">25</span>`]],
    lines: [
      problem('prev', 'tail'),
      {
        id: `left_${++lineIdSeq}`, label: 'left half', muted: true,
        nodes: [
          cell(P, 'prev'), sym('x'), cell(String(eka), 'eka'), sym('='), cell(L, 'res', { id: 'L' })
        ]
      },
      {
        id: `right_${++lineIdSeq}`, label: 'right half',
        nodes: [
          cell('5', 'tail', { id: 't2' }), sym('x'), cell('5', 'tail', { id: 't3' }), sym('='),
          cell('25', 'res', { id: 'R', pop: true })
        ]
      }
    ],
    wires: [{ fromKey: 't', toKey: 't2', color: '#4cc2ff' }],
    flyers: []
  });

  const finalSlots: LineNode[] = [];
  L.split('').forEach((ch, i) => finalSlots.push(cell(ch, 'res', { id: 'ansL' + i })));
  finalSlots.push(cell('2', 'res', { id: 'ansR0' }));
  finalSlots.push(cell('5', 'res', { id: 'ansR1' }));

  frames.push({
    cap: `Write them side by side — <b>concatenate</b>, don't add. <b>${n}² = ${ans}</b>.`,
    log: [['', `answer = ${left} | 25`], ['sum', `${n}² = ${ans}`]],
    lines: [
      problem('prev', 'tail'),
      { id: `left_${++lineIdSeq}`, label: 'left half', muted: true, nodes: [cell(L, 'res', { id: 'L' })] },
      { id: `right_${++lineIdSeq}`, label: 'right half', muted: true, nodes: [cell('25', 'res', { id: 'R' })] },
      { id: `div_${++lineIdSeq}`, label: null, nodes: [divider()] },
      { id: `ans_${++lineIdSeq}`, label: 'answer', nodes: finalSlots }
    ],
    wires: [
      { fromKey: 'L', toKey: 'ansL0', color: '#bc8cff' },
      { fromKey: 'R', toKey: 'ansR0', color: '#bc8cff' }
    ],
    flyers: [
      { fromKey: 'L', toKey: 'ansL0', text: L },
      { fromKey: 'R', toKey: 'ansR0', text: '25' }
    ]
  });

  return {
    title: 'Lesson 1 – Squaring any number ending in 5',
    ruleHTML: 'Take the <code>previous</code> part, multiply by <code>one more than itself</code> for the left half, then append <code>25</code>.',
    frames,
    note: `Works for any number ending in 5: 15² up to 995².`
  };
}

export function buildLesson2(p: any): LessonModel {
  const a = p.a, b = p.b;
  // Use pre-computed split from validations if available, otherwise fallback
  const prevStr = p.prev !== undefined ? String(p.prev) : String(Math.floor(a / 10));
  const laStr = p.la !== undefined ? String(p.la) : String(a % 10);
  const lbStr = p.lb !== undefined ? String(p.lb) : String(b % 10);
  
  const prev = Number(prevStr), la = Number(laStr), lb = Number(lbStr);
  const k = p.k || 1; // Number of digits in the right part
  
  const eka = prev + 1, left = prev * eka, right = la * lb;
  
  // The right part must be padded to twice the length of the matching suffix
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
