import { Router } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../lib/db.js';
import {
  hashPassword,
  verifyPassword,
  signToken,
  setAuthCookie,
  clearAuthCookie,
  requireAuth,
  type AuthRequest,
} from '../lib/auth.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
  profile: z.record(z.unknown()),
});

router.post('/register', async (req, res) => {
  try {
    const body = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await hashPassword(body.password);
    const p = body.profile as Record<string, string | number | undefined>;

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        role: body.role,
        isVerified: body.role === Role.ADMIN,
        ...(body.role === Role.STUDENT && {
          student: {
            create: {
              fullName: String(p.fullName || ''),
              branch: String(p.branch || 'General'),
              department: String(p.department || 'General'),
              year: Number(p.year || 1),
              college: String(p.college || 'All India Institute of Ayurveda'),
              city: String(p.city || 'New Delhi'),
              cgpa: p.cgpa ? Number(p.cgpa) : undefined,
              rollNumber: p.rollNumber ? String(p.rollNumber) : undefined,
              portfolio: { create: { publicSlug: `student-${Date.now()}` } },
            },
          },
        }),
        ...(body.role === Role.FACULTY && {
          faculty: {
            create: {
              fullName: String(p.fullName || ''),
              designation: String(p.designation || 'Assistant Professor'),
              department: String(p.department || 'Kayachikitsa'),
              college: String(p.college || 'All India Institute of Ayurveda'),
              city: String(p.city || 'New Delhi'),
              specialization: p.specialization ? String(p.specialization) : undefined,
            },
          },
        }),
        ...(body.role === Role.INDUSTRY && {
          industry: {
            create: {
              companyName: String(p.companyName || ''),
              sector: String(p.sector || 'Healthcare'),
              city: String(p.city || 'Mumbai'),
              website: p.website ? String(p.website) : undefined,
              description: p.description ? String(p.description) : undefined,
              isApproved: false,
            },
          },
        }),
        ...(body.role === Role.ADMIN && {
          admin: {
            create: {
              fullName: String(p.fullName || 'Institution Admin'),
              college: String(p.college || 'All India Institute of Ayurveda'),
            },
          },
        }),
      },
      include: { student: true, faculty: true, industry: true, admin: true },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    setAuthCookie(res, token);
    res.status(201).json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors });
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true, faculty: true, industry: true, admin: true },
    });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    setAuthCookie(res, token);
    res.json({ user: { id: user.id, email: user.email, role: user.role, isVerified: user.isVerified } });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: e.errors });
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: {
      student: { include: { skills: { include: { skill: true } }, portfolio: true } },
      faculty: true,
      industry: true,
      admin: true,
    },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    profile: user.student || user.faculty || user.industry || user.admin,
  });
});

export default router;
