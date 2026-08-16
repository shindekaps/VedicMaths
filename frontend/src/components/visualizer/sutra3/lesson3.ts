import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildUrdhvaDec(p: any): LessonModel {
  const aStr = (p.a || '2.3').toString();
  const bStr = (p.b || '4.5').toString();
  
  const aDecPlaces = aStr.includes('.') ? aStr.length - aStr.indexOf('.') - 1 : 0;
  const bDecPlaces = bStr.includes('.') ? bStr.length - bStr.indexOf('.') - 1 : 0;
  const totalDecPlaces = aDecPlaces + bDecPlaces;
  
  const aInt = parseInt(aStr.replace('.', ''), 10);
  const bInt = parseInt(bStr.replace('.', ''), 10);

  const title = `Decimal Multiplication (Urdhva Tiryagbhyam)`;
  const ruleHTML = `For decimals:<br>1. Multiply as if there are no decimal points<br>2. Count total decimal places<br>3. Place the decimal point in the answer`;
  const note = `Total decimal places: ${aDecPlaces} + ${bDecPlaces} = ${totalDecPlaces}`;
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  // Frame 1: Setup & Decimal Count
  frames.push({
    cap: `Problem: ${aStr} × ${bStr}. Count total decimal places: ${aDecPlaces} + ${bDecPlaces} = ${totalDecPlaces}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(aStr, 'prev', { id: 'dec_a' })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(bStr, 'prev', { id: 'dec_b' })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] }
    ]
  });

  const aIntStr = aInt.toString().padStart(2, '0');
  const bIntStr = bInt.toString().padStart(2, '0');
  const a1 = parseInt(aIntStr[0], 10);
  const a0 = parseInt(aIntStr[1], 10);
  const b1 = parseInt(bIntStr[0], 10);
  const b0 = parseInt(bIntStr[1], 10);

  // Step 1: Right vertical
  const p0 = a0 * b0;
  const r0 = p0 % 10;
  let carry0 = Math.floor(p0 / 10);

  // Step 2: Cross multiply
  const p1 = a1 * b0 + a0 * b1;
  const s1 = p1 + carry0;
  const r1 = s1 % 10;
  let carry1 = Math.floor(s1 / 10);
  
  // Step 3: Left vertical
  const p2 = a1 * b1;
  const s2 = p2 + carry1;

  const intResultStr = `${s2}${r1}${r0}`;
  log.push(['Step 1', `Remove decimals: ${aInt} × ${bInt}`]);

  // Frame 2: Right vertical step (wires)
  frames.push({
    cap: `Multiply right digits vertically: ${a0} × ${b0} = ${p0}`,
    log: [...log],
    wires: [
      { fromKey: 'dec_a0', toKey: 'dec_b0', color: '#3fb950' }
    ],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a1.toString(), 'prev'), cell(a0.toString(), 'eka', { id: 'dec_a0', pop: true })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b1.toString(), 'prev'), cell(b0.toString(), 'eka', { id: 'dec_b0', pop: true })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(''), cell(r0.toString(), 'res', { id: 'res_d0', carry: carry0 > 0 ? carry0.toString() : undefined, pop: true })] }
    ]
  });

  // Frame 3: Cross multiply step (wires)
  frames.push({
    cap: `Cross multiply and add: ${a1}×${b0} + ${a0}×${b1} = ${p1}. Plus carry = ${s1}`,
    log: [...log],
    wires: [
      { fromKey: 'dec_a1', toKey: 'dec_b0', color: '#f0b429' },
      { fromKey: 'dec_a0', toKey: 'dec_b1', color: '#f0b429' }
    ],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a1.toString(), 'eka', { id: 'dec_a1', pop: true }), cell(a0.toString(), 'eka', { id: 'dec_a0', pop: true })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b1.toString(), 'eka', { id: 'dec_b1', pop: true }), cell(b0.toString(), 'eka', { id: 'dec_b0', pop: true })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(r1.toString(), 'res', { id: 'res_d1', carry: carry1 > 0 ? carry1.toString() : undefined, pop: true }), cell(r0.toString(), 'res')] }
    ]
  });

  // Frame 4: Left vertical step (wires)
  log.push(['Step 2', `Multiply as integers: ${aInt} × ${bInt} = ${intResultStr}`]);
  frames.push({
    cap: `Multiply left digits vertically: ${a1} × ${b1} = ${p2}. Integer result = ${intResultStr}`,
    log: [...log],
    wires: [
      { fromKey: 'dec_a1_left', toKey: 'dec_b1_left', color: '#4cc2ff' }
    ],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a1.toString(), 'eka', { id: 'dec_a1_left', pop: true }), cell(a0.toString(), 'prev')] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b1.toString(), 'eka', { id: 'dec_b1_left', pop: true }), cell(b0.toString(), 'prev')] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(s2.toString(), 'res', { id: 'res_s2', pop: true }), cell(r1.toString(), 'res'), cell(r0.toString(), 'res')] }
    ]
  });

  // Frame 5: Place decimal point
  let finalAns = intResultStr;
  if (totalDecPlaces > 0) {
    if (finalAns.length <= totalDecPlaces) {
      finalAns = finalAns.padStart(totalDecPlaces + 1, '0');
    }
    const dotPos = finalAns.length - totalDecPlaces;
    finalAns = finalAns.slice(0, dotPos) + '.' + finalAns.slice(dotPos);
  }

  log.push(['Step 3', `Place decimal point ${totalDecPlaces} places from right: ${finalAns}`]);

  frames.push({
    cap: `Place decimal point ${totalDecPlaces} places from the right.`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(aStr, 'prev', { id: 'final_dec_a' })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(bStr, 'prev', { id: 'final_dec_b' })] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(finalAns, 'res', { id: 'final_dec_ans', pop: true })] }
    ]
  });

  // Frame 6: Final Answer with summary
  log.push(['sum', `${aStr} × ${bStr} = ${finalAns}`]);
  frames.push({
    cap: `Final Answer: ${aStr} × ${bStr} = ${finalAns}`,
    log: [...log],
    wires: [
      { fromKey: 'final_dec_a', toKey: 'final_dec_ans', color: '#10b981' }
    ],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(aStr)] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(bStr)] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(finalAns, 'res', { pop: true })] }
    ]
  });

  return { title, ruleHTML, frames, note };
}
