import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildUrdhvaTwo(p: any): LessonModel {
  const a = parseInt(p.a || '23', 10);
  const b = parseInt(p.b || '45', 10);
  
  const aStr = a.toString().padStart(2, '0');
  const bStr = b.toString().padStart(2, '0');
  
  const a1 = parseInt(aStr[0], 10);
  const a0 = parseInt(aStr[1], 10);
  const b1 = parseInt(bStr[0], 10);
  const b0 = parseInt(bStr[1], 10);

  const title = `Two-Digit Multiplication (Urdhva Tiryagbhyam)`;
  const ruleHTML = `Urdhva Tiryagbhyam means "Vertically and Cross-wise". For a two-digit multiplication:<br>1. Multiply vertically on the right<br>2. Multiply cross-wise and add<br>3. Multiply vertically on the left`;
  const note = `Apply carries to the left at each step.`;
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  // Step 1: Setup
  frames.push({
    cap: 'Write the numbers one below the other.',
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [cell(a1.toString(), 'prev', { id: 'cell_a1' }), cell(a0.toString(), 'prev', { id: 'cell_a0' })]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [sym('×'), cell(b1.toString(), 'prev', { id: 'cell_b1' }), cell(b0.toString(), 'prev', { id: 'cell_b0' })]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [divider()]
      }
    ]
  });

  // Step 2: Vertical Multiplication on Right (a0 * b0)
  const p0 = a0 * b0;
  const r0 = p0 % 10;
  let carry = Math.floor(p0 / 10);
  log.push(['Step 1', `${a0} × ${b0} = ${p0} (write ${r0}, carry ${carry})`]);
  
  frames.push({
    cap: `Multiply vertically on the right: ${a0} × ${b0} = ${p0}`,
    log: [...log],
    wires: [
      { fromKey: 'step1_a0', toKey: 'step1_b0', color: '#3fb950' }
    ],
    flyers: [],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [cell(a1.toString(), 'prev', { id: 'step1_a1' }), cell(a0.toString(), 'eka', { id: 'step1_a0', pop: true })]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [sym('×'), cell(b1.toString(), 'prev', { id: 'step1_b1' }), cell(b0.toString(), 'eka', { id: 'step1_b0', pop: true })]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [divider()]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [cell(''), cell(r0.toString(), 'res', { id: 'res_r0', carry: carry > 0 ? carry.toString() : undefined, pop: true })]
      }
    ]
  });

  // Step 3: Cross Multiplication (a1*b0 + a0*b1)
  const p1 = a1 * b0 + a0 * b1;
  const sum1 = p1 + carry;
  const r1 = sum1 % 10;
  carry = Math.floor(sum1 / 10);
  log.push(['Step 2', `${a1}×${b0} + ${a0}×${b1} = ${p1}. Add carry: ${p1} + ${Math.floor(p0/10)} = ${sum1} (write ${r1}, carry ${carry})`]);

  frames.push({
    cap: `Multiply cross-wise and add: ${a1}×${b0} + ${a0}×${b1} = ${p1}. Plus carry = ${sum1}.`,
    log: [...log],
    wires: [
      { fromKey: 'step2_a1', toKey: 'step2_b0', color: '#f0b429' },
      { fromKey: 'step2_a0', toKey: 'step2_b1', color: '#f0b429' }
    ],
    flyers: [],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [cell(a1.toString(), 'eka', { id: 'step2_a1', pop: true }), cell(a0.toString(), 'eka', { id: 'step2_a0', pop: true })]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [sym('×'), cell(b1.toString(), 'eka', { id: 'step2_b1', pop: true }), cell(b0.toString(), 'eka', { id: 'step2_b0', pop: true })]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [divider()]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [cell(r1.toString(), 'res', { id: 'res_r1', carry: carry > 0 ? carry.toString() : undefined, pop: true }), cell(r0.toString(), 'res')]
      }
    ]
  });

  // Step 4: Vertical Multiplication on Left (a1 * b1)
  const p2 = a1 * b1;
  const sum2 = p2 + carry;
  log.push(['Step 3', `${a1} × ${b1} = ${p2}. Add carry: ${p2} + ${Math.floor(sum1/10)} = ${sum2}`]);

  frames.push({
    cap: `Multiply vertically on the left: ${a1} × ${b1} = ${p2}. Plus carry = ${sum2}.`,
    log: [...log],
    wires: [
      { fromKey: 'step3_a1', toKey: 'step3_b1', color: '#4cc2ff' }
    ],
    flyers: [],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [cell(a1.toString(), 'eka', { id: 'step3_a1', pop: true }), cell(a0.toString())]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [sym('×'), cell(b1.toString(), 'eka', { id: 'step3_b1', pop: true }), cell(b0.toString())]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [divider()]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [cell(sum2.toString(), 'res', { id: 'res_sum2', pop: true }), cell(r1.toString(), 'res'), cell(r0.toString(), 'res')]
      }
    ]
  });

  const finalAns = `${sum2}${r1}${r0}`;
  log.push(['sum', `${a} × ${b} = ${finalAns}`]);

  // Step 5: Final answer
  frames.push({
    cap: `Final answer: ${a} × ${b} = ${finalAns}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [cell(a1.toString()), cell(a0.toString())]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [sym('×'), cell(b1.toString()), cell(b0.toString())]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [divider()]
      },
      {
        id: `l${lineIdSeq++}`,
        label: null,
        nodes: [cell(sum2.toString(), 'res', { pop: true }), cell(r1.toString(), 'res', { pop: true }), cell(r0.toString(), 'res', { pop: true })]
      }
    ]
  });

  return { title, ruleHTML, frames, note };
}
