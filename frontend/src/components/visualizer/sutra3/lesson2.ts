import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildUrdhvaThree(p: any): LessonModel {
  const a = parseInt(p.a || '123', 10);
  const b = parseInt(p.b || '456', 10);
  
  const aStr = a.toString().padStart(3, '0');
  const bStr = b.toString().padStart(3, '0');
  
  const a2 = parseInt(aStr[0], 10);
  const a1 = parseInt(aStr[1], 10);
  const a0 = parseInt(aStr[2], 10);
  
  const b2 = parseInt(bStr[0], 10);
  const b1 = parseInt(bStr[1], 10);
  const b0 = parseInt(bStr[2], 10);

  const title = `Three-Digit Multiplication (Urdhva Tiryagbhyam)`;
  const ruleHTML = `Urdhva Tiryagbhyam for 3-digits has 5 steps, working right to left:<br>1. Rightmost vertical<br>2. Right two cross<br>3. All three cross (star pattern)<br>4. Left two cross<br>5. Leftmost vertical`;
  const note = `Add carries to the next column at each step.`;
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  // Step 0: Setup
  frames.push({
    cap: 'Write the numbers one below the other.',
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString(), 'prev', { id: 'cell_a2' }), cell(a1.toString(), 'prev', { id: 'cell_a1' }), cell(a0.toString(), 'prev', { id: 'cell_a0' })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString(), 'prev', { id: 'cell_b2' }), cell(b1.toString(), 'prev', { id: 'cell_b1' }), cell(b0.toString(), 'prev', { id: 'cell_b0' })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] }
    ]
  });

  const res: string[] = [];
  let carry = 0;
  
  // Step 1: Rightmost vertical (a0 * b0)
  const p0 = a0 * b0;
  const s0 = p0 + carry;
  const r0 = s0 % 10;
  carry = Math.floor(s0 / 10);
  res.unshift(r0.toString());
  log.push(['Step 1', `${a0}×${b0} = ${p0} (write ${r0}, carry ${carry})`]);
  
  frames.push({
    cap: `Step 1: Multiply rightmost vertical column: ${a0} × ${b0} = ${p0}`,
    log: [...log],
    wires: [
      { fromKey: 's1_a0', toKey: 's1_b0', color: '#3fb950' }
    ],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString(), 'prev'), cell(a1.toString(), 'prev'), cell(a0.toString(), 'eka', { id: 's1_a0', pop: true })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString(), 'prev'), cell(b1.toString(), 'prev'), cell(b0.toString(), 'eka', { id: 's1_b0', pop: true })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(''), cell(''), cell(r0.toString(), 'res', { id: 'res_r0', carry: carry > 0 ? carry.toString() : undefined, pop: true })] }
    ]
  });

  // Step 2: Right two cross (a1*b0 + a0*b1)
  const p1 = a1 * b0 + a0 * b1;
  const s1 = p1 + carry;
  const r1 = s1 % 10;
  carry = Math.floor(s1 / 10);
  res.unshift(r1.toString());
  log.push(['Step 2', `${a1}×${b0} + ${a0}×${b1} = ${p1}. Add carry: ${s1} (write ${r1}, carry ${carry})`]);

  frames.push({
    cap: `Step 2: Cross multiply right two columns: ${a1}×${b0} + ${a0}×${b1} = ${p1}. Plus carry = ${s1}`,
    log: [...log],
    wires: [
      { fromKey: 's2_a1', toKey: 's2_b0', color: '#f0b429' },
      { fromKey: 's2_a0', toKey: 's2_b1', color: '#f0b429' }
    ],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString(), 'prev'), cell(a1.toString(), 'eka', { id: 's2_a1', pop: true }), cell(a0.toString(), 'eka', { id: 's2_a0', pop: true })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString(), 'prev'), cell(b1.toString(), 'eka', { id: 's2_b1', pop: true }), cell(b0.toString(), 'eka', { id: 's2_b0', pop: true })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(''), cell(r1.toString(), 'res', { id: 'res_r1', carry: carry > 0 ? carry.toString() : undefined, pop: true }), cell(r0.toString(), 'res')] }
    ]
  });

  // Step 3: All three cross (star pattern: a2*b0 + a1*b1 + a0*b2)
  const p2 = a2 * b0 + a1 * b1 + a0 * b2;
  const s2 = p2 + carry;
  const r2 = s2 % 10;
  carry = Math.floor(s2 / 10);
  res.unshift(r2.toString());
  log.push(['Step 3', `${a2}×${b0} + ${a1}×${b1} + ${a0}×${b2} = ${p2}. Add carry: ${s2} (write ${r2}, carry ${carry})`]);

  frames.push({
    cap: `Step 3: Cross multiply all three columns: ${a2}×${b0} + ${a1}×${b1} + ${a0}×${b2} = ${p2}. Plus carry = ${s2}`,
    log: [...log],
    wires: [
      { fromKey: 's3_a2', toKey: 's3_b0', color: '#bc8cff' },
      { fromKey: 's3_a1', toKey: 's3_b1', color: '#3fb950' },
      { fromKey: 's3_a0', toKey: 's3_b2', color: '#bc8cff' }
    ],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString(), 'eka', { id: 's3_a2', pop: true }), cell(a1.toString(), 'eka', { id: 's3_a1', pop: true }), cell(a0.toString(), 'eka', { id: 's3_a0', pop: true })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString(), 'eka', { id: 's3_b2', pop: true }), cell(b1.toString(), 'eka', { id: 's3_b1', pop: true }), cell(b0.toString(), 'eka', { id: 's3_b0', pop: true })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(r2.toString(), 'res', { id: 'res_r2', carry: carry > 0 ? carry.toString() : undefined, pop: true }), cell(r1.toString(), 'res'), cell(r0.toString(), 'res')] }
    ]
  });

  // Step 4: Left two cross (a2*b1 + a1*b2)
  const p3 = a2 * b1 + a1 * b2;
  const s3 = p3 + carry;
  const r3 = s3 % 10;
  carry = Math.floor(s3 / 10);
  res.unshift(r3.toString());
  log.push(['Step 4', `${a2}×${b1} + ${a1}×${b2} = ${p3}. Add carry: ${s3} (write ${r3}, carry ${carry})`]);

  frames.push({
    cap: `Step 4: Cross multiply left two columns: ${a2}×${b1} + ${a1}×${b2} = ${p3}. Plus carry = ${s3}`,
    log: [...log],
    wires: [
      { fromKey: 's4_a2', toKey: 's4_b1', color: '#f0b429' },
      { fromKey: 's4_a1', toKey: 's4_b2', color: '#f0b429' }
    ],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString(), 'eka', { id: 's4_a2', pop: true }), cell(a1.toString(), 'eka', { id: 's4_a1', pop: true }), cell(a0.toString(), 'prev')] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString(), 'eka', { id: 's4_b2', pop: true }), cell(b1.toString(), 'eka', { id: 's4_b1', pop: true }), cell(b0.toString(), 'prev')] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(r3.toString(), 'res', { id: 'res_r3', carry: carry > 0 ? carry.toString() : undefined, pop: true }), cell(r2.toString(), 'res'), cell(r1.toString(), 'res'), cell(r0.toString(), 'res')] }
    ]
  });

  // Step 5: Leftmost vertical (a2 * b2)
  const p4 = a2 * b2;
  const s4 = p4 + carry;
  res.unshift(s4.toString());
  log.push(['Step 5', `${a2}×${b2} = ${p4}. Add carry: ${s4} (write ${s4})`]);

  frames.push({
    cap: `Step 5: Leftmost vertical column: ${a2} × ${b2} = ${p4}. Plus carry = ${s4}`,
    log: [...log],
    wires: [
      { fromKey: 's5_a2', toKey: 's5_b2', color: '#4cc2ff' }
    ],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString(), 'eka', { id: 's5_a2', pop: true }), cell(a1.toString(), 'prev'), cell(a0.toString(), 'prev')] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString(), 'eka', { id: 's5_b2', pop: true }), cell(b1.toString(), 'prev'), cell(b0.toString(), 'prev')] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(s4.toString(), 'res', { id: 'res_s4', pop: true }), cell(r3.toString(), 'res'), cell(r2.toString(), 'res'), cell(r1.toString(), 'res'), cell(r0.toString(), 'res')] }
    ]
  });

  // Step 6: Final answer with green summary log
  const finalAns = res.join('');
  log.push(['sum', `${a} × ${b} = ${finalAns}`]);

  frames.push({
    cap: `Final answer: ${a} × ${b} = ${finalAns}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString()), cell(a1.toString()), cell(a0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString()), cell(b1.toString()), cell(b0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: res.map((x, idx) => cell(x, 'res', { id: `final_${idx}`, pop: true })) }
    ]
  });

  return { title, ruleHTML, frames, note };
}
