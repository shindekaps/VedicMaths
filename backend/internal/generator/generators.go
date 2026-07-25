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
	switch difficulty {
	case 2:
		return 100, 999
	case 3:
		return 1000, 9999
	case 4:
		return 10000, 99999
	default: // Default to level 1
		return 10, 99
	}
}

// ---------- Sutra 1: Ekadhikena Purvena (squaring numbers ending in 5) ----------
func genSutra1Lesson1(difficulty int) domain.Problem {
	lo, hi := rangeForDifficulty(difficulty)
	if hi > 99995 {
		hi = 99995
	}
	loTens := lo / 10
	hiTens := hi / 10
	tens := loTens + rand.Intn(hiTens-loTens+1)
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

// Multiplying numbers with same first digit and units digits sum is 10 (Lesson 2)
func genSutra1Lesson2(difficulty int) domain.Problem {
	_, hiDiff := rangeForDifficulty(difficulty)
	var minTens, maxTens int
	if hiDiff < 100 {
		minTens = 1
		maxTens = 9
	} else if hiDiff < 1000 {
		minTens = 10
		maxTens = 99
	} else {
		minTens = 100
		maxTens = 999
	}

	tens := minTens + rand.Intn(maxTens-minTens+1)
	u1 := rand.Intn(9) + 1
	u2 := 10 - u1

	num1 := tens*10 + u1
	num2 := tens*10 + u2
	ans := num1 * num2

	return domain.Problem{
		SutraID:      1,
		QuestionText: fmt.Sprintf("%d x %d", num1, num2),
		Difficulty:   difficultyFromMagnitude(num1),
		DedupKey:     fmt.Sprintf("s1:L2:%d:%d", num1, num2),
		Answer:       ans,
		SolutionSteps: []string{
			fmt.Sprintf("Tens digit is same: %d", tens),
			fmt.Sprintf("Sum of units digits is 10: %d + %d = 10", u1, u2),
			fmt.Sprintf("Left part: %d x (%d + 1) = %d", tens, tens, tens*(tens+1)),
			fmt.Sprintf("Right part: %d x %d = %d", u1, u2, u1*u2),
			fmt.Sprintf("Answer: %d", ans),
		},
	}
}

// Divisibility Rules for Numbers Ending in 9 (Lesson 3)
func genSutra1Lesson3(difficulty int) domain.Problem {
	var divisor int
	switch difficulty {
	case 1:
		divisors := []int{19, 29}
		divisor = divisors[rand.Intn(len(divisors))]
	case 2:
		divisors := []int{19, 29, 39, 49}
		divisor = divisors[rand.Intn(len(divisors))]
	default:
		divisors := []int{19, 29, 39, 49, 59, 79, 89}
		divisor = divisors[rand.Intn(len(divisors))]
	}

	isDivisible := rand.Intn(2) == 0
	var num int
	if isDivisible {
		mult := 5 + rand.Intn(100)
		num = divisor * mult
	} else {
		mult := 5 + rand.Intn(100)
		num = divisor*mult + 1 + rand.Intn(divisor-1)
	}

	p := (divisor / 10) + 1 // positive osculator
	ans := "No"
	if isDivisible {
		ans = "Yes"
	}

	steps := []string{
		fmt.Sprintf("Divisor is %d. The digit before 9 is %d, so the positive osculator P = %d + 1 = %d", divisor, divisor/10, divisor/10, p),
	}

	current := num
	for current > divisor*2 {
		lastDigit := current % 10
		remaining := current / 10
		nextVal := remaining + lastDigit*p
		steps = append(steps, fmt.Sprintf("Isolate last digit of %d: remaining part is %d, last digit is %d. Calculate %d + %d x %d = %d", current, remaining, lastDigit, remaining, lastDigit, p, nextVal))
		current = nextVal
	}

	if current%divisor == 0 {
		steps = append(steps, fmt.Sprintf("%d is a multiple of %d (since %d = %d x %d). Therefore, the original number %d is divisible.", current, divisor, current, divisor, current/divisor, num))
	} else {
		steps = append(steps, fmt.Sprintf("%d is not a multiple of %d. Therefore, the original number %d is not divisible.", current, divisor, num))
	}

	return domain.Problem{
		SutraID:       1,
		QuestionText:  fmt.Sprintf("Is %d divisible by %d?", num, divisor),
		Difficulty:    difficulty,
		DedupKey:      fmt.Sprintf("s1:L3:%d:%d", num, divisor),
		Answer:        ans,
		Options:       []string{"Yes", "No"},
		SolutionSteps: steps,
	}
}

// Finding Recurring Decimals for Divisors Ending in 9 (Lesson 4)
func genSutra1Lesson4(difficulty int) domain.Problem {
	qType := rand.Intn(3)
	var denominators = []int{19, 29, 39, 49, 59, 79, 89}
	denom := denominators[rand.Intn(len(denominators))]
	m := (denom / 10) + 1

	if qType == 0 {
		ans := m
		options := []string{
			fmt.Sprintf("%d", m),
			fmt.Sprintf("%d", m-1),
			fmt.Sprintf("%d", m+1),
			fmt.Sprintf("%d", m+2),
		}
		rand.Shuffle(len(options), func(i, j int) { options[i], options[j] = options[j], options[i] })

		return domain.Problem{
			SutraID:      1,
			QuestionText: fmt.Sprintf("What is the constant multiplier (M) for the recurring decimal of 1/%d?", denom),
			Difficulty:   difficulty,
			DedupKey:     fmt.Sprintf("s1:L4:M:%d", denom),
			Answer:       fmt.Sprintf("%d", ans),
			Options:      options,
			SolutionSteps: []string{
				fmt.Sprintf("Denominator is %d.", denom),
				fmt.Sprintf("Take the digit before the 9: %d.", denom/10),
				fmt.Sprintf("Add 1: %d + 1 = %d.", denom/10, m),
				fmt.Sprintf("So, the constant multiplier (M) is %d.", m),
			},
		}
	} else if qType == 1 {
		var d = 19
		var mult = 2
		if rand.Intn(2) == 0 {
			d = 29
			mult = 3
		}

		curr := 1
		carry := 0
		stepsCount := 1 + rand.Intn(4)

		seq := "1"
		for i := 0; i < stepsCount; i++ {
			prod := curr*mult + carry
			digit := prod % 10
			carry = prod / 10
			seq = fmt.Sprintf("%d%s", digit, seq)
			curr = digit
		}

		prod := curr*mult + carry
		nextDigit := prod % 10
		nextCarry := prod / 10

		var questionText string
		if carry > 0 {
			questionText = fmt.Sprintf("If the recurring sequence of 1/%d ends in ...%s (with a carry of %d), what is the next digit to the left?", d, seq, carry)
		} else {
			questionText = fmt.Sprintf("If the recurring sequence of 1/%d ends in ...%s, what is the next digit to the left?", d, seq)
		}

		options := []string{
			fmt.Sprintf("%d", nextDigit),
			fmt.Sprintf("%d", (nextDigit+3)%10),
			fmt.Sprintf("%d", (nextDigit+7)%10),
			fmt.Sprintf("%d", (nextDigit+1)%10),
		}
		optMap := make(map[string]bool)
		uniqueOpts := []string{}
		for _, o := range options {
			if !optMap[o] {
				optMap[o] = true
				uniqueOpts = append(uniqueOpts, o)
			}
		}
		for len(uniqueOpts) < 4 {
			cand := fmt.Sprintf("%d", rand.Intn(10))
			if !optMap[cand] {
				optMap[cand] = true
				uniqueOpts = append(uniqueOpts, cand)
			}
		}
		rand.Shuffle(len(uniqueOpts), func(i, j int) { uniqueOpts[i], uniqueOpts[j] = uniqueOpts[j], uniqueOpts[i] })

		return domain.Problem{
			SutraID:      1,
			QuestionText: questionText,
			Difficulty:   difficulty,
			DedupKey:     fmt.Sprintf("s1:L4:next:%d:%s", d, seq),
			Answer:       fmt.Sprintf("%d", nextDigit),
			Options:      uniqueOpts,
			SolutionSteps: []string{
				fmt.Sprintf("The fraction is 1/%d, so the multiplier (M) is %d.", d, mult),
				fmt.Sprintf("The current leftmost digit is %d.", curr),
				fmt.Sprintf("Multiply by the multiplier (M): %d x %d = %d.", curr, mult, curr*mult),
				fmt.Sprintf("Add the previous carry-over (%d): %d + %d = %d.", carry, curr*mult, carry, prod),
				fmt.Sprintf("The unit digit is %d, and the carry-over for the next step is %d.", nextDigit, nextCarry),
				fmt.Sprintf("Therefore, the next digit to the left is %d.", nextDigit),
			},
		}
	} else {
		halfSeq := "947368421"
		complement := "052631578"

		options := []string{
			complement,
			"052631579",
			"042631578",
			"152631578",
		}
		rand.Shuffle(len(options), func(i, j int) { options[i], options[j] = options[j], options[i] })

		return domain.Problem{
			SutraID:      1,
			QuestionText: fmt.Sprintf("If the last 9 digits of 1/19 are %s, what is its front half using the Nines Complement rule?", halfSeq),
			Difficulty:   difficulty,
			DedupKey:     "s1:L4:comp:19",
			Answer:       complement,
			Options:      options,
			SolutionSteps: []string{
				"According to the Nines Complement rule, the sum of corresponding digits of the first and second half is always 9.",
				fmt.Sprintf("We subtract each digit of the second half (%s) from 9:", halfSeq),
				"9 - 9 = 0",
				"9 - 4 = 5",
				"9 - 7 = 2",
				"9 - 3 = 6",
				"9 - 6 = 3",
				"9 - 8 = 1",
				"9 - 4 = 5",
				"9 - 2 = 7",
				"9 - 1 = 8",
				fmt.Sprintf("This instantly gives the front half: %s.", complement),
			},
		}
	}
}

func genSutra1WithLesson(difficulty int, lessonID string) domain.Problem {
	if lessonID == "SUTRA_1_LESSON_1" {
		return genSutra1Lesson1(difficulty)
	}
	if lessonID == "SUTRA_1_LESSON_2" {
		return genSutra1Lesson2(difficulty)
	}
	if lessonID == "SUTRA_1_LESSON_3" {
		return genSutra1Lesson3(difficulty)
	}
	if lessonID == "SUTRA_1_LESSON_4" {
		return genSutra1Lesson4(difficulty)
	}
	// Fallback/Random: select from all 4 lessons
	switch rand.Intn(4) {
	case 0:
		return genSutra1Lesson1(difficulty)
	case 1:
		return genSutra1Lesson2(difficulty)
	case 2:
		return genSutra1Lesson3(difficulty)
	default:
		return genSutra1Lesson4(difficulty)
	}
}

func genSutra1(difficulty int) domain.Problem {
	return genSutra1WithLesson(difficulty, "")
}

// ---------- Sutra 2: Nikhilam (multiplication near a base) ----------
func genSutra2Lesson1(difficulty int) domain.Problem {
	var base int
	switch {
	case difficulty <= 1:
		base = 100
	case difficulty == 2:
		base = 1000
	default:
		base = 10000
	}
	num := rand.Intn(base-1) + 1
	ans := base - num
	return domain.Problem{
		SutraID:      2,
		QuestionText: fmt.Sprintf("%d - %d", base, num),
		Difficulty:   difficultyFromMagnitude(base),
		DedupKey:     fmt.Sprintf("s2:L1:%d:%d", base, num),
		Answer:       ans,
		SolutionSteps: []string{
			fmt.Sprintf("Base = %d", base),
			"Methodology: All from 9, Last from 10",
			fmt.Sprintf("Answer: %d", ans),
		},
	}
}

func genSutra2Lesson2(difficulty int) domain.Problem {
	var base int
	switch {
	case difficulty <= 1:
		base = 10
	case difficulty == 2:
		base = 100
	default:
		base = 1000
	}
	var span int
	if base == 10 {
		span = 4
	} else {
		span = base / 10
		if span < 1 {
			span = 1
		}
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

func genSutra2Lesson3(difficulty int) domain.Problem {
	var base int
	var span int
	switch {
	case difficulty <= 1:
		base = 10
		span = 9
	case difficulty == 2:
		base = 100
		span = 30
	default:
		base = 1000
		span = 100
	}
	
	a := base + (rand.Intn(span) + 1)
	b := base + (rand.Intn(span) + 1)
	ea, eb := a-base, b-base
	left := a + eb
	right := ea * eb
	ans := left*base + right
	lo, hi := sortPair(a, b)
	
	return domain.Problem{
		SutraID:      2,
		QuestionText: fmt.Sprintf("%d x %d", a, b),
		Difficulty:   difficultyFromMagnitude(base),
		DedupKey:     fmt.Sprintf("s2:L3:%d:%d", lo, hi),
		Answer:       ans,
		SolutionSteps: []string{
			fmt.Sprintf("Base = %d", base),
			fmt.Sprintf("Excess of %d = %d-%d = %d", a, a, base, ea),
			fmt.Sprintf("Excess of %d = %d-%d = %d", b, b, base, eb),
			fmt.Sprintf("Left: %d + %d = %d", a, eb, left),
			fmt.Sprintf("Right: %d x %d = %d", ea, eb, right),
			"Handle carry from RHS to LHS",
			fmt.Sprintf("Answer: %d", ans),
		},
	}
}

func genSutra2Lesson4(difficulty int) domain.Problem {
	var divisors []int
	switch {
	case difficulty <= 1:
		divisors = []int{9, 8, 7}
	case difficulty == 2:
		divisors = []int{89, 91, 98, 97}
	default:
		divisors = []int{997, 998, 999}
	}
	divisor := divisors[rand.Intn(len(divisors))]
	quotient := 10 + rand.Intn(990)
	remainder := rand.Intn(divisor)
	dividend := divisor*quotient + remainder
	
	return domain.Problem{
		SutraID:      2,
		QuestionText: fmt.Sprintf("%d / %d", dividend, divisor),
		Difficulty:   difficultyFromMagnitude(dividend),
		DedupKey:     fmt.Sprintf("s2:L4:%d:%d", dividend, divisor),
		Answer:       quotient,
		SolutionSteps: []string{
			fmt.Sprintf("Apply complement method for division near base %d", divisor),
			fmt.Sprintf("Answer (Quotient): %d", quotient),
		},
	}
}

func genSutra2WithLesson(difficulty int, lessonID string) domain.Problem {
	if lessonID == "SUTRA_2_LESSON_1" {
		return genSutra2Lesson1(difficulty)
	}
	if lessonID == "SUTRA_2_LESSON_2" {
		return genSutra2Lesson2(difficulty)
	}
	if lessonID == "SUTRA_2_LESSON_3" {
		return genSutra2Lesson3(difficulty)
	}
	if lessonID == "SUTRA_2_LESSON_4" {
		return genSutra2Lesson4(difficulty)
	}
	// Fallback: random lesson
	switch rand.Intn(4) {
	case 0:
		return genSutra2Lesson1(difficulty)
	case 1:
		return genSutra2Lesson2(difficulty)
	case 2:
		return genSutra2Lesson3(difficulty)
	default:
		return genSutra2Lesson4(difficulty)
	}
}

func genSutra2(difficulty int) domain.Problem {
	return genSutra2WithLesson(difficulty, "")
}

// ---------- Sutra 3: Urdhva-Tiryagbhyam (general multiplication) ----------
func genSutra3Lesson1(difficulty int) domain.Problem {
	a := 10 + rand.Intn(90)
	b := 10 + rand.Intn(90)
	ans := a * b
	
	a1, a0 := a/10, a%10
	b1, b0 := b/10, b%10
	
	step1Val := a0 * b0
	step2Val := a1*b0 + a0*b1
	step3Val := a1 * b1
	
	steps := []string{
		fmt.Sprintf("Multiply right vertical column: %d x %d = %d", a0, b0, step1Val),
		fmt.Sprintf("Cross-multiply and add: (%d x %d) + (%d x %d) = %d", a1, b0, a0, b1, step2Val),
		fmt.Sprintf("Multiply left vertical column: %d x %d = %d", a1, b1, step3Val),
	}
	
	carry1 := step1Val / 10
	ans0 := step1Val % 10
	steps = append(steps, fmt.Sprintf("Step 1 result: Write %d, carry %d", ans0, carry1))
	
	step2Sum := step2Val + carry1
	carry2 := step2Sum / 10
	ans1 := step2Sum % 10
	steps = append(steps, fmt.Sprintf("Step 2 result (with carry): %d + %d = %d. Write %d, carry %d", step2Val, carry1, step2Sum, ans1, carry2))
	
	step3Sum := step3Val + carry2
	steps = append(steps, fmt.Sprintf("Step 3 result (with carry): %d + %d = %d. Write %d", step3Val, carry2, step3Sum, step3Sum))
	steps = append(steps, fmt.Sprintf("Combine parts: %d", ans))
	
	lo, hi := sortPair(a, b)
	return domain.Problem{
		SutraID:       3,
		QuestionText:  fmt.Sprintf("%d x %d", a, b),
		Difficulty:    2,
		DedupKey:      fmt.Sprintf("s3:L1:%d:%d", lo, hi),
		Answer:        ans,
		SolutionSteps: steps,
	}
}

func genSutra3Lesson2(difficulty int) domain.Problem {
	isAsym := rand.Intn(2) == 0
	a := 100 + rand.Intn(900)
	var b int
	var qText string
	if isAsym {
		b = 10 + rand.Intn(90)
		qText = fmt.Sprintf("%d x %d", a, b)
	} else {
		b = 100 + rand.Intn(900)
		qText = fmt.Sprintf("%d x %d", a, b)
	}
	ans := a * b
	
	paddedB := b
	bStr := fmt.Sprintf("%d", b)
	if len(bStr) == 2 {
		bStr = "0" + bStr
	}
	
	steps := []string{
		fmt.Sprintf("Spatially align: \n  %d\n  %s", a, bStr),
	}
	
	a2, a1, a0 := a/100, (a/10)%10, a%10
	b2, b1, b0 := paddedB/100, (paddedB/10)%10, paddedB%10
	
	s1 := a0 * b0
	s2 := a1*b0 + a0*b1
	s3 := a2*b0 + a0*b2 + a1*b1
	s4 := a2*b1 + a1*b2
	s5 := a2 * b2
	
	steps = append(steps, fmt.Sprintf("Step 1 (Units): %d x %d = %d", a0, b0, s1))
	steps = append(steps, fmt.Sprintf("Step 2 (Tens): (%d x %d) + (%d x %d) = %d", a1, b0, a0, b1, s2))
	steps = append(steps, fmt.Sprintf("Step 3 (Hundreds): (%d x %d) + (%d x %d) + (%d x %d) = %d", a2, b0, a0, b2, a1, b1, s3))
	steps = append(steps, fmt.Sprintf("Step 4 (Thousands): (%d x %d) + (%d x %d) = %d", a2, b1, a1, b2, s4))
	steps = append(steps, fmt.Sprintf("Step 5 (Ten-Thousands): %d x %d = %d", a2, b2, s5))
	
	c1 := s1 / 10
	r0 := s1 % 10
	
	c2 := (s2 + c1) / 10
	r1 := (s2 + c1) % 10
	
	c3 := (s3 + c2) / 10
	r2 := (s3 + c2) % 10
	
	c4 := (s4 + c3) / 10
	r3 := (s4 + c3) % 10
	
	r45 := s5 + c4
	
	steps = append(steps, fmt.Sprintf("Apply carries right-to-left: Write %d, carry %d -> Write %d, carry %d -> Write %d, carry %d -> Write %d, carry %d -> final %d", r0, c1, r1, c2, r2, c3, r3, c4, r45))
	steps = append(steps, fmt.Sprintf("Final Product: %d", ans))
	
	lo, hi := sortPair(a, b)
	return domain.Problem{
		SutraID:       3,
		QuestionText:  qText,
		Difficulty:    3,
		DedupKey:      fmt.Sprintf("s3:L2:%d:%d", lo, hi),
		Answer:        ans,
		SolutionSteps: steps,
	}
}

func genSutra3Lesson3(difficulty int) domain.Problem {
	isThreeDigit := rand.Intn(2) == 0
	var aInt, bInt int
	var aFloat, bFloat float64
	var aStr, bStr string
	
	if isThreeDigit {
		aInt = 100 + rand.Intn(900)
		bInt = 10 + rand.Intn(90)
		aFloat = float64(aInt) / 100.0
		bFloat = float64(bInt) / 10.0
		aStr = fmt.Sprintf("%.2f", aFloat)
		bStr = fmt.Sprintf("%.1f", bFloat)
	} else {
		aInt = 10 + rand.Intn(90)
		bInt = 10 + rand.Intn(90)
		aFloat = float64(aInt) / 10.0
		bFloat = float64(bInt) / 10.0
		aStr = fmt.Sprintf("%.1f", aFloat)
		bStr = fmt.Sprintf("%.1f", bFloat)
	}
	
	ansInt := aInt * bInt
	ansFloat := aFloat * bFloat
	ansStr := fmt.Sprintf("%g", ansFloat)
	
	steps := []string{
		fmt.Sprintf("Ignore the decimal points and multiply as whole integers: %d x %d", aInt, bInt),
		fmt.Sprintf("Standard Urdhva Tiryagbhyam result: %d", ansInt),
		fmt.Sprintf("Count decimal places in inputs: %s (%d places) and %s (%d places). Total places = %d", aStr, len(aStr)-2, bStr, len(bStr)-2, len(aStr)+len(bStr)-4),
		fmt.Sprintf("Place the decimal point from right to left in the integer result: %s", ansStr),
	}
	
	return domain.Problem{
		SutraID:       3,
		QuestionText:  fmt.Sprintf("%s x %s", aStr, bStr),
		Difficulty:    3,
		DedupKey:      fmt.Sprintf("s3:L3:%s:%s", aStr, bStr),
		Answer:        ansStr,
		SolutionSteps: steps,
	}
}

func genSutra3Lesson4(difficulty int) domain.Problem {
	var num int
	if rand.Intn(2) == 0 {
		num = 10 + rand.Intn(90)
	} else {
		num = 100 + rand.Intn(30)
	}
	ans := num * num
	
	steps := []string{
		fmt.Sprintf("Squaring %d is equivalent to multiplying %d x %d using Urdhva Tiryagbhyam.", num, num, num),
	}
	
	if num < 100 {
		a, b := num/10, num%10
		steps = append(steps, fmt.Sprintf("Use the algebraic shortcut (10a + b)^2 = 100(a^2) + 10(2ab) + b^2:"))
		steps = append(steps, fmt.Sprintf("Right part: b^2 = %d^2 = %d", b, b*b))
		steps = append(steps, fmt.Sprintf("Middle part: 2 x a x b = 2 x %d x %d = %d", a, b, 2*a*b))
		steps = append(steps, fmt.Sprintf("Left part: a^2 = %d^2 = %d", a, a*a))
	} else {
		steps = append(steps, fmt.Sprintf("Apply the 5-step star multiplication to %d x %d", num, num))
	}
	steps = append(steps, fmt.Sprintf("Add up column values and carries to get final answer: %d", ans))
	
	return domain.Problem{
		SutraID:       3,
		QuestionText:  fmt.Sprintf("%d^2", num),
		Difficulty:    2,
		DedupKey:      fmt.Sprintf("s3:L4:%d", num),
		Answer:        ans,
		SolutionSteps: steps,
	}
}

func genSutra3WithLesson(difficulty int, lessonID string) domain.Problem {
	if lessonID == "SUTRA_3_LESSON_1" {
		return genSutra3Lesson1(difficulty)
	}
	if lessonID == "SUTRA_3_LESSON_2" {
		return genSutra3Lesson2(difficulty)
	}
	if lessonID == "SUTRA_3_LESSON_3" {
		return genSutra3Lesson3(difficulty)
	}
	if lessonID == "SUTRA_3_LESSON_4" {
		return genSutra3Lesson4(difficulty)
	}
	// Fallback
	switch rand.Intn(4) {
	case 0:
		return genSutra3Lesson1(difficulty)
	case 1:
		return genSutra3Lesson2(difficulty)
	case 2:
		return genSutra3Lesson3(difficulty)
	default:
		return genSutra3Lesson4(difficulty)
	}
}

func genSutra3(difficulty int) domain.Problem {
	return genSutra3WithLesson(difficulty, "")
}

func genSutra4Lesson1(difficulty int) domain.Problem {
	var d int
	switch {
	case difficulty <= 1:
		d = 11 + rand.Intn(3)
	case difficulty == 2:
		d = 111 + rand.Intn(3)
	default:
		d = 1001 + rand.Intn(3)
	}
	
	q := 10 + rand.Intn(90)
	r := rand.Intn(d)
	dividend := d*q + r
	
	steps := []string{
		fmt.Sprintf("Divisor is %d. Find its base and positive excess.", d),
		fmt.Sprintf("Transpose the excess digits (invert their signs) to form the calculation flag."),
		fmt.Sprintf("Apply transpositions column-by-column to calculate Quotient = %d", q),
	}
	
	return domain.Problem{
		SutraID:      4,
		QuestionText: fmt.Sprintf("What is the quotient of %d ÷ %d?", dividend, d),
		Difficulty:   difficulty,
		DedupKey:     fmt.Sprintf("s4:L1:%d:%d", dividend, d),
		Answer:       q,
		SolutionSteps: steps,
	}
}

func formatLinearTerm(x int) string {
	if x > 0 {
		return fmt.Sprintf("x + %d", x)
	}
	return fmt.Sprintf("x - %d", -x)
}

func genSutra4Lesson2(difficulty int) domain.Problem {
	choices := []int{-5, -4, -3, -2, -1, 1, 2, 3, 4, 5}
	a := choices[rand.Intn(len(choices))]
	b := choices[rand.Intn(len(choices))]
	for a+b == 0 || a*b == 0 {
		a = choices[rand.Intn(len(choices))]
		b = choices[rand.Intn(len(choices))]
	}
	
	coeff1 := a + b
	coeff0 := a * b
	
	var dividendStr string
	if coeff1 > 0 {
		dividendStr = fmt.Sprintf("x² + %dx", coeff1)
	} else {
		dividendStr = fmt.Sprintf("x² - %dx", -coeff1)
	}
	
	if coeff0 > 0 {
		dividendStr = fmt.Sprintf("%s + %d", dividendStr, coeff0)
	} else {
		dividendStr = fmt.Sprintf("%s - %d", dividendStr, -coeff0)
	}
	
	divisorStr := formatLinearTerm(a)
	quotientStr := formatLinearTerm(b)
	
	steps := []string{
		fmt.Sprintf("Extract dividend coefficients: [1, %d, %d]", coeff1, coeff0),
		fmt.Sprintf("Transpose the constant term of the divisor (%s) to get the flag: %d", divisorStr, -a),
		fmt.Sprintf("Perform synthetic transposition addition to resolve coefficients: [1, %d]", b),
		fmt.Sprintf("Re-attach polynomial variables to get Quotient: %s", quotientStr),
	}
	
	options := []string{
		quotientStr,
		formatLinearTerm(-b),
		formatLinearTerm(a),
		formatLinearTerm(-a),
	}
	
	optMap := make(map[string]bool)
	var finalOptions []string
	finalOptions = append(finalOptions, quotientStr)
	optMap[quotientStr] = true
	
	for _, opt := range options {
		if !optMap[opt] {
			finalOptions = append(finalOptions, opt)
			optMap[opt] = true
		}
	}
	
	distractorOffset := 1
	for len(finalOptions) < 4 {
		newOpt := formatLinearTerm(b + distractorOffset)
		if !optMap[newOpt] {
			finalOptions = append(finalOptions, newOpt)
			optMap[newOpt] = true
		}
		distractorOffset++
	}
	
	rand.Shuffle(len(finalOptions), func(i, j int) {
		finalOptions[i], finalOptions[j] = finalOptions[j], finalOptions[i]
	})
	
	return domain.Problem{
		SutraID:      4,
		QuestionText: fmt.Sprintf("What is the quotient of (%s) ÷ (%s)?", dividendStr, divisorStr),
		Difficulty:   3,
		DedupKey:     fmt.Sprintf("s4:L2:%d:%d", a, b),
		Answer:       quotientStr,
		Options:      finalOptions,
		SolutionSteps: steps,
	}
}

func genSutra4Lesson3(difficulty int) domain.Problem {
	var d int
	switch {
	case difficulty <= 1:
		d = 121
	case difficulty == 2:
		d = 112
	default:
		d = 103
	}
	
	q := 10 + rand.Intn(40)
	r := 5 + rand.Intn(d-10)
	dividend := d*q + r
	
	steps := []string{
		fmt.Sprintf("Divisor is %d. Base is 100 or 1000.", d),
		fmt.Sprintf("Transpose the positive excess digits to form the flag."),
		fmt.Sprintf("Carry out column-by-column division to get Remainder = %d", r),
	}
	
	return domain.Problem{
		SutraID:      4,
		QuestionText: fmt.Sprintf("What is the remainder of %d ÷ %d?", dividend, d),
		Difficulty:   difficulty,
		DedupKey:     fmt.Sprintf("s4:L3:%d:%d", dividend, d),
		Answer:       r,
		SolutionSteps: steps,
	}
}

func genSutra4Lesson4(difficulty int) domain.Problem {
	x := 2 + rand.Intn(8)
	a := 3 + rand.Intn(6)
	c := 1 + rand.Intn(2)
	b := 1 + rand.Intn(15)
	
	d := (a-c)*x + b
	
	var eqStr string
	if b > 0 {
		eqStr = fmt.Sprintf("%dx + %d = %dx + %d", a, b, c, d)
	} else {
		eqStr = fmt.Sprintf("%dx - %d = %dx + %d", a, -b, c, d)
	}
	
	steps := []string{
		fmt.Sprintf("Equation: %s", eqStr),
		fmt.Sprintf("By Paravartya Yojayet (Transpose and Apply), group x terms on LHS and constants on RHS:"),
		fmt.Sprintf("(%d - %d)x = %d - %d", a, c, d, b),
		fmt.Sprintf("%dx = %d", a-c, d-b),
		fmt.Sprintf("x = %d / %d = %d", d-b, a-c, x),
	}
	
	return domain.Problem{
		SutraID:      4,
		QuestionText: fmt.Sprintf("Solve for x: %s", eqStr),
		Difficulty:   2,
		DedupKey:     fmt.Sprintf("s4:L4:%d:%d:%d", a, c, b),
		Answer:       x,
		SolutionSteps: steps,
	}
}

func genSutra4WithLesson(difficulty int, lessonID string) domain.Problem {
	if lessonID == "SUTRA_4_LESSON_1" {
		return genSutra4Lesson1(difficulty)
	}
	if lessonID == "SUTRA_4_LESSON_2" {
		return genSutra4Lesson2(difficulty)
	}
	if lessonID == "SUTRA_4_LESSON_3" {
		return genSutra4Lesson3(difficulty)
	}
	if lessonID == "SUTRA_4_LESSON_4" {
		return genSutra4Lesson4(difficulty)
	}
	// Fallback
	switch rand.Intn(4) {
	case 0:
		return genSutra4Lesson1(difficulty)
	case 1:
		return genSutra4Lesson2(difficulty)
	case 2:
		return genSutra4Lesson3(difficulty)
	default:
		return genSutra4Lesson4(difficulty)
	}
}

func genSutra4(difficulty int) domain.Problem {
	return genSutra4WithLesson(difficulty, "")
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
	bases := []int{100, 1000, 10000}
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
