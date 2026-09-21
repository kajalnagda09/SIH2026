import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db.js';
import { requireAuth, requireRole, type AuthRequest } from '../lib/auth.js';

const router = Router();
router.use(requireAuth, requireRole('ADMIN'));

router.get('/dashboard', async (_req, res) => {
  const [students, faculty, industries, internships, jobs, applications] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.facultyProfile.count(),
    prisma.industryProfile.count(),
    prisma.internship.count(),
    prisma.jobPosting.count(),
    prisma.application.count(),
  ]);

  res.json({
    stats: { students, faculty, industries, internships, jobs, applications },
  });
});

router.get('/analytics/skills', async (req, res) => {
  const { department } = req.query;
  const where = department ? { department: String(department) } : {};

  const students = await prisma.studentProfile.findMany({
    where,
    include: { skills: { include: { skill: true } } },
  });

  const skillCounts: Record<string, number> = {};
  for (const s of students) {
    for (const sk of s.skills) {
      skillCounts[sk.skill.name] = (skillCounts[sk.skill.name] || 0) + sk.level;
    }
  }

  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, value]) => ({ name, value }));

  res.json({ topSkills, totalStudents: students.length });
});

router.get('/analytics/placement-funnel', async (_req, res) => {
  const statuses = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'JOINED', 'REJECTED'] as const;
  const funnel = await Promise.all(
    statuses.map(async (status) => ({
      status,
      count: await prisma.application.count({ where: { status } }),
    }))
  );
  res.json(funnel);
});

router.get('/analytics/departments', async (_req, res) => {
  const departments = await prisma.studentProfile.groupBy({
    by: ['department'],
    _count: { id: true },
    _avg: { cgpa: true },
  });

  const readiness = await Promise.all(
    departments.map(async (d) => {
      const students = await prisma.studentProfile.findMany({
        where: { department: d.department },
        include: { skills: true, assessmentAttempts: true },
      });
      const avgSkills =
        students.length > 0
          ? students.reduce((a, s) => a + s.skills.length, 0) / students.length
          : 0;
      const avgAssess =
        students.length > 0
          ? students.reduce(
              (a, s) =>
                a +
                (s.assessmentAttempts.length > 0
                  ? s.assessmentAttempts.reduce((x, t) => x + t.score / t.maxScore, 0) / s.assessmentAttempts.length
                  : 0),
              0
            ) / students.length
          : 0;

      return {
        department: d.department,
        students: d._count.id,
        avgCgpa: d._avg.cgpa,
        readinessScore: Math.round((avgSkills * 10 + avgAssess * 50) / 2),
      };
    })
  );

  res.json(readiness);
});

router.get('/analytics/internships', async (_req, res) => {
  const byMonth = await prisma.application.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  const participation = await prisma.internship.findMany({
    include: { _count: { select: { applications: true } }, industry: { select: { companyName: true } } },
    orderBy: { applications: { _count: 'desc' } },
    take: 10,
  });
  res.json({ byStatus: byMonth, topInternships: participation });
});

router.get('/analytics/recruiter-activity', async (_req, res) => {
  const industries = await prisma.industryProfile.findMany({
    include: {
      _count: { select: { internships: true, jobs: true, programs: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(industries);
});

router.get('/students', async (req, res) => {
  const { search, page = '1' } = req.query;
  const where: Record<string, unknown> = {};
  if (search) where.fullName = { contains: String(search), mode: 'insensitive' };

  const skip = (Number(page) - 1) * 20;
  const [students, total] = await Promise.all([
    prisma.studentProfile.findMany({
      where,
      include: { user: { select: { email: true, isVerified: true } }, skills: { include: { skill: true } } },
      skip,
      take: 20,
    }),
    prisma.studentProfile.count({ where }),
  ]);
  res.json({ students, total });
});

router.get('/faculty', async (_req, res) => {
  const faculty = await prisma.facultyProfile.findMany({
    include: { user: { select: { email: true } } },
  });
  res.json(faculty);
});

router.get('/industries/pending', async (_req, res) => {
  const pending = await prisma.industryProfile.findMany({
    where: { isApproved: false },
    include: { user: { select: { email: true } } },
  });
  res.json(pending);
});

router.patch('/industries/:id/verify', async (req, res) => {
  const { approved } = z.object({ approved: z.boolean() }).parse(req.body);
  const industry = await prisma.industryProfile.update({
    where: { id: req.params.id },
    data: { isApproved: approved },
    include: { user: true },
  });

  await prisma.user.update({
    where: { id: industry.userId },
    data: { isVerified: approved },
  });

  await prisma.notification.create({
    data: {
      userId: industry.userId,
      type: 'SYSTEM',
      title: approved ? 'Account Approved' : 'Account Rejected',
      body: approved
        ? 'Your industry account has been verified. You can now post opportunities.'
        : 'Your industry account verification was rejected.',
    },
  });

  res.json(industry);
});

router.get('/certificates', async (_req, res) => {
  const certs = await prisma.certificate.findMany({
    include: { enrollment: { include: { student: true, program: true } } },
    orderBy: { issuedAt: 'desc' },
  });
  res.json(certs);
});

router.get('/documents', async (_req, res) => {
  const docs = await prisma.document.findMany({
    include: { user: { select: { email: true, role: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(docs);
});

export default router;
