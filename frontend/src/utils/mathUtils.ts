import { type Problem } from '../api/practice';

// Generate multiple choice options (answer + 3 distractors)
export const generateMCQOptions = (answerStr: string): string[] => {
  const ansVal = parseInt(answerStr, 10);
  if (isNaN(ansVal)) {
    return [answerStr, answerStr + '.5', '0.1428', 'None of the above'].sort(() => Math.random() - 0.5);
  }

  const set = new Set<string>();
  set.add(answerStr);

  const offsets = [10, -10, 100, -100, 5, -5, 20, -20, 1, 2, 3];
  offsets.sort(() => Math.random() - 0.5);

  for (const offset of offsets) {
    const val = ansVal + offset;
    if (val > 0 && val !== ansVal) {
      set.add(val.toString());
      if (set.size === 4) break;
    }
  }

  while (set.size < 4) {
    set.add((ansVal + set.size + 2).toString());
  }

  return Array.from(set).sort(() => Math.random() - 0.5);
};

// Local expression solver to find expected answer for options generation
export const solveProblemLocally = (questionText: string): number => {
  const clean = questionText.replace(/×/g, '*').replace(/x/g, '*').replace(/=/g, '').replace(/\?/g, '').trim();
  if (clean.includes('²') || clean.includes('^2')) {
    const num = parseInt(clean.replace('²', '').replace('^2', '').trim(), 10);
    return isNaN(num) ? 0 : num * num;
  }
  if (clean.includes('*')) {
    const parts = clean.split('*');
    const num1 = parseInt(parts[0].trim(), 10);
    const num2 = parseInt(parts[1].trim(), 10);
    if (!isNaN(num1) && !isNaN(num2)) {
      return num1 * num2;
    }
  }
  return 0;
};

// Parse digits for the Urdhva Tiryagbhyam grid helper
export const parseUrdhvaDigits = (problem: Problem | null) => {
  if (!problem) return null;
  const qText = problem.questionText || '';
  if (!qText.includes('×') && !qText.includes('x') && !qText.includes('*')) {
    return null;
  }
  const match = qText.match(/(\d+)\s*[×x*]\s*(\d+)/i);
  if (match) {
    return {
      num1Digits: match[1].split('').map(Number),
      num2Digits: match[2].split('').map(Number),
    };
  }
  return null;
};

// Parse multiplication/squaring problem string for digit grid visualization
export const parseDigitGrid = (problem: string): { num1Digits: number[]; num2Digits: number[] } | null => {
  try {
    if (problem.includes('²')) {
      const num = parseInt(problem.replace('²', '').trim(), 10);
      if (isNaN(num)) return null;
      const digits = num.toString().split('').map(Number);
      return { num1Digits: digits, num2Digits: digits };
    }
    const match = problem.match(/(\d+)\s*[×x*]\s*(\d+)/i);
    if (match) {
      return {
        num1Digits: match[1].split('').map(Number),
        num2Digits: match[2].split('').map(Number),
      };
    }
    return null;
  } catch {
    return null;
  }
};

// Parse Sutra 1 (Ekadhikena) squaring/multiplication problem into LHS and RHS parts
export const parseSutra1Problem = (problemStr: string): { lhs: string; rhs1: string; rhs2: string; power: number } | null => {
  let num1 = 0;
  let num2 = 0;
  if (problemStr.includes('²')) {
    const num = parseInt(problemStr.replace('²', '').trim(), 10);
    if (!isNaN(num)) {
      num1 = num;
      num2 = num;
    }
  } else if (problemStr.includes('^2')) {
    const num = parseInt(problemStr.replace('^2', '').trim(), 10);
    if (!isNaN(num)) {
      num1 = num;
      num2 = num;
    }
  } else {
    const match = problemStr.match(/(\d+)\s*[×x*]\s*(\d+)/i);
    if (match) {
      num1 = parseInt(match[1], 10);
      num2 = parseInt(match[2], 10);
    }
  }

  if (num1 > 0 && num2 > 0) {
    const s1 = num1.toString();
    const s2 = num2.toString();
    
    for (let n = 1; n < s1.length; n++) {
      const rhs1 = parseInt(s1.slice(-n), 10);
      const rhs2 = parseInt(s2.slice(-n), 10);
      const lhs1 = s1.slice(0, -n);
      const lhs2 = s2.slice(0, -n);
      if (lhs1 === lhs2 && (rhs1 + rhs2 === Math.pow(10, n))) {
        return {
          lhs: lhs1,
          rhs1: rhs1.toString().padStart(n, '0'),
          rhs2: rhs2.toString().padStart(n, '0'),
          power: n
        };
      }
    }
    const len = s1.length;
    if (len > 1) {
      return {
        lhs: s1.slice(0, -1),
        rhs1: s1.slice(-1),
        rhs2: s2.slice(-1),
        power: 1
      };
    }
  }
  return null;
};

// Expert pedagogical classification for Vedic Mathematics Sutras
export const getDifficulty = (index: number): 'Easy' | 'Medium' | 'Hard' => {
  if (index <= 5) return 'Easy';
  if (index <= 10) return 'Medium';
  return 'Hard';
};

// Parse Sutra 2 (Nikhilam) problem for complement visualization
export const parseSutra2Problem = (problem: string): {
  type: 'subtraction' | 'multiplication' | null;
  base: number;
  num1: number;
  num2?: number;
  deficiency1?: number;
  deficiency2?: number;
} | null => {
  try {
    // Subtraction: "1000 - 387"
    const subMatch = problem.match(/(\d+)\s*[-−]\s*(\d+)/);
    if (subMatch) {
      const base = parseInt(subMatch[1], 10);
      const num = parseInt(subMatch[2], 10);
      // Check if base is a power of 10
      if (base > 0 && Math.log10(base) % 1 === 0 && num < base) {
        return { type: 'subtraction', base, num1: num };
      }
    }
    // Multiplication: "94 × 92"
    const mulMatch = problem.match(/(\d+)\s*[×x*]\s*(\d+)/i);
    if (mulMatch) {
      const num1 = parseInt(mulMatch[1], 10);
      const num2 = parseInt(mulMatch[2], 10);
      // Find closest base
      const maxNum = Math.max(num1, num2);
      let base = 10;
      while (base < maxNum) base *= 10;
      // Check if both are near this base (within 50%)
      if (Math.abs(num1 - base) < base / 2 && Math.abs(num2 - base) < base / 2) {
        return {
          type: 'multiplication',
          base,
          num1,
          num2,
          deficiency1: base - num1,
          deficiency2: base - num2,
        };
      }
    }
    return null;
  } catch {
    return null;
  }
};

// Format caret notation to superscripts (e.g., x^2 -> x², (x+1)^3 -> (x+1)³)
export const formatSuperscripts = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\^4/g, '⁴')
    .replace(/\^5/g, '⁵')
    .replace(/\^x/g, 'ˣ')
    .replace(/\^y/g, 'ʸ')
    .replace(/\^n/g, 'ⁿ');
};

