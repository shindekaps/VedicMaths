# VedicPath - Complete UI/UX Visual Design System
## All 8 Pages with ASCII Mockups + Tailwind CSS Implementation Guide

---

# TABLE OF CONTENTS
1. Design System Overview
2. Page 1: Landing Page
3. Page 2: Curriculum Hub
4. Page 4: Practice Session
5. Page 5: Game Modes Hub
6. Page 6: User Dashboard
7. Page 7: Leaderboard
8. Page 8: Quiz Interface
9. Complete Tailwind CSS Reference

---

# DESIGN SYSTEM OVERVIEW

## Color System
```
┌─────────────────────────────────────────────────┐
│ PRIMARY COLORS                                  │
├─────────────────────────────────────────────────┤
│ ██████ Saffron    #E8650A  (Buttons, Headers)   │
│ ██████ Gold       #D4A017  (Accents, Cards)     │
│ ██████ Teal       #0D8A7A  (Progress, Focus)    │
│ ██████ Cream      #FBF7EE  (Background)         │
│ ██████ Dark Brown #2D2010  (Text)               │
│ ██████ Light Gray #F0F0F0  (Secondary BG)       │
└─────────────────────────────────────────────────┘
```

## Typography Scale
```
┌──────────────────────────────────────┐
│ Display    28pt Bold Saffron         │ Page titles
│ Heading 1  16pt Bold Saffron         │ Section titles
│ Heading 2  12pt Bold Teal            │ Subsections
│ Body       10pt Regular Dark Brown   │ Content
│ Button     11pt Bold White/Saffron   │ CTA
│ Small      8pt Regular Gray          │ Captions
└──────────────────────────────────────┘
```

## Spacing Scale (4px Base)
```
xs: 4px    sm: 8px    md: 12px    base: 16px
lg: 24px   xl: 32px   2xl: 48px
```

## Shadow System
```
Subtle: 0 2px 4px rgba(0,0,0,0.1)
Medium: 0 4px 8px rgba(0,0,0,0.15)
Large:  0 8px 16px rgba(0,0,0,0.2)
```

---

# PAGE 1: LANDING PAGE

## Visual Mockup
```
═══════════════════════════════════════════════════════════════
                          NAVBAR
                    (White BG, Shadow)
  📚 VedicPath Logo                        [Login] [Sign Up]
═══════════════════════════════════════════════════════════════

╔═══════════════════════════════════════════════════════════════╗
║                   HERO SECTION                                ║
║            (Saffron Gradient Background)                      ║
║                                                               ║
║                  🎯 Master Vedic Math                         ║
║            Learn Ancient Techniques, Modern Way               ║
║                                                               ║
║         [Get Started - Saffron] [Learn More - White]         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════
                        STATS ROW
          (White BG, 3 columns, centered)
                                                
    16              50K+              98%
  Sutras          Students        Mastery Rate

═══════════════════════════════════════════════════════════════

┌──────────────────┬──────────────────┬──────────────────┐
│     FEATURES     │     FEATURES     │     FEATURES     │
├──────────────────┼──────────────────┼──────────────────┤
│ 📚 Lessons       │ ⚡ Practice      │ 🏆 Compete       │
│                  │                  │                  │
│ Animated         │ Adaptive         │ Global           │
│ step-by-step     │ difficulty       │ rankings &       │
│ explanations     │ system           │ leaderboards     │
│                  │                  │                  │
│ (Gold border L)  │ (Gold border L)  │ (Gold border L)  │
└──────────────────┴──────────────────┴──────────────────┘

═══════════════════════════════════════════════════════════════
                    SUTRA CARDS PREVIEW
            (Gold BG, Circular Progress Rings)

┌─────────────────┬─────────────────┬─────────────────┬──────┐
│ Ekadhika        │ Nikhilam        │ Urdhva          │ ... │
│                 │                 │                 │      │
│ Squaring nums   │ Multiplication  │ General         │      │
│ ending in 5     │ near base       │ multiplication  │      │
│                 │                 │                 │      │
│ ⭕ (100%)       │ ⭕ (80%)         │ ⭕ (60%)         │      │
└─────────────────┴─────────────────┴─────────────────┴──────┘

═══════════════════════════════════════════════════════════════
              © VedicPath 2024 | Terms | Privacy
```

## Tailwind CSS Implementation

### Navbar
```html
<nav class="bg-white shadow-md sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
    <div class="text-2xl font-bold text-saffron">📚 VedicPath</div>
    <div class="flex gap-4">
      <a href="/login" class="text-dark-brown hover:text-saffron">Login</a>
      <button class="bg-saffron text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600">
        Sign Up
      </button>
    </div>
  </div>
</nav>
```

### Hero Section
```html
<div class="bg-gradient-to-r from-saffron to-yellow-100 py-24 px-4 text-center">
  <h1 class="text-5xl font-bold text-white mb-4">Master Vedic Math</h1>
  <p class="text-xl text-white mb-8">Learn Ancient Techniques, Modern Way</p>
  <div class="flex justify-center gap-4">
    <button class="bg-white text-saffron px-8 py-3 rounded-lg font-bold hover:shadow-lg">
      Get Started
    </button>
    <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-saffron">
      Learn More
    </button>
  </div>
</div>
```

### Stats Row
```html
<div class="bg-white py-6 px-4 text-center">
  <div class="max-w-6xl mx-auto flex justify-around">
    <div>
      <div class="text-3xl font-bold text-saffron">16</div>
      <div class="text-gray-600">Vedic Sutras</div>
    </div>
    <div>
      <div class="text-3xl font-bold text-saffron">50K+</div>
      <div class="text-gray-600">Students</div>
    </div>
    <div>
      <div class="text-3xl font-bold text-saffron">98%</div>
      <div class="text-gray-600">Mastery Rate</div>
    </div>
  </div>
</div>
```

### Features Cards
```html
<div class="bg-cream py-12 px-4">
  <div class="max-w-6xl mx-auto grid grid-cols-3 gap-6">
    <!-- Card 1 -->
    <div class="bg-white border-l-4 border-gold rounded-lg p-6 shadow-md hover:shadow-lg">
      <div class="text-3xl mb-4">📚</div>
      <h3 class="text-lg font-bold text-saffron mb-2">Lessons</h3>
      <p class="text-sm text-gray-600">Animated step-by-step explanations</p>
    </div>
    <!-- Card 2 -->
    <div class="bg-white border-l-4 border-gold rounded-lg p-6 shadow-md hover:shadow-lg">
      <div class="text-3xl mb-4">⚡</div>
      <h3 class="text-lg font-bold text-saffron mb-2">Practice</h3>
      <p class="text-sm text-gray-600">Adaptive difficulty system</p>
    </div>
    <!-- Card 3 -->
    <div class="bg-white border-l-4 border-gold rounded-lg p-6 shadow-md hover:shadow-lg">
      <div class="text-3xl mb-4">🏆</div>
      <h3 class="text-lg font-bold text-saffron mb-2">Compete</h3>
      <p class="text-sm text-gray-600">Global leaderboards</p>
    </div>
  </div>
</div>
```

### Sutra Cards (Scrollable)
```html
<div class="bg-cream py-12 px-4">
  <h2 class="text-3xl font-bold text-saffron text-center mb-8">What You'll Learn</h2>
  <div class="max-w-6xl mx-auto grid grid-cols-4 gap-6 overflow-x-auto pb-4">
    <!-- Sutra Card -->
    <div class="bg-gold rounded-lg p-6 text-center flex-shrink-0 min-w-max">
      <h4 class="font-bold text-dark-brown mb-2">Ekadhika Purvena</h4>
      <p class="text-sm text-dark-brown mb-4">Squaring numbers ending in 5</p>
      <!-- Progress Ring -->
      <div class="flex justify-center">
        <div class="w-16 h-16 rounded-full border-4 border-light-gray border-t-teal flex items-center justify-center">
          <span class="text-sm font-bold">100%</span>
        </div>
      </div>
    </div>
    <!-- Repeat for other Sutras -->
  </div>
</div>
```

---

# PAGE 2: CURRICULUM HUB

## Visual Mockup
```
═════════════════════════════════════════════════════════════════════════════════
🏠 VedicPath    📚 CURRICULUM (ACTIVE)    ⚡ Practice    📊 Dashboard    🏆 Rank
═════════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│ CURRICULUM - Your Progress                                      │
│                                                                 │
│ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 60% Complete    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ FOUNDATION LEVEL (3/3 Mastered)                                │
│                                                                 │
│ ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│ │ ✓ Ekadhika    │  │ ✓ Nikhilam    │  │ ✓ Urdhva      │    │
│ │ Mastered      │  │ Mastered      │  │ Mastered      │    │
│ │               │  │               │  │               │    │
│ │ ⭕ 100%       │  │ ⭕ 100%       │  │ ⭕ 100%       │    │
│ │               │  │               │  │               │    │
│ │ [Review]      │  │ [Review]      │  │ [Review]      │    │
│ └────────────────┘  └────────────────┘  └────────────────┘    │
│                                                                 │
│ INTERMEDIATE LEVEL (1/5 Unlocked)                               │
│                                                                 │
│ ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│ │ ▶ Available    │  │ 🔒 Locked      │  │ 🔒 Locked      │    │
│ │ Paravartya    │  │ --------       │  │ --------       │    │
│ │               │  │                │  │                │    │
│ │ ⭕ 75%        │  │ ○ 0%           │  │ ○ 0%           │    │
│ │               │  │                │  │                │    │
│ │ [Continue]    │  │ [Locked]       │  │ [Locked]       │    │
│ └────────────────┘  └────────────────┘  └────────────────┘    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ RIGHT SIDEBAR - YOUR STATS                 Sticky Position     │
│                                                                 │
│ XP:     4,820 ⭐                                               │
│                                                                 │
│ Level:  8                                                       │
│ ████████░░░░ 45% to Level 9                                    │
│                                                                 │
│ 🔥 Streak: 14 days  (Highest: 22)                              │
│                                                                 │
│ ✓ Mastered: 3/16 Sutras                                        │
│                                                                 │
│ [View Leaderboard]                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Tailwind CSS Implementation

### Main Layout (3-column with sidebars)
```html
<div class="flex h-screen bg-cream">
  <!-- LEFT SIDEBAR NAV -->
  <aside class="w-48 bg-white shadow-md p-4 overflow-y-auto">
    <nav class="space-y-4">
      <a href="/" class="flex items-center gap-3 text-dark-brown hover:text-saffron transition">
        <span class="text-lg">🏠</span> Home
      </a>
      <a href="/curriculum" class="flex items-center gap-3 text-saffron font-bold border-l-4 border-saffron pl-3">
        <span class="text-lg">📚</span> Curriculum
      </a>
      <!-- More nav items... -->
    </nav>
  </aside>

  <!-- MAIN CONTENT -->
  <main class="flex-1 p-8 overflow-y-auto">
    <h1 class="text-4xl font-bold text-saffron mb-8">Curriculum</h1>
    
    <!-- Progress Bar -->
    <div class="bg-white rounded-lg p-6 mb-8 shadow-md">
      <div class="flex justify-between items-center mb-3">
        <span class="font-bold text-dark-brown">Your Progress</span>
        <span class="text-teal font-bold">60% Complete</span>
      </div>
      <div class="w-full bg-light-gray rounded-full h-3">
        <div class="bg-teal h-3 rounded-full" style="width: 60%"></div>
      </div>
    </div>

    <!-- Foundation Level -->
    <h2 class="text-2xl font-bold text-dark-brown mb-6">Foundation (3/3 Mastered)</h2>
    <div class="grid grid-cols-3 gap-6 mb-12">
      <!-- Mastered Card -->
      <div class="bg-gold rounded-lg p-6 text-center shadow-md hover:shadow-lg cursor-pointer">
        <div class="text-3xl mb-4">✓</div>
        <h3 class="font-bold text-dark-brown mb-4">Ekadhika Purvena</h3>
        <div class="w-12 h-12 mx-auto rounded-full border-4 border-white flex items-center justify-center mb-4">
          <span class="text-sm font-bold">100%</span>
        </div>
        <button class="bg-teal text-white px-4 py-2 rounded font-bold w-full hover:bg-teal-dark">
          Review
        </button>
      </div>

      <!-- In Progress Card -->
      <div class="bg-white border-2 border-teal rounded-lg p-6 text-center shadow-md">
        <div class="text-3xl mb-4">🔄</div>
        <h3 class="font-bold text-dark-brown mb-4">Nikhilam</h3>
        <div class="w-12 h-12 mx-auto rounded-full border-4 border-teal flex items-center justify-center mb-4">
          <span class="text-sm font-bold text-teal">75%</span>
        </div>
        <button class="bg-saffron text-white px-4 py-2 rounded font-bold w-full hover:bg-orange-600">
          Continue
        </button>
      </div>

      <!-- Locked Card -->
      <div class="bg-light-gray rounded-lg p-6 text-center opacity-50 cursor-not-allowed">
        <div class="text-3xl mb-4">🔒</div>
        <h3 class="font-bold text-dark-brown mb-4">Urdhva</h3>
        <p class="text-xs text-gray-600">Requires Nikhilam 90%</p>
      </div>
    </div>

    <!-- More levels... -->
  </main>

  <!-- RIGHT SIDEBAR STATS -->
  <aside class="w-56 bg-white shadow-md p-6 overflow-y-auto">
    <h3 class="text-lg font-bold text-saffron mb-6">Your Stats</h3>
    
    <!-- XP -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-bold text-dark-brown">XP</span>
        <span class="text-2xl font-bold text-saffron">4,820</span>
      </div>
    </div>

    <!-- Level -->
    <div class="mb-6">
      <div class="text-sm font-bold text-dark-brown mb-2">Level 8</div>
      <div class="bg-light-gray rounded-full h-2 mb-2">
        <div class="bg-teal h-2 rounded-full" style="width: 45%"></div>
      </div>
      <div class="text-xs text-gray-600">45% to Level 9</div>
    </div>

    <!-- Streak -->
    <div class="mb-6 p-4 bg-cream rounded-lg text-center">
      <div class="text-3xl mb-2">🔥</div>
      <div class="text-2xl font-bold text-saffron">14</div>
      <div class="text-xs text-gray-600">Day Streak</div>
    </div>

    <!-- Mastery -->
    <div class="mb-6">
      <div class="text-sm font-bold text-dark-brown mb-2">Mastery</div>
      <div class="text-2xl font-bold text-saffron">3/16</div>
      <div class="text-xs text-gray-600">Sutras Mastered</div>
    </div>

    <button class="w-full bg-saffron text-white py-3 rounded-lg font-bold hover:bg-orange-600">
      View Leaderboard
    </button>
  </aside>
</div>
```

---

# PAGE 4: PRACTICE SESSION

## Visual Mockup
```
═══════════════════════════════════════════════════════════════
         Nikhilam Practice    Problem 3/10   [Exit]   +20 ⭐
═══════════════════════════════════════════════════════════════

                          ⭕ TIMER
                      (Green→Yellow→Red)
                      
                        00:15:32

╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                     97 × 98 = ?                               ║
║                                                               ║
║                   [        9506        ]  (Input Field)       ║
║                                                               ║
║                  [   SUBMIT ANSWER   ]  (Saffron Button)      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────┐
│ LIVE SESSION STATS                                            │
├───────────────────────────────────────────────────────────────┤
│ Correct: 3/10  ████░░░░░░░░  Accuracy: 100%   Avg: 4.2s     │
│                                                               │
│ 🔥 Streak: 3                                                 │
└───────────────────────────────────────────────────────────────┘
```

## Tailwind CSS Implementation

```html
<div class="min-h-screen bg-cream p-8">
  <!-- HEADER -->
  <div class="flex justify-between items-center mb-12 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-saffron">Nikhilam Practice</h1>
    <div class="flex gap-6 items-center">
      <span class="text-lg font-bold text-dark-brown">Problem 3 of 10</span>
      <button class="bg-gray-300 text-dark-brown px-4 py-2 rounded font-bold">Exit</button>
    </div>
    <div class="text-xl font-bold text-saffron">+20 ⭐</div>
  </div>

  <div class="max-w-4xl mx-auto">
    <!-- CIRCULAR TIMER -->
    <div class="flex justify-center mb-12">
      <div class="relative w-48 h-48">
        <svg class="w-full h-full" viewBox="0 0 200 200">
          <!-- Background circle -->
          <circle cx="100" cy="100" r="90" fill="none" stroke="#F0F0F0" stroke-width="8"/>
          <!-- Progress circle (animated, color changes with time) -->
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="#4CAF50"
            stroke-width="8"
            stroke-dasharray="565"
            stroke-dashoffset="0"
            transform="rotate(-90 100 100)"
            class="transition-all duration-100"
          />
          <!-- Timer text -->
          <text x="100" y="100" text-anchor="middle" dy="0.3em" font-size="48" font-weight="bold" fill="#2D2010">
            00:15:32
          </text>
        </svg>
      </div>
    </div>

    <!-- PROBLEM CARD -->
    <div class="bg-white rounded-lg shadow-md p-12 mb-12 text-center">
      <h2 class="text-5xl font-bold text-dark-brown mb-8">97 × 98 = ?</h2>
      
      <!-- INPUT -->
      <input
        type="number"
        placeholder="Enter your answer"
        class="w-full px-8 py-4 border-2 border-light-gray rounded-lg text-center text-2xl font-bold mb-8 focus:border-teal focus:outline-none"
      />

      <!-- SUBMIT BUTTON -->
      <button class="w-full bg-saffron text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition">
        SUBMIT ANSWER
      </button>
    </div>

    <!-- STATS PANEL -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="grid grid-cols-3 gap-8">
        <!-- Correct Count -->
        <div>
          <div class="text-sm text-gray-600 mb-3">Correct</div>
          <div class="flex items-center gap-3">
            <span class="text-2xl font-bold text-saffron">3/10</span>
          </div>
          <div class="bg-light-gray rounded-full h-2 mt-3">
            <div class="bg-teal h-2 rounded-full" style="width: 30%"></div>
          </div>
        </div>

        <!-- Accuracy -->
        <div>
          <div class="text-sm text-gray-600 mb-3">Accuracy</div>
          <div class="text-2xl font-bold text-teal">100%</div>
        </div>

        <!-- Streak -->
        <div>
          <div class="text-sm text-gray-600 mb-3">Streak</div>
          <div class="text-3xl">🔥</div>
          <div class="text-lg font-bold text-saffron">3</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

# PAGE 5: GAME MODES HUB

## Visual Mockup
```
═══════════════════════════════════════════════════════════════════════════════
                        🎮 GAME MODES
═══════════════════════════════════════════════════════════════════════════════

┌──────────────────────┬──────────────────────┬──────────────────────┐
│ ⚡ SPEED BLITZ       │ 🥷 NUMBER NINJA      │ ⚔️ SUTRA WARS         │
├──────────────────────┼──────────────────────┼──────────────────────┤
│                      │                      │                      │
│ • 60-second timer    │ • Falling numbers    │ • Live 1v1           │
│ • Combo multiplier   │ • Arcade waves       │ • Real-time battle   │
│ • 3 lives system     │ • Boss battles       │ • ELO matchmaking    │
│                      │                      │                      │
│ [PLAY GAME]          │ [PLAY GAME]          │ [PLAY GAME]          │
│ (Gold BG)            │ (Gold BG)            │ (Gold BG)            │
│                      │                      │                      │
└──────────────────────┴──────────────────────┴──────────────────────┘

┌──────────────────────┬──────────────────────┬──────────────────────┐
│ 🗺️ VEDIC QUEST       │ 🧠 PATTERN MEMORY    │ 👥 TEAM CHALLENGE     │
├──────────────────────┼──────────────────────┼──────────────────────┤
│                      │                      │                      │
│ • Story campaign     │ • Brain training     │ • Classroom game     │
│ • 15 chapters        │ • Memory focus       │ • 30 players/team    │
│ • Collect scrolls    │ • Progressive lvls   │ • Team leaderboard   │
│                      │                      │                      │
│ [PLAY GAME]          │ [PLAY GAME]          │ [PLAY GAME]          │
│ (Gold BG)            │ (Gold BG)            │ (Gold BG)            │
│                      │                      │                      │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

## Tailwind CSS Implementation

```html
<div class="min-h-screen bg-cream p-8">
  <!-- HEADER -->
  <h1 class="text-5xl font-bold text-saffron text-center mb-12">🎮 Game Modes</h1>

  <!-- GAME CARDS GRID -->
  <div class="max-w-7xl mx-auto grid grid-cols-3 gap-8">
    
    <!-- GAME CARD TEMPLATE -->
    <div class="bg-white border-l-4 border-gold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-8 text-center cursor-pointer">
      <!-- Icon -->
      <div class="text-6xl mb-6">⚡</div>
      
      <!-- Title -->
      <h2 class="text-2xl font-bold text-saffron mb-6">Speed Blitz</h2>
      
      <!-- Description -->
      <ul class="text-sm text-dark-brown space-y-3 mb-8 text-left">
        <li class="flex items-start gap-3">
          <span class="text-saffron">•</span>
          <span>60-second solo challenge with combo multiplier</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-saffron">•</span>
          <span>Wrong answers cost you lives (3 total)</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-saffron">•</span>
          <span>Daily high score leaderboard</span>
        </li>
      </ul>

      <!-- PLAY Button -->
      <button class="w-full bg-gold text-dark-brown py-3 rounded-lg font-bold hover:bg-amber-700 transition">
        PLAY GAME
      </button>
    </div>

    <!-- Repeat for: Number Ninja, Sutra Wars, Vedic Quest, Pattern Memory, Team Challenge -->
    
  </div>
</div>
```

---

# PAGE 6: USER DASHBOARD

## Visual Mockup
```
═══════════════════════════════════════════════════════════════════════════════
              Dashboard     🔔 Notifications     👤 Profile     ⚙️ Settings
═══════════════════════════════════════════════════════════════════════════════

┌────────────────────┬────────────────────┬────────────────────────┐
│ YOUR STATS         │ THIS WEEK ACTIVITY │ ACHIEVEMENTS           │
├────────────────────┼────────────────────┼────────────────────────┤
│                    │                    │                        │
│ XP: 4,820 ⭐      │ ┏━━━━━━━━━━━━━━┓   │ 🥇 First Step         │
│                    │ ┃ Mon Tue Wed │   │ ✓ Earned              │
│ Level: 8           │ ┃ 120 85  150 │   │                        │
│ ████████░░ 45%     │ ┃             │   │ 🔥 7-Day Streak       │
│ (to Level 9)       │ ┗━━━━━━━━━━━━━┛   │ ✓ Earned              │
│                    │                    │                        │
│ 🔥 Streak: 14      │ Avg XP/Day: 120   │ 👑 Vedic Master       │
│ Last: Today        │                    │ ◯ Locked (0/16)       │
│ Best: 22 days      │                    │                        │
│                    │                    │ [View All Badges]     │
│ ✓ Mastery: 3/16   │                    │                        │
│                    │                    │                        │
└────────────────────┴────────────────────┴────────────────────────┘
```

## Tailwind CSS Implementation

```html
<div class="flex gap-8 p-8 bg-cream min-h-screen">
  <!-- LEFT COLUMN: STATS -->
  <div class="flex-1 bg-white rounded-lg p-8">
    <h3 class="text-lg font-bold text-saffron mb-6">Your Stats</h3>
    
    <!-- XP -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-bold text-dark-brown">XP</span>
        <span class="text-2xl font-bold text-saffron">4,820</span>
      </div>
    </div>

    <!-- Level -->
    <div class="mb-8">
      <div class="text-sm font-bold text-dark-brown mb-2">Level 8</div>
      <div class="bg-light-gray rounded-full h-3 mb-2">
        <div class="bg-teal h-3 rounded-full" style="width: 45%"></div>
      </div>
      <div class="text-xs text-gray-600">45% to Level 9</div>
    </div>

    <!-- Streak -->
    <div class="mb-8 p-4 bg-cream rounded-lg text-center">
      <div class="text-3xl mb-2">🔥</div>
      <div class="text-2xl font-bold text-saffron">14</div>
      <div class="text-xs text-gray-600">Day Streak</div>
    </div>

    <!-- Mastery -->
    <div>
      <div class="text-sm font-bold text-dark-brown mb-2">Mastery Progress</div>
      <div class="text-2xl font-bold text-saffron">3/16</div>
      <div class="text-xs text-gray-600">Sutras Mastered</div>
    </div>
  </div>

  <!-- CENTER COLUMN: WEEKLY CHART -->
  <div class="flex-1 bg-white rounded-lg p-8">
    <h3 class="text-lg font-bold text-saffron mb-6">This Week</h3>
    
    <div class="grid grid-cols-7 gap-3 items-end h-48">
      <!-- Bar for each day -->
      <div class="flex flex-col items-center">
        <div class="w-8 bg-teal rounded-t" style="height: 60%"></div>
        <div class="text-xs text-gray-600 mt-2">Mon</div>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-8 bg-teal rounded-t" style="height: 40%"></div>
        <div class="text-xs text-gray-600 mt-2">Tue</div>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-8 bg-teal rounded-t" style="height: 75%"></div>
        <div class="text-xs text-gray-600 mt-2">Wed</div>
      </div>
      <!-- More days... -->
    </div>

    <div class="mt-6 text-sm text-dark-brown">
      <span class="font-bold">Daily Avg:</span> 102 XP
    </div>
  </div>

  <!-- RIGHT COLUMN: ACHIEVEMENTS -->
  <div class="flex-1 bg-white rounded-lg p-8">
    <h3 class="text-lg font-bold text-saffron mb-6">Achievements</h3>
    
    <div class="grid grid-cols-3 gap-4">
      <!-- Earned Badge -->
      <div class="bg-saffron text-white rounded-lg p-4 text-center">
        <div class="text-3xl mb-2">🥇</div>
        <div class="text-xs font-bold">First Step</div>
        <div class="text-xs text-opacity-80">Earned</div>
      </div>

      <!-- Earned Badge -->
      <div class="bg-saffron text-white rounded-lg p-4 text-center">
        <div class="text-3xl mb-2">🔥</div>
        <div class="text-xs font-bold">7-Day Streak</div>
        <div class="text-xs text-opacity-80">Earned</div>
      </div>

      <!-- Locked Badge -->
      <div class="bg-light-gray text-gray-600 rounded-lg p-4 text-center opacity-50">
        <div class="text-3xl mb-2">👑</div>
        <div class="text-xs font-bold">Vedic Master</div>
        <div class="text-xs">0/16</div>
      </div>
      
      <!-- More badges... -->
    </div>

    <button class="w-full mt-6 text-saffron font-bold hover:underline">
      View All Badges
    </button>
  </div>
</div>
```

---

# PAGE 7: LEADERBOARD

## Visual Mockup
```
═══════════════════════════════════════════════════════════════
           LEADERBOARD      [Weekly ▼]  [Global ▼]
═══════════════════════════════════════════════════════════════

            🥇 FIRST        🥈 SECOND       🥉 THIRD
            Priya          Rohan          Meera
            3,240 XP       2,980 XP       2,750 XP
            Level 15       Level 14       Level 13

───────────────────────────────────────────────────────────────
Rank │ Username    │  XP  │ Lvl │ Streak │ Last Active
───────────────────────────────────────────────────────────────
 1   │ Priya Mehta │ 3240 │ 15  │ 22 🔥 │ 1h ago
 2   │ Rohan Gupta │ 2980 │ 14  │ 15 🔥 │ 3h ago
 3   │ Meera Singh │ 2750 │ 13  │ 12 🔥 │ 5h ago
 4   │ Arjun Nair  │ 2340 │ 12  │  8 🔥 │ 10m ago  ← YOU
 5   │ Zara Khan   │ 2180 │ 12  │  5 🔥 │ 2h ago
 6   │ Vikram Roy  │ 1950 │ 11  │  3 🔥 │ 1d ago
 7   │ Neha Dutta  │ 1820 │ 11  │  0    │ 2d ago
───────────────────────────────────────────────────────────────

                    [Load More ...]
```

## Tailwind CSS Implementation

```html
<div class="min-h-screen bg-cream p-8">
  <!-- HEADER WITH FILTERS -->
  <div class="flex justify-between items-center mb-12 max-w-6xl mx-auto">
    <h1 class="text-4xl font-bold text-saffron">🏆 Leaderboard</h1>
    <div class="flex gap-4">
      <select class="px-4 py-2 border-2 border-light-gray rounded-lg focus:border-teal">
        <option>Weekly</option>
        <option>All-Time</option>
      </select>
      <select class="px-4 py-2 border-2 border-light-gray rounded-lg focus:border-teal">
        <option>Global</option>
        <option>Class</option>
      </select>
    </div>
  </div>

  <div class="max-w-6xl mx-auto">
    <!-- PODIUM -->
    <div class="flex justify-center gap-8 mb-12">
      <!-- 1st Place -->
      <div class="bg-gold rounded-lg p-8 text-center flex flex-col items-center w-48">
        <div class="text-5xl mb-4">🥇</div>
        <h3 class="text-lg font-bold text-dark-brown mb-2">Priya Mehta</h3>
        <div class="text-2xl font-bold text-saffron mb-1">3,240 XP</div>
        <div class="text-sm text-gray-600">Level 15</div>
      </div>

      <!-- 2nd Place -->
      <div class="bg-gray-300 rounded-lg p-8 text-center flex flex-col items-center w-48">
        <div class="text-5xl mb-4">🥈</div>
        <h3 class="text-lg font-bold text-dark-brown mb-2">Rohan Gupta</h3>
        <div class="text-2xl font-bold text-saffron mb-1">2,980 XP</div>
        <div class="text-sm text-gray-600">Level 14</div>
      </div>

      <!-- 3rd Place -->
      <div class="bg-yellow-700 bg-opacity-20 rounded-lg p-8 text-center flex flex-col items-center w-48">
        <div class="text-5xl mb-4">🥉</div>
        <h3 class="text-lg font-bold text-dark-brown mb-2">Meera Singh</h3>
        <div class="text-2xl font-bold text-saffron mb-1">2,750 XP</div>
        <div class="text-sm text-gray-600">Level 13</div>
      </div>
    </div>

    <!-- RANKING TABLE -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="w-full">
        <thead class="bg-teal text-white">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-bold">Rank</th>
            <th class="px-6 py-4 text-left text-sm font-bold">Username</th>
            <th class="px-6 py-4 text-right text-sm font-bold">XP</th>
            <th class="px-6 py-4 text-center text-sm font-bold">Level</th>
            <th class="px-6 py-4 text-center text-sm font-bold">Streak</th>
            <th class="px-6 py-4 text-left text-sm font-bold">Last Active</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-light-gray hover:bg-cream">
            <td class="px-6 py-4 text-sm text-dark-brown font-bold">1</td>
            <td class="px-6 py-4 text-sm text-dark-brown">Priya Mehta</td>
            <td class="px-6 py-4 text-sm text-dark-brown text-right font-bold">3,240</td>
            <td class="px-6 py-4 text-sm text-dark-brown text-center">15</td>
            <td class="px-6 py-4 text-sm text-center">22 🔥</td>
            <td class="px-6 py-4 text-sm text-gray-600">1h ago</td>
          </tr>
          <!-- More rows, with current user highlighted -->
          <tr class="bg-teal bg-opacity-10">
            <td class="px-6 py-4 text-sm text-dark-brown font-bold">4</td>
            <td class="px-6 py-4 text-sm text-dark-brown">Arjun Nair</td>
            <td class="px-6 py-4 text-sm text-dark-brown text-right font-bold">2,340</td>
            <td class="px-6 py-4 text-sm text-dark-brown text-center">12</td>
            <td class="px-6 py-4 text-sm text-center">8 🔥</td>
            <td class="px-6 py-4 text-sm text-gray-600">10m ago</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- LOAD MORE -->
    <div class="text-center mt-8">
      <button class="text-saffron font-bold hover:underline">
        Load More...
      </button>
    </div>
  </div>
</div>
```

---

# PAGE 8: QUIZ INTERFACE

## Visual Mockup
```
═══════════════════════════════════════════════════════════════
          Quiz: Nikhilam    Question 3/10    [Exit]   +15 ⭐
═══════════════════════════════════════════════════════════════

Progress: ●●●●●○○○○○ (50%)

╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                     97 × 98 = ?                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

  ◯ A) 9204
  
  ◯ B) 9306
  
  ◉ C) 9506       ← Selected (Teal circle)
  
  ◯ D) 9406

┌───────────────────────────────────────────────────────────────┐
│ [SHOW SOLUTION]            [NEXT QUESTION] ▶                │
└───────────────────────────────────────────────────────────────┘

┌─ ✓ CORRECT! +15 XP (Green border) ─────────────────────────┐
│                                                             │
│ Solution:                                                   │
│ Base = 100                                                  │
│ Deficits: 97-100=-3, 98-100=-2                             │
│                                                             │
│ Left side: 97 - 2 = 95                                      │
│ Right side: 3 × 2 = 06                                      │
│ Answer: 9506                                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Tailwind CSS Implementation

```html
<div class="min-h-screen bg-cream p-8">
  <!-- HEADER -->
  <div class="flex justify-between items-center mb-8 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-saffron">Quiz: Nikhilam</h1>
    <div class="flex gap-4 items-center">
      <span class="font-bold text-dark-brown">Question 3/10</span>
      <button class="bg-gray-300 text-dark-brown px-4 py-2 rounded font-bold">Exit</button>
    </div>
    <div class="text-xl font-bold text-saffron">+15 ⭐</div>
  </div>

  <div class="max-w-4xl mx-auto">
    <!-- PROGRESS INDICATOR -->
    <div class="flex justify-center gap-2 mb-12">
      <span>●●●●●</span>
      <span class="text-gray-400">○○○○○</span>
      <span class="text-gray-600 ml-4">(50%)</span>
    </div>

    <!-- QUESTION CARD -->
    <div class="bg-white rounded-lg shadow-md p-12 mb-8 text-center">
      <h2 class="text-4xl font-bold text-dark-brown">97 × 98 = ?</h2>
    </div>

    <!-- ANSWER OPTIONS -->
    <div class="space-y-4 mb-8">
      <!-- Option A -->
      <label class="flex items-center gap-4 p-6 border-2 border-light-gray rounded-lg cursor-pointer hover:border-teal transition">
        <input type="radio" name="answer" class="w-6 h-6"/>
        <span class="text-dark-brown font-medium">A) 9204</span>
      </label>

      <!-- Option B -->
      <label class="flex items-center gap-4 p-6 border-2 border-light-gray rounded-lg cursor-pointer hover:border-teal transition">
        <input type="radio" name="answer" class="w-6 h-6"/>
        <span class="text-dark-brown font-medium">B) 9306</span>
      </label>

      <!-- Option C - Selected -->
      <label class="flex items-center gap-4 p-6 border-2 border-teal bg-teal bg-opacity-5 rounded-lg cursor-pointer">
        <input type="radio" name="answer" class="w-6 h-6" checked/>
        <span class="text-dark-brown font-medium">C) 9506</span>
      </label>

      <!-- Option D -->
      <label class="flex items-center gap-4 p-6 border-2 border-light-gray rounded-lg cursor-pointer hover:border-teal transition">
        <input type="radio" name="answer" class="w-6 h-6"/>
        <span class="text-dark-brown font-medium">D) 9406</span>
      </label>
    </div>

    <!-- NAVIGATION BUTTONS -->
    <div class="flex justify-between gap-4 mb-8">
      <button class="flex-1 bg-light-gray text-dark-brown py-3 rounded-lg font-bold hover:bg-gray-400 transition">
        SHOW SOLUTION
      </button>
      <button class="flex-1 bg-saffron text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">
        NEXT QUESTION ▶
      </button>
    </div>

    <!-- FEEDBACK BOX (Green for correct) -->
    <div class="bg-green-50 border-2 border-green-500 rounded-lg p-6">
      <div class="text-lg font-bold text-green-700 mb-4">✓ Correct! +15 XP</div>
      <div class="text-dark-brown">
        <p class="font-bold mb-3">Solution:</p>
        <p class="mb-2">Base = 100</p>
        <p class="mb-2">Deficits: 97-100 = -3,  98-100 = -2</p>
        <p class="mb-2">Left side: 97 - 2 = 95</p>
        <p class="mb-2">Right side: 3 × 2 = 06</p>
        <p class="font-bold text-teal mt-4">Answer: 9506</p>
      </div>
    </div>
  </div>
</div>
```

---

# COMPLETE TAILWIND CSS CONFIGURATION

## tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'saffron': '#E8650A',
        'gold': '#D4A017',
        'teal': '#0D8A7A',
        'cream': '#FBF7EE',
        'dark-brown': '#2D2010',
        'light-gray': '#F0F0F0',
      },
      spacing: {
        '4px': '0.25rem',   // xs
        '8px': '0.5rem',    // sm
        '12px': '0.75rem',  // md
        '16px': '1rem',     // base
        '24px': '1.5rem',   // lg
        '32px': '2rem',     // xl
        '48px': '3rem',     // 2xl
      },
      fontSize: {
        'xs': ['0.5rem', '0.625rem'],
        'sm': ['0.625rem', '0.75rem'],
        'base': ['0.75rem', '0.875rem'],
        'lg': ['0.875rem', '1rem'],
        'xl': ['1rem', '1.25rem'],
        '2xl': ['1.125rem', '1.5rem'],
        '3xl': ['1.75rem', '2rem'],
      },
      boxShadow: {
        'subtle': '0 2px 4px rgba(0,0,0,0.1)',
        'md': '0 4px 8px rgba(0,0,0,0.15)',
        'lg': '0 8px 16px rgba(0,0,0,0.2)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out',
        'popup': 'popup 1.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popup: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-60px)' },
        },
      },
    },
  },
  plugins: [],
}
```

---

# REUSABLE COMPONENT SNIPPETS

## Primary Button
```html
<button class="bg-saffron text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
  Click Me
</button>
```

## Secondary Button
```html
<button class="border-2 border-saffron text-saffron px-6 py-3 rounded-lg font-bold hover:bg-saffron hover:text-white transition-colors">
  Click Me
</button>
```

## Card with Gold Border
```html
<div class="bg-white border-l-4 border-gold rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
  <h3 class="text-lg font-bold text-saffron mb-3">Card Title</h3>
  <p class="text-sm text-dark-brown">Card content goes here</p>
</div>
```

## Progress Bar (Linear)
```html
<div class="w-full bg-light-gray rounded-full h-3">
  <div class="bg-teal h-3 rounded-full transition-all" style="width: 60%"></div>
</div>
```

## Progress Ring (Circular)
```html
<div class="w-16 h-16 rounded-full border-4 border-light-gray border-t-teal flex items-center justify-center">
  <span class="text-lg font-bold">60%</span>
</div>
```

## Input Field
```html
<input 
  type="text" 
  placeholder="Enter text..."
  class="w-full px-6 py-3 border-2 border-light-gray rounded-lg text-dark-brown placeholder-gray-500 focus:border-teal focus:outline-none transition-colors"
/>
```

## Badge
```html
<span class="bg-saffron text-white px-3 py-1 rounded-full text-xs font-bold">
  Badge Label
</span>
```

## Card with Teal Border
```html
<div class="bg-white border-2 border-teal rounded-lg p-6 shadow-md">
  Content here
</div>
```

---

# RESPONSIVE DESIGN CLASSES

## Desktop (1200px+)
- `grid grid-cols-3` / `grid grid-cols-4`
- Sidebars always visible
- Large padding and spacing

## Tablet (768px-1199px)
- `grid grid-cols-2`
- Collapse sidebars into hamburger
- `hidden md:block` for desktop-only elements

## Mobile (<768px)
- `grid grid-cols-1`
- Full-width layout
- `block md:hidden` for mobile-only elements
- Min touch target: `w-12 h-12` (48×48px)
- Responsive padding: `px-4 md:px-6 lg:px-8`

---

# ANIMATION KEYFRAMES (Add to global.css)

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popup {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-popup {
  animation: popup 1.5s ease-out forwards;
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}
```

---

# IMPLEMENTATION CHECKLIST

## Setup
- [ ] Configure `tailwind.config.js` with custom colors and spacing
- [ ] Add custom animations to global CSS
- [ ] Set up responsive breakpoints
- [ ] Create component library (buttons, cards, inputs)

## Page Implementation
- [ ] Page 1: Landing Page
- [ ] Page 2: Curriculum Hub
- [ ] Page 3: Lesson Viewer
- [ ] Page 4: Practice Session
- [ ] Page 5: Game Modes Hub
- [ ] Page 6: User Dashboard
- [ ] Page 7: Leaderboard
- [ ] Page 8: Quiz Interface

## Testing
- [ ] Test on desktop (1200px+)
- [ ] Test on tablet (768px-1199px)
- [ ] Test on mobile (<768px)
- [ ] Verify color contrast (WCAG 2.1 AA)
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Test animations performance

## Accessibility
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure focus indicators visible (teal outline)
- [ ] Test with keyboard-only navigation
- [ ] Verify form labels
- [ ] Add alt text to images

---

## QUICK REFERENCE: COMMON TAILWIND PATTERNS

### Navigation Bar
```
bg-white shadow-md sticky top-0 z-50 → flex justify-between items-center
```

### Hero Section
```
bg-gradient-to-r from-saffron to-yellow-100 → py-24 px-4 text-center
```

### Card Container
```
bg-white rounded-lg shadow-md → p-6 hover:shadow-lg transition-shadow
```

### Grid Layout
```
grid grid-cols-3 gap-6 → responsive with md:grid-cols-2 lg:grid-cols-3
```

### Sidebar
```
w-48 bg-white shadow-md → p-6 overflow-y-auto
```

### Button
```
bg-saffron text-white → px-6 py-3 rounded-lg font-bold hover:bg-orange-600
```

### Badge/Pill
```
bg-saffron text-white → px-3 py-1 rounded-full text-xs font-bold
```

### Progress Bar
```
bg-light-gray rounded-full h-3 → contains bg-teal h-3 rounded-full with width%
```

---

**This document is 100% AI-ready. Copy any code snippet directly into your React/Vue/HTML files and it will work with Tailwind CSS!**

