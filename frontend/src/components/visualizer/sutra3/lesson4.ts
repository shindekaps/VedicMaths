import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildUrdhvaSquare(p: any): LessonModel {
  const nStr = (p.n || '23').toString();
  const digits = nStr.split('').map((x: string) => parseInt(x, 10));

  const title = `Squaring Any Number (Dwandwa Yoga)`;
  const ruleHTML = `The Duplex (Dwandwa) method squares a number digit-by-digit:<br>` +
    `<b>2-digit (ab):</b> b² | 2ab | a²<br>` +
    `<b>3-digit (abc):</b> c² | 2bc | 2ac+b² | 2ab | a²<br>` +
    `Write each result, carry leftwards, and combine.`;
  const note = `Each step highlights which digits pair together for the duplex.`;

  if (digits.length === 2) {
    return buildTwoDigitSquare(digits, nStr, title, ruleHTML, note);
  } else if (digits.length === 3) {
    return buildThreeDigitSquare(digits, nStr, title, ruleHTML, note);
  } else {
    return {
      title, ruleHTML, note,
      frames: [{
        cap: `Dwandwa Yoga visualiser supports 2 and 3 digit numbers.`,
        log: [], wires: [], flyers: [],
        lines: [{ id: 'l0', label: null, nodes: [cell('Enter a 2 or 3 digit number')] }]
      }]
    };
  }
}

/* ===========================  2-DIGIT SQUARING  =========================== */
function buildTwoDigitSquare(
  digits: number[], nStr: string, title: string, ruleHTML: string, note: string
): LessonModel {
  const [a, b] = digits;
  const n = parseInt(nStr, 10);
  const answer = n * n;

  const frames: Frame[] = [];
  const log: string[][] = [];
  let lid = 0;

  // ── Frame 1: Setup ──────────────────────────────────────────────────────
  frames.push({
    cap: `Problem: ${nStr}² — write it as ${nStr} × ${nStr} and apply the Duplex method.`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString(), 'prev'), cell(b.toString(), 'prev')] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString(), 'prev'), cell(b.toString(), 'prev')] },
      { id: `l${lid++}`, label: null, nodes: [divider()] }
    ]
  });

  // ── Frame 2: Step 1 — Right vertical (b × b) ───────────────────────────
  const p0 = b * b;
  const r0 = p0 % 10;
  let carry = Math.floor(p0 / 10);

  log.push(['Step 1', `Right vertical: ${b} × ${b} = ${p0} (write ${r0}, carry ${carry})`]);

  frames.push({
    cap: `Duplex of rightmost digit: ${b} × ${b} = ${p0}`,
    log: [...log],
    wires: [
      { fromKey: 's1_top_b', toKey: 's1_bot_b', color: '#3fb950' }
    ],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString(), 'prev'), cell(b.toString(), 'eka', { id: 's1_top_b', pop: true })] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString(), 'prev'), cell(b.toString(), 'eka', { id: 's1_bot_b', pop: true })] },
      { id: `l${lid++}`, label: null, nodes: [divider()] },
      { id: `l${lid++}`, label: null, nodes: [
        cell('', 'prev'),
        cell(r0.toString(), 'res', { id: 's1_res', carry: carry > 0 ? carry.toString() : undefined, pop: true })
      ]}
    ]
  });

  // ── Frame 3: Step 2 — Cross multiply (a×b + b×a = 2ab) ─────────────────
  const crossRaw = a * b + b * a; // 2ab
  const crossSum = crossRaw + carry;
  const r1 = crossSum % 10;
  carry = Math.floor(crossSum / 10);

  log.push(['Step 2', `Cross: ${a}×${b} + ${b}×${a} = ${crossRaw}. Add carry ${crossSum - crossRaw}: total ${crossSum} (write ${r1}, carry ${carry})`]);

  frames.push({
    cap: `Cross-wise: ${a}×${b} + ${b}×${a} = ${crossRaw}. Plus carry → ${crossSum}`,
    log: [...log],
    wires: [
      { fromKey: 's2_top_a', toKey: 's2_bot_b', color: '#f0b429' },
      { fromKey: 's2_top_b', toKey: 's2_bot_a', color: '#f0b429' }
    ],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString(), 'eka', { id: 's2_top_a', pop: true }), cell(b.toString(), 'eka', { id: 's2_top_b', pop: true })] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString(), 'eka', { id: 's2_bot_a', pop: true }), cell(b.toString(), 'eka', { id: 's2_bot_b', pop: true })] },
      { id: `l${lid++}`, label: null, nodes: [divider()] },
      { id: `l${lid++}`, label: null, nodes: [
        cell(r1.toString(), 'res', { id: 's2_res', carry: carry > 0 ? carry.toString() : undefined, pop: true }),
        cell(r0.toString(), 'res')
      ]}
    ]
  });

  // ── Frame 4: Step 3 — Left vertical (a × a) ────────────────────────────
  const leftRaw = a * a;
  const leftSum = leftRaw + carry;

  log.push(['Step 3', `Left vertical: ${a} × ${a} = ${leftRaw}. Add carry ${leftSum - leftRaw}: total ${leftSum}`]);

  frames.push({
    cap: `Duplex of leftmost digit: ${a} × ${a} = ${leftRaw}. Plus carry → ${leftSum}`,
    log: [...log],
    wires: [
      { fromKey: 's3_top_a', toKey: 's3_bot_a', color: '#4cc2ff' }
    ],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString(), 'eka', { id: 's3_top_a', pop: true }), cell(b.toString(), 'prev')] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString(), 'eka', { id: 's3_bot_a', pop: true }), cell(b.toString(), 'prev')] },
      { id: `l${lid++}`, label: null, nodes: [divider()] },
      { id: `l${lid++}`, label: null, nodes: [
        cell(leftSum.toString(), 'res', { id: 's3_res', pop: true }),
        cell(r1.toString(), 'res'),
        cell(r0.toString(), 'res')
      ]}
    ]
  });

  // ── Frame 5: Final Answer ───────────────────────────────────────────────
  log.push(['sum', `${nStr}² = ${answer}`]);

  frames.push({
    cap: `Final Answer: ${nStr}² = ${answer}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString()), cell(b.toString())] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString()), cell(b.toString())] },
      { id: `l${lid++}`, label: null, nodes: [divider()] },
      { id: `l${lid++}`, label: null, nodes: answerCells(answer, lid) }
    ]
  });

  return { title, ruleHTML, frames, note };
}

/* ===========================  3-DIGIT SQUARING  =========================== */
function buildThreeDigitSquare(
  digits: number[], nStr: string, title: string, ruleHTML: string, note: string
): LessonModel {
  const [a, b, c] = digits;
  const n = parseInt(nStr, 10);
  const answer = n * n;

  const frames: Frame[] = [];
  const log: string[][] = [];
  let lid = 0;

  // ── Frame 1: Setup ──────────────────────────────────────────────────────
  frames.push({
    cap: `Problem: ${nStr}² — write it as ${nStr} × ${nStr} and apply the Duplex method.`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString(), 'prev'), cell(b.toString(), 'prev'), cell(c.toString(), 'prev')] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString(), 'prev'), cell(b.toString(), 'prev'), cell(c.toString(), 'prev')] },
      { id: `l${lid++}`, label: null, nodes: [divider()] }
    ]
  });

  // ── Frame 2: Step 1 — Rightmost vertical (c × c) ───────────────────────
  const p1 = c * c;
  const r1 = p1 % 10;
  let carry = Math.floor(p1 / 10);

  log.push(['Step 1', `Right vertical: ${c} × ${c} = ${p1} (write ${r1}, carry ${carry})`]);

  frames.push({
    cap: `Duplex of rightmost digit: ${c} × ${c} = ${p1}`,
    log: [...log],
    wires: [
      { fromKey: 'f2_top_c', toKey: 'f2_bot_c', color: '#3fb950' }
    ],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString(), 'prev'), cell(b.toString(), 'prev'), cell(c.toString(), 'eka', { id: 'f2_top_c', pop: true })] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString(), 'prev'), cell(b.toString(), 'prev'), cell(c.toString(), 'eka', { id: 'f2_bot_c', pop: true })] },
      { id: `l${lid++}`, label: null, nodes: [divider()] },
      { id: `l${lid++}`, label: null, nodes: [
        cell('', 'prev'), cell('', 'prev'),
        cell(r1.toString(), 'res', { carry: carry > 0 ? carry.toString() : undefined, pop: true })
      ]}
    ]
  });

  // ── Frame 3: Step 2 — Cross on right two (b×c + c×b = 2bc) ─────────────
  const p2raw = b * c + c * b; // 2bc
  const p2 = p2raw + carry;
  const r2 = p2 % 10;
  carry = Math.floor(p2 / 10);

  log.push(['Step 2', `Cross (right two): ${b}×${c} + ${c}×${b} = ${p2raw}. Add carry ${p2 - p2raw}: total ${p2} (write ${r2}, carry ${carry})`]);

  frames.push({
    cap: `Cross-wise on right two digits: ${b}×${c} + ${c}×${b} = ${p2raw}. Plus carry → ${p2}`,
    log: [...log],
    wires: [
      { fromKey: 'f3_top_b', toKey: 'f3_bot_c', color: '#f0b429' },
      { fromKey: 'f3_top_c', toKey: 'f3_bot_b', color: '#f0b429' }
    ],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString(), 'prev'), cell(b.toString(), 'eka', { id: 'f3_top_b', pop: true }), cell(c.toString(), 'eka', { id: 'f3_top_c', pop: true })] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString(), 'prev'), cell(b.toString(), 'eka', { id: 'f3_bot_b', pop: true }), cell(c.toString(), 'eka', { id: 'f3_bot_c', pop: true })] },
      { id: `l${lid++}`, label: null, nodes: [divider()] },
      { id: `l${lid++}`, label: null, nodes: [
        cell('', 'prev'),
        cell(r2.toString(), 'res', { carry: carry > 0 ? carry.toString() : undefined, pop: true }),
        cell(r1.toString(), 'res')
      ]}
    ]
  });

  // ── Frame 4: Step 3 — Full star (a×c + b×b + c×a = 2ac + b²) ──────────
  const p3raw = a * c + b * b + c * a; // 2ac + b²
  const p3 = p3raw + carry;
  const r3 = p3 % 10;
  carry = Math.floor(p3 / 10);

  log.push(['Step 3', `Star: ${a}×${c} + ${b}×${b} + ${c}×${a} = ${p3raw}. Add carry ${p3 - p3raw}: total ${p3} (write ${r3}, carry ${carry})`]);

  frames.push({
    cap: `Full star pattern: ${a}×${c} + ${b}² + ${c}×${a} = ${p3raw}. Plus carry → ${p3}`,
    log: [...log],
    wires: [
      { fromKey: 'f4_top_a', toKey: 'f4_bot_c', color: '#e879f9' },
      { fromKey: 'f4_top_b', toKey: 'f4_bot_b', color: '#e879f9' },
      { fromKey: 'f4_top_c', toKey: 'f4_bot_a', color: '#e879f9' }
    ],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString(), 'eka', { id: 'f4_top_a', pop: true }), cell(b.toString(), 'eka', { id: 'f4_top_b', pop: true }), cell(c.toString(), 'eka', { id: 'f4_top_c', pop: true })] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString(), 'eka', { id: 'f4_bot_a', pop: true }), cell(b.toString(), 'eka', { id: 'f4_bot_b', pop: true }), cell(c.toString(), 'eka', { id: 'f4_bot_c', pop: true })] },
      { id: `l${lid++}`, label: null, nodes: [divider()] },
      { id: `l${lid++}`, label: null, nodes: [
        cell(r3.toString(), 'res', { carry: carry > 0 ? carry.toString() : undefined, pop: true }),
        cell(r2.toString(), 'res'),
        cell(r1.toString(), 'res')
      ]}
    ]
  });

  // ── Frame 5: Step 4 — Cross on left two (a×b + b×a = 2ab) ──────────────
  const p4raw = a * b + b * a; // 2ab
  const p4 = p4raw + carry;
  const r4 = p4 % 10;
  carry = Math.floor(p4 / 10);

  log.push(['Step 4', `Cross (left two): ${a}×${b} + ${b}×${a} = ${p4raw}. Add carry ${p4 - p4raw}: total ${p4} (write ${r4}, carry ${carry})`]);

  frames.push({
    cap: `Cross-wise on left two digits: ${a}×${b} + ${b}×${a} = ${p4raw}. Plus carry → ${p4}`,
    log: [...log],
    wires: [
      { fromKey: 'f5_top_a', toKey: 'f5_bot_b', color: '#f0b429' },
      { fromKey: 'f5_top_b', toKey: 'f5_bot_a', color: '#f0b429' }
    ],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString(), 'eka', { id: 'f5_top_a', pop: true }), cell(b.toString(), 'eka', { id: 'f5_top_b', pop: true }), cell(c.toString(), 'prev')] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString(), 'eka', { id: 'f5_bot_a', pop: true }), cell(b.toString(), 'eka', { id: 'f5_bot_b', pop: true }), cell(c.toString(), 'prev')] },
      { id: `l${lid++}`, label: null, nodes: [divider()] },
      { id: `l${lid++}`, label: null, nodes: [
        cell(r4.toString(), 'res', { carry: carry > 0 ? carry.toString() : undefined, pop: true }),
        cell(r3.toString(), 'res'),
        cell(r2.toString(), 'res'),
        cell(r1.toString(), 'res')
      ]}
    ]
  });

  // ── Frame 6: Step 5 — Left vertical (a × a) ────────────────────────────
  const p5raw = a * a;
  const p5 = p5raw + carry;

  log.push(['Step 5', `Left vertical: ${a} × ${a} = ${p5raw}. Add carry ${p5 - p5raw}: total ${p5}`]);

  frames.push({
    cap: `Duplex of leftmost digit: ${a} × ${a} = ${p5raw}. Plus carry → ${p5}`,
    log: [...log],
    wires: [
      { fromKey: 'f6_top_a', toKey: 'f6_bot_a', color: '#4cc2ff' }
    ],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString(), 'eka', { id: 'f6_top_a', pop: true }), cell(b.toString(), 'prev'), cell(c.toString(), 'prev')] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString(), 'eka', { id: 'f6_bot_a', pop: true }), cell(b.toString(), 'prev'), cell(c.toString(), 'prev')] },
      { id: `l${lid++}`, label: null, nodes: [divider()] },
      { id: `l${lid++}`, label: null, nodes: [
        cell(p5.toString(), 'res', { pop: true }),
        cell(r4.toString(), 'res'),
        cell(r3.toString(), 'res'),
        cell(r2.toString(), 'res'),
        cell(r1.toString(), 'res')
      ]}
    ]
  });

  // ── Frame 7: Final Answer ───────────────────────────────────────────────
  log.push(['sum', `${nStr}² = ${answer}`]);

  frames.push({
    cap: `Final Answer: ${nStr}² = ${answer}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: null, nodes: [cell(a.toString()), cell(b.toString()), cell(c.toString())] },
      { id: `l${lid++}`, label: null, nodes: [sym('×'), cell(a.toString()), cell(b.toString()), cell(c.toString())] },
      { id: `l${lid++}`, label: null, nodes: [divider()] },
      { id: `l${lid++}`, label: null, nodes: answerCells(answer, lid) }
    ]
  });

  return { title, ruleHTML, frames, note };
}

/* ===========================  HELPERS  ==================================== */
/** Convert an integer answer into an array of result cells. */
function answerCells(answer: number, _lid: number): LineNode[] {
  return answer.toString().split('').map(d =>
    cell(d, 'res', { pop: true })
  );
}
