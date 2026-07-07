# Mode 1 — Quick Check walkthrough

*5 minutes, no code. A planning meeting and a whiteboard are enough.*

## Scenario

Your team is about to ship a 90-second product demo video. Before publishing,
run the seven questions:

| # | Question | Answer |
|---|----------|--------|
| 🧠 Clarity | Is there ONE clear intention behind this? | ✅ yes — "show how export works in 3 clicks" |
| 🪞 Fidelity | Does the output match what was planned? | ✅ yes — final cut follows the script |
| ⚡ Energy | Is the energy calibrated to the content? | ✅ yes — calm voiceover, moderate cut rate |
| 🎯 Contrast | Is there enough tension to sustain attention? | ❌ no — no problem/solution moment, it's a flat feature tour |
| 🌊 Flow | Does it flow naturally from start to finish? | ✅ yes |
| 🔄 Traceability | Can we measure the impact of our decisions? | ❌ no — no analytics on the video landing page |
| ⚖️ Balance | Does it balance technical rigor with human resonance? | ✅ yes |

**Result: 5/7 → Ship with known gaps — document them.**

The two gaps become tickets: add a problem/solution hook in the first 10 seconds
(Contrast), and wire view/retention analytics before the next video (Traceability).

## The same thing in code (optional)

```typescript
import { quickCheck } from 'kybalion-protocol';

const result = quickCheck({
  clarity: true,
  fidelity: true,
  energy: true,
  contrast: false,
  flow: true,
  traceability: false,
  balance: true,
});

console.log(result);
// {
//   yes_count: 5,
//   gate: 'ship-with-known-gaps',
//   gaps: ['contrast', 'traceability']
// }
```

Gate table: 7/7 → `ship` · 5–6 → `ship-with-known-gaps` · 3–4 → `needs-work` · <3 → `reconsider-scope`.
