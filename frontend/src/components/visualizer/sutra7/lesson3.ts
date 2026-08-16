import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSankalanaWord(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Step 1', 'Define variables']);
  frames.push({
    cap: 'Let Son\'s age be x. Father\'s age is x + 30.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Son',
        nodes: [cell('x', 'res', { pop: true })]
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Father',
        nodes: [cell('x + 30', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 2', 'Set up the equation for 5 years later']);
  frames.push({
    cap: 'In 5 years, Father will be 3 times the Son\'s age: (x + 30) + 5 = 3(x + 5)',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Equation',
        nodes: [cell('x + 35'), sym('='), cell('3(x + 5)')]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 3', 'Expand and collect terms']);
  frames.push({
    cap: 'Expand the right side and subtract x from both sides.',
    log: [...log],
    lines: [
      {
        id: `L3`,
        label: 'Equation',
        nodes: [cell('x + 35'), sym('='), cell('3(x + 5)')],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Expand',
        nodes: [cell('x + 35'), sym('='), cell('3x + 15', 'res', { pop: true })]
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Subtract x',
        nodes: [cell('35'), sym('='), cell('2x + 15', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 4', 'Solve for x']);
  frames.push({
    cap: 'Subtract 15 and divide by 2 to find x (Son\'s age).',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Subtract 15',
        nodes: [cell('20'), sym('='), cell('2x', 'res', { pop: true })]
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Divide by 2',
        nodes: [cell('x'), sym('='), cell('10', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Sankalana-Vyavaharana: Word Problems',
    ruleHTML: 'Solving real-world problems by addition and subtraction.',
    frames,
    note: 'Translating word problems into simple linear equations.'
  };
}
