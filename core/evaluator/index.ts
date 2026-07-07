// ============================================================
// KybalionEvaluator — Mode 3 (automated, adapter-based)
// ============================================================

import type {
  DimensionScore,
  EvalContext,
  KybalionDimension,
  KybalionDimensionEvaluator,
  KybalionReport,
} from '../types/index.js';
import { KYBALION_DIMENSIONS } from '../types/index.js';
import { buildReport, neutralScore, validateDimensionScore } from './report.js';

export type { BuildReportOptions } from './report.js';
export {
  buildReport,
  neutralScore,
  validateDimensionScore,
  PASS_THRESHOLD,
  TRACEABILITY_CRITICAL_THRESHOLD,
} from './report.js';

/**
 * A partial set of evaluators. Dimensions without an evaluator are
 * scored with the neutral convention (50, confidence 0) — this allows
 * incremental adoption, one adapter at a time.
 */
export type PartialEvaluatorSet = Partial<
  Record<KybalionDimension, KybalionDimensionEvaluator>
>;

/**
 * Runs the 7 dimension evaluators over an EvalContext and builds the report.
 *
 * Failure isolation: a throwing (or contract-violating) adapter never
 * takes the report down — its dimension degrades to the neutral score
 * with the failure recorded in `gap` and `source: ['error:<dimension>']`.
 */
export class KybalionEvaluator {
  private readonly evaluators: PartialEvaluatorSet;

  constructor(evaluators: PartialEvaluatorSet) {
    for (const dim of KYBALION_DIMENSIONS) {
      const ev = evaluators[dim];
      if (ev && ev.dimension !== dim) {
        throw new Error(
          `[kybalion] Evaluator registered under "${dim}" declares dimension "${ev.dimension}".`,
        );
      }
    }
    this.evaluators = { ...evaluators };
  }

  async evaluate(context: EvalContext = {}): Promise<KybalionReport> {
    const results = await Promise.all(
      KYBALION_DIMENSIONS.map((dim) => this.evaluateDimension(dim, context)),
    );
    const dimensions = Object.fromEntries(
      KYBALION_DIMENSIONS.map((dim, i) => [dim, results[i]]),
    ) as Record<KybalionDimension, DimensionScore>;

    return buildReport(dimensions, {
      ...(context.subject_id !== undefined
        ? { subject_id: context.subject_id }
        : {}),
      ...(context.subject_meta !== undefined
        ? { subject_meta: context.subject_meta }
        : {}),
      ...(context.traceability_loop_closed !== undefined
        ? { traceability_loop_closed: context.traceability_loop_closed }
        : {}),
    });
  }

  private async evaluateDimension(
    dim: KybalionDimension,
    context: EvalContext,
  ): Promise<DimensionScore> {
    const evaluator = this.evaluators[dim];
    if (!evaluator) {
      return neutralScore(`No evaluator registered for "${dim}".`, [
        'convention:no-evaluator',
      ]);
    }
    try {
      const score = await evaluator.evaluate(context);
      validateDimensionScore(dim, score);
      return score;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return neutralScore(`Evaluator for "${dim}" failed: ${message}`, [
        `error:${dim}`,
      ]);
    }
  }
}
