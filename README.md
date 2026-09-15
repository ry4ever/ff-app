# FEARLESS FOOTBALLER — SEE | REHEARSE | BECOME

Strategic Dual-ICP Native Platform for High-Performance Youth Athletes & Supportive Parents.
Built strictly to the **Fearless Footballer Specification Blueprint** with native **Stripe** subscriptions and family account pairing.

---

## ⚽ Brand Design System
- **Tone**: Professional, Direct & Results-Focused
- **Typography**: Montserrat (Bold / Regular)
- **Color Palette**:
  - `#000000` Deep Pitch Black
  - `#008BCE` Fearless Blue
  - `#69E0FA` Cyan Highlight
  - `#A3ACAC` Composure Silver

---

## 🎯 Dual-ICP Architecture

| Dimension | The Parent ICP | The Athlete ICP |
| :--- | :--- | :--- |
| **Primary Motivation** | Emotional well-being, progress visibility & developmental oversight | Elite composure, unshakeable confidence & competitive status |
| **Pricing / Track** | Value-based membership (via **Stripe**); mental health ROI | Feature-based; performance gains, badges & social proof |
| **Core Pain Point** | The "Drive-Home Anxiety" and lack of post-match insight | Performance nerves and the "Confidence Gap" under pressure |
| **App Interaction** | Dashboard tracking and **Conversation Starters** | High-frequency **Daily Reps** (5-minute rehearsals) & streak completion |

---

## 📱 Native Screen Architecture (iOS / Android / Web)

- **Screen 1: Questionnaire (Onboarding)**
  - First-open 5-question visual survey (Position, Match Target, Main Barrier, Frequency, Level).
  - Hybrid Recommender Engine maps answers to 1 of 4 archetypes and populates a tailored 7-day schedule.
- **Screen 2: Fearless HQ (Command Center - Tab 4)**
  - Primary thumb-strike zone command center.
  - Top Metrics: `Composure Streak: 4/5 Days` + Flame Icon, Composure Score meter.
  - Vertical 7-day stack with active day highlight, status badges, and audio details.
  - CTA: `[ Start Fearless Rehearsal ]`.
- **Screen 3: Fearless Custom Mode**
  - Sliding top toggle unlocks edit icons on all 7 daily cards.
  - Tapping opens bottom-sheet with full 11-session Fearless Vault catalog.
  - Swapping an audio rep instant-syncs to the Parent Dashboard.
- **Screen 4: Community Feed (Shortcuts Feed)**
  - Verified routines from academy mentors (e.g., Mark's Elite Academy Match-Eve Routine).
  - 1-Tap CTA: `[ Import Routine to Fearless HQ ]`.
- **Parent Support View**:
  - Eliminates "Drive-Home Anxiety" with real-time progress metrics.
  - Dynamic **Conversation Starter** card generated whenever the athlete finishes an audio rehearsal.
  - Direct **Stripe** subscription management and 6-digit family pairing code (`FEAR-XXXX`).

---

## 🛡️ Telemetry Duration Guard & 45-Day Jersey Milestone

- **AC 4.1**: Session marked complete only if audio playback duration matches actual file length (prevents skipping/scrubbing to cheat streaks).
- **AC 4.2**: Hitting a 45-day active streak sets `jersey_reward_eligible = true` and triggers fulfillment alert for the official branded match jersey (Saturday Sideline Effect).

---

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Run Automated Unit & Spec Tests
```bash
npm test
```
All 22 unit tests validate:
1. `telemetry.test.ts`: AC 4.1 duration match verification & cheat rejection.
2. `archetypes.test.ts`: Section 8 barrier-to-archetype mapping rules.
3. `streakMilestone.test.ts`: AC 4.2 45-day jersey milestone fulfillment trigger.
4. `scheduler.test.ts`: 7-day calendar generator, custom mode swapper, and community importer.
5. `stripeWebhook.test.ts`: Stripe subscription events and 6-digit family pairing codes.
6. `conversationStarter.test.ts`: Dynamic parent conversation prompt generation.

### Production Build
```bash
npm run build
```
