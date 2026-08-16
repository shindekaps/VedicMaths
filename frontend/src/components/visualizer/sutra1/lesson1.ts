import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildLesson1(p: any): LessonModel {
  const n = p.n, prev = Math.floor(n / 10), eka = prev + 1;
  const left = prev * eka, ans = left * 100 + 25;
  const P = String(prev), L = String(left);
  const frames: Frame[] = [];

  let lineIdSeq = 0;

  const problem = (pc: string, tc: string): LineDef => ({
    id: `prob_${++lineIdSeq}`,
    label: 'problem',
    nodes: [
      cell(P, pc, { id: 'p', tag: pc === 'prev' ? 'previous' : '' }),
      cell('5', tc, { id: 't', tag: tc === 'tail' ? 'last' : '' }),
      sym('²', true)
    ]
  });

  frames.push({
    cap: `We want <b>${n}²</b>. The only thing that matters: it <b>ends in 5</b>.`,
    log: [['', `${n}² → ends in 5`]],
    lines: [problem('', '')],
    wires: [], flyers: []
  });

  frames.push({
    cap: `Split it. Everything before the 5 is the <span class="vvm-hl">previous</span> part — here <span class="vvm-hl">${prev}</span>.`,
    log: [['', `previous = <span class="vvm-v">${prev}</span>`], ['', `last digit = 5`]],
    lines: [problem('prev', 'tail')],
    wires: [], flyers: []
  });

  frames.push({
    cap: `The sutra: <span class="vvm-hl2">one more than the previous</span>. So ${prev} + 1 = <span class="vvm-hl2">${eka}</span>.`,
    log: [['', `ekādhika = ${prev} + 1 = <span class="vvm-v">${eka}</span>`]],
    lines: [
      problem('prev', 'tail'),
      {
        id: `eka_${++lineIdSeq}`, label: 'ekādhika',
        nodes: [
          cell(P, 'prev', { id: 'p2' }), sym('+'), cell('1', '', { sm: true }), sym('='),
          cell(String(eka), 'eka', { id: 'e', pop: true, tag: '+1' })
        ]
      }
    ],
    wires: [{ fromKey: 'p', toKey: 'p2', color: '#f0b429' }],
    flyers: []
  });

  frames.push({
    cap: `Left half = previous × its ekādhika = <span class="vvm-hl">${prev}</span> × <span class="vvm-hl2">${eka}</span> = <b>${left}</b>.`,
    log: [['1', `left = ${prev} × ${eka} = <span class="vvm-v">${left}</span>`]],
    lines: [
      problem('prev', 'tail'),
      {
        id: `eka_${++lineIdSeq}`, label: 'ekādhika', muted: true,
        nodes: [
          cell(P, 'prev', { id: 'p2' }), sym('+'), cell('1', '', { sm: true }), sym('='),
          cell(String(eka), 'eka', { id: 'e' })
        ]
      },
      {
        id: `left_${++lineIdSeq}`, label: 'left half',
        nodes: [
          cell(P, 'prev', { id: 'p3' }), sym('x'), cell(String(eka), 'eka', { id: 'e2' }), sym('='),
          cell(L, 'res', { id: 'L', pop: true })
        ]
      }
    ],
    wires: [
      { fromKey: 'p2', toKey: 'p3', color: '#f0b429' },
      { fromKey: 'e', toKey: 'e2', color: '#3fb950' }
    ],
    flyers: []
  });

  frames.push({
    cap: `Right half is always <b>25</b>, because the last digits are 5 × 5.`,
    log: [['2', `right = 5 × 5 = <span class="vvm-v">25</span>`]],
    lines: [
      problem('prev', 'tail'),
      {
        id: `left_${++lineIdSeq}`, label: 'left half', muted: true,
        nodes: [
          cell(P, 'prev'), sym('x'), cell(String(eka), 'eka'), sym('='), cell(L, 'res', { id: 'L' })
        ]
      },
      {
        id: `right_${++lineIdSeq}`, label: 'right half',
        nodes: [
          cell('5', 'tail', { id: 't2' }), sym('x'), cell('5', 'tail', { id: 't3' }), sym('='),
          cell('25', 'res', { id: 'R', pop: true })
        ]
      }
    ],
    wires: [{ fromKey: 't', toKey: 't2', color: '#4cc2ff' }],
    flyers: []
  });

  const finalSlots: LineNode[] = [];
  L.split('').forEach((ch, i) => finalSlots.push(cell(ch, 'res', { id: 'ansL' + i })));
  finalSlots.push(cell('2', 'res', { id: 'ansR0' }));
  finalSlots.push(cell('5', 'res', { id: 'ansR1' }));

  frames.push({
    cap: `Write them side by side — <b>concatenate</b>, don't add. <b>${n}² = ${ans}</b>.`,
    log: [['', `answer = ${left} | 25`], ['sum', `${n}² = ${ans}`]],
    lines: [
      problem('prev', 'tail'),
      { id: `left_${++lineIdSeq}`, label: 'left half', muted: true, nodes: [cell(L, 'res', { id: 'L' })] },
      { id: `right_${++lineIdSeq}`, label: 'right half', muted: true, nodes: [cell('25', 'res', { id: 'R' })] },
      { id: `div_${++lineIdSeq}`, label: null, nodes: [divider()] },
      { id: `ans_${++lineIdSeq}`, label: 'answer', nodes: finalSlots }
    ],
    wires: [
      { fromKey: 'L', toKey: 'ansL0', color: '#bc8cff' },
      { fromKey: 'R', toKey: 'ansR0', color: '#bc8cff' }
    ],
    flyers: [
      { fromKey: 'L', toKey: 'ansL0', text: L },
      { fromKey: 'R', toKey: 'ansR0', text: '25' }
    ]
  });

  return {
    title: 'Lesson 1 – Squaring any number ending in 5',
    ruleHTML: 'Take the <code>previous</code> part, multiply by <code>one more than itself</code> for the left half, then append <code>25</code>.',
    frames,
    note: `Works for any number ending in 5: 15² up to 995².`
  };
}
