import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSunyamSystem(p: any): LessonModel {
  const sumVal = p.sumVal || 5;
  const prodVal = p.prodVal || 6;
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['System', `x + y = ${sumVal}, xy = ${prodVal}`]);
  frames.push({
    cap: 'Solve a system of equations given sum and product.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Eqs',
        nodes: [cell(`x + y = ${sumVal}`), sym(','), cell(`xy = ${prodVal}`)]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Quadratic', `Form equation: t² - ${sumVal}t + ${prodVal} = 0`]);
  frames.push({
    cap: 'These are roots of a quadratic equation in t.',
    log: [...log],
    lines: [
      ...frames[0].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Subst',
        nodes: [cell(`t² - ${sumVal}t + ${prodVal}`), sym('='), cell('0', '', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Roots', 't = 2, 3']);
  frames.push({
    cap: 'Factor and solve for t.',
    log: [...log],
    lines: [
      ...frames[1].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Roots',
        nodes: [cell('t = 2'), sym(','), cell('t = 3')]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Solution', 'x=2, y=3 or x=3, y=2']);
  frames.push({
    cap: 'The values of x and y are interchangeable.',
    log: [...log],
    lines: [
      ...frames[2].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell('(x,y) = (2,3)'), sym('or'), cell('(3,2)', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Systems of Equations',
    ruleHTML: 'Sunyam Samyasamuccaye.',
    frames,
    note: 'Using sum and product of roots.'
  };
}
