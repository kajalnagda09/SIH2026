import { Router } from 'express';
import { prisma } from '../lib/db.js';

const router = Router();

router.get('/stats', async (_req, res) => {
  const [students, industries, internships, placements] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.industryProfile.count({ where: { isApproved: true } }),
    prisma.internship.count({ where: { isActive: true } }),
    prisma.application.count({ where: { status: 'JOINED' } }),
  ]);
  res.json({ students, industries, internships, placements });
});

router.get('/portfolio/:slug', async (req, res) => {
  const portfolio = await prisma.portfolio.findUnique({
    where: { publicSlug: req.params.slug },
    include: {
      student: {
        select: {
          fullName: true,
          branch: true,
          department: true,
          college: true,
          city: true,
          skills: { include: { skill: true } },
        },
      },
      certificates: true,
    },
  });
  if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
  res.json(portfolio);
});

router.get('/verify/:verificationId', async (req, res) => {
  const cert = await prisma.certificate.findUnique({
    where: { verificationId: req.params.verificationId },
    include: {
      enrollment: { include: { student: true, program: { include: { industry: true } } } },
    },
  });
  if (!cert) return res.status(404).json({ error: 'Certificate not found' });
  res.json({
    valid: true,
    title: cert.title,
    verificationId: cert.verificationId,
    issuedAt: cert.issuedAt,
    student: cert.enrollment?.student.fullName,
    program: cert.enrollment?.program.title,
    issuer: cert.enrollment?.program.industry.companyName,
  });
});

router.get('/skills', async (_req, res) => {
  const skills = await prisma.skill.findMany({ orderBy: { name: 'asc' } });
  res.json(skills);
});

export default router;
