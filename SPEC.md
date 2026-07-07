# SPEC — Kybalion Protocol

> **Versão 0.1** · Definição formal dos tipos e contratos do protocolo.
> Esta é a fonte de verdade para implementações em qualquer linguagem.

---

## Princípios do contrato

1. **Sem `overall_score`** — o radar é o output, não um número agregado
2. **`confidence` obrigatório** — scores sem confidence são opiniões, não medidas
3. **`gap` é nullable** — `null` significa aprovado; string significa gap identificado
4. **`insight` sempre presente** — uma frase acionável, mesmo quando score é alto
5. **`source` rastreável** — sempre diz de onde veio o score

---

## TypeScript

```typescript
// ============================================================
// Canonical types — kybalion-protocol/core/types/index.ts
// ============================================================

/** The 7 Hermetic dimensions. Order is the narrative sequence. */
export type KybalionDimension =
  | 'clarity'       // 1. Mentalism    — the seed
  | 'fidelity'      // 2. Correspondence — the root
  | 'energy'        // 3. Vibration    — the stem
  | 'contrast'      // 4. Polarity     — the flower
  | 'flow'          // 5. Rhythm       — the fruit
  | 'traceability'  // 6. Cause/Effect — the harvest
  | 'balance';      // 7. Gender       — the new seed

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
   * Example: ['adapters/video-fidelity', 'gemini-vision']
   */
  source: string[];

  /**
   * Type of imbalance (equivalent to reversed cards in Tarot).
   * - null: score >= 70 (dimension is balanced).
   * - 'deficit': score < 70 due to lack of the attribute (e.g. video is too slow/boring).
   * - 'excess': score < 70 due to over-saturation/bloat (e.g. video is too chaotic).
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
   * Coeficiente de Simetria (0.0 - 1.0).
   * Measures the balance of the radar shape.
   * Derived from 1 - (std_dev(scores) / max_possible_std_dev).
   * High symmetry (-> 1.0) means balanced growth across all dimensions.
   * Low symmetry (-> 0.0) indicates severe, uneven gaps.
   */
  symmetry_coefficient: number;

  /**
   * Macro pillar scores derived from the Three Pillars of Kabbalah:
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
    /** Loudness/energy curve: [{ time_sec, energy_0_1 }] */
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
   * Attention/retention curve: [{ time_sec, retention_0_1 }]
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
    outcome_measured: boolean; // has a measurable effect been recorded?
  }>;

  // ── Analytics ─────────────────────────────────────────────
  /**
   * Whether a traceability loop is explicitly closed.
   * true = decisions feed back into future decisions via measurement.
   */
  traceability_loop_closed?: boolean;

  // ── Structural quality ────────────────────────────────────
  /**
   * Technical issues detected (for the Balance dimension structural pole).
   * Compatible with common timeline-inspector/linter output formats.
   */
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
```

---

## Python

```python
# ============================================================
# Canonical types — kybalion_protocol/core/types.py
# ============================================================

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Literal, Optional
from abc import ABC, abstractmethod

KybalionDimension = Literal[
    "clarity",      # 1. Mentalism    — the seed
    "fidelity",     # 2. Correspondence — the root
    "energy",       # 3. Vibration    — the stem
    "contrast",     # 4. Polarity     — the flower
    "flow",         # 5. Rhythm       — the fruit
    "traceability", # 6. Cause/Effect — the harvest
    "balance",      # 7. Gender       — the new seed
]

KybalionMaturity = Literal["seed", "sprouting", "growing", "mature", "complete"]

KYBALION_DIMENSIONS: list[str] = [
    "clarity", "fidelity", "energy", "contrast",
    "flow", "traceability", "balance"
]


@dataclass
class DimensionScore:
    score: float                    # 0–100
    confidence: float               # 0.0–1.0
    gap: Optional[str]              # None = passes; str = gap description
    insight: str                    # one actionable sentence
    source: list[str]               # modules that produced this score
    imbalance: Optional[Literal["deficit", "excess"]] = None # None = balanced; deficit/excess = reversed card

    def passes(self, threshold: float = 70.0) -> bool:
        return self.score >= threshold and self.gap is None


@dataclass
class KybalionReport:
    dimensions: dict[str, DimensionScore]  # key = KybalionDimension
    maturity: KybalionMaturity
    critical_gap: str                       # KybalionDimension with lowest score
    top_recommendation: str
    radar: dict[str, float]                 # normalized 0.0–1.0
    symmetry_coefficient: float             # 0.0–1.0
    pillars: dict[str, float]               # key: force, form, synthesis
    evaluated_at: int                       # unix timestamp ms
    subject_id: Optional[str] = None
    subject_meta: Optional[dict] = None
    # No overall_score by design.


@dataclass
class EvalContext:
    subject_id: Optional[str] = None
    subject_meta: Optional[dict] = None
    transcript_text: Optional[str] = None
    spec_text: Optional[str] = None
    audio_features: Optional[dict] = None
    segment_boundaries: Optional[list[float]] = None
    duration_sec: Optional[float] = None
    fidelity_scores: Optional[dict[str, float]] = None
    retention_curve: Optional[list[dict]] = None
    decision_history: Optional[list[dict]] = None
    traceability_loop_closed: Optional[bool] = None
    structural_issues: Optional[list[dict]] = None


class KybalionDimensionEvaluator(ABC):
    """Base class for all dimension evaluators."""

    @property
    @abstractmethod
    def dimension(self) -> str:  # KybalionDimension
        ...

    @abstractmethod
    async def evaluate(self, context: EvalContext) -> DimensionScore:
        ...
```

---

## KybalionReport — construction rules

```typescript
// Utility: build a KybalionReport from 7 DimensionScores.
function buildReport(
  dimensions: Record<KybalionDimension, DimensionScore>,
  opts?: { subject_id?: string; subject_meta?: Record<string, unknown> }
): KybalionReport {

  const scores = Object.values(dimensions).map(d => d.score);
  const dimensionsAbove70 = scores.filter(s => s >= 70).length;
  const traceabilityScore = dimensions.traceability.score;

  // Maturity rule
  let maturity: KybalionMaturity;
  if (dimensionsAbove70 === 7 && traceabilityScore >= 70) {
    maturity = 'complete';
  } else if (dimensionsAbove70 >= 6) {
    maturity = 'mature';
  } else if (dimensionsAbove70 >= 4) {
    maturity = 'growing';
  } else if (dimensionsAbove70 >= 2) {
    maturity = 'sprouting';
  } else {
    maturity = 'seed';
  }

  // Critical rule: traceability < 30 overrides to 'growing'
  if (traceabilityScore < 30 && maturity !== 'seed' && maturity !== 'sprouting') {
    maturity = 'growing';
  }

  const entries = Object.entries(dimensions) as [KybalionDimension, DimensionScore][];
  const critical_gap = entries.reduce((min, [dim, score]) =>
    score.score < dimensions[min].score ? dim : min,
    entries[0][0]
  );

  const top_recommendation = dimensions[critical_gap].insight;

  const radar = Object.fromEntries(
    entries.map(([dim, score]) => [dim, score.score / 100])
  ) as Record<KybalionDimension, number>;

  // Calculate Symmetry Coefficient
  const mean = scores.reduce((sum, s) => sum + s, 0) / 7;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / 7;
  const stdDev = Math.sqrt(variance);
  // Max possible standard deviation occurs when one score is 100 and another is 0,
  // or generally in a [0, 100] scale. For 7 items, the maximum std dev occurs
  // when 3 are 100 and 4 are 0 (or vice versa), which is ~50.
  const maxStdDev = 50.0; 
  const symmetry_coefficient = Math.max(0, Math.min(1, 1 - (stdDev / maxStdDev)));

  // Calculate Pillar Scores
  const pillars = {
    force: (dimensions.clarity.score + dimensions.energy.score) / 2,
    form: (dimensions.fidelity.score + dimensions.contrast.score) / 2,
    synthesis: (dimensions.balance.score + dimensions.flow.score + dimensions.traceability.score) / 3,
  };

  return {
    dimensions,
    maturity,
    critical_gap,
    top_recommendation,
    radar,
    symmetry_coefficient,
    pillars,
    evaluated_at: Date.now(),
    ...opts,
  };
}
```

---

## Convenção: score neutro quando sem dados

```typescript
// Use this when a dimension has no data to evaluate.
const NEUTRAL_SCORE: DimensionScore = {
  score: 50,            // neutral — not good, not bad
  confidence: 0.0,      // signals: this is a convention, not a measurement
  gap: "No data available to evaluate this dimension.",
  insight: "Gather data to evaluate this dimension meaningfully.",
  source: ['convention:no-data'],
  imbalance: null,
};
```

---

## Versioning

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-07-06 | Initial spec. No overall_score. 3 modes. |

---

## References

- [README.md](./README.md) — protocol overview
- [DIMENSIONS.md](./DIMENSIONS.md) — evaluator algorithms per dimension
- [CONTRIBUTING.md](./CONTRIBUTING.md) — how to implement adapters
