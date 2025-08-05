// Utility to recommend roster placements based on ranking, grade and position.
// The algorithm follows the FuturePlay Sports roster rules:
// - Varsity: 10 players, grades 11-12 only, 2 per position. Seniors are
//   considered first and if a senior doesn't make varsity they are cut.
// - Junior Varsity (JV): 10 players, grades 9-11, target 2 per position with
//   flexibility. Prioritises positions that will graduate varsity seniors and
//   players with top positional ranks.
// - JV2: 10 players, grades 9-10, prioritising freshmen development. Top
//   freshmen are selected first then remaining spots are filled trying to keep
//   positional balance.
// - All other players are cut.

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];

/**
 * Recommends team placement for a list of athletes.
 * @param {Array<Object>} athletes Array of athlete objects with fields:
 *  - athleteId: unique identifier
 *  - grade: number 9-12
 *  - position: one of PG, SG, SF, PF, C
 *  - compositeRank: numeric rank (lower is better)
 *  - positionRank: rank among players in the same position
 *  - overallRank: overall rank among all players
 * @returns {{players:Array, varsity:Array, jv:Array, jv2:Array, graduating:Object}}
 */
export function recommendPlacements(athletes = []) {
  // Clone players to avoid mutating original input
  const roster = athletes.map((p) => ({ ...p, placement: null }));
  const selected = new Set();

  // -------------------- Step 1: Assign Varsity --------------------
  const varsity = [];
  POSITIONS.forEach((pos) => {
    // Seniors for the position sorted by overall rank
    const seniors = roster
      .filter((p) => p.grade === 12 && p.position === pos)
      .sort((a, b) => a.overallRank - b.overallRank);

    seniors.slice(0, 2).forEach((p) => {
      p.placement = "Varsity";
      varsity.push(p);
      selected.add(p.athleteId);
    });

    const count = varsity.filter((p) => p.position === pos).length;
    if (count < 2) {
      const needed = 2 - count;
      const underclass = roster
        .filter(
          (p) =>
            p.grade <= 11 &&
            p.position === pos &&
            !selected.has(p.athleteId)
        )
        .sort((a, b) => a.overallRank - b.overallRank);
      underclass.slice(0, needed).forEach((p) => {
        p.placement = "Varsity";
        varsity.push(p);
        selected.add(p.athleteId);
      });
    }
  });

  // Remaining seniors are cut
  roster.forEach((p) => {
    if (p.grade === 12 && !selected.has(p.athleteId)) {
      p.placement = "Cut";
      selected.add(p.athleteId);
    }
  });

  // -------------------- Step 2: Project graduation --------------------
  const graduating = {};
  POSITIONS.forEach((pos) => {
    graduating[pos] = varsity.filter(
      (p) => p.position === pos && p.grade === 12
    ).length;
  });

  // -------------------- Step 3: Fill JV --------------------
  const jv = [];
  const eligibleJV = roster.filter(
    (p) => p.grade <= 11 && p.placement === null
  );
  const posPriority = [...POSITIONS].sort(
    (a, b) => graduating[b] - graduating[a]
  );

  posPriority.forEach((pos) => {
    const candidates = eligibleJV
      .filter(
        (p) =>
          p.position === pos &&
          p.positionRank <= 3 &&
          !selected.has(p.athleteId)
      )
      .sort((a, b) => a.compositeRank - b.compositeRank);

    for (const c of candidates) {
      if (jv.length >= 10) break;
      const count = jv.filter((p) => p.position === pos).length;
      if (count < 2) {
        c.placement = "JV";
        jv.push(c);
        selected.add(c.athleteId);
      }
    }
  });

  if (jv.length < 10) {
    const flex = roster
      .filter((p) => p.grade <= 11 && p.placement === null)
      .sort((a, b) => a.compositeRank - b.compositeRank);
    for (const c of flex) {
      if (jv.length >= 10) break;
      c.placement = "JV";
      jv.push(c);
      selected.add(c.athleteId);
    }
  }

  // -------------------- Step 4: Fill JV2 --------------------
  const jv2 = [];
  const remaining = roster.filter(
    (p) => p.grade <= 10 && p.placement === null
  );

  // Top 5 freshmen by composite rank
  const freshmen = remaining
    .filter((p) => p.grade === 9)
    .sort((a, b) => a.compositeRank - b.compositeRank);
  freshmen.slice(0, 5).forEach((p) => {
    if (jv2.length < 10) {
      p.placement = "JV2";
      jv2.push(p);
      selected.add(p.athleteId);
    }
  });

  // Attempt to reach two per position
  POSITIONS.forEach((pos) => {
    while (
      jv2.length < 10 &&
      jv2.filter((p) => p.position === pos).length < 2
    ) {
      const candidate = roster
        .filter(
          (p) =>
            p.position === pos &&
            p.grade <= 10 &&
            p.placement === null
        )
        .sort((a, b) => a.compositeRank - b.compositeRank)[0];
      if (!candidate) break;
      candidate.placement = "JV2";
      jv2.push(candidate);
      selected.add(candidate.athleteId);
    }
  });

  // Fill remaining spots flexibly
  if (jv2.length < 10) {
    const flex = roster
      .filter((p) => p.grade <= 10 && p.placement === null)
      .sort((a, b) => a.compositeRank - b.compositeRank);
    for (const c of flex) {
      if (jv2.length >= 10) break;
      c.placement = "JV2";
      jv2.push(c);
      selected.add(c.athleteId);
    }
  }

  // -------------------- Step 5: Cut remaining players --------------------
  roster.forEach((p) => {
    if (p.placement === null) {
      p.placement = "Cut";
    }
  });

  return { players: roster, varsity, jv, jv2, graduating };
}

export default recommendPlacements;
