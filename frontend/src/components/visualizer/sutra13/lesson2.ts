import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildSopantyaSequence(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: 'Fibonacci sequence: each term = sum of previous two',
    log: [['Start', 'Begin with 1, 1']],
    lines: [
      { id: 'l1', label: 'Fibonacci', nodes: [cell('1'), sym(','), cell('1')] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: '1 + 1 = 2',
    log: [['Step 1', '1 + 1 = 2']],
    lines: [
      { id: 'l1', label: 'Fibonacci', nodes: [cell('1', 'prev'), sym(','), cell('1', 'prev'), sym(','), cell('2', 'res', {pop: true})] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: '1 + 2 = 3',
    log: [['Step 2', '1 + 2 = 3']],
    lines: [
      { id: 'l1', label: 'Fibonacci', nodes: [cell('1'), sym(','), cell('1', 'prev'), sym(','), cell('2', 'prev'), sym(','), cell('3', 'res', {pop: true})] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Sequences and Series',
    ruleHTML: 'Sopantyadvayamantyam - Ultimate and twice the penultimate',
    frames,
    note: 'Generating the Fibonacci sequence.'
  };
}
