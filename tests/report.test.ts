import { describe, expect, it } from 'vitest';
import {
  buildReport,
  neutralScore,
  KYBALION_DIMENSIONS,
  type DimensionScore,
  type KybalionDimension,
} from '../index.js';

function ds(score: number, over: Partial<DimensionScore> = {}): DimensionScore {
  return {
    score,
    confidence: 1,
    gap: score >= 70 ? null : 'Below threshold.',
    insight: `Insight for score ${score}.`,
    source: ['test'],
    imbalance: score >= 70 ? null : 'deficit',
    ...over,
  };
}

function dims(
  overrides: Partial<Record<KybalionDimension, number>> = {},
  base = 90,
): Record<KybalionDimension, DimensionScore> {
  return Object.fromEntries(
    KYBALION_DIMENSIONS.map((d) => [d, ds(overrides[d] ?? base)]),
  ) as Record<KybalionDimension, DimensionScore>;
}

describe('maturity ladder', () => {
  it('all 7 >= 70 without explicit loop closure caps at mature', () => {
    expect(buildReport(dims()).maturity).toBe('mature');
  });

  it('all 7 >= 70 with traceability_loop_closed reaches complete', () => {
    const report = buildReport(dims(), { traceability_loop_closed: true });
    expect(report.maturity).toBe('complete');
  });

  it('6 dimensions >= 70 is mature', () => {
    expect(buildReport(dims({ energy: 50 })).maturity).toBe('mature');
  });

  it('4–5 dimensions >= 70 is growing', () => {
    expect(buildReport(dims({ energy: 50, flow: 60 })).maturity).toBe('growing');
    expect(
      buildReport(dims({ energy: 50, flow: 60, contrast: 40 })).maturity,
    ).toBe('growing');
  });

  it('2–3 dimensions >= 70 is sprouting', () => {
    expect(
      buildReport(dims({ energy: 50, flow: 60, contrast: 40, clarity: 30 })).maturity,
    ).toBe('sprouting');
  });

  it('0–1 dimensions >= 70 is seed', () => {
    expect(buildReport(dims({}, 40)).maturity).toBe('seed');
    expect(buildReport(dims({ clarity: 90 }, 40)).maturity).toBe('seed');
  });
});

describe('critical rule — traceability < 30 caps maturity', () => {
  it('6 passing dimensions + traceability 20 → growing, not mature', () => {
    const report = buildReport(dims({ traceability: 20 }));
    expect(report.maturity).toBe('growing');
    expect(report.critical_gap).toBe('traceability');
    expect(report.top_recommendation).toBe(
      report.dimensions.traceability.insight,
    );
  });

  it('the cap does not apply when traceability >= 30', () => {
    expect(buildReport(dims({ energy: 50 })).maturity).toBe('mature');
  });
});

describe('critical_gap and top_recommendation', () => {
  it('picks the lowest-scoring dimension', () => {
    const report = buildReport(dims({ contrast: 15, flow: 40 }));
    expect(report.critical_gap).toBe('contrast');
  });

  it('resolves ties to the earliest dimension in narrative order', () => {
    const report = buildReport(dims({ fidelity: 30, balance: 30 }));
    expect(report.critical_gap).toBe('fidelity');
  });
});

describe('validation case: astrology (pseudoscience, Popperian demarcation)', () => {
  // docs/VALIDATION_CASES.md — Caso de Teste 2A
  const astrology = dims({
    clarity: 60,
    fidelity: 55,
    energy: 50,
    contrast: 0,
    flow: 40,
    traceability: 10,
    balance: 45,
  });

  it('rejects with contrast as the critical gap', () => {
    const report = buildReport(astrology);
    expect(report.critical_gap).toBe('contrast');
    expect(report.maturity).toBe('seed');
  });

  it('produces a visibly asymmetric radar', () => {
    const report = buildReport(astrology);
    expect(report.symmetry_coefficient).toBeLessThan(0.7);
  });
});

describe('symmetry coefficient', () => {
  it('is 1.0 for a perfectly uniform radar', () => {
    expect(buildReport(dims({}, 80)).symmetry_coefficient).toBe(1);
  });

  it('drops as the shape collapses on one edge', () => {
    const balanced = buildReport(dims({}, 80)).symmetry_coefficient;
    const collapsed = buildReport(dims({ traceability: 0 }, 80)).symmetry_coefficient;
    expect(collapsed).toBeLessThan(balanced);
    expect(collapsed).toBeGreaterThanOrEqual(0);
  });
});

describe('pillars', () => {
  it('computes force, form and synthesis as documented means', () => {
    const report = buildReport(
      dims({
        clarity: 80,
        energy: 60,
        fidelity: 90,
        contrast: 70,
        balance: 60,
        flow: 90,
        traceability: 30,
      }),
    );
    expect(report.pillars.force).toBe(70);
    expect(report.pillars.form).toBe(80);
    expect(report.pillars.synthesis).toBe(60);
  });
});

describe('radar and metadata', () => {
  it('normalizes scores to 0–1', () => {
    const report = buildReport(dims({ clarity: 85 }));
    expect(report.radar.clarity).toBe(0.85);
    expect(report.radar.energy).toBe(0.9);
  });

  it('honors the injected timestamp and subject fields', () => {
    const report = buildReport(dims(), {
      now: 1234,
      subject_id: 'video-42',
      subject_meta: { type: 'video' },
    });
    expect(report.evaluated_at).toBe(1234);
    expect(report.subject_id).toBe('video-42');
    expect(report.subject_meta).toEqual({ type: 'video' });
  });

  it('omits subject fields when not provided', () => {
    const report = buildReport(dims());
    expect('subject_id' in report).toBe(false);
    expect('subject_meta' in report).toBe(false);
  });
});

describe('contract validation', () => {
  it('rejects scores outside [0, 100]', () => {
    expect(() => buildReport(dims({ clarity: 101 }))).toThrow(RangeError);
    expect(() => buildReport(dims({ clarity: -1 }))).toThrow(RangeError);
  });

  it('rejects confidence outside [0, 1]', () => {
    const d = dims();
    d.energy = ds(80, { confidence: 2 });
    expect(() => buildReport(d)).toThrow(RangeError);
  });

  it('rejects empty-string gap (must be null or a real description)', () => {
    const d = dims();
    d.flow = ds(80, { gap: '' });
    expect(() => buildReport(d)).toThrow(/empty string/);
  });

  it('rejects a missing dimension', () => {
    const d = dims() as Partial<Record<KybalionDimension, DimensionScore>>;
    delete d.balance;
    expect(() =>
      buildReport(d as Record<KybalionDimension, DimensionScore>),
    ).toThrow(/Missing dimension "balance"/);
  });
});

describe('neutral-score convention', () => {
  it('is 50 with confidence 0 and a gap', () => {
    const n = neutralScore();
    expect(n.score).toBe(50);
    expect(n.confidence).toBe(0);
    expect(n.gap).toMatch(/No data/);
    expect(n.source).toEqual(['convention:no-data']);
  });
});
