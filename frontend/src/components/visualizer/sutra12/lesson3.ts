import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildShesaModular(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  frames.push({
    cap: `Solving x ≡ 3 (mod 5)`,
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Equation',
        nodes: [cell('x'), sym('≡'), cell('3'), cell('(mod 5)')]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Modular Arithmetic',
    ruleHTML: 'Remainders by the last digit in modular operations.',
    frames,
    note: 'Sutra 12'
  };
}
