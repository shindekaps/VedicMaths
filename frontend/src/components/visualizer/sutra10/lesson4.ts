import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym } from '../helpers';

export function buildYavadunamFactor(p: any): LessonModel {
  const n = p.n || 9999;
  
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 0;
  
  log.push(['Identify', `${n} is close to 10000`]);
  frames.push({
    cap: `Recognize that ${n} is a deficiency of 1 from 10000 (100²).`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Setup',
        nodes: [
          cell(n.toString()), sym('='), cell('10000'), sym('-'), cell('1')
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  log.push(['Squares', `100² - 1²`]);
  frames.push({
    cap: `Rewrite as difference of squares.`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Squares',
        nodes: [
          cell('100²'), sym('-'), cell('1²')
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  log.push(['Factor', `(100 - 1)(100 + 1) = 99 × 101`]);
  frames.push({
    cap: `Apply difference of squares factorization: (a-b)(a+b)`,
    log: [...log],
    lines: [
      {
        id: `l${lineIdSeq++}`,
        label: 'Factors',
        nodes: [
          sym('('), cell('100'), sym('-'), cell('1'), sym(')'),
          sym('('), cell('100'), sym('+'), cell('1'), sym(')'),
          sym('='),
          cell('99'), sym('×'), cell('101', 'res', { pop: true })
        ]
      }
    ],
    wires: [],
    flyers: []
  });
  
  return {
    title: 'Sutra 10 - Yavadunam: Factorization',
    ruleHTML: 'Using deficiency to recognize algebraic patterns like difference of squares.',
    frames,
    note: `Helps quickly factorize specific numbers.`
  };
}
