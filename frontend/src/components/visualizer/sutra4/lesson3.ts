import type { LessonModel, Frame, LineDef, LineNode, WireDef } from '../types';
import { cell, sym, divider } from '../helpers';

/**
 * Paravartya Yojayet – Multi-digit Divisor Division
 *
 * For divisors like 121, 112, 103, 1003 etc.
 * The excess has multiple digits → flag is multi-digit (negated).
 * Each dropped quotient digit multiplies by ALL flag digits,
 * and products are placed diagonally across consecutive columns.
 *
 * Example: 1234 ÷ 121
 *   Base = 100, Excess = 21, Flag = (−2, −1)
 *   Split: 12 | 34
 *   Drop 1 → multiply 1×(−2,−1) = −2,−1 → place under cols 2,3
 *   Col 2: 2+(−2)=0 → multiply 0×(−2,−1) = 0,0 → place under cols 3,4
 *   Col 3 (rem): 3+(−1)+0 = 2
 *   Col 4 (rem): 4+0 = 4
 *   Q = 10, R = 24
 */
export function buildParavartyaLarge(p: any): LessonModel {
  const num = parseInt(p.num || '1234', 10);
  const den = parseInt(p.den || '121', 10);

  const base = Math.pow(10, den.toString().length - 1);
  const excess = den - base;
  const baseZeros = den.toString().length - 1;

  // Build multi-digit flag (negate each digit of excess, padded to baseZeros length)
  const excessStr = excess.toString().padStart(baseZeros, '0');
  const flagDigits: number[] = excessStr.split('').map((ch: string) => -parseInt(ch, 10));

  const numStr = String(num);
  const dividendDigits = numStr.split('').map(Number);
  const totalDigits = dividendDigits.length;
  const qLen = Math.max(1, totalDigits - baseZeros);

  // Track placed products per column (multiple rows possible)
  const colProducts: number[][] = Array.from({ length: totalDigits }, () => []);
  // Track column results
  const results: (number | null)[] = new Array(totalDigits).fill(null);

  const frames: Frame[] = [];
  const log: string[][] = [];

  const flagStr = flagDigits.map(f => (f <= 0 ? String(f) : `+${f}`)).join(', ');

  /* ═══════════════════════  BOARD RENDERER  ═══════════════════════ */
  const renderBoard = (
    activeCol: number,
    highlightType: 'none' | 'drop' | 'multiply' | 'add',
    showFinal: boolean = false,
    finalQ: number = 0,
    finalR: number = 0
  ): LineDef[] => {
    const lines: LineDef[] = [];
    let lid = 0; // Reset lid for stable element IDs across re-renders

    // Row 1: Problem Expression Header
    lines.push({
      id: `l${lid++}`,
      label: 'problem',
      nodes: [
        cell(`Problem: ${num} ÷ ${den}`, 'prev', { id: 'cell_expr' }),
        sym('|'),
        cell(`Flag: (${flagStr})`, 'eka', { tag: 'transpose' })
      ]
    });

    // Row 2: Divisor | Dividend digits with | separator for remainder zone
    const topNodes: LineNode[] = [
      cell(String(den), 'prev', { id: 'cell_den' }),
      sym('|')
    ];
    dividendDigits.forEach((d, i) => {
      if (i === qLen) topNodes.push(sym('|'));
      const isActive = (i === activeCol && (highlightType === 'add' || highlightType === 'drop'));
      topNodes.push(cell(String(d), isActive ? 'eka' : (i < qLen ? 'prev' : 'tail'), {
        id: `top_${i}`, pop: isActive
      }));
    });
    lines.push({ id: `l${lid++}`, label: 'setup', nodes: topNodes });

    // Rows 3+: Flag product rows (multiple rows for diagonal placement)
    const maxRows = Math.max(...colProducts.map(a => a.length), 1);
    for (let r = 0; r < maxRows; r++) {
      const rowNodes: LineNode[] = [
        r === 0 ? cell(`(${flagStr})`, 'eka', { id: 'cell_flag', tag: 'flag', sm: true }) : cell('', 'prev'),
        sym('|')
      ];
      dividendDigits.forEach((_, i) => {
        if (i === qLen) rowNodes.push(sym('|'));
        const val = colProducts[i][r];
        if (val !== undefined) {
          const isActive = (i === activeCol && highlightType === 'multiply');
          rowNodes.push(cell(String(val), 'eka', {
            id: `placed_${i}_${r}`, pop: isActive
          }));
        } else {
          rowNodes.push(cell('', 'prev'));
        }
      });
      lines.push({ id: `l${lid++}`, label: `products_${r}`, nodes: rowNodes });
    }

    // Divider
    lines.push({ id: `l${lid++}`, label: null, nodes: [divider()] });

    // Result row
    const resNodes: LineNode[] = [cell('Totals', 'res'), sym('|')];
    dividendDigits.forEach((_, i) => {
      if (i === qLen) resNodes.push(sym('|'));
      if (results[i] !== null) {
        const isActive = (i === activeCol && (highlightType === 'drop' || highlightType === 'add'));
        resNodes.push(cell(String(results[i]), i < qLen ? 'res' : 'tail', {
          id: `res_${i}`, pop: isActive
        }));
      } else {
        resNodes.push(cell('', 'prev'));
      }
    });
    lines.push({ id: `l${lid++}`, label: 'results', nodes: resNodes });

    // Final answer row
    if (showFinal) {
      lines.push({
        id: `l${lid++}`, label: 'final answer',
        nodes: [
          cell(`Quotient = ${finalQ}`, 'res', { id: 'final_q', pop: true }),
          sym('|'),
          cell(`Remainder = ${finalR}`, 'tail', { id: 'final_r', pop: true })
        ]
      });
    }

    return lines;
  };

  /* ═══════════════════════  FRAME 0: SETUP  ═══════════════════════ */
  frames.push({
    cap: `<b>Setup: ${num} ÷ ${den}</b><br/>` +
      `• Base = <b>${base}</b>, Excess = <b>${excess}</b><br/>` +
      `• Transposed Flag = <b>(${flagStr})</b> (negate each digit of excess)<br/>` +
      `• Split dividend: <b>${dividendDigits.slice(0, qLen).join('  ')}</b> | <b>${dividendDigits.slice(qLen).join('  ')}</b> (last ${baseZeros} digit(s) for remainder)`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: renderBoard(-1, 'none')
  });
  log.push(['Setup', `${num} ÷ ${den}. Base ${base}, Flag (${flagStr})`]);

  /* ═══════════════════════  STEP: DROP FIRST DIGIT  ═══════════════ */
  results[0] = dividendDigits[0];

  frames.push({
    cap: `<b>Drop first digit:</b> Bring down <b>${dividendDigits[0]}</b>.`,
    log: [...log],
    wires: [{ fromKey: 'top_0', toKey: 'res_0', color: '#6366f1' }],
    flyers: [],
    lines: renderBoard(0, 'drop')
  });
  log.push(['Drop', `Bring down ${dividendDigits[0]}`]);

  /* ═══════════════════════  COLUMN-BY-COLUMN  ═════════════════════ */
  // First, place the products from the first dropped digit
  for (let f = 0; f < flagDigits.length; f++) {
    const tgt = 1 + f;
    if (tgt < totalDigits) {
      colProducts[tgt].push(dividendDigits[0] * flagDigits[f]);
    }
  }

  // Show multiply frame for first digit
  {
    const products = flagDigits.map((fd, f) => {
      const tgt = 1 + f;
      return tgt < totalDigits ? `${dividendDigits[0] * fd}` : null;
    }).filter(x => x !== null);

    const wires: WireDef[] = [];
    for (let f = 0; f < flagDigits.length; f++) {
      const tgt = 1 + f;
      if (tgt < totalDigits) {
        wires.push({ fromKey: 'res_0', toKey: `placed_${tgt}_${colProducts[tgt].length - 1}`, color: '#f59e0b' });
      }
    }

    frames.push({
      cap: `<b>First multiply:</b> ${dividendDigits[0]} × (${flagStr}) = <b>${products.join(', ')}</b>. Place diagonally across next columns.`,
      log: [...log],
      wires,
      flyers: [],
      lines: renderBoard(0, 'multiply')
    });
    log.push(['Multiply', `${dividendDigits[0]} × (${flagStr}) = ${products.join(', ')}`]);
  }

  // Process remaining quotient columns
  for (let col = 1; col < qLen; col++) {
    // ADD: sum the column
    const addedProducts = colProducts[col].reduce((a, b) => a + b, 0);
    const colResult = dividendDigits[col] + addedProducts;
    results[col] = colResult;

    const addLabel = col === 1 ? 'First add' : col === 2 ? 'Second add' : col === 3 ? 'Third add' : `${col}th add`;
    const productsStr = colProducts[col].map(v => `(${v >= 0 ? '+' : ''}${v})`).join(' + ');

    frames.push({
      cap: `<b>${addLabel}:</b> ${dividendDigits[col]} + ${productsStr} = <b>${colResult}</b>`,
      log: [...log],
      wires: [
        { fromKey: `top_${col}`, toKey: `res_${col}`, color: '#6366f1' }
      ],
      flyers: [],
      lines: renderBoard(col, 'add')
    });
    log.push([addLabel, `${dividendDigits[col]} + ${productsStr} = ${colResult}`]);

    // MULTIPLY: place products from this result into future columns
    for (let f = 0; f < flagDigits.length; f++) {
      const tgt = col + 1 + f;
      if (tgt < totalDigits) {
        colProducts[tgt].push(colResult * flagDigits[f]);
      }
    }

    const products = flagDigits.map((fd, f) => {
      const tgt = col + 1 + f;
      return tgt < totalDigits ? `${colResult * fd}` : null;
    }).filter(x => x !== null);

    if (products.length > 0) {
      const multiplyLabel = col === 1 ? 'Second multiply' : col === 2 ? 'Third multiply' : `${col + 1}th multiply`;
      const wires: WireDef[] = [];
      for (let f = 0; f < flagDigits.length; f++) {
        const tgt = col + 1 + f;
        if (tgt < totalDigits) {
          wires.push({ fromKey: `res_${col}`, toKey: `placed_${tgt}_${colProducts[tgt].length - 1}`, color: '#f59e0b' });
        }
      }

      frames.push({
        cap: `<b>${multiplyLabel}:</b> ${colResult} × (${flagStr}) = <b>${products.join(', ')}</b>. Place diagonally.`,
        log: [...log],
        wires,
        flyers: [],
        lines: renderBoard(col, 'multiply')
      });
      log.push([multiplyLabel, `${colResult} × (${flagStr}) = ${products.join(', ')}`]);
    }
  }

  // Process remainder columns (just add, no multiply)
  for (let col = qLen; col < totalDigits; col++) {
    const addedProducts = colProducts[col].reduce((a, b) => a + b, 0);
    const colResult = dividendDigits[col] + addedProducts;
    results[col] = colResult;

    const productsStr = colProducts[col].length > 0
      ? colProducts[col].map(v => `(${v >= 0 ? '+' : ''}${v})`).join(' + ')
      : '0';

    frames.push({
      cap: `<b>Remainder column ${col - qLen + 1}:</b> ${dividendDigits[col]} + ${productsStr} = <b>${colResult}</b>`,
      log: [...log],
      wires: [{ fromKey: `top_${col}`, toKey: `res_${col}`, color: '#ec4899' }],
      flyers: [],
      lines: renderBoard(col, 'add')
    });
    log.push([`Rem col ${col - qLen + 1}`, `${dividendDigits[col]} + ${productsStr} = ${colResult}`]);
  }

  /* ═══════════════════════  FINAL ADJUSTMENT  ═════════════════════ */
  let rawQ = 0;
  for (let i = 0; i < qLen; i++) {
    rawQ += results[i]! * Math.pow(10, qLen - 1 - i);
  }
  let rawR = 0;
  for (let i = qLen; i < totalDigits; i++) {
    rawR += results[i]! * Math.pow(10, totalDigits - 1 - i);
  }

  let finalQ = rawQ;
  let finalR = rawR;

  if (finalR < 0) {
    const borrow = Math.ceil(Math.abs(finalR) / den);
    finalQ -= borrow;
    finalR += borrow * den;
  }
  if (finalR >= den) {
    const extra = Math.floor(finalR / den);
    finalQ += extra;
    finalR = finalR % den;
  }

  const needsAdjust = rawR < 0 || rawR >= den;

  if (needsAdjust) {
    log.push(['Adjust', `Raw Q=${rawQ}, R=${rawR} → Final Q=${finalQ}, R=${finalR}`]);
    frames.push({
      cap: `<b>Adjustment:</b> Raw Q=${rawQ}, R=${rawR}.` +
        (rawR < 0 ? ` Remainder negative → borrow from quotient.` : ` Remainder ≥ divisor → divide.`) +
        `<br/><b>Final: Quotient = ${finalQ}, Remainder = ${finalR}</b>`,
      log: [...log],
      wires: [],
      flyers: [],
      lines: renderBoard(-1, 'none', true, finalQ, finalR)
    });
  }

  log.push(['sum', `${num} ÷ ${den} = ${finalQ} remainder ${finalR}`]);

  if (!needsAdjust) {
    frames.push({
      cap: `<b>Final Answer: ${num} ÷ ${den} = ${finalQ} remainder ${finalR}</b>`,
      log: [...log],
      wires: [],
      flyers: [],
      lines: renderBoard(-1, 'none', true, finalQ, finalR)
    });
  } else {
    frames[frames.length - 1].log = [...log];
  }

  return {
    title: 'Multi-digit Divisor Division (Paravartya Yojayet)',
    ruleHTML:
      `<b>Multi-digit Transposed Flag Division:</b><br/>` +
      `1. Base = nearest power of 10 below divisor. Excess = divisor − base.<br/>` +
      `2. Negate each digit of excess → multi-digit flag.<br/>` +
      `3. Each dropped quotient digit multiplies by ALL flag digits, placed diagonally.<br/>` +
      `4. Sum each column sequentially.`,
    frames,
    note: `Divisor ${den} = ${base} + ${excess}. Flag = (${flagStr}). Remainder zone = ${baseZeros} digit(s).`
  };
}
