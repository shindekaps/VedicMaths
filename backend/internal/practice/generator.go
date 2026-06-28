package practice

import (
	"fmt"
	"math/rand"
	"time"
)

// Generator defines the interface for Sutra-specific problem generation
type Generator interface {
	Generate(difficulty int) (question string, answer string)
}

// EkadhikenaGenerator generates problems for squaring numbers ending in 5
type EkadhikenaGenerator struct{}

func (g *EkadhikenaGenerator) Generate(difficulty int) (string, string) {
	// Logic: Numbers like 15, 25, 35... up to 100+ based on difficulty
	seed := rand.New(rand.NewSource(time.Now().UnixNano()))
	
	maxBase := 10 * difficulty // e.g., difficulty 1: 15-95, difficulty 5: 15-495
	if maxBase < 10 { maxBase = 10 }
	
	num := (seed.Intn(maxBase) + 1) * 10 + 5
	question := fmt.Sprintf("%d * %d", num, num)
	answer := fmt.Sprintf("%d", num * num)
	
	return question, answer
}

// NikhilamGenerator generates problems for multiplication near base numbers
type NikhilamGenerator struct{}

func (g *NikhilamGenerator) Generate(difficulty int) (string, string) {
	seed := rand.New(rand.NewSource(time.Now().UnixNano()))
	
	bases := []int{10, 100, 1000}
	baseIndex := (difficulty - 1) / 2 // diff 1-2: base 10, diff 3-4: base 100, diff 5: base 1000
	if baseIndex >= len(bases) { baseIndex = len(bases) - 1 }
	base := bases[baseIndex]

	// Numbers near the base (deficits of 1-9)
	num1 := base - (seed.Intn(9) + 1)
	num2 := base - (seed.Intn(9) + 1)

	question := fmt.Sprintf("%d * %d", num1, num2)
	answer := fmt.Sprintf("%d", num1 * num2)
	
	return question, answer
}
