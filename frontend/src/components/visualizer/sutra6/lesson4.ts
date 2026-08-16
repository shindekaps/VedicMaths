import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildAnurupyeGeo(p: any): LessonModel {
  const frames: Frame[] = [];
  const log: string[][] = [];
  let lineIdSeq = 1;

  log.push(['Start', 'Similar triangles sides ratio']);
  frames.push({
    cap: 'In similar triangles, the ratio of corresponding sides is equal.',
    log: [...log],
    lines: [
      {
        id: `L${lineIdSeq++}`,
        label: 'Sides',
        nodes: [cell('AB/XY'), sym('='), cell('BC/YZ')]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Values', '3/x = 4/8']);
  frames.push({
    cap: 'Substitute known side lengths.',
    log: [...log],
    lines: [
      ...frames[0].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Subst',
        nodes: [cell('3/x'), sym('='), cell('4/8', '', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  log.push(['Solve', 'x = 6']);
  frames.push({
    cap: 'Cross multiply and find unknown side x.',
    log: [...log],
    lines: [
      ...frames[1].lines.map(l => ({...l, muted: true})),
      {
        id: `L${lineIdSeq++}`,
        label: 'Result',
        nodes: [cell('x = 6', 'res', { pop: true })]
      }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Geometric Problems',
    ruleHTML: 'Anurupye Sunyamanyat.',
    frames,
    note: 'Applying proportional ratios to geometry.'
  };
}
