import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildGunakaPoly(p: any): LessonModel {
  const coeffs = p.coeffs || [3, 2, -5, 7]; // 3x³+2x²-5x+7
  const sum = coeffs.reduce((a: number, b: number) => a + b, 0);

  const frames: Frame[] = [];
  frames.push({
    cap: 'Polynomial P(x) = 3x³ + 2x² - 5x + 7',
    log: [['Start', 'Given Polynomial']],
    lines: [
      { id: 'l1', label: 'P(x)', nodes: [cell('3x³ + 2x² - 5x + 7')] }
    ],
    wires: [], flyers: []
  });

  frames.push({
    cap: 'Find P(1) = sum of coefficients',
    log: [['Step 1', 'Substitute x=1']],
    lines: [
      { id: 'l2', label: 'P(1)', nodes: [cell('3(1)³ + 2(1)² - 5(1) + 7')] }
    ],
    wires: [], flyers: []
  });

  frames.push({
    cap: `Sum = ${coeffs.join(' + ').replace('+ -', '- ')} = ${sum}`,
    log: [['Result', `Sum = ${sum}`]],
    lines: [
      { id: 'l3', label: 'Sum', nodes: [cell('3 + 2 - 5 + 7', 'res')] },
      { id: 'l4', label: 'Ans', nodes: [cell(sum.toString(), 'res', {pop: true})] }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Finding Polynomial Values at x=1',
    ruleHTML: 'Gunakasamuccayah - Sum of coefficients',
    frames,
    note: 'Evaluating polynomials easily at x=1.'
  };
}
