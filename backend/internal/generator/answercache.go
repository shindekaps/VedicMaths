package generator

import (
	"context"
	"sync"
	"time"

	"vedicpath/internal/domain"
)

type AnswerCache interface {
	Put(ctx context.Context, problemID string, p domain.Problem, ttl time.Duration) error
	Take(ctx context.Context, problemID string) (domain.Problem, bool, error) // Take = get + delete (one-shot)
}

type cacheEntry struct {
	problem   domain.Problem
	expiresAt time.Time
}

type InMemoryAnswerCache struct {
	mu      sync.Mutex
	entries map[string]cacheEntry
}

func NewInMemoryAnswerCache() *InMemoryAnswerCache {
	c := &InMemoryAnswerCache{entries: make(map[string]cacheEntry)}
	go c.janitor()
	return c
}

func (c *InMemoryAnswerCache) Put(_ context.Context, problemID string, p domain.Problem, ttl time.Duration) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.entries[problemID] = cacheEntry{problem: p, expiresAt: time.Now().Add(ttl)}
	return nil
}

func (c *InMemoryAnswerCache) Take(_ context.Context, problemID string) (domain.Problem, bool, error) {
	c.mu.Lock()
	defer c.mu.Unlock()
	e, ok := c.entries[problemID]
	if !ok || time.Now().After(e.expiresAt) {
		delete(c.entries, problemID)
		return domain.Problem{}, false, nil
	}
	delete(c.entries, problemID) // one-shot: prevents answer replay/resubmission
	return e.problem, true, nil
}

func (c *InMemoryAnswerCache) janitor() {
	ticker := time.NewTicker(5 * time.Minute)
	for range ticker.C {
		c.mu.Lock()
		now := time.Now()
		for id, e := range c.entries {
			if now.After(e.expiresAt) {
				delete(c.entries, id)
			}
		}
		c.mu.Unlock()
	}
}
