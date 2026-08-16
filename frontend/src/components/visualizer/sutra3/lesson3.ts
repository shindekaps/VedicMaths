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
  
  frames.push({
    cap: `Problem: ${aStr} × ${bStr}. Count total decimal places: ${aDecPlaces} + ${bDecPlaces} = ${totalDecPlaces}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(aStr)] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(bStr)] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] }
    ]
  });

  const aIntStr = aInt.toString().padStart(2, '0');
  const bIntStr = bInt.toString().padStart(2, '0');
  const a1 = parseInt(aIntStr[0], 10);
  const a0 = parseInt(aIntStr[1], 10);
  const b1 = parseInt(bIntStr[0], 10);
  const b0 = parseInt(bIntStr[1], 10);

  const p0 = a0 * b0;
  const r0 = p0 % 10;
  let carry = Math.floor(p0 / 10);
  
  const p1 = a1 * b0 + a0 * b1;
  const s1 = p1 + carry;
  const r1 = s1 % 10;
  carry = Math.floor(s1 / 10);
  
  const p2 = a1 * b1;
  const s2 = p2 + carry;

  const intResultStr = `${s2}${r1}${r0}`;
  log.push(['Step 1', `Remove decimals: ${aInt} × ${bInt}`]);
  log.push(['Step 2', `Multiply using Urdhva Tiryagbhyam: ${intResultStr}`]);
  
  frames.push({
    cap: `Multiply as integers using Urdhva Tiryagbhyam: ${aInt} × ${bInt} = ${intResultStr}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(a1.toString()), cell(a0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(b1.toString()), cell(b0.toString())] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(s2.toString(), 'res', {pop:true}), cell(r1.toString(), 'res', {pop:true}), cell(r0.toString(), 'res', {pop:true})] }
    ]
  });

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
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(aStr)] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(bStr)] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(finalAns, 'res', {pop:true})] }
    ]
  });

  frames.push({
    cap: `Final Answer: ${aStr} × ${bStr} = ${finalAns}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(aStr)] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [sym('×'), cell(bStr)] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(finalAns, 'res')] }
    ]
  });

  return { title, ruleHTML, frames, note };
}
