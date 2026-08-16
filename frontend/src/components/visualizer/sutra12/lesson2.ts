import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

function getDigitSum(num: number): number {
  if (num === 0) return 0;
  return num % 9 === 0 ? 9 : num % 9;
}

export function buildShesaCastNines(p: any): LessonModel {
  const a = parseInt(p.a) || 23;
  const b = parseInt(p.b) || 45;
  const prod = a * b;
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  const dsA = getDigitSum(a);
  const dsB = getDigitSum(b);
  const dsProd = getDigitSum(prod);
  const dsExpected = getDigitSum(dsA * dsB);

  frames.push({
    cap: `Verify ${a} × ${b} = ${prod} using casting out nines`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Equation',
        nodes: [cell(a.toString()), sym('×'), cell(b.toString()), sym('='), cell(prod.toString())]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['DS(a)', dsA.toString()]);
  log.push(['DS(b)', dsB.toString()]);
  log.push(['DS(prod)', dsProd.toString()]);

  frames.push({
    cap: `Digit sums: a→${dsA}, b→${dsB}. Product DS expected: ${dsExpected}. Actual: ${dsProd}.`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Verification',
        nodes: [
          cell(`DS(${prod})`), sym('='), cell(dsProd.toString(), dsProd === dsExpected ? 'res' : 'err', { pop: true })
        ]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Casting Out Nines',
    ruleHTML: 'Checking arithmetic results by analyzing the remainders mod 9.',
    frames,
    note: 'Sutra 12'
  };
}
