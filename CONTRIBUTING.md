# Contributing — how to build an adapter

An **adapter** is a set of dimension evaluators for one domain (video, SaaS,
podcast, e-commerce…). The core never knows about your domain — it only sees
the `KybalionDimensionEvaluator` contract.

## The contract

```typescript
interface KybalionDimensionEvaluator {
  readonly dimension: KybalionDimension;
  evaluate(context: EvalContext): Promise<DimensionScore>;
}
```

Rules (full spec in [SPEC.md](./SPEC.md)):

1. **`score`** 0–100. **`confidence`** 0–1, reflecting how complete your data is.
2. **`gap`** is `null` when passing, one actionable sentence when not — never `''`.
3. **`insight`** is always present, even when the score is high.
4. **`source`** traces every module/API that produced the score.
5. **No data?** Return the neutral convention: score 50, confidence 0
   (use `neutralScore()` from the core).

## Steps

1. Copy [`adapters/_template/`](./adapters/_template/) and rename it after your domain.
2. Implement one evaluator per dimension you can **actually measure** —
   omit the rest. `KybalionEvaluator` fills missing dimensions with the
   neutral convention automatically. Incremental adoption is the intended path.
3. Extend `EvalContext` with your domain fields instead of adding parameters.
4. Test each evaluator in isolation (see `tests/` for patterns). A throwing
   evaluator degrades to neutral — but don't rely on that as control flow.

## The Parsimony Rule (10%)

From [WHY.md](./WHY.md): if writing an adapter costs more than ~10% of the
effort of the thing it evaluates, don't automate it — use Mode 1 (quick check)
or Mode 2 (manual scored evaluation with `buildReport`) instead. DX first.

## Core PRs

The core is deliberately small: types, report construction, evaluator,
quick check. New utilities need a strong case — the metaprotocol
(see [VALIDATION_CASES.md](./VALIDATION_CASES.md), Case 4) rejects
bloated-core PRs by design. All PRs need tests (`npm test`) and a clean
`npm run typecheck`.
