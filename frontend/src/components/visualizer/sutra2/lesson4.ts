import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

export function buildNikhilamDiv(p: any): LessonModel {
  const num = p.num || 1232;
  const den = p.den || 9;

  let base = 10;
  while (base <= den) base *= 10;
  const comp = base - den;
  const zeros = String(base).length - 1;

  const numStr = String(num);
  const totalDigits = numStr.length;
  const qLen = Math.max(1, totalDigits - zeros);
  const dividendDigits = numStr.split('').map(Number);
  
  // Track additions for each column
  const colAdditions: number[][] = Array.from({ length: totalDigits }, () => []);
  const rawQDigits: number[] = [];

  const frames: Frame[] = [];
  let lineIdSeq = 0;

  // Helper to render the board grid lines
  const renderBoardLines = (activeColIndex: number, showResultRow: boolean = false, showAdjRow: boolean = false, adjVal: number = 0, finalRVal: number = 0) => {
    const lines: LineDef[] = [];
    
    // Top setup line: Divisor & Complement | Dividend Digits
    const topNodes: LineNode[] = [
      cell(String(den), 'prev', { tag: 'divisor' }),
      cell(`(+${comp})`, 'eka', { tag: 'complement' }),
      sym('|')
    ];
    dividendDigits.forEach((d, i) => {
      if (i === qLen) topNodes.push(sym('|'));
      topNodes.push(cell(String(d), i < qLen ? 'prev' : 'tail', { tag: i === 0 ? 'dividend' : undefined }));
    });
    lines.push({ id: `top_${++lineIdSeq}`, label: 'setup', nodes: topNodes });

    // Carry additions lines under dividend
    const maxAdds = Math.max(...colAdditions.map(a => a.length), 0);
    for (let r = 0; r < maxAdds; r++) {
      const addNodes: LineNode[] = [sym(''), sym(''), sym('|')];
      dividendDigits.forEach((_, colIdx) => {
        if (colIdx === qLen) addNodes.push(sym('|'));
        const val = colAdditions[colIdx][r];
        if (val !== undefined) {
          addNodes.push(cell(`+${val}`, 'eka', { sm: true, pop: colIdx === activeColIndex }));
        } else {
          addNodes.push(cell('', ''));
        }
      });
      lines.push({ id: `add_row_${r}_${++lineIdSeq}`, label: r === 0 ? 'multiplier carries' : null, nodes: addNodes });
    }

    lines.push({ id: `div_${++lineIdSeq}`, label: null, nodes: [divider()] });

    // Result Row
    if (showResultRow) {
      const resNodes: LineNode[] = [cell('Q', 'res'), cell('R', 'tail'), sym('|')];
      rawQDigits.forEach((qd, i) => {
        resNodes.push(cell(String(qd), 'res', { pop: true }));
      });
      resNodes.push(sym('|'));
      
      // Remainder column sum
      let rawR = 0;
      for (let i = qLen; i < totalDigits; i++) {
        rawR += dividendDigits[i] + (colAdditions[i].reduce((a, b) => a + b, 0));
      }
      resNodes.push(cell(String(rawR), 'tail', { pop: true }));
      lines.push({ id: `res_${++lineIdSeq}`, label: 'result row', nodes: resNodes });

      if (showAdjRow && adjVal > 0) {
        let unadjustedPosQ = 0;
        for (let idx = 0; idx < rawQDigits.length; idx++) {
          const power = rawQDigits.length - 1 - idx;
          unadjustedPosQ += rawQDigits[idx] * Math.pow(10, power);
        }
        let finalQ = unadjustedPosQ + adjVal;
        lines.push({
          id: `adj_${++lineIdSeq}`, label: 'adjusted answer',
          nodes: [
            cell('Quotient = ' + finalQ, 'res', { pop: true }),
            sym('|'),
            cell('Remainder = ' + finalRVal, 'tail', { pop: true })
          ]
        });
      }
    }

    return lines;
  };

  // Frame 1: Setup & Partitioning
  frames.push({
    cap: `Divide <b>${num} ÷ ${den}</b>. Base = <b>${base}</b>, Complement = <b>+${comp}</b>. Grid partitioned at <b>${zeros}</b> remainder digit(s).`,
    log: [['1', `${num} ÷ ${den} (Base ${base}, Complement +${comp})`]],
    lines: renderBoardLines(-1),
    wires: [], flyers: []
  });

  // Step 2: Process columns left to right
  for (let i = 0; i < qLen; i++) {
    const origD = dividendDigits[i];
    const columnAdds = colAdditions[i];
    const sumAdds = columnAdds.reduce((a, b) => a + b, 0);
    const colSum = origD + sumAdds;
    rawQDigits.push(colSum);

    const prod = colSum * comp;

    // Add product under subsequent columns
    if (comp < 10) {
      if (i + 1 < totalDigits) {
        colAdditions[i + 1].push(prod);
      }
    } else {
      const prodDigits = String(prod).split('').map(Number);
      prodDigits.forEach((pDigit, pIdx) => {
        const targetCol = i + 1 + pIdx;
        if (targetCol < totalDigits) {
          colAdditions[targetCol].push(pDigit);
        }
      });
    }

    frames.push({
      cap: i === 0
        ? `<b>Column 1</b>: Bring down <b>${origD}</b> → Q-digit = <b>${colSum}</b>. Multiply: ${colSum} × (+${comp}) = <b>+${prod}</b> under Column 2.`
        : `<b>Column ${i + 1}</b>: Add column (${origD} + ${sumAdds}) = <b>${colSum}</b> → Q-digit = <b>${colSum}</b>. Multiply: ${colSum} × (+${comp}) = <b>+${prod}</b> under Column ${i + 2}.`,
      log: [[String(i + 2), `Col ${i + 1}: ${origD}${sumAdds ? '+' + sumAdds : ''} = ${colSum} → (${colSum} × +${comp} = ${prod})`]],
      lines: renderBoardLines(i + 1),
      wires: [], flyers: []
    });
  }

  // Calculate raw remainder and unadjusted quotient using place values
  let rawR = 0;
  for (let i = qLen; i < totalDigits; i++) {
    rawR += dividendDigits[i] + (colAdditions[i].reduce((a, b) => a + b, 0));
  }

  let unadjustedQ = 0;
  for (let idx = 0; idx < rawQDigits.length; idx++) {
    const power = rawQDigits.length - 1 - idx;
    unadjustedQ += rawQDigits[idx] * Math.pow(10, power);
  }

  frames.push({
    cap: `Sum Remainder Zone column → Remainder = <b>${rawR}</b>. Combine Quotient column place values → Quotient = <b>${unadjustedQ}</b>.`,
    log: [['R', `Quotient = ${unadjustedQ}, Remainder = ${rawR}`]],
    lines: renderBoardLines(-1, true),
    wires: [], flyers: []
  });

  // Remainder Adjustment frame if rawR >= den
  if (rawR >= den) {
    const extraQ = Math.floor(rawR / den);
    const finalR = rawR % den;
    const finalQ = unadjustedQ + extraQ;

    frames.push({
      cap: `Remainder <b>${rawR}</b> ≥ Divisor <b>${den}</b>! Adjust: ${rawR} ÷ ${den} = <b>${extraQ}</b> R <b>${finalR}</b>. Final Quotient: ${unadjustedQ} + ${extraQ} = <b>${finalQ}</b>.`,
      log: [
        ['adj', `Adjust: ${rawR} ÷ ${den} = ${extraQ} R ${finalR}`],
        ['sum', `Final Answer: ${num} ÷ ${den} = ${finalQ} R ${finalR}`]
      ],
      lines: renderBoardLines(-1, true, true, extraQ, finalR),
      wires: [], flyers: []
    });
  } else {
    frames.push({
      cap: `Remainder <b>${rawR}</b> < Divisor <b>${den}</b>. Done! <b>${num} ÷ ${den} = ${unadjustedQ} R ${rawR}</b>.`,
      log: [['sum', `Final Answer: ${num} ÷ ${den} = ${unadjustedQ} R ${rawR}`]],
      lines: renderBoardLines(-1, true),
      wires: [], flyers: []
    });
  }

  return {
    title: 'Nikhilam Lesson 4 – Division Near the Base',
    ruleHTML: 'Use complement addition instead of long division.',
    frames,
    note: `Divisor ${den}, Base ${base}, Complement +${comp}`
  };
}
