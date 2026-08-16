import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildEkanyunenaMul(p: any): LessonModel {
  const n = p.n || 35;
  const frames: Frame[] = [];
  frames.push({
    cap: `Multiply ${n} by 99`,
    log: [['Start', `${n} × 99`]],
    lines: [
      { id: 'l1', label: 'Problem', nodes: [cell(n.toString()), sym('×'), cell('99')] }
    ],
    wires: [], flyers: []
  });
  
  const left = n - 1;
  frames.push({
    cap: 'By one less than the previous: left part is ' + left,
    log: [['Left Part', `${n} - 1 = ${left}`]],
    lines: [
      { id: 'l1', label: 'Problem', nodes: [cell(n.toString(), 'eka'), sym('×'), cell('99')] },
      { id: 'l2', label: 'Left', nodes: [cell(left.toString(), 'res', {pop: true})] }
    ],
    wires: [], flyers: []
  });

  const right = 100 - n;
  frames.push({
    cap: 'Right part is complement of ' + n + ' from 100 = ' + right,
    log: [['Right Part', `100 - ${n} = ${right}`]],
    lines: [
      { id: 'l2', label: 'Result', nodes: [cell(left.toString(), 'res'), sym('|'), cell(right.toString(), 'res', {pop: true})] }
    ],
    wires: [], flyers: []
  });

  frames.push({
    cap: 'Final answer: ' + left + right,
    log: [['Final', `${left}${right}`]],
    lines: [
      { id: 'l2', label: 'Result', nodes: [cell(`${left}${right}`, 'res', {pop: true})] }
    ],
    wires: [], flyers: []
  });

  return {
    title: 'Multiplication by 9s',
    ruleHTML: 'Ekanyunena Purvena - By one less than the previous',
    frames,
    note: 'Quick multiplication by 99, 999, etc.'
  };
}
