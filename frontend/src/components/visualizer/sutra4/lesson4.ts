import type { LessonModel, Frame, LineDef } from '../types';
import { cell, sym } from '../helpers';

export function buildParavartyaLinear(p: any): LessonModel {
  const a = p.a || 3;
  const b = p.b || 5;
  const c = p.c || 20;
  
  const frames: Frame[] = [];
  let lineIdSeq = 1;

  // Frame 1
  frames.push({
    cap: `Step 1: Given equation`,
    log: [['Equation', `${a}x + ${b} = ${c}`]],
    lines: [{
      id: `l-${lineIdSeq++}`,
      label: 'Given',
      nodes: [
        cell(`${a}x`), sym('+'), cell(`${b}`), sym('='), cell(`${c}`)
      ]
    }],
    wires: [],
    flyers: []
  });

  // Frame 2
  frames.push({
    cap: `Step 2: Transpose +${b} to the right side`,
    log: [['Equation', `${a}x + ${b} = ${c}`], ['Transpose', `Move ${b} to right side: ${a}x = ${c} - ${b}`]],
    lines: [
      {
        id: `l-1`,
        label: 'Given',
        nodes: [
          cell(`${a}x`), sym('+'), cell(`${b}`), sym('='), cell(`${c}`)
        ],
        muted: true
      },
      {
        id: `l-${lineIdSeq++}`,
        label: 'Transpose',
        nodes: [
          cell(`${a}x`), sym('='), cell(`${c}`), sym('-'), cell(`${b}`, 'eka', { pop: true }), sym('='), cell(`${c - b}`, 'res')
        ]
      }
    ],
    wires: [],
    flyers: []
  });

  // Frame 3
  const rhs = c - b;
  frames.push({
    cap: `Step 3: Divide by coefficient ${a}`,
    log: [['Equation', `${a}x + ${b} = ${c}`], ['Transpose', `Move ${b} to right side: ${a}x = ${c} - ${b}`], ['Divide', `x = ${rhs} ÷ ${a}`]],
    lines: [
      {
        id: `l-1`,
        label: 'Given',
        nodes: [
          cell(`${a}x`), sym('+'), cell(`${b}`), sym('='), cell(`${c}`)
        ],
        muted: true
      },
      {
        id: `l-2`,
        label: 'Transpose',
        nodes: [
          cell(`${a}x`), sym('='), cell(`${c}`), sym('-'), cell(`${b}`), sym('='), cell(`${rhs}`)
        ],
        muted: true
      },
      {
        id: `l-${lineIdSeq++}`,
        label: 'Divide',
        nodes: [
          cell('x'), sym('='), cell(`${rhs}`), sym('÷'), cell(`${a}`, 'eka', { pop: true })
        ]
      }
    ],
    wires: [],
    flyers: []
  });

  // Frame 4
  const x = rhs / a;
  frames.push({
    cap: `Step 4: Final answer`,
    log: [['Equation', `${a}x + ${b} = ${c}`], ['Transpose', `Move ${b} to right side: ${a}x = ${c} - ${b}`], ['Divide', `x = ${rhs} ÷ ${a}`], ['Answer', `x = ${x}`]],
    lines: [
      {
        id: `l-3`,
        label: 'Divide',
        nodes: [
          cell('x'), sym('='), cell(`${rhs}`), sym('÷'), cell(`${a}`)
        ],
        muted: true
      },
      {
        id: `l-${lineIdSeq++}`,
        label: 'Answer',
        nodes: [
          cell('x'), sym('='), cell(`${x}`, 'res', { pop: true })
        ]
      }
    ],
    wires: [],
    flyers: []
  });

  return {
    title: 'Paravartya Yojayet - Linear Equations',
    ruleHTML: 'Solve ax + b = c using Paravartya Yojayet (Transpose and Apply)',
    frames,
    note: 'Shows the step-by-step solution of linear equations.'
  };
}
