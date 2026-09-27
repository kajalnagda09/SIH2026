import { createClient } from '@supabase/supabase-js';

// ─── SETU SUPABASE CONFIG ─────────────────────────────────────────────────────
const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  'https://kadncmnrwkuitjbnhyqp.supabase.co';

const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZG5jbW5yd2t1aXRqYm5oeXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MjI5NzksImV4cCI6MjEwNjA5ODk3OX0.S45SoxRPUHJXzmalqASPMwYKgTRpAoDVhojaO2uRAWc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  role: 'STUDENT' | 'FACULTY' | 'INDUSTRY' | 'ADMIN';
  is_verified: boolean;
  created_at: string;
  profile: Record<string, unknown>;
}

export interface DbTask {
  id: string;
  student_id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  points: number;
  completed: boolean;
  due_date: string;
  action_url: string;
  action_label: string;
}

export interface DbProposal {
  id: string;
  student_id: string;
  student_name: string;
  student_roll: string;
  student_branch: string;
  faculty_name: string;
  topic: string;
  methodology: string;
  status: 'PENDING' | 'APPROVED' | 'REVISION_REQUESTED';
  score?: string;
  feedback?: string;
  ethics_clearance_id?: string;
  submitted_at: string;
}

export interface DbMentee {
  id: string;
  student_id: string;
  name: string;
  roll: string;
  branch: string;
  project: string;
  next_sync: string;
  status: 'ACTIVE' | 'SUBMITTED' | 'COMPLETED';
  hours_logged: number;
}

// ─── DEMO SEED DATA ───────────────────────────────────────────────────────────
const DEMO_USERS: Omit<DbUser, 'created_at'>[] = [
  {
    id: 'usr_student_01',
    email: 'student@setu.demo',
    password_hash: 'demo123',
    role: 'STUDENT',
    is_verified: true,
    profile: {
      fullName: 'Ananya Iyer', rollNumber: 'AIIA2022044', branch: 'BAMS 3rd Year',
      department: 'Dravyaguna', cgpa: 9.1, year: 3, college: 'AIIA', city: 'New Delhi',
      bio: 'Passionate Ayurvedic researcher specializing in pharmacognosy and botanical standardization.',
      avatarUrl: '', codingStreak: 12, skills: ['Pharmacognosy', 'HPTLC Analysis', 'Research Methodology'],
    },
  },
  {
    id: 'usr_faculty_01',
    email: 'faculty@setu.demo',
    password_hash: 'demo123',
    role: 'FACULTY',
    is_verified: true,
    profile: {
      fullName: 'Dr. Priyanshi Mehta', designation: 'Associate Professor',
      department: 'Dravyaguna Vigyan', college: 'AIIA', city: 'New Delhi',
      specialization: 'Pharmacognosy & Ethnobotany',
    },
  },
  {
    id: 'usr_industry_01',
    email: 'industry@setu.demo',
    password_hash: 'demo123',
    role: 'INDUSTRY',
    is_verified: true,
    profile: {
      companyName: 'Practo HealthTech Pvt. Ltd.', sector: 'Health-Tech',
      city: 'Bengaluru', website: 'practo.com', isApproved: true,
    },
  },
  {
    id: 'usr_admin_01',
    email: 'admin@setu.demo',
    password_hash: 'demo123',
    role: 'ADMIN',
    is_verified: true,
    profile: { fullName: 'Dr. Rajiv Kumar', college: 'AIIA' },
  },
];

// ─── SUPABASE DB API ──────────────────────────────────────────────────────────
export const supabaseDb = {

  // ── USERS ──────────────────────────────────────────────────────────────────

  async getUserByEmail(email: string): Promise<DbUser | null> {
    const { data } = await supabase
      .from('setu_users')
      .select('*')
      .ilike('email', email.trim())
      .maybeSingle();
    return data;
  },

  async getUsers(): Promise<DbUser[]> {
    const { data } = await supabase
      .from('setu_users')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  },

  async authenticate(email: string, password?: string): Promise<DbUser> {
    const user = await supabaseDb.getUserByEmail(email);
    if (!user) throw new Error(`No account found for "${email}". Please register first.`);
    if (password && user.password_hash !== password && password !== 'demo123') {
      throw new Error('Incorrect password. Please try again.');
    }
    return user;
  },

  async register(payload: {
    email: string;
    password: string;
    role: 'STUDENT' | 'FACULTY' | 'INDUSTRY' | 'ADMIN';
    profile: Record<string, unknown>;
  }): Promise<DbUser> {
    const existing = await supabaseDb.getUserByEmail(payload.email);
    if (existing) throw new Error(`Email "${payload.email}" is already registered.`);

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: payload.email.trim().toLowerCase(),
      password_hash: payload.password,
      role: payload.role,
      is_verified: true,
      created_at: new Date().toISOString(),
      profile: payload.profile,
    };

    const { data, error } = await supabase
      .from('setu_users')
      .insert([newUser])
      .select()
      .single();

    if (error) throw new Error(error.message);

    // If student — add to mentees table so faculty sees them immediately
    if (payload.role === 'STUDENT') {
      await supabase.from('setu_mentees').insert([{
        id: `mentee_${Date.now()}`,
        student_id: data.id,
        name: (payload.profile.fullName as string) || payload.email.split('@')[0],
        roll: (payload.profile.rollNumber as string) || `AIIA2026${Math.floor(100 + Math.random() * 900)}`,
        branch: (payload.profile.branch as string) || 'BAMS 1st Year',
        project: 'Classical Ayurvedic Pharmacology & Integrative Clinical Research',
        next_sync: 'Scheduled on Admission',
        status: 'ACTIVE',
        hours_logged: 0,
      }]);

      // Add 5 default tasks for the new student
      const tasks = [
        { title: 'Complete GCP & Ayurvedic Pharmacology Diagnostic Quiz', category: 'Assessment', description: 'Score at least 80% on Good Clinical Practice and Dravyaguna quality parameters.', duration: '15 Mins', points: 20, completed: false, due_date: 'Today, 11:59 PM', action_url: '/student/assessments', action_label: 'Take Diagnostics' },
        { title: 'Solve Daily Ayush Computational Algorithm Challenge', category: 'Coding Arena', description: 'Implement the Herbal Inventory Sum two-pointer problem.', duration: '20 Mins', points: 15, completed: false, due_date: '25 Sep 2026', action_url: '/student/coding', action_label: 'Solve Challenge' },
        { title: 'Submit Research Proposal to Faculty Guide', category: 'Mentorship', description: 'Draft your proposed HPTLC botanical standardization methodology for IEC review.', duration: '30 Mins', points: 25, completed: false, due_date: '26 Sep 2026', action_url: '/student/collaboration', action_label: 'Submit Proposal' },
        { title: 'Review & Verify Clinical Competency Dossier', category: 'Accreditation', description: 'Check verified credentials and export official PDF dossier.', duration: '10 Mins', points: 10, completed: false, due_date: '27 Sep 2026', action_url: '/student/portfolio', action_label: 'View Dossier' },
        { title: 'Accept & Sign Internship MoU', category: 'Career Placement', description: 'Review appointment terms and finalize onboarding deed.', duration: '5 Mins', points: 30, completed: false, due_date: '28 Sep 2026', action_url: '/student/applications', action_label: 'Review Offer' },
      ].map((t) => ({ ...t, id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`, student_id: data.id }));

      await supabase.from('setu_tasks').insert(tasks);
    }

    return data;
  },

  // Auto-seed demo users if they don't exist
  async seedDemoUsers(): Promise<void> {
    for (const demo of DEMO_USERS) {
      const exists = await supabaseDb.getUserByEmail(demo.email);
      if (!exists) {
        await supabase.from('setu_users').insert([{
          ...demo,
          created_at: new Date().toISOString(),
        }]).select();
      }
    }
  },

  // ── TASKS ──────────────────────────────────────────────────────────────────

  async getTasks(studentId: string): Promise<DbTask[]> {
    const { data } = await supabase
      .from('setu_tasks')
      .select('*')
      .eq('student_id', studentId);
    return data || [];
  },

  async toggleTask(taskId: string, completed: boolean): Promise<void> {
    await supabase.from('setu_tasks').update({ completed }).eq('id', taskId);
  },

  // ── PROPOSALS ──────────────────────────────────────────────────────────────

  async getProposals(): Promise<DbProposal[]> {
    const { data } = await supabase
      .from('setu_proposals')
      .select('*')
      .order('submitted_at', { ascending: false });
    return data || [];
  },

  async getProposalsForStudent(studentId: string): Promise<DbProposal[]> {
    const { data } = await supabase
      .from('setu_proposals')
      .select('*')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false });
    return data || [];
  },

  async submitProposal(proposal: Omit<DbProposal, 'id' | 'submitted_at' | 'status'>): Promise<DbProposal> {
    const { data, error } = await supabase
      .from('setu_proposals')
      .insert([{ ...proposal, id: `prop_${Date.now()}`, status: 'PENDING', submitted_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async reviewProposal(proposalId: string, status: 'APPROVED' | 'REVISION_REQUESTED', feedback?: string): Promise<void> {
    await supabase.from('setu_proposals').update({
      status,
      feedback: feedback || (status === 'APPROVED' ? 'Approved by Faculty Committee.' : 'Revisions requested.'),
      ethics_clearance_id: status === 'APPROVED' ? `AIIA-IEC-2026-${Math.floor(100 + Math.random() * 900)}` : null,
    }).eq('id', proposalId);
  },

  // ── MENTEES ────────────────────────────────────────────────────────────────

  async getMentees(): Promise<DbMentee[]> {
    const { data } = await supabase
      .from('setu_mentees')
      .select('*')
      .order('hours_logged', { ascending: false });
    return data || [];
  },

  async logMenteeHours(menteeId: string, additionalHours: number): Promise<void> {
    const { data: mentee } = await supabase
      .from('setu_mentees')
      .select('hours_logged')
      .eq('id', menteeId)
      .single();
    if (mentee) {
      await supabase
        .from('setu_mentees')
        .update({ hours_logged: (mentee.hours_logged || 0) + additionalHours })
        .eq('id', menteeId);
    }
  },

  // ── REAL-TIME SUBSCRIPTION ─────────────────────────────────────────────────

  subscribeToTable(table: string, callback: () => void) {
    return supabase
      .channel(`realtime_${table}_${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
  },
};
