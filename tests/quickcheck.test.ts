import { describe, expect, it } from 'vitest';
import {
  quickCheck,
  KYBALION_DIMENSIONS,
  type QuickCheckAnswers,
} from '../index.js';

function answers(no: string[] = []): QuickCheckAnswers {
  return Object.fromEntries(
    KYBALION_DIMENSIONS.map((d) => [d, !no.includes(d)]),
  ) as QuickCheckAnswers;
}

describe('quickCheck (Mode 1)', () => {
  it('7/7 → ship', () => {
    const result = quickCheck(answers());
    expect(result.yes_count).toBe(7);
    expect(result.gate).toBe('ship');
    expect(result.gaps).toEqual([]);
  });

  it('5–6/7 → ship-with-known-gaps, listing the gaps', () => {
    expect(quickCheck(answers(['traceability'])).gate).toBe(
      'ship-with-known-gaps',
    );
    const result = quickCheck(answers(['traceability', 'energy']));
    expect(result.gate).toBe('ship-with-known-gaps');
    expect(result.gaps).toEqual(['energy', 'traceability']);
  });

  it('3–4/7 → needs-work', () => {
    expect(quickCheck(answers(['clarity', 'energy', 'flow'])).gate).toBe(
      'needs-work',
    );
    expect(
      quickCheck(answers(['clarity', 'energy', 'flow', 'balance'])).gate,
    ).toBe('needs-work');
  });

  it('< 3/7 → reconsider-scope', () => {
    const result = quickCheck(
      answers(['clarity', 'energy', 'flow', 'balance', 'contrast']),
    );
    expect(result.yes_count).toBe(2);
    expect(result.gate).toBe('reconsider-scope');
  });
});
