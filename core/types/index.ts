// ============================================================
// Canonical types — kybalion-protocol/core/types/index.ts
// Source of truth: docs/SPEC.md (v0.1)
// ============================================================

/** The 7 Hermetic dimensions. Order is the narrative sequence. */
export type KybalionDimension =
  | 'clarity'       // 1. Mentalism      — the seed
  | 'fidelity'      // 2. Correspondence — the root
  | 'energy'        // 3. Vibration      — the stem
  | 'contrast'      // 4. Polarity       — the flower
  | 'flow'          // 5. Rhythm         — the fruit
  | 'traceability'  // 6. Cause/Effect   — the harvest
  | 'balance';      // 7. Gender         — the new seed

/** The 7 dimensions in narrative order — canonical iteration order. */
export const KYBALION_DIMENSIONS = [
  'clarity',
  'fidelity',
  'energy',
  'contrast',
  'flow',
  'traceability',
  'balance',
] as const satisfies readonly KybalionDimension[];

/** Maturity is defined by how many dimensions score >= 70. */
export type KybalionMaturity =
  | 'seed'       // 0–1 dimensions >= 70
  | 'sprouting'  // 2–3 dimensions >= 70
  | 'growing'    // 4–5 dimensions >= 70
  | 'mature'     // 6 dimensions >= 70
  | 'complete';  // all 7 >= 70 AND traceability loop explicitly closed

/**
 * The score output of a single dimension evaluator.
 * Every field is required — no optional fields to avoid silent gaps.
 */
export interface DimensionScore {
  /** 0–100. Integer or 1 decimal place. */
  score: number;

  /**
   * How much to trust this score.
   * 1.0 = direct measurement with full data.
   * 0.7–0.9 = proxy measurement with partial data.
   * 0.3–0.7 = rough estimate.
   * 0.0 = no data — score defaults to 50 (neutral convention).
   */
  confidence: number;

  /**
   * null → dimension passes (score >= threshold).
   * string → describes the gap in one actionable sentence.
   * Never empty string — either null or a real description.
   */
  gap: string | null;

  /** One actionable sentence. Positive if passing, corrective if gap. */
  insight: string;

  /**
   * Which modules/APIs/methods produced this score.
   * Used for auditability — traces the score back to its source.
   * Example: ['services/modelagem/v58', 'gemini-vision']
   */
  source: string[];

  /**
   * Type of imbalance (equivalent to reversed cards in Tarot).
   * - null: score >= 70 (dimension is balanced).
   * - 'deficit': score < 70 due to lack of the attribute.
   * - 'excess': score < 70 due to over-saturation/bloat.
   */
  imbalance: 'deficit' | 'excess' | null;
}

/**
 * The complete output of a Kybalion evaluation.
 * No overall_score — the radar IS the output.
 */
export interface KybalionReport {
  /** All 7 dimensions. Every key must be present. */
  dimensions: Record<KybalionDimension, DimensionScore>;

  /**
   * Maturity level based on how many dimensions score >= 70.
   * Note: traceability < 30 overrides maturity to 'growing'
   * regardless of other scores (critical rule).
   */
  maturity: KybalionMaturity;

  /**
   * The dimension with the lowest score — the primary gap.
   * This is where to focus first.
   */
  critical_gap: KybalionDimension;

  /** One sentence: the single most impactful action to take next. */
  top_recommendation: string;

  /**
   * Normalized 0.0–1.0 values for radar visualization.
   * Derived from dimensions[d].score / 100.
   */
  radar: Record<KybalionDimension, number>;

  /**
   * Coeficiente de Simetria (0.0–1.0).
   * Measures the balance of the radar shape.
   * Derived from 1 - (std_dev(scores) / max_possible_std_dev).
   * High symmetry (→ 1.0) means balanced growth across all dimensions.
   * Low symmetry (→ 0.0) indicates severe, uneven gaps.
   */
  symmetry_coefficient: number;

  /**
   * Macro pillar scores (the Three Pillars):
   * - force (Mercy): mean(clarity, energy)
   * - form (Severity): mean(fidelity, contrast)
   * - synthesis (Mildness): mean(balance, flow, traceability)
   */
  pillars: {
    force: number;
    form: number;
    synthesis: number;
  };

  /** Unix timestamp (ms) when this report was generated. */
  evaluated_at: number;

  /** Optional: links this report to a specific project/feature/content ID. */
  subject_id?: string;

  /**
   * Optional: free-form metadata about the subject.
   * Example: { type: 'video', title: 'My reel', version: '2.1' }
   */
  subject_meta?: Record<string, unknown>;
}

/**
 * The evaluation context passed to each dimension evaluator.
 * All fields are optional — evaluators use what's available
 * and set confidence accordingly.
 *
 * Domain-specific adapters extend this interface with their own fields.
 */
export interface EvalContext {
  // ── Identity ──────────────────────────────────────────────
  subject_id?: string;
  subject_meta?: Record<string, unknown>;

  // ── Text / Transcript ─────────────────────────────────────
  /** Full transcript text (for content evaluation). */
  transcript_text?: string;
  /** Declared spec or intended description (for software/feature evaluation). */
  spec_text?: string;

  // ── Audio ─────────────────────────────────────────────────
  audio_features?: {
    bpm?: number;
    loudness_rms?: number;
    /** Loudness/energy curve. */
    energy_curve?: Array<{ time_sec: number; energy: number }>;
  };

  // ── Structure / Timeline ──────────────────────────────────
  /** Timestamps (seconds) of structural boundaries (cuts, chapters, sections). */
  segment_boundaries?: number[];
  /** Total duration in seconds. */
  duration_sec?: number;

  // ── Quality signals ───────────────────────────────────────
  /**
   * Pre-computed fidelity scores per unit (e.g., clip ID → fidelity 0–100).
   * Used by the Fidelity dimension to avoid recomputing.
   */
  fidelity_scores?: Record<string, number>;
  /**
   * Attention/retention curve.
   * Used by Contrast, Flow, and Traceability dimensions.
   */
  retention_curve?: Array<{ time_sec: number; retention: number }>;

  // ── Decision history ──────────────────────────────────────
  /**
   * Ordered list of decisions made (edits, commits, feature flags, etc.)
   * Used by Traceability to evaluate loop closure.
   */
  decision_history?: Array<{
    id: string;
    kind: string;
    description: string;
    ts: number;
    /** Has a measurable effect been recorded for this decision? */
    outcome_measured: boolean;
  }>;

  // ── Analytics ─────────────────────────────────────────────
  /**
   * Whether a traceability loop is explicitly closed.
   * true = decisions feed back into future decisions via measurement.
   */
  traceability_loop_closed?: boolean;

  // ── Structural quality ────────────────────────────────────
  /** Technical issues detected (for the Balance dimension structural pole). */
  structural_issues?: Array<{
    id: string;
    kind: 'suggestion' | 'warning' | 'info';
    title: string;
  }>;
}

/**
 * The contract every dimension evaluator must implement.
 * One evaluator per dimension. Stateless — all context via EvalContext.
 */
export interface KybalionDimensionEvaluator {
  readonly dimension: KybalionDimension;
  evaluate(context: EvalContext): Promise<DimensionScore>;
}

/**
 * Convenience type: a full set of 7 evaluators.
 * Used by KybalionEvaluator to run all dimensions.
 */
export type KybalionEvaluatorSet = Record<
  KybalionDimension,
  KybalionDimensionEvaluator
>;
