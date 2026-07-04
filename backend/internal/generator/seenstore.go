package generator

import (
	"context"
	"fmt"
	"sync"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SeenStore interface {
	Has(ctx context.Context, userID string, sutraID int, key string) (bool, error)
	Mark(ctx context.Context, userID string, sutraID int, key string) error
	// Reset clears history for a user+sutra, used when the generator has
	// exhausted its practical number space and needs to start a fresh cycle.
	Reset(ctx context.Context, userID string, sutraID int) error
}

// ---------------- In-memory implementation ----------------
// Good for local dev, a single-instance server, or short-lived sessions.
// Does NOT survive a restart and does NOT work across multiple app instances.

type InMemorySeenStore struct {
	mu   sync.Mutex
	seen map[string]map[string]struct{} // key: "userID:sutraID" -> set of DedupKeys
}

func NewInMemorySeenStore() *InMemorySeenStore {
	return &InMemorySeenStore{seen: make(map[string]map[string]struct{})}
}

func bucketKey(userID string, sutraID int) string {
	return fmt.Sprintf("%s:%d", userID, sutraID)
}

func (s *InMemorySeenStore) Has(_ context.Context, userID string, sutraID int, key string) (bool, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	bucket, ok := s.seen[bucketKey(userID, sutraID)]
	if !ok {
		return false, nil
	}
	_, exists := bucket[key]
	return exists, nil
}

func (s *InMemorySeenStore) Mark(_ context.Context, userID string, sutraID int, key string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	bk := bucketKey(userID, sutraID)
	if s.seen[bk] == nil {
		s.seen[bk] = make(map[string]struct{})
	}
	s.seen[bk][key] = struct{}{}
	return nil
}

func (s *InMemorySeenStore) Reset(_ context.Context, userID string, sutraID int) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.seen, bucketKey(userID, sutraID))
	return nil
}

// ---------------- MongoDB implementation ----------------
// Persists across restarts/instances. A TTL index expires entries after
// `ttl` (default 30 days) so a user who exhausts a sutra's practical
// question space eventually starts seeing "new" (recycled) ones again,
// rather than the app erroring out.

type MongoSeenStore struct {
	coll *mongo.Collection
	ttl  time.Duration
}

func NewMongoSeenStore(db *mongo.Database, ttl time.Duration) (*MongoSeenStore, error) {
	if ttl == 0 {
		ttl = 30 * 24 * time.Hour
	}
	coll := db.Collection("seen_questions")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := coll.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "userId", Value: 1}, {Key: "sutraId", Value: 1}, {Key: "key", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{
			Keys:    bson.D{{Key: "seenAt", Value: 1}},
			Options: options.Index().SetExpireAfterSeconds(int32(ttl.Seconds())),
		},
	})
	if err != nil {
		return nil, err
	}
	return &MongoSeenStore{coll: coll, ttl: ttl}, nil
}

func (s *MongoSeenStore) Has(ctx context.Context, userID string, sutraID int, key string) (bool, error) {
	count, err := s.coll.CountDocuments(ctx, bson.M{"userId": userID, "sutraId": sutraID, "key": key})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (s *MongoSeenStore) Mark(ctx context.Context, userID string, sutraID int, key string) error {
	_, err := s.coll.UpdateOne(ctx,
		bson.M{"userId": userID, "sutraId": sutraID, "key": key},
		bson.M{"$setOnInsert": bson.M{"seenAt": time.Now()}},
		options.Update().SetUpsert(true),
	)
	return err
}

func (s *MongoSeenStore) Reset(ctx context.Context, userID string, sutraID int) error {
	_, err := s.coll.DeleteMany(ctx, bson.M{"userId": userID, "sutraId": sutraID})
	return err
}
