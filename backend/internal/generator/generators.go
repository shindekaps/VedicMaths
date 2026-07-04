package generator

import (
	"fmt"
	"math/rand"

	"vedicpath/internal/domain"
)

type genFunc func(difficulty int) domain.Problem

// Registry maps sutraID -> generator. Register() at init time.
var Registry = map[int]genFunc{
	1:  genSutra1,
	2:  genSutra2,
	3:  genSutra3,
	4:  genSutra4,
	5:  genSutra5,
	6:  genSutra6,
	7:  genSutra7,
	8:  genSutra8,
	9:  genSutra9,
	10: genSutra10,
	11: genSutra11,
	12: genSutra12,
	13: genSutra13,
	14: genSutra14,
	15: genSutra15,
	16: genSutra16,
}

func sortPair(a, b int) (int, int) {
	if a > b {
		return b, a
	}
	return a, b
}

func difficultyFromMagnitude(n int) int {
	switch {
	case n < 100:
		return 1
	case n < 1000:
		return 2
	case n < 10000:
		return 3
	default:
		return 4
	}
}

// clampDifficulty maps the caller's requested 1-5 difficulty onto the
// generator's internal magnitude ranges. Each generator interprets this
// loosely to widen/narrow its number range.
func rangeForDifficulty(difficulty int) (lo, hi int) {
	switch {
	case difficulty <= 1:
		return 10, 99
	case difficulty == 2:
		return 100, 999
	case difficulty == 3:
		return 1000, 9999
	default:
		return 10000, 99999
	}
}

// ---------- Sutra 1: Ekadhikena Purvena (squaring numbers ending in 5) ----------
func genSutra1(difficulty int) domain.Problem {
	_, hi := rangeForDifficulty(difficulty)
	if hi > 99995 {
		hi = 99995
	}
	tens := rand.Intn(hi/10) + 1
	num := tens*10 + 5
	ans := num * num
	return domain.Problem{
		SutraID:      1,
		QuestionText: fmt.Sprintf("%d^2", num),
		Difficulty:   difficultyFromMagnitude(num),
		DedupKey:     fmt.Sprintf("s1:%d", num),
		Answer:       ans,
		SolutionSteps: []string{
			fmt.Sprintf("Number ends in 5: split as %d | 5", tens),
			fmt.Sprintf("Left part: %d x (%d+1) = %d", tens, tens, tens*(tens+1)),
			"Right part: always 25",
			fmt.Sprintf("Answer: %d", ans),
		},
	}
}

// ---------- Sutra 2: Nikhilam (multiplication near a base) ----------
func genSutra2(difficulty int) domain.Problem {
	bases := []int{10, 100, 1000, 10000}
	base := bases[rand.Intn(len(bases))]
	span := base / 10
	if span < 1 {
		span = 1
	}
	a := base - (rand.Intn(span) + 1)
	b := base - (rand.Intn(span) + 1)
	da, db := base-a, base-b
	left := a - db
	digits := len(fmt.Sprintf("%d", base)) - 1
	right := da * db
	ans := left*pow10(digits) + right
	lo, hi := sortPair(a, b)
	return domain.Problem{
		SutraID:      2,
		QuestionText: fmt.Sprintf("%d x %d", a, b),
		Difficulty:   difficultyFromMagnitude(base),
		DedupKey:     fmt.Sprintf("s2:%d:%d", lo, hi),
		Answer:       ans,
		SolutionSteps: []string{
			fmt.Sprintf("Base = %d", base),
			fmt.Sprintf("Deficit of %d = %d-%d = %d", a, base, a, da),
			fmt.Sprintf("Deficit of %d = %d-%d = %d", b, base, b, db),
			fmt.Sprintf("Left: %d - %d = %d", a, db, left),
			fmt.Sprintf("Right: %d x %d = %d", da, db, right),
			fmt.Sprintf("Answer: %d", ans),
		},
	}
}

// ---------- Sutra 3: Urdhva-Tiryagbhyam (general multiplication) ----------
func genSutra3(difficulty int) domain.Problem {
	digitsOptions := []int{2, 2, 2, 3, 3, 4}
	digits := digitsOptions[rand.Intn(len(digitsOptions))]
	if difficulty >= 3 {
		digits = 3 + rand.Intn(2)
	}
	lo10, hi10 := pow10(digits-1), pow10(digits)-1
	a := lo10 + rand.Intn(hi10-lo10+1)
	b := lo10 + rand.Intn(hi10-lo10+1)
	ans := a * b
	lo, hi := sortPair(a, b)
	return domain.Problem{
		SutraID:      3,
		QuestionText: fmt.Sprintf("%d x %d", a, b),
		Difficulty:   min(5, digits),
		DedupKey:     fmt.Sprintf("s3:%d:%d", lo, hi),
		Answer:       ans,
		SolutionSteps: []string{
			"Multiply digits vertically and crosswise (Urdhva-Tiryagbhyam)",
			fmt.Sprintf("Answer: %d", ans),
		},
	}
}

// ---------- Sutra 4: Paravartya Yojayet (division near a base) ----------
func genSutra4(difficulty int) domain.Problem {
	divisors := []int{9, 11, 12, 13, 19, 21, 88, 89, 91, 111, 999, 1001, 98, 102}
	d := divisors[rand.Intn(len(divisors))]
	dividend := d*3 + rand.Intn(d*996)
	q, r := dividend/d, dividend%d
	return domain.Problem{
		SutraID:      4,
		QuestionText: fmt.Sprintf("%d / %d", dividend, d),
		Difficulty:   difficultyFromMagnitude(dividend),
		DedupKey:     fmt.Sprintf("s4:%d:%d", dividend, d),
		Answer:       map[string]int{"quotient": q, "remainder": r},
		SolutionSteps: []string{
			fmt.Sprintf("Use Paravartya Yojayet (transpose and apply) to divide by %d", d),
			fmt.Sprintf("Quotient = %d, Remainder = %d", q, r),
		},
	}
}

// ---------- Sutra 5: Shunyam Saamyasamuccaye ----------
func genSutra5(difficulty int) domain.Problem {
	s := 6 + rand.Intn(75)
	a := 1 + rand.Intn(s-1)
	b := s - a
	c := 1 + rand.Intn(s-1)
	d := s - c
	x := float64(s) / 2
	loAB, hiAB := sortPair(a, b)
	loCD, hiCD := sortPair(c, d)
	return domain.Problem{
		SutraID:      5,
		QuestionText: fmt.Sprintf("1/(x-%d) + 1/(x-%d) = 1/(x-%d) + 1/(x-%d)", a, b, c, d),
		Difficulty:   3,
		DedupKey:     fmt.Sprintf("s5:%d:%d:%d:%d", loAB, hiAB, loCD, hiCD),
		Answer:       x,
		SolutionSteps: []string{
			fmt.Sprintf("Check: %d+%d = %d+%d = %d", a, b, c, d, s),
			"By Shunyam Saamyasamuccaye, since the sums match, x = sum / 2",
			fmt.Sprintf("x = %d/2 = %v", s, x),
		},
	}
}

// ---------- Sutra 6: Anurupye Shunyamanyat ----------
func genSutra6(difficulty int) domain.Problem {
	a := 1 + rand.Intn(12)
	b := 1 + rand.Intn(60)
	if rand.Intn(2) == 0 {
		b = -b
	}
	root2 := -float64(b) / float64(a)
	return domain.Problem{
		SutraID:      6,
		QuestionText: fmt.Sprintf("%dx^2 + %dx = 0", a, b),
		Difficulty:   2,
		DedupKey:     fmt.Sprintf("s6:%d:%d", a, b),
		Answer:       []float64{0, root2},
		SolutionSteps: []string{
			fmt.Sprintf("Factor: x(%dx + %d) = 0", a, b),
			"By Anurupye Shunyamanyat, since the constant term is zero, one root is x = 0",
			fmt.Sprintf("Other root: %dx + %d = 0 -> x = %v", a, b, root2),
		},
	}
}

// ---------- Sutra 7: Sankalana-Vyavakalanabhyam (simultaneous equations) ----------
func genSutra7(difficulty int) domain.Problem {
	for {
		x := -20 + rand.Intn(41)
		y := -20 + rand.Intn(41)
		if x == 0 && y == 0 {
			continue
		}
		a1, b1 := 1+rand.Intn(9), 1+rand.Intn(9)
		a2, b2 := 1+rand.Intn(9), 1+rand.Intn(9)
		if a1*b2 == a2*b1 {
			continue
		}
		c1, c2 := a1*x+b1*y, a2*x+b2*y
		return domain.Problem{
			SutraID:      7,
			QuestionText: fmt.Sprintf("%dx + %dy = %d; %dx + %dy = %d", a1, b1, c1, a2, b2, c2),
			Difficulty:   3,
			DedupKey:     fmt.Sprintf("s7:%d:%d:%d:%d:%d:%d", a1, b1, c1, a2, b2, c2),
			Answer:       map[string]int{"x": x, "y": y},
			SolutionSteps: []string{
				"Add or subtract suitable multiples of the equations to eliminate a variable (Sankalana-Vyavakalanabhyam)",
				fmt.Sprintf("Solution: x = %d, y = %d", x, y),
			},
		}
	}
}

// ---------- Sutra 8: Puranapuranabhyam (completing the square) ----------
func genSutra8(difficulty int) domain.Problem {
	b := 0
	for b == 0 {
		b = -150 + rand.Intn(301)
	}
	half := float64(b) / 2
	add := half * half
	return domain.Problem{
		SutraID:      8,
		QuestionText: fmt.Sprintf("x^2 + %dx + ___ = (x + %v)^2", b, half),
		Difficulty:   3,
		DedupKey:     fmt.Sprintf("s8:%d", b),
		Answer:       add,
		SolutionSteps: []string{
			fmt.Sprintf("Take half of the coefficient of x: %d/2 = %v", b, half),
			fmt.Sprintf("Square it: (%v)^2 = %v", half, add),
			fmt.Sprintf("x^2 + %dx + %v = (x + %v)^2", b, add, half),
		},
	}
}

// ---------- Sutra 9: Chalanakalanabhyam (repeated root via derivative) ----------
func genSutra9(difficulty int) domain.Problem {
	a := 0
	for a == 0 {
		a = -200 + rand.Intn(401)
	}
	b, c := -2*a, a*a
	return domain.Problem{
		SutraID:      9,
		QuestionText: fmt.Sprintf("x^2 + %dx + %d = 0", b, c),
		Difficulty:   4,
		DedupKey:     fmt.Sprintf("s9:%d", a),
		Answer:       a,
		SolutionSteps: []string{
			fmt.Sprintf("Differentiate: 2x + %d = 0 (Chalanakalanabhyam: differential method)", b),
			fmt.Sprintf("x = %d/2 = %d", -b, a),
			"This is the repeated root of the perfect-square trinomial",
		},
	}
}

// ---------- Sutra 10: Yaavadunam (squaring near a base) ----------
func genSutra10(difficulty int) domain.Problem {
	bases := []int{10, 100, 1000, 10000}
	base := bases[rand.Intn(len(bases))]
	span := base / 10
	if span < 1 {
		span = 1
	}
	dev := 1 + rand.Intn(span)
	sign := 1
	if rand.Intn(2) == 0 {
		sign = -1
	}
	num := base + sign*dev
	ans := num * num
	return domain.Problem{
		SutraID:      10,
		QuestionText: fmt.Sprintf("%d^2", num),
		Difficulty:   difficultyFromMagnitude(base),
		DedupKey:     fmt.Sprintf("s10:%d", num),
		Answer:       ans,
		SolutionSteps: []string{
			fmt.Sprintf("Base = %d, deviation = %d", base, sign*dev),
			"Adjust by the deviation and apply Yaavadunam (whatever the deficiency) rule",
			fmt.Sprintf("Answer: %d", ans),
		},
	}
}

// ---------- Sutra 11: Vyashtisamashtih (factorization) ----------
func genSutra11(difficulty int) domain.Problem {
	p, q := 0, 0
	for p == 0 {
		p = -20 + rand.Intn(41)
	}
	for q == 0 {
		q = -20 + rand.Intn(41)
	}
	b, c := p+q, p*q
	lo, hi := sortPair(p, q)
	return domain.Problem{
		SutraID:      11,
		QuestionText: fmt.Sprintf("x^2 + %dx + %d", b, c),
		Difficulty:   3,
		DedupKey:     fmt.Sprintf("s11:%d:%d", lo, hi),
		Answer:       fmt.Sprintf("(x + %d)(x + %d)", p, q),
		SolutionSteps: []string{
			fmt.Sprintf("Find two numbers whose sum = %d and product = %d", b, c),
			fmt.Sprintf("Numbers are %d and %d", p, q),
			fmt.Sprintf("Factorized form: (x + %d)(x + %d)", p, q),
		},
	}
}

// ---------- Sutra 12: Shesanyankena Caramena (remainder / divisibility) ----------
func genSutra12(difficulty int) domain.Problem {
	divisors := []int{7, 11, 13, 17, 19, 23, 29, 31, 37}
	d := divisors[rand.Intn(len(divisors))]
	num := 100 + rand.Intn(999900)
	rem := num % d
	return domain.Problem{
		SutraID:      12,
		QuestionText: fmt.Sprintf("Find the remainder when %d is divided by %d", num, d),
		Difficulty:   4,
		DedupKey:     fmt.Sprintf("s12:%d:%d", num, d),
		Answer:       rem,
		SolutionSteps: []string{
			fmt.Sprintf("Apply the Shesanyankena Caramena (last-digit remainder / osculator) technique for divisor %d", d),
			fmt.Sprintf("Remainder = %d", rem),
		},
	}
}

// ---------- Sutra 13: Sopaantyadvayamantyam (special quadratics) ----------
func genSutra13(difficulty int) domain.Problem {
	p, q := 0, 0
	for p == 0 {
		p = -16 + rand.Intn(33)
	}
	for q == 0 {
		q = -16 + rand.Intn(33)
	}
	b, c := -(p + q), p*q
	lo, hi := sortPair(p, q)
	return domain.Problem{
		SutraID:      13,
		QuestionText: fmt.Sprintf("x^2 + %dx + %d = 0", b, c),
		Difficulty:   4,
		DedupKey:     fmt.Sprintf("s13:%d:%d", lo, hi),
		Answer:       []int{lo, hi},
		SolutionSteps: []string{
			fmt.Sprintf("Using Sopaantyadvayamantyam, roots satisfy sum = %d and product = %d", -b, c),
			fmt.Sprintf("Roots: x = %d, x = %d", p, q),
		},
	}
}

// ---------- Sutra 14: Ekanyunena Purvena (multiply by 9, 99, 999...) ----------
func genSutra14(difficulty int) domain.Problem {
	nines := []int{9, 99, 999, 9999}
	nine := nines[rand.Intn(len(nines))]
	digitsN := len(fmt.Sprintf("%d", nine))
	multiplicand := 1 + rand.Intn(pow10(digitsN)-1)
	ans := multiplicand * nine
	return domain.Problem{
		SutraID:      14,
		QuestionText: fmt.Sprintf("%d x %d", multiplicand, nine),
		Difficulty:   difficultyFromMagnitude(nine),
		DedupKey:     fmt.Sprintf("s14:%d:%d", nine, multiplicand),
		Answer:       ans,
		SolutionSteps: []string{
			fmt.Sprintf("Left part: %d - 1 = %d", multiplicand, multiplicand-1),
			"Right part: complement of the multiplicand using Ekanyunena Purvena (one less than previous)",
			fmt.Sprintf("Answer: %d", ans),
		},
	}
}

// ---------- Sutra 15: Gunitasamuccayah (verification) ----------
func genSutra15(difficulty int) domain.Problem {
	p, q := 0, 0
	for p == 0 {
		p = -20 + rand.Intn(41)
	}
	for q == 0 {
		q = -20 + rand.Intn(41)
	}
	b, c := p+q, p*q
	lhs := (1 + p) * (1 + q)
	rhs := 1 + b + c
	return domain.Problem{
		SutraID:      15,
		QuestionText: fmt.Sprintf("Does (x+%d)(x+%d) expand to x^2 + %dx + %d?", p, q, b, c),
		Difficulty:   3,
		DedupKey:     fmt.Sprintf("s15:%d:%d", p, q),
		Answer:       lhs == rhs,
		SolutionSteps: []string{
			fmt.Sprintf("Sum of coefficients of factors: (1+%d) x (1+%d) = %d", p, q, lhs),
			fmt.Sprintf("Sum of coefficients of product: 1+%d+%d = %d", b, c, rhs),
			"Gunitasamuccayah check: verified",
		},
	}
}

// ---------- Sutra 16: Gunakasamuccyah (verification, leading coefficient) ----------
func genSutra16(difficulty int) domain.Problem {
	a1, a2 := 1+rand.Intn(6), 1+rand.Intn(6)
	p, q := 0, 0
	for p == 0 {
		p = -12 + rand.Intn(25)
	}
	for q == 0 {
		q = -12 + rand.Intn(25)
	}
	A := a1 * a2
	B := a1*q + a2*p
	C := p * q
	lhs := (a1 + p) * (a2 + q)
	rhs := A + B + C
	return domain.Problem{
		SutraID:      16,
		QuestionText: fmt.Sprintf("Does (%dx+%d)(%dx+%d) expand to %dx^2 + %dx + %d?", a1, p, a2, q, A, B, C),
		Difficulty:   4,
		DedupKey:     fmt.Sprintf("s16:%d:%d:%d:%d", a1, p, a2, q),
		Answer:       lhs == rhs,
		SolutionSteps: []string{
			fmt.Sprintf("Sum of coefficients of factor 1: %d+%d = %d", a1, p, a1+p),
			fmt.Sprintf("Sum of coefficients of factor 2: %d+%d = %d", a2, q, a2+q),
			fmt.Sprintf("Product of the two sums: %d", lhs),
			fmt.Sprintf("Sum of coefficients of expanded product: %d+%d+%d = %d", A, B, C, rhs),
			"Gunakasamuccyah check: verified",
		},
	}
}

func pow10(n int) int {
	r := 1
	for i := 0; i < n; i++ {
		r *= 10
	}
	return r
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
