# Mode 3 — Automated Evaluation walkthrough

*Adapter-based. Each dimension gets an evaluator that computes its score from
your domain's data. Adopt incrementally — one adapter at a time.*

## Two real adapters, five neutral fills

You don't need all 7 adapters to start. Here a software team automates just
Fidelity (from the test suite) and Traceability (from decision history):

```typescript
import {
  KybalionEvaluator,
  type DimensionScore,
  type EvalContext,
  type KybalionDimensionEvaluator,
} from 'kybalion-protocol';

const fidelityFromTests: KybalionDimensionEvaluator = {
  dimension: 'fidelity',
  async evaluate(ctx: EvalContext): Promise<DimensionScore> {
    const scores = Object.values(ctx.fidelity_scores ?? {});
    if (scores.length === 0) {
      return {
        score: 50, confidence: 0,
        gap: 'No fidelity data — run the test suite first.',
        insight: 'Wire the test pass-rate into fidelity_scores.',
        source: ['adapter:fidelity-from-tests'], imbalance: null,
      };
    }
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    return {
      score: mean,
      confidence: 0.9, // direct measurement, partial coverage
      gap: mean >= 70 ? null : 'Output diverges from spec — failing contracts.',
      insight: mean >= 70 ? 'Spec and behavior correspond.' : 'Fix the failing contracts before adding scope.',
      source: ['adapter:fidelity-from-tests'],
      imbalance: mean >= 70 ? null : 'deficit',
    };
  },
};

const traceabilityFromHistory: KybalionDimensionEvaluator = {
  dimension: 'traceability',
  async evaluate(ctx: EvalContext): Promise<DimensionScore> {
    const decisions = ctx.decision_history ?? [];
    const measured = decisions.filter((d) => d.outcome_measured).length;
    const coverage = decisions.length === 0 ? 0 : (measured / decisions.length) * 100;
    return {
      score: coverage,
      confidence: decisions.length > 0 ? 1 : 0,
      gap: coverage >= 70 ? null : 'Most decisions have no measured outcome — the loop is open.',
      insight: coverage >= 70 ? 'Decisions feed back into decisions.' : 'Record an outcome for every shipped decision.',
      source: ['adapter:traceability-from-history'],
      imbalance: coverage >= 70 ? null : 'deficit',
    };
  },
};

const evaluator = new KybalionEvaluator({
  fidelity: fidelityFromTests,
  traceability: traceabilityFromHistory,
  // clarity, energy, contrast, flow, balance: intentionally omitted
});

const report = await evaluator.evaluate({
  subject_id: 'release:2.4.0',
  fidelity_scores: { 'contract-a': 96, 'contract-b': 88 },
  decision_history: [
    { id: 'd1', kind: 'feature-flag', description: 'Enable new parser', ts: 1751500000000, outcome_measured: true },
    { id: 'd2', kind: 'refactor', description: 'Split render loop', ts: 1751600000000, outcome_measured: false },
  ],
});
```

## What the core guarantees

- **Missing evaluators degrade honestly**: the 5 omitted dimensions come back as
  score 50, confidence 0, with `gap: 'No evaluator registered for "clarity".'` —
  visible in the radar, never silently green.
- **A crashing adapter cannot take the report down**: if an adapter throws (or
  returns a score outside the contract), that dimension degrades to neutral with
  the failure recorded in `gap` and `source: ['error:<dimension>']`. The other
  six still evaluate.
- **`complete` maturity must be earned explicitly**: even with all 7 scores ≥ 70,
  the report only reaches `complete` when the context declares
  `traceability_loop_closed: true`.

Build your own adapters: [CONTRIBUTING.md](../CONTRIBUTING.md) and
[adapters/_template/](../adapters/_template/).
