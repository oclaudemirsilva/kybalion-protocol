// ============================================================
// Quick Check — Mode 1 (7 yes/no questions, no code required)
// Gate table: README.md "Mode 1 — Quick Check"
// ============================================================

import type { KybalionDimension } from '../types/index.js';
import { KYBALION_DIMENSIONS } from '../types/index.js';

/** One yes/no answer per dimension. */
export type QuickCheckAnswers = Record<KybalionDimension, boolean>;

export type QuickCheckGate =
  | 'ship'                 // 7/7
  | 'ship-with-known-gaps' // 5–6/7 — document the gaps
  | 'needs-work'           // 3–4/7
  | 'reconsider-scope';    // < 3/7

export interface QuickCheckResult {
  yes_count: number;
  gate: QuickCheckGate;
  /** Dimensions answered "no" — document these before shipping. */
  gaps: KybalionDimension[];
}

export function quickCheck(answers: QuickCheckAnswers): QuickCheckResult {
  const gaps = KYBALION_DIMENSIONS.filter((d) => !answers[d]);
  const yes_count = KYBALION_DIMENSIONS.length - gaps.length;

  let gate: QuickCheckGate;
  if (yes_count === 7) {
    gate = 'ship';
  } else if (yes_count >= 5) {
    gate = 'ship-with-known-gaps';
  } else if (yes_count >= 3) {
    gate = 'needs-work';
  } else {
    gate = 'reconsider-scope';
  }

  return { yes_count, gate, gaps };
}
