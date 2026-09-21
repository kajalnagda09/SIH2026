import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/db.js';
import { requireAuth, requireRole, type AuthRequest } from '../lib/auth.js';
import { computeMatchScore, recommendRoles } from '../lib/matching.js';
import { runCodeAgainstTests } from '../lib/coding-runner.js';

const router = Router();
router.use(requireAuth, requireRole('STUDENT'));

async function getStudent(userId: string) {
  return prisma.studentProfile.findUnique({
    where: { userId },
    include: { skills: { include: { skill: true } }, portfolio: true },
  });
}

router.get('/dashboard', async (req: AuthRequest, res) => {
  const student = await getStudent(req.user!.userId);
  if (!student) return res.status(404).json({ error: 'Profile not found' });

  const [applications, attempts, submissions, enrollments, notifications] = await Promise.all([
    prisma.application.count({ where: { studentId: student.id } }),
    prisma.assessmentAttempt.findMany({ where: { studentId: student.id }, take: 5, orderBy: { completedAt: 'desc' } }),
    prisma.codingSubmission.count({ where: { studentId: student.id, passed: true } }),
    prisma.programEnrollment.count({ where: { studentId: student.id } }),
    prisma.notification.count({ where: { userId: req.user!.userId, readAt: null } }),
  ]);

  res.json({
    student,
    stats: {
      applications,
      assessmentsTaken: attempts.length,
      problemsSolved: submissions,
      programsEnrolled: enrollments,
      codingStreak: student.codingStreak,
      unreadNotifications: notifications,
    },
    recentAttempts: attempts,
  });
});

router.get('/assessments', async (_req, res) => {
  const assessments = await prisma.assessment.findMany({
    where: { isActive: true },
    include: { industry: { select: { companyName: true } }, _count: { select: { questions: true } } },
  });
  res.json(assessments);
});

router.get('/assessments/:id', async (req, res) => {
  const assessment = await prisma.assessment.findUnique({
    where: { id: req.params.id },
    include: {
      sections: { orderBy: { order: 'asc' } },
      questions: { select: { id: true, text: true, options: true, sectionId: true, points: true } },
    },
  });
  if (!assessment) return res.status(404).json({ error: 'Not found' });
  res.json(assessment);
});

router.post('/assessments/:id/submit', async (req: AuthRequest, res) => {
  const student = await getStudent(req.user!.userId);
  if (!student) return res.status(404).json({ error: 'Profile not found' });

  const { answers, timeTakenSec } = z
    .object({ answers: z.record(z.number()), timeTakenSec: z.number() })
    .parse(req.body);

  const questions = await prisma.question.findMany({ where: { assessmentId: req.params.id } });
  let score = 0;
  let maxScore = 0;
  for (const q of questions) {
    maxScore += q.points;
    if (answers[q.id] === q.correctIndex) score += q.points;
  }

  const attempt = await prisma.assessmentAttempt.create({
    data: {
      assessmentId: req.params.id,
      studentId: student.id,
      score,
      maxScore,
      answers,
      timeTakenSec,
    },
  });

  res.json({ attempt, percentage: Math.round((score / maxScore) * 100) });
});

router.get('/coding/problems', async (req, res) => {
  const { difficulty, tag, page = '1', limit = '20' } = req.query;
  const where: Record<string, unknown> = { isActive: true };
  if (difficulty) where.difficulty = String(difficulty).toUpperCase();
  if (tag) where.tags = { has: String(tag) };

  const skip = (Number(page) - 1) * Number(limit);
  const [problems, total] = await Promise.all([
    prisma.codingProblem.findMany({
      where,
      select: { id: true, title: true, slug: true, difficulty: true, tags: true },
      skip,
      take: Number(limit),
      orderBy: { title: 'asc' },
    }),
    prisma.codingProblem.count({ where }),
  ]);
  res.json({ problems, total, page: Number(page) });
});

router.get('/coding/problems/:slug', async (req, res) => {
  const problem = await prisma.codingProblem.findUnique({ where: { slug: req.params.slug } });
  if (!problem) return res.status(404).json({ error: 'Not found' });
  const { testCases, ...publicProblem } = problem;
  const publicTests = (testCases as { input: unknown; expected: unknown; isPublic?: boolean }[]).filter(
    (t) => t.isPublic !== false
  );
  res.json({ ...publicProblem, testCases: publicTests.slice(0, 2) });
});

router.post('/coding/problems/:slug/run', async (req, res) => {
  const { code } = z.object({ code: z.string() }).parse(req.body);
  const problem = await prisma.codingProblem.findUnique({ where: { slug: req.params.slug } });
  if (!problem) return res.status(404).json({ error: 'Not found' });

  const tests = (problem.testCases as { input: unknown; expected: unknown; isPublic?: boolean }[]).filter(
    (t) => t.isPublic !== false
  );
  const result = runCodeAgainstTests(code, tests);
  res.json(result);
});

router.post('/coding/problems/:slug/submit', async (req: AuthRequest, res) => {
  const student = await getStudent(req.user!.userId);
  if (!student) return res.status(404).json({ error: 'Profile not found' });

  const { code } = z.object({ code: z.string() }).parse(req.body);
  const problem = await prisma.codingProblem.findUnique({ where: { slug: req.params.slug } });
  if (!problem) return res.status(404).json({ error: 'Not found' });

  const tests = problem.testCases as { input: unknown; expected: unknown }[];
  const result = runCodeAgainstTests(code, tests);

  const submission = await prisma.codingSubmission.create({
    data: {
      problemId: problem.id,
      studentId: student.id,
      code,
      passed: result.passed,
      runtimeMs: result.runtimeMs,
      results: result.results,
    },
  });

  if (result.passed) {
    await prisma.studentProfile.update({
      where: { id: student.id },
      data: { codingStreak: { increment: 1 } },
    });
  }

  res.json({ submission, ...result });
});

router.get('/coding/submissions', async (req: AuthRequest, res) => {
  const student = await getStudent(req.user!.userId);
  if (!student) return res.status(404).json({ error: 'Profile not found' });

  const submissions = await prisma.codingSubmission.findMany({
    where: { studentId: student.id },
    include: { problem: { select: { title: true, slug: true, difficulty: true } } },
    orderBy: { submittedAt: 'desc' },
    take: 50,
  });
  res.json(submissions);
});

router.get('/skill-profile', async (req: AuthRequest, res) => {
  const student = await prisma.studentProfile.findUnique({
    where: { userId: req.user!.userId },
    include: {
      skills: { include: { skill: true } },
      assessmentAttempts: { include: { assessment: true } },
      codingSubmissions: { where: { passed: true }, include: { problem: true } },
    },
  });
  if (!student) return res.status(404).json({ error: 'Not found' });

  const radarData = student.skills.map((s) => ({
    name: s.skill.name,
    value: s.level * 20,
    category: s.skill.category,
  }));

  const assessmentAvg =
    student.assessmentAttempts.length > 0
      ? student.assessmentAttempts.reduce((a, t) => a + (t.score / t.maxScore) * 100, 0) /
        student.assessmentAttempts.length
      : 0;

  res.json({
    radarData,
    strengths: student.skills.filter((s) => s.level >= 4).map((s) => s.skill.name),
    gaps: student.skills.filter((s) => s.level <= 2).map((s) => s.skill.name),
    assessmentAvg: Math.round(assessmentAvg),
    problemsSolved: student.codingSubmissions.length,
    codingStreak: student.codingStreak,
  });
});

router.get('/recommendations', async (req: AuthRequest, res) => {
  const student = await prisma.studentProfile.findUnique({
    where: { userId: req.user!.userId },
    include: { skills: { include: { skill: true } } },
  });
  if (!student) return res.status(404).json({ error: 'Not found' });

  const studentSkills = student.skills.map((s) => ({
    skillId: s.skillId,
    skillName: s.skill.name,
    level: s.level,
  }));

  const [internships, jobs, roles, programs] = await Promise.all([
    prisma.internship.findMany({
      where: { isActive: true, deadline: { gte: new Date() } },
      include: { industry: true, skills: { include: { skill: true } } },
    }),
    prisma.jobPosting.findMany({
      where: { isActive: true, deadline: { gte: new Date() } },
      include: { industry: true, skills: { include: { skill: true } } },
    }),
    prisma.jobRole.findMany(),
    prisma.learningProgram.findMany({ where: { isActive: true }, include: { industry: true, skills: { include: { skill: true } } } }),
  ]);

  const mapItem = (item: {
    id: string;
    title: string;
    skills: { skillId: string; skill: { name: string }; weight: number }[];
    minCgpa?: number | null;
  }) => {
    const required = item.skills.map((s) => ({ skillId: s.skillId, skillName: s.skill.name, weight: s.weight }));
    return { ...item, match: computeMatchScore(studentSkills, required, { cgpa: student.cgpa, minCgpa: item.minCgpa }) };
  };

  const roleRecs = recommendRoles(
    studentSkills,
    roles.map((r) => ({ id: r.id, title: r.title, industry: r.industry, skills: r.skills as string[] }))
  );

  res.json({
    internships: internships.map(mapItem).sort((a, b) => b.match.score - a.match.score),
    jobs: jobs.map(mapItem).sort((a, b) => b.match.score - a.match.score),
    roles: roleRecs.slice(0, 8),
    programs: programs.map(mapItem).sort((a, b) => b.match.score - a.match.score),
  });
});

router.get('/internships', async (req, res) => {
  const { search, location, page = '1' } = req.query;
  const where: Record<string, unknown> = { isActive: true };
  if (search) where.title = { contains: String(search), mode: 'insensitive' };
  if (location) where.location = { contains: String(location), mode: 'insensitive' };

  const skip = (Number(page) - 1) * 20;
  const internships = await prisma.internship.findMany({
    where,
    include: { industry: true, skills: { include: { skill: true } }, _count: { select: { applications: true } } },
    skip,
    take: 20,
    orderBy: { createdAt: 'desc' },
  });
  res.json(internships);
});

router.post('/applications', async (req: AuthRequest, res) => {
  const student = await getStudent(req.user!.userId);
  if (!student) return res.status(404).json({ error: 'Profile not found' });

  const body = z
    .object({ internshipId: z.string().optional(), jobId: z.string().optional(), coverNote: z.string().optional() })
    .parse(req.body);

  const studentSkills = await prisma.studentSkill.findMany({
    where: { studentId: student.id },
    include: { skill: true },
  });
  const skillData = studentSkills.map((s) => ({ skillId: s.skillId, skillName: s.skill.name, level: s.level }));

  let matchScore = 50;
  if (body.internshipId) {
    const internship = await prisma.internship.findUnique({
      where: { id: body.internshipId },
      include: { skills: { include: { skill: true } } },
    });
    if (internship) {
      const reqSkills = internship.skills.map((s) => ({ skillId: s.skillId, skillName: s.skill.name, weight: s.weight }));
      matchScore = computeMatchScore(skillData, reqSkills, { cgpa: student.cgpa, minCgpa: internship.minCgpa }).score;
    }
  }

  const app = await prisma.application.create({
    data: {
      studentId: student.id,
      internshipId: body.internshipId,
      jobId: body.jobId,
      coverNote: body.coverNote,
      matchScore,
      timeline: { create: { status: 'APPLIED', note: 'Application submitted' } },
    },
    include: { internship: { include: { industry: true } }, job: { include: { industry: true } } },
  });

  res.status(201).json(app);
});

router.get('/applications', async (req: AuthRequest, res) => {
  const student = await getStudent(req.user!.userId);
  if (!student) return res.status(404).json({ error: 'Not found' });

  const apps = await prisma.application.findMany({
    where: { studentId: student.id },
    include: {
      internship: { include: { industry: true } },
      job: { include: { industry: true } },
      timeline: { orderBy: { createdAt: 'asc' } },
      feedback: true,
      progressLogs: true,
    },
    orderBy: { appliedAt: 'desc' },
  });
  res.json(apps);
});

router.get('/programs', async (_req, res) => {
  const programs = await prisma.learningProgram.findMany({
    where: { isActive: true },
    include: { industry: true, skills: { include: { skill: true } }, _count: { select: { enrollments: true } } },
  });
  res.json(programs);
});

router.post('/programs/:id/enroll', async (req: AuthRequest, res) => {
  const student = await getStudent(req.user!.userId);
  if (!student) return res.status(404).json({ error: 'Not found' });

  const enrollment = await prisma.programEnrollment.create({
    data: { programId: req.params.id, studentId: student.id },
    include: { program: true },
  });
  res.status(201).json(enrollment);
});

router.patch('/programs/enrollments/:id/progress', async (req: AuthRequest, res) => {
  const { progress } = z.object({ progress: z.number().min(0).max(100) }).parse(req.body);
  const enrollment = await prisma.programEnrollment.update({
    where: { id: req.params.id },
    data: {
      progress,
      completed: progress >= 100,
      completedAt: progress >= 100 ? new Date() : null,
    },
  });

  if (progress >= 100) {
    const student = await getStudent(req.user!.userId);
    const program = await prisma.learningProgram.findUnique({ where: { id: enrollment.programId } });
    if (student?.portfolio && program) {
      await prisma.certificate.create({
        data: {
          enrollmentId: enrollment.id,
          title: program.title,
          verificationId: `SETU-2026-AIIA-${uuidv4().slice(0, 8).toUpperCase()}`,
          portfolioId: student.portfolio.id,
        },
      });
    }
  }

  res.json(enrollment);
});

router.get('/portfolio', async (req: AuthRequest, res) => {
  const student = await prisma.studentProfile.findUnique({
    where: { userId: req.user!.userId },
    include: {
      portfolio: { include: { certificates: true } },
      skills: { include: { skill: true } },
      codingSubmissions: { where: { passed: true }, include: { problem: true }, take: 10 },
      applications: { where: { status: 'JOINED' }, include: { internship: true } },
    },
  });
  res.json(student);
});

router.patch('/portfolio', async (req: AuthRequest, res) => {
  const student = await getStudent(req.user!.userId);
  if (!student?.portfolio) return res.status(404).json({ error: 'Not found' });

  const body = z
    .object({
      headline: z.string().optional(),
      summary: z.string().optional(),
      projects: z.array(z.unknown()).optional(),
      achievements: z.array(z.unknown()).optional(),
    })
    .parse(req.body);

  const portfolio = await prisma.portfolio.update({
    where: { id: student.portfolio.id },
    data: body,
  });
  res.json(portfolio);
});

router.get('/roles', async (_req, res) => {
  const roles = await prisma.jobRole.findMany({ orderBy: { demandTrend: 'desc' } });
  res.json(roles);
});

router.get('/workshops', async (_req, res) => {
  const workshops = await prisma.workshop.findMany({
    include: { _count: { select: { registrations: true } } },
    orderBy: { date: 'asc' },
  });
  res.json(workshops);
});

router.post('/workshops/:id/register', async (req: AuthRequest, res) => {
  const student = await getStudent(req.user!.userId);
  if (!student) return res.status(404).json({ error: 'Not found' });

  const reg = await prisma.workshopRegistration.create({
    data: { workshopId: req.params.id, studentId: student.id },
  });
  res.status(201).json(reg);
});

router.get('/challenges', async (_req, res) => {
  const challenges = await prisma.innovationChallenge.findMany({
    include: { industry: true, submissions: { include: { student: { select: { fullName: true } } } } },
  });
  res.json(challenges);
});

router.post('/challenges/:id/submit', async (req: AuthRequest, res) => {
  const student = await getStudent(req.user!.userId);
  if (!student) return res.status(404).json({ error: 'Not found' });

  const body = z.object({ title: z.string(), description: z.string() }).parse(req.body);
  const sub = await prisma.challengeSubmission.create({
    data: { challengeId: req.params.id, studentId: student.id, ...body, score: Math.floor(Math.random() * 30) + 70 },
  });
  res.status(201).json(sub);
});

router.get('/notifications', async (req: AuthRequest, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json(notifications);
});

router.patch('/notifications/:id/read', async (req: AuthRequest, res) => {
  await prisma.notification.update({
    where: { id: req.params.id },
    data: { readAt: new Date() },
  });
  res.json({ ok: true });
});

router.get('/messages', async (req: AuthRequest, res) => {
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: req.user!.userId }, { receiverId: req.user!.userId }] },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json(messages);
});

router.post('/messages', async (req: AuthRequest, res) => {
  const body = z.object({ receiverId: z.string(), content: z.string(), threadId: z.string() }).parse(req.body);
  const msg = await prisma.message.create({
    data: { senderId: req.user!.userId, ...body },
  });
  res.status(201).json(msg);
});

export default router;
