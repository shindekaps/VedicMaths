import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildEkanyunenaDiv(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: '1000 ÷ 9 = 111.111...',
    log: [['Start', 'Division by 9']],
    lines: [
      { id: 'l1', label: 'Problem', nodes: [cell('1000'), sym('÷'), cell('9')] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: 'Using repeated pattern for division',
    log: [['Result', '111.111...']],
    lines: [
      { id: 'l1', label: 'Problem', nodes: [cell('1000'), sym('÷'), cell('9')] },
      { id: 'l2', label: 'Result', nodes: [cell('111.111...', 'res')] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Division Methods',
    ruleHTML: 'Ekanyunena Purvena',
    frames,
    note: 'Fractions and recurring decimals.'
  };
}
