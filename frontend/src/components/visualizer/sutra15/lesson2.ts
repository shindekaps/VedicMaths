import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildGunitaIdentity(p: any): LessonModel {
  const frames: Frame[] = [];
  frames.push({
    cap: '(a+b)(c+d) = ac+ad+bc+bd visually with area model',
    log: [['Start', '(a+b)(c+d)']],
    lines: [
      { id: 'l1', label: 'Exp', nodes: [cell('(a+b)'), cell('(c+d)')] }
    ],
    wires: [], flyers: []
  });
  frames.push({
    cap: 'Expand the terms',
    log: [['Expand', 'ac + ad + bc + bd']],
    lines: [
      { id: 'l2', label: 'Result', nodes: [cell('ac'), sym('+'), cell('ad'), sym('+'), cell('bc'), sym('+'), cell('bd')] }
    ],
    wires: [], flyers: []
  });
  return {
    title: 'Algebraic Identities',
    ruleHTML: 'Gunitasamuccayah',
    frames,
    note: 'Visualizing polynomial multiplication.'
  };
}
