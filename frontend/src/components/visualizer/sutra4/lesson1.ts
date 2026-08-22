import type { LessonModel, Frame, LineDef, LineNode, WireDef } from '../types';
import { cell, sym, divider } from '../helpers';

/**
 * Paravartya Yojayet – Division Above a Base Power of 10
 *
 * Textbook steps (e.g. 1352 ÷ 12):
 *   Setup:  Divisor=12, Transpose=−2, Dividend= 1 3 5 | 2
 *   Drop 1 → Multiply 1×(−2)=−2 → Add 3+(−2)=1
 *           → Multiply 1×(−2)=−2 → Add 5+(−2)=3
 *           → Multiply 3×(−2)=−6 → Add 2+(−6)=−4
 *   Adjust: Q=113−1=112, R=−4+12=8
 */
export function buildParavartyaSingle(p: any): LessonModel {
  const num = parseInt(p.num || '1352', 10);
  const den = parseInt(p.den || '12', 10);

  const base = Math.pow(10, den.toString().length - 1);
  const excess = den - base;
  const flag = -excess;
  const baseZeros = den.toString().length - 1;

  const numStr = String(num);
  const dividendDigits = numStr.split('').map(Number);
  const totalDigits = dividendDigits.length;
  const qLen = Math.max(1, totalDigits - baseZeros);

  // Track what is placed under each column (flag products)
  const placed: (number | null)[] = new Array(totalDigits).fill(null);
  // Track computed column results
  const results: (number | null)[] = new Array(totalDigits).fill(null);

  const frames: Frame[] = [];
  const log: string[][] = [];
  let lid = 0;

  /* ═══════════════════════  BOARD RENDERER  ═══════════════════════ */
  const renderBoard = (
    activeCol: number,
    highlightType: 'none' | 'drop' | 'multiply' | 'add',
    showFinal: boolean = false,
    finalQ: number = 0,
    finalR: number = 0
  ): LineDef[] => {
    const lines: LineDef[] = [];

    // ── Row 1: Divisor | Dividend digits separated by | for remainder zone ──
    const topNodes: LineNode[] = [
      cell(String(den), 'prev', { id: 'cell_den' }),
      sym('|')
    ];
    dividendDigits.forEach((d, i) => {
      if (i === qLen) topNodes.push(sym('|'));
      const isActive = (i === activeCol && highlightType === 'add') ||
                       (i === activeCol && highlightType === 'drop');
      topNodes.push(cell(String(d), isActive ? 'eka' : 'prev', {
        id: `top_${i}`,
        pop: isActive
      }));
    });
    lines.push({ id: `l${lid++}`, label: null, nodes: topNodes });

    // ── Row 2: Transpose (flag) | placed products ──
    const flagNodes: LineNode[] = [
      cell(`(${flag > 0 ? '+' : ''}${flag})`, 'eka', { id: 'cell_flag', tag: 'transpose' }),
      sym('|')
    ];
    dividendDigits.forEach((_, i) => {
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
    lines.push({ id: `l${lid++}`, label: null, nodes: flagNodes });

    // ── Divider ──
    lines.push({ id: `l${lid++}`, label: null, nodes: [divider()] });

    // ── Row 3: Results row ──
    const resNodes: LineNode[] = [cell('', 'prev'), sym('|')];
    dividendDigits.forEach((_, i) => {
      if (i === qLen) resNodes.push(sym('|'));
      if (results[i] !== null) {
        const isActive = (i === activeCol &&
          (highlightType === 'drop' || highlightType === 'add'));
        resNodes.push(cell(String(results[i]), 'res', {
          id: `res_${i}`,
          pop: isActive
        }));
      } else {
        resNodes.push(cell('', 'prev'));
      }
    });
    lines.push({ id: `l${lid++}`, label: null, nodes: resNodes });

    // ── Final answer row ──
    if (showFinal) {
      lines.push({
        id: `l${lid++}`, label: null,
        nodes: [
          cell(`Quotient = ${finalQ}`, 'res', { id: 'final_q', pop: true }),
          sym(','),
          cell(`Remainder = ${finalR}`, 'res', { id: 'final_r', pop: true })
        ]
      });
    }

    return lines;
  };

  /* ═══════════════════════  FRAME 0: SETUP  ═══════════════════════ */
  frames.push({
    cap: `<b>Setup: ${num} ÷ ${den}</b><br/>` +
      `• Divisor = <b>${den}</b>, Base = <b>${base}</b><br/>` +
      `• Transpose: change sign of excess (${excess}) → Flag = <b>${flag > 0 ? '+' : ''}${flag}</b><br/>` +
      `• Split dividend: <b>${dividendDigits.slice(0, qLen).join('  ')}</b> | <b>${dividendDigits.slice(qLen).join('  ')}</b> (last ${baseZeros} digit(s) for remainder)`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: renderBoard(-1, 'none')
  });
  log.push(['Setup', `${num} ÷ ${den}, Transpose = ${flag > 0 ? '+' : ''}${flag}`]);

  /* ═══════════════════════  STEP: DROP FIRST DIGIT  ═══════════════ */
  results[0] = dividendDigits[0];

  frames.push({
    cap: `<b>Drop first digit:</b> Bring down the <b>${dividendDigits[0]}</b>.`,
    log: [...log],
    wires: [
      { fromKey: 'top_0', toKey: 'res_0', color: '#6366f1' }
    ],
    flyers: [],
    lines: renderBoard(0, 'drop')
  });
  log.push(['Drop', `Bring down ${dividendDigits[0]}`]);

  /* ═══════════════════════  COLUMN-BY-COLUMN  ═════════════════════ */
  for (let col = 1; col < totalDigits; col++) {
    const prevResult = results[col - 1]!;
    const product = prevResult * flag;
    const isLastQ = col === qLen - 1;
    const isRemainder = col >= qLen;

    // ── Sub-step A: MULTIPLY previous result by flag ──
    placed[col] = product;

    const multiplyLabel = col === 1 ? 'First' : col === 2 ? 'Second' : col === 3 ? 'Third' : `${col}th`;

    frames.push({
      cap: `<b>${multiplyLabel} multiply:</b> ${prevResult} × (${flag > 0 ? '+' : ''}${flag}) = <b>${product}</b>`,
      log: [...log],
      wires: [
        { fromKey: `res_${col - 1}`, toKey: `placed_${col}`, color: '#f59e0b' }
      ],
      flyers: [],
      lines: renderBoard(col, 'multiply')
    });
    log.push([`Multiply`, `${prevResult} × (${flag > 0 ? '+' : ''}${flag}) = ${product}`]);

    // ── Sub-step B: ADD dividend digit + placed product ──
    const colResult = dividendDigits[col] + product;
    results[col] = colResult;

    const addLabel = col < totalDigits - 1
      ? `${dividendDigits[col]} + (${product}) = <b>${colResult}</b>`
      : `${dividendDigits[col]} + (${product}) = <b>${colResult}</b>`;

    const stepLabel = col === totalDigits - 1 ? 'Final add' :
                      col === 1 ? 'First add' :
                      col === 2 ? 'Second add' :
                      col === 3 ? 'Third add' : `${col}th add`;

    frames.push({
      cap: `<b>${stepLabel}:</b> ${addLabel}`,
      log: [...log],
      wires: [
        { fromKey: `top_${col}`, toKey: `res_${col}`, color: '#6366f1' },
        { fromKey: `placed_${col}`, toKey: `res_${col}`, color: '#f59e0b' }
      ],
      flyers: [],
      lines: renderBoard(col, 'add')
    });
    log.push([stepLabel, `${dividendDigits[col]} + (${product}) = ${colResult}`]);
  }

  /* ═══════════════════════  FINAL ADJUSTMENT  ═════════════════════ */
  // Compute raw Q and R from results
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

  const needsAdjust = rawR < 0 || rawR >= den;

  if (needsAdjust) {
    if (rawR < 0) {
      // Borrow from quotient
      const borrow = Math.ceil(Math.abs(rawR) / den);
      finalQ = rawQ - borrow;
      finalR = rawR + borrow * den;

      log.push(['Adjust', `Q = ${rawQ}, R = ${rawR} (negative!)`]);
      log.push(['Adjust', `Borrow ${borrow} from quotient: Q = ${rawQ} − ${borrow} = ${finalQ}`]);
      log.push(['Adjust', `Fix remainder: ${rawR} + ${borrow * den} = ${finalR}`]);

      frames.push({
        cap: `<b>Final Adjustment</b><br/>` +
          `• Initial: Quotient = <b>${rawQ}</b>, Remainder = <b>${rawR}</b>.<br/>` +
          `• Remainder is negative! Borrow 1 from quotient.<br/>` +
          `• Adjust quotient: ${rawQ} − ${borrow} = <b>${finalQ}</b><br/>` +
          `• Adjust remainder: ${rawR} + ${den} = <b>${finalR}</b>`,
        log: [...log],
        wires: [],
        flyers: [],
        lines: renderBoard(-1, 'none', true, finalQ, finalR)
      });
    } else {
      // Remainder >= divisor
      const extra = Math.floor(rawR / den);
      finalQ = rawQ + extra;
      finalR = rawR % den;

      log.push(['Adjust', `R = ${rawR} ≥ ${den}. Divide: ${rawR} ÷ ${den} = ${extra} R ${finalR}`]);

      frames.push({
        cap: `<b>Final Adjustment</b><br/>` +
          `• Initial: Quotient = <b>${rawQ}</b>, Remainder = <b>${rawR}</b>.<br/>` +
          `• Remainder ≥ divisor! Divide: ${rawR} ÷ ${den} = ${extra} R ${finalR}.<br/>` +
          `• Final Quotient: ${rawQ} + ${extra} = <b>${finalQ}</b>`,
        log: [...log],
        wires: [],
        flyers: [],
        lines: renderBoard(-1, 'none', true, finalQ, finalR)
      });
    }
  }

  // Final answer
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
    // Update the last frame's log with the sum entry
    const lastFrame = frames[frames.length - 1];
    lastFrame.log = [...log];
  }

  return {
    title: 'Division Above a Base Power of 10 (Paravartya Yojayet)',
    ruleHTML:
      `<b>Transpose and Apply:</b><br/>` +
      `1. Find the base (power of 10 just below the divisor).<br/>` +
      `2. Transpose: negate the excess → this is your flag.<br/>` +
      `3. Split the dividend into Quotient zone | Remainder zone.<br/>` +
      `4. Drop the first digit. Then repeat: <em>multiply by flag → add to next column</em>.`,
    frames,
    note: `Divisor ${den} = ${base} + ${excess}. Transpose = ${flag > 0 ? '+' : ''}${flag}.`
  };
}
