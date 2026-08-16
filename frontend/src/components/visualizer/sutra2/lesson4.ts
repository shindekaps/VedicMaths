import type { LessonModel, Frame, LineDef, LineNode, WireDef } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildNikhilamDiv(p: any): LessonModel {
  const num = p.num || 345;
  const den = p.den || 6;

  // Calculate Base dynamically: 10, 100, 1000, etc.
  let base = 10;
  while (base <= den) base *= 10;
  const comp = base - den;
  const zeros = String(base).length - 1; // number of remainder digits

  const numStr = String(num);
  const totalDigits = numStr.length;
  const qLen = Math.max(1, totalDigits - zeros);
  const dividendDigits = numStr.split('').map(Number);

  // Track product additions per column
  const colProducts: number[][] = Array.from({ length: totalDigits }, () => []);
  const rawQDigits: number[] = [];

  const frames: Frame[] = [];
  let lineIdSeq = 0;

  // Generic Board Renderer dynamically supporting ANY divisor, base, and dividend
  const renderBoard = (
    stepIndex: number,
    showResultRow: boolean = false,
    showBalancing: boolean = false,
    balancedQ: number = 0,
    showFinalAdj: boolean = false,
    extraQ: number = 0,
    finalR: number = 0
  ) => {
    const lines: LineDef[] = [];

    // Line 1: Divisor & Complement | Dividend digits (with vertical separator for Remainder zone)
    const setupNodes: LineNode[] = [
      cell(String(den), 'prev', { id: 'cell_divisor', tag: 'divisor' }),
      sym('|')
    ];
    dividendDigits.forEach((d, i) => {
      if (i === qLen) setupNodes.push(sym('|'));
      setupNodes.push(cell(String(d), i < qLen ? 'prev' : 'tail', { id: `div_digit_${i}`, tag: i === 0 ? 'dividend' : undefined }));
    });
    lines.push({ id: `setup_${++lineIdSeq}`, label: 'setup', nodes: setupNodes });

    // Multiplier Products rows
    const maxAdds = Math.max(...colProducts.map(a => a.length), 1);
    for (let r = 0; r < maxAdds; r++) {
      const rowNodes: LineNode[] = [
        r === 0 ? cell(`(+${comp})`, 'eka', { id: 'cell_comp', tag: 'complement' }) : cell('', ''),
        sym('|')
      ];
      dividendDigits.forEach((_, colIdx) => {
        if (colIdx === qLen) rowNodes.push(sym('|'));
        const val = colProducts[colIdx][r];
        if (val !== undefined) {
          rowNodes.push(cell(String(val), 'eka', { id: `add_${colIdx}_${r}`, pop: true }));
        } else {
          rowNodes.push(cell('', ''));
        }
      });
      lines.push({ id: `prod_row_${r}_${++lineIdSeq}`, label: r === 0 ? 'carries' : null, nodes: rowNodes });
    }

    lines.push({ id: `div_${++lineIdSeq}`, label: null, nodes: [divider()] });

    // Line 3: Column Totals Row (Unbalanced Quotient digits | Unbalanced Remainder)
    if (showResultRow) {
      const resNodes: LineNode[] = [cell('Totals', 'res'), sym('|')];
      dividendDigits.forEach((_, colIdx) => {
        if (colIdx === qLen) resNodes.push(sym('|'));
        if (colIdx < qLen) {
          if (rawQDigits[colIdx] !== undefined) {
            resNodes.push(cell(String(rawQDigits[colIdx]), 'res', { id: `raw_q_${colIdx}`, pop: stepIndex === colIdx }));
          } else {
            resNodes.push(cell('', ''));
          }
        } else {
          let colRemSum = dividendDigits[colIdx] + (colProducts[colIdx].reduce((a, b) => a + b, 0));
          resNodes.push(cell(String(colRemSum), 'tail', { id: `raw_r_${colIdx}`, pop: stepIndex === totalDigits }));
        }
      });
      lines.push({ id: `res_${++lineIdSeq}`, label: 'unbalanced totals', nodes: resNodes });
    }

    // Line 4: Balanced Quotient Row
    if (showBalancing) {
      const balNodes: LineNode[] = [
        cell('Balanced Q', 'res'),
        sym('='),
        cell(String(balancedQ), 'res', { id: 'bal_q', pop: true })
      ];
      lines.push({ id: `bal_${++lineIdSeq}`, label: 'balanced quotient', nodes: balNodes });
    }

    // Line 5: Final Answer Row
    if (showFinalAdj) {
      const finalQ = balancedQ + extraQ;
      lines.push({
        id: `adj_${++lineIdSeq}`, label: 'final answer',
        nodes: [
          cell(`Final Quotient = ${balancedQ} + ${extraQ} = ${finalQ}`, 'res', { id: 'final_q', pop: true }),
          sym('|'),
          cell(`Final Remainder = ${finalR}`, 'tail', { id: 'final_r', pop: true })
        ]
      });
    }

    return lines;
  };

  // Step 0: Setup
  frames.push({
    cap: `Divide <b>${num} ÷ ${den}</b>.<br/>• Base = <b>${base}</b>, Complement = <b>+${comp}</b> (${base} - ${den}).<br/>• Base has ${zeros} zero(s) → partition last ${zeros} digit(s) for Remainder.`,
    log: [['0', `Setup: ${num} ÷ ${den} (Base ${base}, Complement +${comp})`]],
    lines: renderBoard(-1),
    wires: [],
    flyers: []
  });

  // Step 1: Bring down 1st quotient digit
  const firstD = dividendDigits[0];
  rawQDigits.push(firstD);
  const p1 = firstD * comp;
  colProducts[1].push(p1);

  frames.push({
    cap: `<b>Step 1: Bring down first digit</b><br/>• Bring down <b>${firstD}</b> directly into Quotient.<br/>• Multiply by complement: ${firstD} × (+${comp}) = <b>${p1}</b> under Column 2.`,
    log: [['1', `Bring down ${firstD} → Multiply: ${firstD} × (+${comp}) = ${p1}`]],
    lines: renderBoard(0, true),
    wires: [
      { fromKey: 'div_digit_0', toKey: 'raw_q_0', color: '#6366f1' },
      { fromKey: 'raw_q_0', toKey: 'add_1_0', color: '#f59e0b' }
    ],
    flyers: []
  });

  // Step 2: Loop through remaining Quotient columns
  for (let i = 1; i < qLen; i++) {
    const origD = dividendDigits[i];
    const columnAdds = colProducts[i];
    const sumAdds = columnAdds.reduce((a, b) => a + b, 0);
    const colSum = origD + sumAdds;
    rawQDigits.push(colSum);

    const prod = colSum * comp;
    if (i + 1 < totalDigits) {
      colProducts[i + 1].push(prod);
    }

    const wires: WireDef[] = [
      { fromKey: `div_digit_${i}`, toKey: `raw_q_${i}`, color: '#6366f1' },
      { fromKey: `raw_q_${i}`, toKey: `add_${i + 1}_${colProducts[i + 1].length - 1}`, color: '#f59e0b' }
    ];

    frames.push({
      cap: `<b>Step ${i + 1}: Multiply and add for Column ${i + 1}</b><br/>• Add column: ${origD} + ${sumAdds} = <b>${colSum}</b>.<br/>• Multiply by complement: ${colSum} × (+${comp}) = <b>${prod}</b> under next column.`,
      log: [[String(i + 1), `Col ${i + 1}: ${origD}${sumAdds ? ' + ' + sumAdds : ''} = ${colSum} → Multiply: ${colSum} × (+${comp}) = ${prod}`]],
      lines: renderBoard(i, true),
      wires,
      flyers: []
    });
  }

  // Step 3: Compute Remainder zone totals
  let rawR = 0;
  const remColDetails: string[] = [];
  for (let i = qLen; i < totalDigits; i++) {
    const colSum = dividendDigits[i] + colProducts[i].reduce((a, b) => a + b, 0);
    const power = totalDigits - 1 - i;
    rawR += colSum * Math.pow(10, power);
    remColDetails.push(String(colSum));
  }

  frames.push({
    cap: `<b>Step 3: Sum Remainder Column(s)</b><br/>• Remainder zone totals = <b>${remColDetails.join(' | ')}</b> → Initial Remainder = <b>${rawR}</b>.<br/>• Raw column totals: <b>Quotient = ${rawQDigits.join(' | ')}</b>, <b>Remainder = ${rawR}</b>.`,
    log: [['3', `Unbalanced Totals: Quotient = ${rawQDigits.join(' | ')}, Remainder = ${rawR}`]],
    lines: renderBoard(totalDigits, true),
    wires: [
      { fromKey: `div_digit_${totalDigits - 1}`, toKey: `raw_r_${totalDigits - 1}`, color: '#ec4899' }
    ],
    flyers: []
  });

  // Balancing Quotient (e.g., 3 | 16 in Base 10 -> 46, or for 1 | 23 -> 123)
  let balancedQ = 0;
  for (let idx = 0; idx < rawQDigits.length; idx++) {
    const power = rawQDigits.length - 1 - idx;
    balancedQ += rawQDigits[idx] * Math.pow(10, power);
  }

  const needsBalancing = rawQDigits.some((d, idx) => d >= 10 && idx > 0);
  frames.push({
    cap: needsBalancing
      ? `<b>Balancing Step 1: Balance Quotient Digits</b><br/>• Column digits exceed single place value! For <b>${rawQDigits.join(' | ')}</b>:<br/>• Carry tens place leftwards → Temporary Quotient = <b>${balancedQ}</b>.`
      : `<b>Balancing Step 1: Balance Quotient</b><br/>• Quotient digits <b>${rawQDigits.join(' | ')}</b> form Quotient = <b>${balancedQ}</b>.`,
    log: [['bal', `Balance Quotient: ${rawQDigits.join(' | ')} → ${balancedQ}`]],
    lines: renderBoard(-1, true, true, balancedQ),
    wires: [
      { fromKey: `raw_q_${rawQDigits.length - 1}`, toKey: 'bal_q', color: '#6366f1' }
    ],
    flyers: []
  });

  // Remainder Adjustment (if initial remainder >= divisor)
  if (rawR >= den) {
    const extraQ = Math.floor(rawR / den);
    const finalR = rawR % den;
    const finalQ = balancedQ + extraQ;

    frames.push({
      cap: `<b>Balancing Step 2 & 3: Correct Remainder & Final Combine</b><br/>• Remainder <b>${rawR}</b> ≥ Divisor <b>${den}</b>!<br/>• Divide remainder by divisor: ${rawR} ÷ ${den} = <b>${extraQ}</b> with remainder <b>${finalR}</b>.<br/>• Add extra quotient: ${balancedQ} + ${extraQ} = <b>${finalQ}</b>.<br/>• <b>Final Answer: Quotient = ${finalQ}, Remainder = ${finalR}</b>.`,
      log: [
        ['adj', `Correct Remainder: ${rawR} ÷ ${den} = ${extraQ} R ${finalR}`],
        ['sum', `Final Answer: Quotient = ${finalQ}, Remainder = ${finalR}`]
      ],
      lines: renderBoard(-1, true, true, balancedQ, true, extraQ, finalR),
      wires: [
        { fromKey: `raw_r_${totalDigits - 1}`, toKey: 'final_r', color: '#10b981' },
        { fromKey: 'bal_q', toKey: 'final_q', color: '#10b981' }
      ],
      flyers: []
    });
  } else {
    frames.push({
      cap: `<b>Final Check</b>: Remainder <b>${rawR}</b> < Divisor <b>${den}</b>.<br/><b>Final Answer: Quotient = ${balancedQ}, Remainder = ${rawR}</b>.`,
      log: [['sum', `Final Answer: Quotient = ${balancedQ}, Remainder = ${rawR}`]],
      lines: renderBoard(-1, true, true, balancedQ, true, 0, rawR),
      wires: [
        { fromKey: `raw_r_${totalDigits - 1}`, toKey: 'final_r', color: '#10b981' },
        { fromKey: 'bal_q', toKey: 'final_q', color: '#10b981' }
      ],
      flyers: []
    });
  }

  return {
    title: 'Nikhilam Lesson 4 – Division Near the Base',
    ruleHTML: 'Use complement addition instead of long division.',
    frames,
    note: `Divisor ${den}, Base ${base}, Complement +${comp}`
  };
}
