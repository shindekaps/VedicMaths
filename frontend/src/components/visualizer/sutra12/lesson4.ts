import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildShesaError(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  frames.push({
    cap: `Error detection with digit sums`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Check',
        nodes: [cell('DS(LHS)'), sym('='), cell('DS(RHS)')]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Error Detection',
    ruleHTML: 'Detecting errors by verifying the remainders.',
    frames,
    note: 'Sutra 12'
  };
}
