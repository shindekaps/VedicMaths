import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildPuranaGeo(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Step 1', 'Problem: Maximize area of rectangle with perimeter 20']);
  frames.push({
    cap: 'Perimeter = 20, so Length (L) + Width (W) = 10. Let W = x, then L = 10 - x.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Width',
        nodes: [cell('x')]
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Length',
        nodes: [cell('10 - x')]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 2', 'Express Area as a function of x']);
  frames.push({
    cap: 'Area = Length × Width = x(10 - x) = 10x - x²',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Area A(x)',
        nodes: [cell('-x²'), sym('+'), cell('10x')]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 3', 'Complete the square to find max Area']);
  frames.push({
    cap: 'Factor out -1: -(x² - 10x). Complete the square inside parenthesis.',
    log: [...log],
    lines: [
      {
        id: `L3`,
        label: 'Area A(x)',
        nodes: [cell('-x²'), sym('+'), cell('10x')],
        muted: true
      },
      {
        id: `L${lineIdSeq++}`,
        label: 'Factor -1',
        nodes: [sym('-'), cell('(x² - 10x + 25 - 25)', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Step 4', 'Rewrite in vertex form']);
  frames.push({
    cap: 'A(x) = -(x - 5)² + 25. The maximum area is 25 when x = 5.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Vertex Form',
        nodes: [sym('-'), cell('(x - 5)²', 'res', { pop: true }), sym('+'), cell('25', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Puranapuranabhyam: Geometric Applications',
    ruleHTML: 'By the completion or non-completion.',
    frames,
    note: 'Completing the square is very useful for finding the maximum or minimum values of quadratic functions.'
  };
}
