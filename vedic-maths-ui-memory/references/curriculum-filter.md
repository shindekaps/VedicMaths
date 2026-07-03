# Curriculum Filter Logic

To maintain pedagogical progression in the Curriculum UI, we categorize the 16 Vedic Sutras into three difficulty tiers based on their `order_index`:

### Logic
```typescript
const getDifficulty = (index: number): "Easy" | "Medium" | "Hard" => {
  if (index <= 5) return "Easy";
  if (index <= 10) return "Medium";
  return "Hard";
};
```

### Categorization Table
| Order Index | Difficulty |
| :--- | :--- |
| 1 - 5 | Easy |
| 6 - 10 | Medium |
| 11 - 16 | Hard |
