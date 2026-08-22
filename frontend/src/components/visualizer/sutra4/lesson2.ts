import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

/**
 * Helper to format polynomial from coefficients
 * e.g. [1, 5, 6] -> 'x² + 5x + 6'
 */
function formatPoly(coeffs: number[]): string {
  if (coeffs.length === 0) return '0';
  let str = '';
  const degree = coeffs.length - 1;
  for (let i = 0; i <= degree; i++) {
    const c = coeffs[i];
    if (c === 0) continue;
    
    const power = degree - i;
    const sign = c > 0 ? (str ? ' + ' : '') : (str ? ' − ' : '-');
    const absC = Math.abs(c);
    
    let termStr = '';
    if (power === 0) {
      termStr = `${absC}`;
    } else if (power === 1) {
      termStr = `${absC === 1 ? '' : absC}x`;
    } else {
      const supers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
      const powStr = power.toString().split('').map(d => supers[parseInt(d)]).join('');
      termStr = `${absC === 1 ? '' : absC}x${powStr}`;
    }
    str += `${sign}${termStr}`;
  }
  return str || '0';
}

/**
 * Helper to format term power indicator above coefficient column
 * e.g. power 2 -> 'x²', power 1 -> 'x', power 0 -> '1'
 */
function formatPowerLabel(power: number): string {
  if (power === 0) return '1';
  if (power === 1) return 'x';
  const supers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
  const powStr = power.toString().split('').map(d => supers[parseInt(d)]).join('');
  return `x${powStr}`;
}

/**
 * Algebraic Polynomial Division using Paravartya Yojayet (synthetic division)
 */
export function buildParavartyaTwo(p: any): LessonModel {
  const coeffs: number[] = p.coeffs || [1, 5, 6];
  const divisorK: number = p.divisorK !== undefined ? p.divisorK : 2;

  const flag = -divisorK;
  const totalDigits = coeffs.length;
  const degree = totalDigits - 1;
  const qLen = Math.max(1, totalDigits - 1); // Last column is remainder

  const placed: (number | null)[] = new Array(totalDigits).fill(null);
  const results: (number | null)[] = new Array(totalDigits).fill(null);

  const polyDiv = formatPoly(coeffs);
  const polyDivisor = `x ${divisorK >= 0 ? '+' : '−'} ${Math.abs(divisorK)}`;

  const frames: Frame[] = [];
  const log: string[][] = [];

  const renderBoard = (
    activeCol: number,
    highlightType: 'none' | 'drop' | 'multiply' | 'add',
    showFinal: boolean = false,
    finalQ: number[] = [],
    finalR: number = 0
  ): LineDef[] => {
    const lines: LineDef[] = [];
    let lid = 0;

    // Row 1: Problem Expression & Transposed Flag
    lines.push({
      id: `l${lid++}`,
      label: 'problem',
      nodes: [
        cell(`(${polyDiv}) ÷ (${polyDivisor})`, 'prev', { id: 'cell_expr' }),
        sym('|'),
        cell(`Flag: ${flag > 0 ? '+' : ''}${flag}`, 'eka', { tag: 'transpose' })
      ]
    });
    
    // Row 2: Term Powers (x², x, 1) above each column
    const termNodes: LineNode[] = [cell('Terms:', 'prev'), sym('|')];
    coeffs.forEach((_, i) => {
      if (i === qLen) termNodes.push(sym('|'));
      const power = degree - i;
      termNodes.push(cell(formatPowerLabel(power), 'prev', { sm: true }));
    });
    lines.push({ id: `l${lid++}`, label: 'terms', nodes: termNodes });

    // Row 3: Coeffs
    const topNodes: LineNode[] = [cell('Coeffs:', 'prev'), sym('|')];
    coeffs.forEach((c, i) => {
      if (i === qLen) topNodes.push(sym('|'));
      const isActive = (i === activeCol && highlightType === 'add') ||
                       (i === activeCol && highlightType === 'drop');
      topNodes.push(cell(String(c), isActive ? 'eka' : (i < qLen ? 'prev' : 'tail'), {
        id: `top_${i}`,
        pop: isActive
      }));
    });
    lines.push({ id: `l${lid++}`, label: 'coeffs', nodes: topNodes });

    // Row 4: Placed products
    const flagNodes: LineNode[] = [cell('Placed:', 'prev'), sym('|')];
    coeffs.forEach((_, i) => {
      if (i === qLen) flagNodes.push(sym('|'));
      if (placed[i] !== null) {
        const isActive = (i === activeCol && highlightType === 'multiply');
        flagNodes.push(cell(String(placed[i]), 'eka', {
          id: `placed_${i}`,
          pop: isActive
        }));
      } else {
        flagNodes.push(cell('', 'prev'));
      }
    });
    lines.push({ id: `l${lid++}`, label: 'placed', nodes: flagNodes });

    // Divider
    lines.push({ id: `l${lid++}`, label: null, nodes: [divider()] });

    // Row 5: Results
    const resNodes: LineNode[] = [cell('Result:', 'res'), sym('|')];
    coeffs.forEach((_, i) => {
      if (i === qLen) resNodes.push(sym('|'));
      if (results[i] !== null) {
        const isActive = (i === activeCol &&
          (highlightType === 'drop' || highlightType === 'add'));
        resNodes.push(cell(String(results[i]), i < qLen ? 'res' : 'tail', {
          id: `res_${i}`,
          pop: isActive
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
          cell(`Quotient = ${formatPoly(finalQ)}`, 'res', { id: 'final_q', pop: true }),
          sym('|'),
          cell(`Remainder = ${finalR}`, 'tail', { id: 'final_r', pop: true })
        ]
      });
    }

    return lines;
  };

  /* ═══════════════════════  FRAME 0: SETUP  ═══════════════════════ */
  frames.push({
    cap: `<b>Setup: (${polyDiv}) ÷ (${polyDivisor})</b><br/>` +
      `• Write down the dividend coefficients: <b>[${coeffs.join(', ')}]</b> for powers <b>[${coeffs.map((_, i) => formatPowerLabel(degree - i)).join(', ')}]</b>.<br/>` +
      `• Transpose constant of divisor: ${polyDivisor} → Flag = <b>${flag > 0 ? '+' : ''}${flag}</b>.<br/>` +
      `• Remainder zone: last column (power 0 / constant term).`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: renderBoard(-1, 'none')
  });
  log.push(['Setup', `(${polyDiv}) ÷ (${polyDivisor}), Flag = ${flag > 0 ? '+' : ''}${flag}`]);

  /* ═══════════════════════  STEP: DROP FIRST COEFFICIENT  ═══════════════ */
  results[0] = coeffs[0];

  frames.push({
    cap: `<b>Drop first coefficient:</b> Bring down the coefficient of <b>${formatPowerLabel(degree)}</b> → <b>${coeffs[0]}</b>.`,
    log: [...log],
    wires: [
      { fromKey: 'top_0', toKey: 'res_0', color: '#6366f1' }
    ],
    flyers: [],
    lines: renderBoard(0, 'drop')
  });
  log.push(['Drop', `Bring down ${coeffs[0]}`]);

  /* ═══════════════════════  COLUMN-BY-COLUMN  ═════════════════════ */
  for (let col = 1; col < totalDigits; col++) {
    const prevResult = results[col - 1]!;
    const product = prevResult * flag;

    // Sub-step A: MULTIPLY previous result by flag
    placed[col] = product;

    const multiplyLabel = col === 1 ? 'First' : col === 2 ? 'Second' : col === 3 ? 'Third' : `${col}th`;

    frames.push({
      cap: `<b>${multiplyLabel} multiply:</b> ${prevResult} × (${flag > 0 ? '+' : ''}${flag}) = <b>${product}</b> under <b>${formatPowerLabel(degree - col)}</b> column.`,
      log: [...log],
      wires: [
        { fromKey: `res_${col - 1}`, toKey: `placed_${col}`, color: '#f59e0b' }
      ],
      flyers: [],
      lines: renderBoard(col, 'multiply')
    });
    log.push([`Multiply`, `${prevResult} × (${flag > 0 ? '+' : ''}${flag}) = ${product}`]);

    // Sub-step B: ADD coefficient + placed product
    const colResult = coeffs[col] + product;
    results[col] = colResult;

    const isRemainderCol = col === qLen;
    const stepLabel = isRemainderCol ? 'Remainder add' :
                      col === 1 ? 'First add' :
                      col === 2 ? 'Second add' : `${col}th add`;

    frames.push({
      cap: `<b>${stepLabel}:</b> ${coeffs[col]} + (${product}) = <b>${colResult}</b>` +
        (isRemainderCol ? ` (Remainder term)` : ` (Quotient coefficient for ${formatPowerLabel(degree - col - 1)})`),
      log: [...log],
      wires: [
        { fromKey: `top_${col}`, toKey: `res_${col}`, color: '#6366f1' },
        { fromKey: `placed_${col}`, toKey: `res_${col}`, color: '#f59e0b' }
      ],
      flyers: [],
      lines: renderBoard(col, 'add')
    });
    log.push([stepLabel, `${coeffs[col]} + (${product}) = ${colResult}`]);
  }

  /* ═══════════════════════  FINAL ANSWER  ═════════════════════ */
  const finalQ = results.slice(0, qLen) as number[];
  const finalR = results[results.length - 1] as number;

  const formattedQ = formatPoly(finalQ);

  log.push(['sum', `(${polyDiv}) ÷ (${polyDivisor}) = ${formattedQ} remainder ${finalR}`]);

  const lastFrameLog = [...log];

  frames.push({
    cap: `<b>Final Answer:</b><br/>` +
      `• Quotient coefficients: [${finalQ.join(', ')}] → <b>${formattedQ}</b><br/>` +
      `• Remainder: <b>${finalR}</b><br/>` +
      `<b>(${polyDiv}) ÷ (${polyDivisor}) = ${formattedQ} remainder ${finalR}</b>`,
    log: lastFrameLog,
    wires: [],
    flyers: [],
    lines: renderBoard(-1, 'none', true, finalQ, finalR)
  });

  return {
    title: 'Algebraic Polynomial Division (Paravartya Yojayet)',
    ruleHTML:
      `<b>Synthetic Division:</b><br/>` +
      `1. Write down the coefficients of the dividend polynomial.<br/>` +
      `2. Transpose the sign of the constant in the divisor (flag).<br/>` +
      `3. Bring down the first coefficient.<br/>` +
      `4. Repeat: <em>Multiply by flag → Add to next coefficient</em>.<br/>` +
      `5. Convert quotient coefficients back into a polynomial.`,
    frames,
    note: `Using Paravartya Yojayet (Transpose and Apply). (${polyDiv}) ÷ (${polyDivisor}) → Flag is ${flag > 0 ? '+' : ''}${flag}.`
  };
}
