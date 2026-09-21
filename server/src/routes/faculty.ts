import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db.js';
import { requireAuth, requireRole, type AuthRequest } from '../lib/auth.js';

const router = Router();
router.use(requireAuth, requireRole('FACULTY'));

async function getFaculty(userId: string) {
  return prisma.facultyProfile.findUnique({ where: { userId } });
}

router.get('/dashboard', async (req: AuthRequest, res) => {
  const faculty = await getFaculty(req.user!.userId);
  if (!faculty) return res.status(404).json({ error: 'Not found' });

  const [applications, mentorships, workshops] = await Promise.all([
    prisma.facultyApplication.count({ where: { facultyId: faculty.id } }),
    prisma.mentorshipRequest.count({ where: { mentorId: faculty.id } }),
    prisma.workshopRegistration.count({ where: { facultyId: faculty.id } }),
  ]);

  res.json({ faculty, stats: { applications, mentorships, workshops } });
});

router.get('/opportunities', async (req, res) => {
  const { type, search } = req.query;
  const where: Record<string, unknown> = { isActive: true };
  if (type) where.type = String(type);
  if (search) where.title = { contains: String(search), mode: 'insensitive' };

  const opportunities = await prisma.facultyOpportunity.findMany({
    where,
    include: { _count: { select: { applications: true } } },
    orderBy: { deadline: 'asc' },
  });
  res.json(opportunities);
});

router.post('/opportunities/:id/apply', async (req: AuthRequest, res) => {
  const faculty = await getFaculty(req.user!.userId);
  if (!faculty) return res.status(404).json({ error: 'Not found' });

  const { coverNote } = z.object({ coverNote: z.string().optional() }).parse(req.body);
  const app = await prisma.facultyApplication.create({
    data: { facultyId: faculty.id, opportunityId: req.params.id, coverNote },
  });
  res.status(201).json(app);
});

router.get('/applications', async (req: AuthRequest, res) => {
  const faculty = await getFaculty(req.user!.userId);
  if (!faculty) return res.status(404).json({ error: 'Not found' });

  const apps = await prisma.facultyApplication.findMany({
    where: { facultyId: faculty.id },
    include: { opportunity: true },
    orderBy: { appliedAt: 'desc' },
  });
  res.json(apps);
});

router.get('/mentorship', async (req: AuthRequest, res) => {
  const faculty = await getFaculty(req.user!.userId);
  if (!faculty) return res.status(404).json({ error: 'Not found' });

  const requests = await prisma.mentorshipRequest.findMany({
    where: { OR: [{ mentorId: faculty.id }, { mentorId: null, status: 'PENDING' }] },
    include: { mentee: { select: { fullName: true, branch: true, college: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(requests);
});

router.patch('/mentorship/:id', async (req: AuthRequest, res) => {
  const faculty = await getFaculty(req.user!.userId);
  if (!faculty) return res.status(404).json({ error: 'Not found' });

  const body = z
    .object({ status: z.string(), scheduledAt: z.string().optional() })
    .parse(req.body);

  const req_ = await prisma.mentorshipRequest.update({
    where: { id: req.params.id },
    data: {
      mentorId: faculty.id,
      status: body.status,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
    },
  });
  res.json(req_);
});

router.get('/workshops', async (_req, res) => {
  const workshops = await prisma.workshop.findMany({ orderBy: { date: 'asc' } });
  res.json(workshops);
});

router.post('/workshops/:id/register', async (req: AuthRequest, res) => {
  const faculty = await getFaculty(req.user!.userId);
  if (!faculty) return res.status(404).json({ error: 'Not found' });

  const reg = await prisma.workshopRegistration.create({
    data: { workshopId: req.params.id, facultyId: faculty.id },
  });
  res.status(201).json(reg);
});

export default router;
