# Mode 2 — Scored Evaluation walkthrough

*~30 minutes, manual. The team scores each dimension 0–100 using the rubrics
in [DIMENSIONS.md](../DIMENSIONS.md), then `buildReport` derives everything else.*

## Scenario

A SaaS team evaluates a newly shipped "smart notifications" feature.
They score each dimension in a review meeting:

```typescript
import { buildReport, type DimensionScore } from 'kybalion-protocol';

const score = (s: number, gap: string | null, insight: string): DimensionScore => ({
  score: s,
  confidence: 0.8, // manual team estimate, not a direct measurement
  gap,
  insight,
  source: ['team-review:2026-07'],
  imbalance: s >= 70 ? null : 'deficit',
});

const report = buildReport(
  {
    clarity:      score(85, null, 'One job: surface what needs action today.'),
    fidelity:     score(90, null, 'Shipped behavior matches the spec.'),
    energy:       score(55, 'Notification frequency untuned — users report fatigue.', 'Add per-user frequency calibration.'),
    contrast:     score(70, null, 'Actionable vs. informational split is clear.'),
    flow:         score(60, 'Onboarding drops users straight into settings.', 'Add a 3-step guided setup.'),
    traceability: score(20, 'No feedback loop from decisions to outcomes.', 'Instrument open/dismiss rates before iterating further.'),
    balance:      score(65, 'Copy is technically precise but cold.', 'Rewrite the top 5 notifications with human copy.'),
  },
  { subject_id: 'feature:smart-notifications' },
);
```

## What comes out

```json
{
  "maturity": "sprouting",
  "critical_gap": "traceability",
  "top_recommendation": "Instrument open/dismiss rates before iterating further.",
  "symmetry_coefficient": 0.57,
  "pillars": { "force": 70, "form": 80, "synthesis": 48.3 }
}
```

Note what the protocol did:

- **No `overall_score`.** The mean (63.6) would look "fine" and hide the hole.
- **`critical_gap` = traceability (20).** The radar shape collapses on one edge —
  that edge is where to work first, and `top_recommendation` says exactly what to do.
- **Pillars** show the diagnosis at a glance: Force 70 / Form 80 / Synthesis 48 —
  the feature is well-built and well-intended, but poorly integrated and flying blind.
- Had 6 dimensions been ≥ 70, traceability at 20 (< 30) would still cap maturity
  at `growing` — a product flying blind is not mature.
