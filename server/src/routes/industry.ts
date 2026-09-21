import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db.js';
import { requireAuth, requireRole, type AuthRequest } from '../lib/auth.js';
import { computeMatchScore } from '../lib/matching.js';

const router = Router();
router.use(requireAuth, requireRole('INDUSTRY'));

async function getIndustry(userId: string) {
  return prisma.industryProfile.findUnique({ where: { userId } });
}

router.get('/dashboard', async (req: AuthRequest, res) => {
  const industry = await getIndustry(req.user!.userId);
  if (!industry) return res.status(404).json({ error: 'Not found' });

  const [internships, jobs, programs, applications] = await Promise.all([
    prisma.internship.count({ where: { industryId: industry.id } }),
    prisma.jobPosting.count({ where: { industryId: industry.id } }),
    prisma.learningProgram.count({ where: { industryId: industry.id } }),
    prisma.application.count({
      where: { OR: [{ internship: { industryId: industry.id } }, { job: { industryId: industry.id } }] },
    }),
  ]);

  res.json({ industry, stats: { internships, jobs, programs, applications } });
});

router.get('/internships', async (req: AuthRequest, res) => {
  const industry = await getIndustry(req.user!.userId);
  if (!industry) return res.status(404).json({ error: 'Not found' });

  const internships = await prisma.internship.findMany({
    where: { industryId: industry.id },
    include: { skills: { include: { skill: true } }, _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(internships);
});

router.post('/internships', async (req: AuthRequest, res) => {
  const industry = await getIndustry(req.user!.userId);
  if (!industry) return res.status(404).json({ error: 'Not found' });

  const body = z
    .object({
      title: z.string(),
      description: z.string(),
      type: z.enum(['INTERNSHIP', 'PROJECT', 'APPRENTICESHIP']),
      stipend: z.number(),
      duration: z.string(),
      location: z.string(),
      deadline: z.string(),
      openings: z.number().default(1),
      minCgpa: z.number().optional(),
      skillIds: z.array(z.string()).optional(),
    })
    .parse(req.body);

  const { skillIds, deadline, ...data } = body;
  const internship = await prisma.internship.create({
    data: {
      industryId: industry.id,
      ...data,
      deadline: new Date(deadline),
      skills: skillIds?.length
        ? { create: skillIds.map((skillId) => ({ skillId, weight: 1 })) }
        : undefined,
    },
    include: { skills: { include: { skill: true } } },
  });
  res.status(201).json(internship);
});

router.get('/jobs', async (req: AuthRequest, res) => {
  const industry = await getIndustry(req.user!.userId);
  if (!industry) return res.status(404).json({ error: 'Not found' });

  const jobs = await prisma.jobPosting.findMany({
    where: { industryId: industry.id },
    include: { skills: { include: { skill: true } }, _count: { select: { applications: true } } },
  });
  res.json(jobs);
});

router.post('/jobs', async (req: AuthRequest, res) => {
  const industry = await getIndustry(req.user!.userId);
  if (!industry) return res.status(404).json({ error: 'Not found' });

  const body = z
    .object({
      title: z.string(),
      description: z.string(),
      packageMin: z.number(),
      packageMax: z.number(),
      location: z.string(),
      qualifications: z.string(),
      deadline: z.string(),
      minCgpa: z.number().optional(),
      skillIds: z.array(z.string()).optional(),
    })
    .parse(req.body);

  const { skillIds, deadline, ...data } = body;
  const job = await prisma.jobPosting.create({
    data: {
      industryId: industry.id,
      ...data,
      deadline: new Date(deadline),
      skills: skillIds?.length ? { create: skillIds.map((skillId) => ({ skillId, weight: 1 })) } : undefined,
    },
    include: { skills: { include: { skill: true } } },
  });
  res.status(201).json(job);
});

router.get('/candidates', async (req: AuthRequest, res) => {
  const industry = await getIndustry(req.user!.userId);
  if (!industry) return res.status(404).json({ error: 'Not found' });

  const { internshipId, jobId, minCgpa, branch, status } = req.query;

  const where: Record<string, unknown> = {
    OR: [{ internship: { industryId: industry.id } }, { job: { industryId: industry.id } }],
  };
  if (internshipId) where.internshipId = String(internshipId);
  if (jobId) where.jobId = String(jobId);
  if (status) where.status = String(status);

  let applications = await prisma.application.findMany({
    where,
    include: {
      student: { include: { skills: { include: { skill: true } } } },
      internship: true,
      job: true,
      timeline: true,
    },
    orderBy: { matchScore: 'desc' },
  });

  if (minCgpa) applications = applications.filter((a) => (a.student.cgpa ?? 0) >= Number(minCgpa));
  if (branch) applications = applications.filter((a) => a.student.branch.toLowerCase().includes(String(branch).toLowerCase()));

  res.json(applications);
});

router.patch('/applications/:id/status', async (req: AuthRequest, res) => {
  const { status, note } = z
    .object({
      status: z.enum(['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'JOINED', 'REJECTED']),
      note: z.string().optional(),
    })
    .parse(req.body);

  const app = await prisma.application.update({
    where: { id: req.params.id },
    data: {
      status,
      timeline: { create: { status, note: note || `Status updated to ${status}` } },
    },
    include: { student: true, timeline: true },
  });

  const studentUser = await prisma.studentProfile.findUnique({
    where: { id: app.studentId },
    select: { userId: true },
  });
  if (studentUser) {
    await prisma.notification.create({
      data: {
        userId: studentUser.userId,
        type: 'APPLICATION',
        title: 'Application Update',
        body: `Your application status changed to ${status}`,
        link: '/student/applications',
      },
    });
  }

  res.json(app);
});

router.post('/applications/bulk-shortlist', async (req: AuthRequest, res) => {
  const { ids } = z.object({ ids: z.array(z.string()) }).parse(req.body);
  await prisma.application.updateMany({
    where: { id: { in: ids } },
    data: { status: 'SHORTLISTED' },
  });
  res.json({ updated: ids.length });
});

router.get('/programs', async (req: AuthRequest, res) => {
  const industry = await getIndustry(req.user!.userId);
  if (!industry) return res.status(404).json({ error: 'Not found' });

  const programs = await prisma.learningProgram.findMany({
    where: { industryId: industry.id },
    include: { enrollments: { include: { student: true } } },
  });
  res.json(programs);
});

router.post('/programs', async (req: AuthRequest, res) => {
  const industry = await getIndustry(req.user!.userId);
  if (!industry) return res.status(404).json({ error: 'Not found' });

  const body = z
    .object({
      title: z.string(),
      description: z.string(),
      type: z.enum(['COURSE', 'CERTIFICATION', 'WORKSHOP', 'MENTORSHIP']),
      duration: z.string(),
      mode: z.string(),
      fee: z.number().default(0),
    })
    .parse(req.body);

  const program = await prisma.learningProgram.create({
    data: { industryId: industry.id, ...body },
  });
  res.status(201).json(program);
});

router.get('/recommendations/students', async (req: AuthRequest, res) => {
  const industry = await getIndustry(req.user!.userId);
  if (!industry) return res.status(404).json({ error: 'Not found' });

  const { internshipId } = req.query;
  if (!internshipId) return res.status(400).json({ error: 'internshipId required' });

  const internship = await prisma.internship.findUnique({
    where: { id: String(internshipId) },
    include: { skills: { include: { skill: true } } },
  });
  if (!internship) return res.status(404).json({ error: 'Internship not found' });

  const required = internship.skills.map((s) => ({ skillId: s.skillId, skillName: s.skill.name, weight: s.weight }));

  const students = await prisma.studentProfile.findMany({
    include: { skills: { include: { skill: true } } },
    take: 50,
  });

  const ranked = students
    .map((s) => {
      const skillData = s.skills.map((sk) => ({ skillId: sk.skillId, skillName: sk.skill.name, level: sk.level }));
      const match = computeMatchScore(skillData, required, { cgpa: s.cgpa, minCgpa: internship.minCgpa });
      return { ...s, match };
    })
    .sort((a, b) => b.match.score - a.match.score);

  res.json(ranked.slice(0, 20));
});

export default router;
