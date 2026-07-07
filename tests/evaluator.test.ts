import { describe, expect, it } from 'vitest';
import {
  KybalionEvaluator,
  KYBALION_DIMENSIONS,
  type DimensionScore,
  type KybalionDimension,
  type KybalionDimensionEvaluator,
  type PartialEvaluatorSet,
} from '../index.js';

function stub(
  dimension: KybalionDimension,
  score: number,
): KybalionDimensionEvaluator {
  return {
    dimension,
    async evaluate(): Promise<DimensionScore> {
      return {
        score,
        confidence: 1,
        gap: score >= 70 ? null : 'Low.',
        insight: `${dimension} measured at ${score}.`,
        source: [`stub:${dimension}`],
        imbalance: score >= 70 ? null : 'deficit',
      };
    },
  };
}

function fullSet(score = 90): PartialEvaluatorSet {
  return Object.fromEntries(
    KYBALION_DIMENSIONS.map((d) => [d, stub(d, score)]),
  ) as PartialEvaluatorSet;
}

describe('KybalionEvaluator (Mode 3)', () => {
  it('runs all 7 evaluators and builds a full report', async () => {
    const evaluator = new KybalionEvaluator(fullSet(90));
    const report = await evaluator.evaluate({
      subject_id: 'proj-1',
      traceability_loop_closed: true,
    });

    for (const dim of KYBALION_DIMENSIONS) {
      expect(report.dimensions[dim].score).toBe(90);
    }
    expect(report.maturity).toBe('complete');
    expect(report.subject_id).toBe('proj-1');
  });

  it('fills missing evaluators with the neutral convention', async () => {
    const evaluator = new KybalionEvaluator({
      fidelity: stub('fidelity', 90),
      balance: stub('balance', 80),
    });
    const report = await evaluator.evaluate();

    expect(report.dimensions.fidelity.score).toBe(90);
    expect(report.dimensions.balance.score).toBe(80);
    expect(report.dimensions.clarity.score).toBe(50);
    expect(report.dimensions.clarity.confidence).toBe(0);
    expect(report.dimensions.clarity.gap).toMatch(/No evaluator registered/);
    expect(report.maturity).toBe('sprouting');
  });

  it('isolates a throwing adapter without taking the report down', async () => {
    const set = fullSet(90);
    set.energy = {
      dimension: 'energy',
      async evaluate(): Promise<DimensionScore> {
        throw new Error('audio service unreachable');
      },
    };
    const report = await new KybalionEvaluator(set).evaluate();

    expect(report.dimensions.energy.score).toBe(50);
    expect(report.dimensions.energy.confidence).toBe(0);
    expect(report.dimensions.energy.gap).toMatch(/failed: audio service unreachable/);
    expect(report.dimensions.energy.source).toEqual(['error:energy']);
    expect(report.dimensions.clarity.score).toBe(90);
  });

  it('neutralizes an adapter that violates the score contract', async () => {
    const set = fullSet(90);
    set.flow = {
      dimension: 'flow',
      async evaluate(): Promise<DimensionScore> {
        return {
          score: 150, // out of range
          confidence: 1,
          gap: null,
          insight: 'Bogus.',
          source: ['stub:flow'],
          imbalance: null,
        };
      },
    };
    const report = await new KybalionEvaluator(set).evaluate();

    expect(report.dimensions.flow.score).toBe(50);
    expect(report.dimensions.flow.gap).toMatch(/failed/);
    expect(report.dimensions.flow.source).toEqual(['error:flow']);
  });

  it('rejects an evaluator registered under the wrong dimension key', () => {
    expect(
      () => new KybalionEvaluator({ energy: stub('clarity', 90) }),
    ).toThrow(/registered under "energy" declares dimension "clarity"/);
  });
});
