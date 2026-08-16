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
  const ruleHTML = `Urdhva Tiryagbhyam for 3-digits has 5 steps, working right to left:<br>1. Rightmost vertical<br>2. Right two cross<br>3. All three cross (star)<br>4. Left two cross<br>5. Leftmost vertical`;
  const note = `Add carries to the next column at each step.`;
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  frames.push({
    cap: 'Write the numbers one below the other.',
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString()), cell(a1.toString()), cell(a0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString()), cell(b1.toString()), cell(b0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] }
    ]
  });

  const res: string[] = [];
  let carry = 0;
  
  // Step 1: Rightmost vertical
  const p0 = a0 * b0;
  const s0 = p0 + carry;
  const r0 = s0 % 10;
  carry = Math.floor(s0 / 10);
  res.unshift(r0.toString());
  log.push(['Step 1', `${a0}×${b0} = ${p0} (write ${r0}, carry ${carry})`]);
  
  frames.push({
    cap: `Step 1: ${a0} × ${b0} = ${p0}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString()), cell(a1.toString()), cell(a0.toString(), 'eka', {pop:true})] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString()), cell(b1.toString()), cell(b0.toString(), 'eka', {pop:true})] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(''), cell(''), cell(r0.toString(), 'res', { carry: carry>0?carry.toString():undefined, pop:true })] }
    ]
  });

  // Step 2: Right two cross
  const p1 = a1 * b0 + a0 * b1;
  const s1 = p1 + carry;
  const r1 = s1 % 10;
  carry = Math.floor(s1 / 10);
  res.unshift(r1.toString());
  log.push(['Step 2', `${a1}×${b0} + ${a0}×${b1} = ${p1}. Add carry: ${s1} (write ${r1}, carry ${carry})`]);

  frames.push({
    cap: `Step 2: Cross multiply right two columns: ${a1}×${b0} + ${a0}×${b1} = ${p1}. Plus carry = ${s1}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString()), cell(a1.toString(), 'eka', {pop:true}), cell(a0.toString(), 'eka', {pop:true})] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString()), cell(b1.toString(), 'eka', {pop:true}), cell(b0.toString(), 'eka', {pop:true})] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(''), cell(r1.toString(), 'res', { carry: carry>0?carry.toString():undefined, pop:true }), cell(r0.toString(), 'res')] }
    ]
  });

  // Step 3: All three cross
  const p2 = a2 * b0 + a1 * b1 + a0 * b2;
  const s2 = p2 + carry;
  const r2 = s2 % 10;
  carry = Math.floor(s2 / 10);
  res.unshift(r2.toString());
  log.push(['Step 3', `${a2}×${b0} + ${a1}×${b1} + ${a0}×${b2} = ${p2}. Add carry: ${s2} (write ${r2}, carry ${carry})`]);

  frames.push({
    cap: `Step 3: Cross multiply all three columns: ${a2}×${b0} + ${a1}×${b1} + ${a0}×${b2} = ${p2}. Plus carry = ${s2}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString(), 'eka', {pop:true}), cell(a1.toString(), 'eka', {pop:true}), cell(a0.toString(), 'eka', {pop:true})] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString(), 'eka', {pop:true}), cell(b1.toString(), 'eka', {pop:true}), cell(b0.toString(), 'eka', {pop:true})] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(r2.toString(), 'res', { carry: carry>0?carry.toString():undefined, pop:true }), cell(r1.toString(), 'res'), cell(r0.toString(), 'res')] }
    ]
  });

  // Step 4: Left two cross
  const p3 = a2 * b1 + a1 * b2;
  const s3 = p3 + carry;
  const r3 = s3 % 10;
  carry = Math.floor(s3 / 10);
  res.unshift(r3.toString());
  log.push(['Step 4', `${a2}×${b1} + ${a1}×${b2} = ${p3}. Add carry: ${s3} (write ${r3}, carry ${carry})`]);

  frames.push({
    cap: `Step 4: Cross multiply left two columns: ${a2}×${b1} + ${a1}×${b2} = ${p3}. Plus carry = ${s3}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString(), 'eka', {pop:true}), cell(a1.toString(), 'eka', {pop:true}), cell(a0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString(), 'eka', {pop:true}), cell(b1.toString(), 'eka', {pop:true}), cell(b0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(r3.toString(), 'res', { carry: carry>0?carry.toString():undefined, pop:true }), cell(r2.toString(), 'res'), cell(r1.toString(), 'res'), cell(r0.toString(), 'res')] }
    ]
  });

  // Step 5: Leftmost vertical
  const p4 = a2 * b2;
  const s4 = p4 + carry;
  res.unshift(s4.toString());
  log.push(['Step 5', `${a2}×${b2} = ${p4}. Add carry: ${s4} (write ${s4})`]);

  frames.push({
    cap: `Step 5: Leftmost vertical: ${a2} × ${b2} = ${p4}. Plus carry = ${s4}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString(), 'eka', {pop:true}), cell(a1.toString()), cell(a0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString(), 'eka', {pop:true}), cell(b1.toString()), cell(b0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(s4.toString(), 'res', {pop:true}), cell(r3.toString(), 'res'), cell(r2.toString(), 'res'), cell(r1.toString(), 'res'), cell(r0.toString(), 'res')] }
    ]
  });

  // Final
  frames.push({
    cap: `Final answer: ${a} × ${b} = ${res.join('')}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a2.toString()), cell(a1.toString()), cell(a0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b2.toString()), cell(b1.toString()), cell(b0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: res.map(x => cell(x, 'res')) }
    ]
  });

  return { title, ruleHTML, frames, note };
}
