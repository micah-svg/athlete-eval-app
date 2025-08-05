export const SUBCATEGORY_TO_CATEGORY = {
  'Response to Feedback': 'coachability',
  'Eye Contact & Engagement': 'coachability',
  'Body Language': 'coachability',
  'Questions Asked': 'coachability',
  'Defensive Talk': 'communication',
  'Offensive Talk': 'communication',
  'Positive Feedback': 'communication',
  'Nonverbal Communication': 'communication',
  'Shot Selection': 'decisionMaking',
  'Pass Timing & Vision': 'decisionMaking',
  'Transition Decisions': 'decisionMaking',
  'Play Adaptability': 'decisionMaking',
  'On-Ball Pressure': 'defensiveEffort',
  'Help Defense/Rotations': 'defensiveEffort',
  'Defensive Closeouts': 'defensiveEffort',
  'Rebounding Effort': 'defensiveEffort',
};

const CATEGORY_KEYS = ['coachability', 'communication', 'decisionMaking', 'defensiveEffort'];

const CATEGORY_WEIGHTS = {
  coachability: 1,
  communication: 1,
  decisionMaking: 1.2,
  defensiveEffort: 1.3,
};

// National benchmarks organized by age group and gender.
// Values are illustrative and represent {min, max} ranges for each test.
// Percentiles are derived within the range; higherIsBetter indicates directionality.
const BENCHMARKS = {
  height: {
    higherIsBetter: true,
    male: {
      U15: { min: 60, max: 78 },
      U19: { min: 65, max: 82 },
    },
    female: {
      U15: { min: 58, max: 74 },
      U19: { min: 60, max: 76 },
    },
  },
  wingspan: {
    higherIsBetter: true,
    male: {
      U15: { min: 62, max: 80 },
      U19: { min: 68, max: 85 },
    },
    female: {
      U15: { min: 60, max: 78 },
      U19: { min: 64, max: 82 },
    },
  },
  verticalJump: {
    higherIsBetter: true,
    male: {
      U15: { min: 40, max: 70 },
      U19: { min: 45, max: 80 },
    },
    female: {
      U15: { min: 30, max: 55 },
      U19: { min: 32, max: 60 },
    },
  },
  sprint20m: {
    higherIsBetter: false,
    male: {
      U15: { min: 3.0, max: 4.5 },
      U19: { min: 2.8, max: 4.2 },
    },
    female: {
      U15: { min: 3.2, max: 4.8 },
      U19: { min: 3.0, max: 4.5 },
    },
  },
  tTestAgility: {
    higherIsBetter: false,
    male: {
      U15: { min: 9.5, max: 13 },
      U19: { min: 9, max: 12 },
    },
    female: {
      U15: { min: 10, max: 14 },
      U19: { min: 9.5, max: 13 },
    },
  },
  yoYoTest: {
    higherIsBetter: true,
    male: {
      U15: { min: 10, max: 18 },
      U19: { min: 14, max: 22 },
    },
    female: {
      U15: { min: 8, max: 16 },
      U19: { min: 10, max: 18 },
    },
  },
  fiveJumpTotal: {
    higherIsBetter: true,
    male: {
      U15: { min: 40, max: 80 },
      U19: { min: 50, max: 90 },
    },
    female: {
      U15: { min: 35, max: 70 },
      U19: { min: 45, max: 80 },
    },
  },
  fatigueIndex: {
    higherIsBetter: false,
    male: {
      U15: { min: 3.5, max: 10 },
      U19: { min: 3, max: 9 },
    },
    female: {
      U15: { min: 4, max: 10.5 },
      U19: { min: 3.5, max: 9.5 },
    },
  },
};

function getAgeGroup(age) {
  if (age == null) return 'U19';
  return age <= 15 ? 'U15' : 'U19';
}

function getBenchmark(category, age, gender) {
  const data = BENCHMARKS[category];
  if (!data) return null;
  const group = getAgeGroup(age);
  const genderData = data[gender?.toLowerCase()] || {};
  const range = genderData[group];
  if (!range) return null;
  return { ...range, higherIsBetter: data.higherIsBetter };
}

function calcPercentile(value, { min, max, higherIsBetter }) {
  if (value == null) return 0;
  const clamped = Math.min(Math.max(value, min), max);
  if (higherIsBetter) {
    return (clamped - min) / (max - min);
  } else {
    return (max - clamped) / (max - min);
  }
}

export function computeFitPercentiles(athletes) {
  const composites = athletes.map((athlete) => {
    const percentiles = [];
    for (const test in BENCHMARKS) {
      const val = athlete[test];
      const benchmark = getBenchmark(test, athlete.age, athlete.gender);
      if (val != null && benchmark) {
        percentiles.push(calcPercentile(val, benchmark));
      }
    }
    const composite =
      percentiles.length > 0
        ? percentiles.reduce((sum, p) => sum + p, 0) / percentiles.length
        : 0;
    return { jerseyNumber: athlete.jerseyNumber, composite };
  });

  const sorted = [...composites].sort((a, b) => b.composite - a.composite);
  const total = sorted.length || 1;
  const result = {};
  sorted.forEach((item, index) => {
    result[item.jerseyNumber] = (total - index) / total;
  });
  return result;
}

export function calculateFPScores(evaluations, athletes) {
  const fitPercentiles = computeFitPercentiles(athletes);

  const evalMap = {};
  evaluations.forEach(({ jerseyNumber, skill, rating }) => {
    const category = SUBCATEGORY_TO_CATEGORY[skill];
    if (!category) return;
    if (!evalMap[jerseyNumber]) {
      evalMap[jerseyNumber] = {
        totals: {
          coachability: 0,
          communication: 0,
          decisionMaking: 0,
          defensiveEffort: 0,
        },
        counts: {
          coachability: 0,
          communication: 0,
          decisionMaking: 0,
          defensiveEffort: 0,
        },
      };
    }
    evalMap[jerseyNumber].totals[category] += Number(rating);
    evalMap[jerseyNumber].counts[category] += 1;
  });

  const playerStats = athletes.map((athlete) => {
    const jersey = athlete.jerseyNumber;
    const evalData =
      evalMap[jersey] || {
        totals: {
          coachability: 0,
          communication: 0,
          decisionMaking: 0,
          defensiveEffort: 0,
        },
        counts: {
          coachability: 0,
          communication: 0,
          decisionMaking: 0,
          defensiveEffort: 0,
        },
      };

    const averages = {};
    CATEGORY_KEYS.forEach((key) => {
      const total = evalData.totals[key];
      const count = evalData.counts[key];
      averages[key] = count ? total / count : 0;
    });

    const fitPercentile = fitPercentiles[jersey] || 0;
    const fpScore =
      (averages.coachability +
        averages.communication +
        CATEGORY_WEIGHTS.decisionMaking * averages.decisionMaking +
        CATEGORY_WEIGHTS.defensiveEffort * averages.defensiveEffort) *
      fitPercentile;

    return {
      jerseyNumber: jersey,
      name: athlete.name || 'Unknown',
      position: athlete.position || 'N/A',
      averages,
      fitPercentile,
      fpScore,
    };
  });

  playerStats.sort((a, b) => b.fpScore - a.fpScore);
  return playerStats;
}

export default calculateFPScores;

