import { describe, expect, it } from 'vitest';
import { calculateFPScores } from '../../utils/fpScore';

// Mock athletes and evaluations
const athletes = [
  {
    jerseyNumber: 1,
    name: 'Player One',
    position: 'G',
    age: 16,
    gender: 'male',
    height: 82,
  },
  {
    jerseyNumber: 2,
    name: 'Player Two',
    position: 'F',
    age: 16,
    gender: 'male',
    height: 70,
  },
];

const evaluations = [
  // Player 1 evaluations
  { jerseyNumber: 1, skill: 'Response to Feedback', rating: 4 },
  { jerseyNumber: 1, skill: 'Eye Contact & Engagement', rating: 2 },
  { jerseyNumber: 1, skill: 'Defensive Talk', rating: 3 },
  { jerseyNumber: 1, skill: 'Offensive Talk', rating: 3 },
  { jerseyNumber: 1, skill: 'Shot Selection', rating: 5 },
  { jerseyNumber: 1, skill: 'Pass Timing & Vision', rating: 5 },
  { jerseyNumber: 1, skill: 'On-Ball Pressure', rating: 4 },
  { jerseyNumber: 1, skill: 'Rebounding Effort', rating: 4 },
  // Player 2 evaluations
  { jerseyNumber: 2, skill: 'Response to Feedback', rating: 1 },
  { jerseyNumber: 2, skill: 'Eye Contact & Engagement', rating: 1 },
  { jerseyNumber: 2, skill: 'Defensive Talk', rating: 2 },
  { jerseyNumber: 2, skill: 'Offensive Talk', rating: 2 },
  { jerseyNumber: 2, skill: 'Shot Selection', rating: 2 },
  { jerseyNumber: 2, skill: 'Pass Timing & Vision', rating: 2 },
  { jerseyNumber: 2, skill: 'On-Ball Pressure', rating: 1 },
  { jerseyNumber: 2, skill: 'Rebounding Effort', rating: 1 },
];

describe('calculateFPScores', () => {
  it('sorts players by overall and computes averages correctly', () => {
    const result = calculateFPScores(evaluations, athletes);

    expect(result).toHaveLength(2);

    // Sorted by fpScore (overall) descending
    expect(result[0].jerseyNumber).toBe(1);
    expect(result[1].jerseyNumber).toBe(2);

    // Skill averages for player 1
    expect(result[0].averages).toEqual({
      coachability: 3,
      communication: 3,
      decisionMaking: 5,
      defensiveEffort: 4,
    });

    // Skill averages for player 2
    expect(result[1].averages).toEqual({
      coachability: 1,
      communication: 2,
      decisionMaking: 2,
      defensiveEffort: 1,
    });

    const expected1 = (3 + 3 + 1.2 * 5 + 1.3 * 4) * 1; // fit percentile 1
    const expected2 = (1 + 2 + 1.2 * 2 + 1.3 * 1) * 0.5; // fit percentile 0.5

    expect(result[0].fpScore).toBeCloseTo(expected1);
    expect(result[1].fpScore).toBeCloseTo(expected2);
  });
});
