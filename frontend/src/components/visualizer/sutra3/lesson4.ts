import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildUrdhvaSquare(p: any): LessonModel {
  const nStr = (p.n || '23').toString();
  const digits = nStr.split('').map(x => parseInt(x, 10));
  
  const title = `Squaring Any Number (Dwandwa Yoga)`;
  const ruleHTML = `Use duplex (Dwandwa) for squaring:<br>For 2-digit ab: a² | 2ab | b²<br>For 3-digit abc: a² | 2ab | 2ac+b² | 2bc | c²`;
  const note = `Apply carries leftwards at each step.`;
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  frames.push({
    cap: `Problem: Find the square of ${nStr}`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lineIdSeq++}`, label: null, nodes: [cell(nStr), sym('²')] }
    ]
  });

  if (digits.length === 2) {
    const a = digits[0];
    const b = digits[1];
    
    const d1 = b * b;
    const d2 = 2 * a * b;
    const d3 = a * a;
    
    log.push(['Step 1', `Duplex of right digit: ${b}² = ${d1}`]);
    log.push(['Step 2', `Duplex of both digits: 2 × ${a} × ${b} = ${d2}`]);
    log.push(['Step 3', `Duplex of left digit: ${a}² = ${d3}`]);
    
    frames.push({
      cap: `Calculate duplexes: a² | 2ab | b²`,
      log: [...log],
      wires: [],
      flyers: [],
      lines: [
        { id: `l${lineIdSeq++}`, label: 'a² | 2ab | b²', nodes: [cell(d3.toString()), sym('|'), cell(d2.toString()), sym('|'), cell(d1.toString())] }
      ]
    });

    let carry = 0;
    const s1 = d1 + carry;
    const r1 = s1 % 10;
    carry = Math.floor(s1 / 10);
    
    const s2 = d2 + carry;
    const r2 = s2 % 10;
    carry = Math.floor(s2 / 10);
    
    const s3 = d3 + carry;
    
    log.push(['Step 4', `Apply carries right to left: ${s3}${r2}${r1}`]);

    frames.push({
      cap: `Resolve carries from right to left to get the answer.`,
      log: [...log],
      wires: [],
      flyers: [],
      lines: [
        { id: `l${lineIdSeq++}`, label: null, nodes: [cell(d3.toString()), sym('|'), cell(d2.toString()), sym('|'), cell(d1.toString())] },
        { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
        { id: `l${lineIdSeq++}`, label: null, nodes: [cell(s3.toString(), 'res', {pop:true}), cell(r2.toString(), 'res', {pop:true}), cell(r1.toString(), 'res', {pop:true})] }
      ]
    });
  } else if (digits.length === 3) {
    const a = digits[0];
    const b = digits[1];
    const c = digits[2];
    
    const d1 = c * c;
    const d2 = 2 * b * c;
    const d3 = 2 * a * c + b * b;
    const d4 = 2 * a * b;
    const d5 = a * a;

    log.push(['Step 1', `Duplex of right digit: ${c}² = ${d1}`]);
    log.push(['Step 2', `Duplex of right two: 2 × ${b} × ${c} = ${d2}`]);
    log.push(['Step 3', `Duplex of three: 2 × ${a} × ${c} + ${b}² = ${d3}`]);
    log.push(['Step 4', `Duplex of left two: 2 × ${a} × ${b} = ${d4}`]);
    log.push(['Step 5', `Duplex of left digit: ${a}² = ${d5}`]);
    
    frames.push({
      cap: `Calculate duplexes: a² | 2ab | 2ac+b² | 2bc | c²`,
      log: [...log],
      wires: [],
      flyers: [],
      lines: [
        { id: `l${lineIdSeq++}`, label: 'Duplex', nodes: [cell(d5.toString()), sym('|'), cell(d4.toString()), sym('|'), cell(d3.toString()), sym('|'), cell(d2.toString()), sym('|'), cell(d1.toString())] }
      ]
    });

    let carry = 0;
    const s1 = d1 + carry;
    const r1 = s1 % 10;
    carry = Math.floor(s1 / 10);
    
    const s2 = d2 + carry;
    const r2 = s2 % 10;
    carry = Math.floor(s2 / 10);
    
    const s3 = d3 + carry;
    const r3 = s3 % 10;
    carry = Math.floor(s3 / 10);

    const s4 = d4 + carry;
    const r4 = s4 % 10;
    carry = Math.floor(s4 / 10);

    const s5 = d5 + carry;

    log.push(['Step 6', `Apply carries right to left: ${s5}${r4}${r3}${r2}${r1}`]);

    frames.push({
      cap: `Resolve carries from right to left to get the answer.`,
      log: [...log],
      wires: [],
      flyers: [],
      lines: [
        { id: `l${lineIdSeq++}`, label: null, nodes: [cell(d5.toString()), sym('|'), cell(d4.toString()), sym('|'), cell(d3.toString()), sym('|'), cell(d2.toString()), sym('|'), cell(d1.toString())] },
        { id: `l${lineIdSeq++}`, label: null, nodes: [divider()] },
        { id: `l${lineIdSeq++}`, label: null, nodes: [cell(s5.toString(), 'res', {pop:true}), cell(r4.toString(), 'res', {pop:true}), cell(r3.toString(), 'res', {pop:true}), cell(r2.toString(), 'res', {pop:true}), cell(r1.toString(), 'res', {pop:true})] }
      ]
    });
  } else {
      frames.push({
        cap: `Dwandwa Yoga for > 3 digits is not implemented in this demo.`,
        log: [...log],
        wires: [],
        flyers: [],
        lines: [
          { id: `l${lineIdSeq++}`, label: null, nodes: [cell('Not implemented')] }
        ]
      });
  }

  return { title, ruleHTML, frames, note };
}
