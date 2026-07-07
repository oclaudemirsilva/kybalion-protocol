// ============================================================
// Starter template for a domain adapter.
//
// Copy this folder, rename it after your domain, and implement one
// evaluator per dimension you can actually measure. Dimensions you
// cannot measure can simply be omitted from the evaluator set —
// KybalionEvaluator fills them with the neutral-score convention
// (score 50, confidence 0, gap describing the missing data).
// ============================================================

import type {
  DimensionScore,
  EvalContext,
  KybalionDimension,
  KybalionDimensionEvaluator,
} from '../../core/types/index.js';

export class TemplateEvaluator implements KybalionDimensionEvaluator {
  constructor(readonly dimension: KybalionDimension) {}

  async evaluate(_context: EvalContext): Promise<DimensionScore> {
    // TODO: replace with a real measurement for your domain.
    // Contract (docs/SPEC.md):
    //  - score: 0–100
    //  - confidence: 0–1, reflecting how complete your data is
    //  - gap: null when passing, one actionable sentence when not (never '')
    //  - source: every module/API that produced the score
    //  - imbalance: null when balanced; 'deficit' or 'excess' when score < 70
    return {
      score: 50,
      confidence: 0,
      gap: `Adapter for "${this.dimension}" not implemented yet.`,
      insight: 'Implement this adapter to measure the dimension.',
      source: ['adapter:_template'],
      imbalance: null,
    };
  }
}
