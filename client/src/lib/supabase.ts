import { createClient } from '@supabase/supabase-js';

// ─── SETU SUPABASE CONFIG ────────────────────────────────────────────────────
// Replace these with your actual Supabase project URL and anon key
// Get them from: https://supabase.com/dashboard → Your Project → Settings → API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── SETU DATABASE TYPES ──────────────────────────────────────────────────────
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

// ─── SUPABASE DB HELPER ───────────────────────────────────────────────────────
export const supabaseDb = {
  // Users
  async getUsers(): Promise<DbUser[]> {
    const { data } = await supabase.from('setu_users').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  async getUserByEmail(email: string): Promise<DbUser | null> {
    const { data } = await supabase
      .from('setu_users')
      .select('*')
      .ilike('email', email)
      .single();
    return data;
  },

  async registerUser(payload: Omit<DbUser, 'id' | 'created_at'>): Promise<DbUser> {
    const existing = await supabaseDb.getUserByEmail(payload.email);
    if (existing) throw new Error(`Email "${payload.email}" already registered.`);

    const { data, error } = await supabase
      .from('setu_users')
      .insert([{ ...payload, created_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Tasks
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

  // Proposals
  async getProposals(): Promise<DbProposal[]> {
    const { data } = await supabase
      .from('setu_proposals')
      .select('*')
      .order('submitted_at', { ascending: false });
    return data || [];
  },

  async submitProposal(proposal: Omit<DbProposal, 'id' | 'submitted_at' | 'status'>): Promise<DbProposal> {
    const { data, error } = await supabase
      .from('setu_proposals')
      .insert([{ ...proposal, status: 'PENDING', submitted_at: new Date().toISOString() }])
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

  // Mentees
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
        .update({ hours_logged: mentee.hours_logged + additionalHours })
        .eq('id', menteeId);
    }
  },

  // Real-time subscription
  subscribeToTable(table: string, callback: () => void) {
    return supabase
      .channel(`realtime_${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
  },
};
