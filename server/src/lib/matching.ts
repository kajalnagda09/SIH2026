interface SkillWeight {
  skillId: string;
  skillName: string;
  weight: number;
}

interface StudentSkillData {
  skillId: string;
  skillName: string;
  level: number;
}

export interface MatchResult {
  score: number;
  missingSkills: string[];
  matchedSkills: string[];
  explanation: string;
}

export function computeMatchScore(
  studentSkills: StudentSkillData[],
  requiredSkills: SkillWeight[],
  extras?: { cgpa?: number | null; minCgpa?: number | null; assessmentAvg?: number; codingScore?: number }
): MatchResult {
  if (requiredSkills.length === 0) {
    return { score: 50, missingSkills: [], matchedSkills: [], explanation: '50% match — no specific skills listed' };
  }

  const studentMap = new Map(studentSkills.map((s) => [s.skillId, s]));
  let weightedMatch = 0;
  let totalWeight = 0;
  const missing: string[] = [];
  const matched: string[] = [];

  for (const req of requiredSkills) {
    totalWeight += req.weight;
    const studentSkill = studentMap.get(req.skillId);
    if (studentSkill && studentSkill.level >= 1) {
      const levelFactor = Math.min(studentSkill.level / 5, 1);
      weightedMatch += req.weight * levelFactor;
      matched.push(req.skillName);
    } else {
      missing.push(req.skillName);
    }
  }

  let skillScore = totalWeight > 0 ? (weightedMatch / totalWeight) * 100 : 0;

  let bonus = 0;
  if (extras?.assessmentAvg) bonus += extras.assessmentAvg * 0.15;
  if (extras?.codingScore) bonus += extras.codingScore * 0.15;
  if (extras?.cgpa && extras?.minCgpa && extras.cgpa >= extras.minCgpa) bonus += 10;
  else if (extras?.minCgpa && (!extras.cgpa || extras.cgpa < extras.minCgpa)) bonus -= 15;

  const score = Math.round(Math.min(100, Math.max(0, skillScore * 0.7 + bonus)));

  const explanation =
    missing.length > 0
      ? `${score}% match — missing: ${missing.slice(0, 4).join(', ')}`
      : `${score}% match — strong fit for required skills`;

  return { score, missingSkills: missing, matchedSkills: matched, explanation };
}

export function recommendRoles(
  studentSkills: StudentSkillData[],
  roles: { id: string; title: string; skills: string[]; industry: string }[]
) {
  return roles
    .map((role) => {
      const required = role.skills.map((name, i) => ({
        skillId: name,
        skillName: name,
        weight: 1 + (role.skills.length - i) * 0.1,
      }));
      const normalized = studentSkills.map((s) => ({
        ...s,
        skillId: s.skillName,
      }));
      const match = computeMatchScore(normalized, required);
      return { ...role, ...match };
    })
    .sort((a, b) => b.score - a.score);
}
