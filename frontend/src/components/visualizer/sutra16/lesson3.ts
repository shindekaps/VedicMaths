import type { LessonModel, Frame, LineDef, LineNode } from '../types';
import { cell, sym, divider } from '../helpers';

/**
 * Sutra 16 Lesson 3 – Verification of Solutions (Gunakasamuccayah)
 *
 * Verifies the algebraic equation (ax + b)(cx + d) = px² + qx + r
 * using the rule: Product of coefficient sums of factors = coefficient sum of product.
 */
export function buildGunakaVerify(p: any): LessonModel {
  const a = p.a !== undefined ? p.a : 2;
  const b = p.b !== undefined ? p.b : 1;
  const c = p.c !== undefined ? p.c : 1;
  const d = p.d !== undefined ? p.d : 2;

  // Calculate coefficients of the expanded quadratic equation: px² + qx + r
  const coeffA = a * c;             // coefficient of x²
  const coeffB = a * d + b * c;     // coefficient of x
  const coeffC = b * d;             // constant term

  // LHS terms
  const factor1Str = `(${a}x ${b >= 0 ? '+' : '−'} ${Math.abs(b)})`;
  const factor2Str = `(${c}x ${d >= 0 ? '+' : '−'} ${Math.abs(d)})`;
  const lhsStr = `${factor1Str}${factor2Str}`;

  // RHS terms
  const rhsStr = `${coeffA}x² ${coeffB >= 0 ? '+' : '−'} ${Math.abs(coeffB)}x ${coeffC >= 0 ? '+' : '−'} ${Math.abs(coeffC)}`;

  const title = 'Verification of Solutions (Gunakasamuccayah)';
  const ruleHTML = 
    `<b>Gunakasamuccayah:</b><br/>` +
    `The product of the sum of the coefficients of the factors is equal to the sum of the coefficients of the product.`;

  const frames: Frame[] = [];
  const log: string[][] = [];
  let lid = 0;

  // ── Frame 1: Setup ──────────────────────────────────────────────────────
  frames.push({
    cap: `Proposed Equation to Verify: <b>${lhsStr} = ${rhsStr}</b>`,
    log: [...log],
    wires: [],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: 'LHS', nodes: [cell(lhsStr, 'prev', { id: 'setup_lhs' })] },
      { id: `l${lid++}`, label: 'RHS', nodes: [cell(rhsStr, 'prev', { id: 'setup_rhs' })] }
    ]
  });
  log.push(['Setup', `Verify: ${lhsStr} = ${rhsStr}`]);

  // ── Frame 2: LHS sum of coefficients ────────────────────────────────────
  const sum1 = a + b;
  const sum2 = c + d;
  const lhsProduct = sum1 * sum2;

  frames.push({
    cap: `<b>LHS Coefficient Sum (substitute x = 1):</b><br/>` +
      `• Factor 1 sum: ${a} + (${b}) = <b>${sum1}</b><br/>` +
      `• Factor 2 sum: ${c} + (${d}) = <b>${sum2}</b><br/>` +
      `• Product of sums: ${sum1} × ${sum2} = <b>${lhsProduct}</b>`,
    log: [...log],
    wires: [{ fromKey: 'setup_lhs', toKey: 'lhs_val', color: '#6366f1' }],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: 'LHS Sum', nodes: [
        cell(`(${a} + ${b}) × (${c} + ${d})`, 'prev'),
        sym('='),
        cell(`${sum1} × ${sum2}`, 'prev'),
        sym('='),
        cell(String(lhsProduct), 'res', { id: 'lhs_val', pop: true })
      ]}
    ]
  });
  log.push(['LHS Sum', `(${a} + ${b}) × (${c} + ${d}) = ${lhsProduct}`]);

  // ── Frame 3: RHS sum of coefficients ────────────────────────────────────
  const rhsSum = coeffA + coeffB + coeffC;

  frames.push({
    cap: `<b>RHS Coefficient Sum (substitute x = 1):</b><br/>` +
      `• Sum coefficients: ${coeffA} + (${coeffB}) + (${coeffC}) = <b>${rhsSum}</b>`,
    log: [...log],
    wires: [{ fromKey: 'setup_rhs', toKey: 'rhs_val', color: '#f59e0b' }],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: 'LHS Sum', nodes: [cell(String(lhsProduct), 'prev')] },
      { id: `l${lid++}`, label: 'RHS Sum', nodes: [
        cell(`${coeffA} + ${coeffB} + ${coeffC}`, 'prev'),
        sym('='),
        cell(String(rhsSum), 'res', { id: 'rhs_val', pop: true })
      ]}
    ]
  });
  log.push(['RHS Sum', `${coeffA} + ${coeffB} + ${coeffC} = ${rhsSum}`]);

  // ── Frame 4: Compare & Verify ───────────────────────────────────────────
  const isMatch = lhsProduct === rhsSum;
  log.push(['sum', isMatch 
    ? `LHS (${lhsProduct}) = RHS (${rhsSum}) ➜ Verification Successful!`
    : `LHS (${lhsProduct}) ≠ RHS (${rhsSum}) ➜ Verification Failed!`
  ]);

  frames.push({
    cap: isMatch 
      ? `<b>Verification Successful!</b><br/>LHS sum (<b>${lhsProduct}</b>) equals RHS sum (<b>${rhsSum}</b>). The factorization is correct!`
      : `<b>Verification Failed!</b><br/>LHS sum (<b>${lhsProduct}</b>) does not equal RHS sum (<b>${rhsSum}</b>). Check the factorization!`,
    log: [...log],
    wires: [
      { fromKey: 'lhs_val', toKey: 'final_lhs', color: '#10b981' },
      { fromKey: 'rhs_val', toKey: 'final_rhs', color: '#10b981' }
    ],
    flyers: [],
    lines: [
      { id: `l${lid++}`, label: 'LHS', nodes: [cell(String(lhsProduct), 'res', { id: 'final_lhs' })] },
      { id: `l${lid++}`, label: 'RHS', nodes: [cell(String(rhsSum), 'res', { id: 'final_rhs' })] },
      { id: `l${lid++}`, label: 'Status', nodes: [cell(isMatch ? 'VERIFIED' : 'FAILED', isMatch ? 'res' : 'tail', { pop: true })] }
    ]
  });

  return {
    title,
    ruleHTML,
    frames,
    note: `Using Gunakasamuccayah (Product of coefficient sums = Coefficient sum of product).`
  };
}
