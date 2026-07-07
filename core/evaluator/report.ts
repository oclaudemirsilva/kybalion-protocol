// ============================================================
// KybalionReport construction — docs/SPEC.md "construction rules"
// ============================================================

import type {
  DimensionScore,
  KybalionDimension,
  KybalionMaturity,
  KybalionReport,
} from '../types/index.js';
import { KYBALION_DIMENSIONS } from '../types/index.js';

/** A dimension passes when its score reaches this threshold. */
export const PASS_THRESHOLD = 70;

/**
 * Critical rule (SPEC.md): traceability below this caps maturity at
 * 'growing' — a product flying blind is not mature.
 */
export const TRACEABILITY_CRITICAL_THRESHOLD = 30;

/** Max possible std dev of 7 scores on a 0–100 scale (SPEC.md). */
const MAX_STD_DEV = 50;

/**
 * Neutral-score convention: when a dimension has no data, score is 50
 * (not 0) with confidence 0.0 to signal it is a convention, not a measurement.
 */
export function neutralScore(
  gap = 'No data available to evaluate this dimension.',
  source: string[] = ['convention:no-data'],
): DimensionScore {
  return {
    score: 50,
    confidence: 0,
    gap,
    insight: 'Gather data to evaluate this dimension meaningfully.',
    source,
    imbalance: null,
  };
}

/**
 * Enforces the SPEC contract on a DimensionScore.
 * Throws with an actionable message on violation.
 */
export function validateDimensionScore(
  dimension: KybalionDimension,
  s: DimensionScore,
): void {
  if (!Number.isFinite(s.score) || s.score < 0 || s.score > 100) {
    throw new RangeError(
      `[kybalion] ${dimension}: score must be a finite number in [0, 100], got ${s.score}.`,
    );
  }
  if (!Number.isFinite(s.confidence) || s.confidence < 0 || s.confidence > 1) {
    throw new RangeError(
      `[kybalion] ${dimension}: confidence must be a finite number in [0, 1], got ${s.confidence}.`,
    );
  }
  if (s.gap === '') {
    throw new Error(
      `[kybalion] ${dimension}: gap must be null or a real description, never an empty string.`,
    );
  }
  if (typeof s.insight !== 'string' || s.insight.trim() === '') {
    throw new Error(
      `[kybalion] ${dimension}: insight is required — one actionable sentence.`,
    );
  }
  if (!Array.isArray(s.source)) {
    throw new Error(
      `[kybalion] ${dimension}: source must be an array of module identifiers.`,
    );
  }
}

export interface BuildReportOptions {
  subject_id?: string;
  subject_meta?: Record<string, unknown>;
  /**
   * Maturity 'complete' requires this to be explicitly true — all 7
   * dimensions >= 70 alone only reaches 'mature' (README maturity table).
   */
  traceability_loop_closed?: boolean;
  /** Timestamp override (ms) for deterministic output. Defaults to Date.now(). */
  now?: number;
}

/** Builds a KybalionReport from 7 DimensionScores (Mode 2 and Mode 3). */
export function buildReport(
  dimensions: Record<KybalionDimension, DimensionScore>,
  opts: BuildReportOptions = {},
): KybalionReport {
  for (const dim of KYBALION_DIMENSIONS) {
    const s = dimensions[dim];
    if (!s) {
      throw new Error(
        `[kybalion] Missing dimension "${dim}" — all 7 must be present. Use neutralScore() when there is no data.`,
      );
    }
    validateDimensionScore(dim, s);
  }

  const scores = KYBALION_DIMENSIONS.map((d) => dimensions[d].score);
  const above = scores.filter((s) => s >= PASS_THRESHOLD).length;
  const traceabilityScore = dimensions.traceability.score;

  let maturity: KybalionMaturity;
  if (above === 7) {
    maturity = opts.traceability_loop_closed === true ? 'complete' : 'mature';
  } else if (above === 6) {
    maturity = 'mature';
  } else if (above >= 4) {
    maturity = 'growing';
  } else if (above >= 2) {
    maturity = 'sprouting';
  } else {
    maturity = 'seed';
  }

  if (
    traceabilityScore < TRACEABILITY_CRITICAL_THRESHOLD &&
    (maturity === 'mature' || maturity === 'complete')
  ) {
    maturity = 'growing';
  }

  // Lowest score wins; ties resolve to the earliest in narrative order.
  let critical_gap: KybalionDimension = KYBALION_DIMENSIONS[0];
  for (const dim of KYBALION_DIMENSIONS) {
    if (dimensions[dim].score < dimensions[critical_gap].score) {
      critical_gap = dim;
    }
  }

  const radar = Object.fromEntries(
    KYBALION_DIMENSIONS.map((d) => [d, dimensions[d].score / 100]),
  ) as Record<KybalionDimension, number>;

  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance =
    scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;
  const symmetry_coefficient = Math.max(
    0,
    Math.min(1, 1 - Math.sqrt(variance) / MAX_STD_DEV),
  );

  const pillars = {
    force: (dimensions.clarity.score + dimensions.energy.score) / 2,
    form: (dimensions.fidelity.score + dimensions.contrast.score) / 2,
    synthesis:
      (dimensions.balance.score +
        dimensions.flow.score +
        dimensions.traceability.score) /
      3,
  };

  return {
    dimensions,
    maturity,
    critical_gap,
    top_recommendation: dimensions[critical_gap].insight,
    radar,
    symmetry_coefficient,
    pillars,
    evaluated_at: opts.now ?? Date.now(),
    ...(opts.subject_id !== undefined ? { subject_id: opts.subject_id } : {}),
    ...(opts.subject_meta !== undefined
      ? { subject_meta: opts.subject_meta }
      : {}),
  };
}
