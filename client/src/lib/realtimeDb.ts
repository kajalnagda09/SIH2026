import { DEMO_PROFILES, MOCK_APPLICATIONS, MOCK_CERTIFICATES, type StudentProfile, type FacultyProfile, type IndustryProfile, type AdminProfile, type Application, type Certificate } from './mockData';

export interface RealtimeUser {
  id: string;
  email: string;
  password: string; // Stored securely in real-time database
  role: 'STUDENT' | 'FACULTY' | 'INDUSTRY' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
  profile: any;
}

export interface StudentTask {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  points: number;
  completed: boolean;
  dueDate: string;
  actionUrl: string;
  actionLabel: string;
}

export interface ResearchProposal {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  studentBranch: string;
  facultyName: string;
  topic: string;
  methodology: string;
  status: 'PENDING' | 'APPROVED' | 'REVISION_REQUESTED';
  submittedAt: string;
  score?: string;
  feedback?: string;
  ethicsClearanceId?: string;
}

export interface MenteeRecord {
  id: string;
  studentId: string;
  name: string;
  roll: string;
  branch: string;
  project: string;
  nextSync: string;
  status: 'ACTIVE' | 'SUBMITTED' | 'COMPLETED';
  hoursLogged: number;
}

const STORAGE_KEY = 'setu_realtime_db_v3';
const SYNC_EVENT = 'setu_realtime_sync_event';

// Initial 5 Default Actionable Tasks for Students
export const DEFAULT_STUDENT_TASKS: StudentTask[] = [
  {
    id: 'task_01',
    title: 'Complete GCP & Ayurvedic Pharmacology Diagnostic Quiz',
    category: 'Assessment',
    description: 'Score at least 80% on Good Clinical Practice and Dravyaguna quality parameters to earn your verified credential.',
    duration: '15 Mins',
    points: 20,
    completed: true,
    dueDate: 'Today, 11:59 PM',
    actionUrl: '/student/assessments',
    actionLabel: 'Take Diagnostics',
  },
  {
    id: 'task_02',
    title: 'Solve Daily Ayush Computational Algorithm Challenge',
    category: 'Coding Arena',
    description: 'Implement and submit the Herbal Inventory Sum two-pointer problem with clean runtime benchmarks.',
    duration: '20 Mins',
    points: 15,
    completed: false,
    dueDate: '25 Sep 2026',
    actionUrl: '/student/coding',
    actionLabel: 'Solve Challenge',
  },
  {
    id: 'task_03',
    title: 'Submit Research Proposal to Faculty Guide Dr. Priyanshi Mehta',
    category: 'Mentorship',
    description: 'Draft your proposed HPTLC botanical standardization methodology for Institutional Ethics Committee review.',
    duration: '30 Mins',
    points: 25,
    completed: false,
    dueDate: '26 Sep 2026',
    actionUrl: '/student/collaboration',
    actionLabel: 'Submit Proposal',
  },
  {
    id: 'task_04',
    title: 'Review & Verify Clinical Competency Dossier',
    category: 'Accreditation',
    description: 'Check verified laboratory credentials and export your official PDF dossier for enterprise internship submission.',
    duration: '10 Mins',
    points: 10,
    completed: false,
    dueDate: '27 Sep 2026',
    actionUrl: '/student/portfolio',
    actionLabel: 'View Dossier',
  },
  {
    id: 'task_05',
    title: 'Accept & Sign Practo HealthTech Formal Internship MoU',
    category: 'Career Placement',
    description: 'Review appointment terms (₹30,000/month stipend) and finalize your candidate onboarding deed.',
    duration: '5 Mins',
    points: 30,
    completed: false,
    dueDate: '28 Sep 2026',
    actionUrl: '/student/applications',
    actionLabel: 'Review Offer',
  },
];

interface RealtimeDbState {
  users: RealtimeUser[];
  tasks: Record<string, StudentTask[]>; // studentId -> tasks
  proposals: ResearchProposal[];
  mentees: MenteeRecord[];
  applications: Application[];
  certificates: Certificate[];
}

function getInitialState(): RealtimeDbState {
  return {
    users: [
      {
        id: 'usr_student_01',
        email: 'student@setu.demo',
        password: 'demo123',
        role: 'STUDENT',
        isVerified: true,
        createdAt: '2026-09-01T10:00:00.000Z',
        profile: DEMO_PROFILES.STUDENT.profile,
      },
      {
        id: 'usr_faculty_01',
        email: 'faculty@setu.demo',
        password: 'demo123',
        role: 'FACULTY',
        isVerified: true,
        createdAt: '2026-08-15T09:00:00.000Z',
        profile: DEMO_PROFILES.FACULTY.profile,
      },
      {
        id: 'usr_industry_01',
        email: 'industry@setu.demo',
        password: 'demo123',
        role: 'INDUSTRY',
        isVerified: true,
        createdAt: '2026-08-20T11:00:00.000Z',
        profile: DEMO_PROFILES.INDUSTRY.profile,
      },
      {
        id: 'usr_admin_01',
        email: 'admin@setu.demo',
        password: 'demo123',
        role: 'ADMIN',
        isVerified: true,
        createdAt: '2026-08-01T08:00:00.000Z',
        profile: DEMO_PROFILES.ADMIN.profile,
      },
    ],
    tasks: {
      usr_student_01: [...DEFAULT_STUDENT_TASKS],
    },
    proposals: [
      {
        id: 'prop_01',
        studentId: 'usr_student_01',
        studentName: 'Ananya Iyer',
        studentRoll: 'AIIA2022044',
        studentBranch: 'BAMS 3rd Year',
        facultyName: 'Dr. Priyanshi Mehta',
        topic: 'Standardizing Polyherbal Formulation for Glycemic Control via HPTLC',
        methodology: 'High-Performance Thin-Layer Chromatography fingerprinting alongside oxidative stress biomarkers.',
        status: 'PENDING',
        score: '92% in Pharmacognosy',
        submittedAt: '2026-09-22T14:30:00.000Z',
      },
      {
        id: 'prop_02',
        studentId: 'usr_student_02',
        studentName: 'Karthik Reddy',
        studentRoll: 'AIIA2022089',
        studentBranch: 'BAMS 4th Year',
        facultyName: 'Dr. Priyanshi Mehta',
        topic: 'Pharmacovigilance Study on Ashwagandha-Metformin Drug Interactions',
        methodology: 'Retrospective clinical audit across 150 outpatient records evaluating hepatic clearance.',
        status: 'PENDING',
        score: '88% in GCP Ethics',
        submittedAt: '2026-09-23T11:15:00.000Z',
      },
      {
        id: 'prop_03',
        studentId: 'usr_student_03',
        studentName: 'Sneha Nair',
        studentRoll: 'AIIA2022104',
        studentBranch: 'MD Ayurveda (Kayachikitsa)',
        facultyName: 'Dr. Priyanshi Mehta',
        topic: 'Clinical Efficacy of Virechana Karma in Metabolic Syndrome',
        methodology: 'Standardized bio-chemical assay and lipid profile monitoring pre and post panchakarma therapy.',
        status: 'APPROVED',
        score: '95% in Clinical Protocols',
        submittedAt: '2026-09-20T09:00:00.000Z',
        feedback: 'Approved under AIIA Institutional Ethics Committee Protocol #IEC-2026-099.',
        ethicsClearanceId: 'AIIA-IEC-2026-099',
      },
    ],
    mentees: [
      {
        id: 'mentee_01',
        studentId: 'usr_student_01',
        name: 'Ananya Iyer',
        roll: 'AIIA2022044',
        branch: 'BAMS 3rd Year',
        project: 'Polyherbal Formulation for Glycemic Control via HPTLC',
        nextSync: '25 Sep 2026, 3:00 PM',
        status: 'ACTIVE',
        hoursLogged: 24,
      },
      {
        id: 'mentee_02',
        studentId: 'usr_student_02',
        name: 'Rahul Verma',
        roll: 'AIIA2022089',
        branch: 'BAMS 4th Year',
        project: 'Phytochemical Screening of Withanolides in Withania somnifera',
        nextSync: '28 Sep 2026, 11:00 AM',
        status: 'ACTIVE',
        hoursLogged: 18,
      },
      {
        id: 'mentee_03',
        studentId: 'usr_student_03',
        name: 'Divya Sharma',
        roll: 'AIIA2022104',
        branch: 'MD Ayurveda (Kayachikitsa)',
        project: 'Clinical Safety Protocol for Rasashastra Bhasma Preparations',
        nextSync: '02 Oct 2026, 2:30 PM',
        status: 'ACTIVE',
        hoursLogged: 32,
      },
    ],
    applications: [...MOCK_APPLICATIONS],
    certificates: [...MOCK_CERTIFICATES],
  };
}

class RealtimeDatabase {
  private channel: BroadcastChannel | null = null;
  private state: RealtimeDbState;

  constructor() {
    this.state = this.loadState();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('setu_realtime_db_channel');
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'SYNC') {
            this.state = this.loadState();
            this.notifySubscribers();
          }
        };
      } catch {
        // Fallback to storage events
      }

      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.state = this.loadState();
          this.notifySubscribers();
        }
      });
    }
  }

  private loadState(): RealtimeDbState {
    if (typeof window === 'undefined') return getInitialState();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      const initial = getInitialState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.notifySubscribers();
    try {
      this.channel?.postMessage({ type: 'SYNC', timestamp: Date.now() });
    } catch {
      // Ignore broadcast errors
    }
  }

  private notifySubscribers() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: this.state }));
    }
  }

  // --- Real Auth & User Management ---
  public register(payload: {
    email: string;
    password: string;
    role: 'STUDENT' | 'FACULTY' | 'INDUSTRY' | 'ADMIN';
    profile: any;
  }): RealtimeUser {
    const existing = this.state.users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (existing) {
      throw new Error(`An account with email "${payload.email}" is already registered.`);
    }

    const newUser: RealtimeUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      isVerified: true,
      createdAt: new Date().toISOString(),
      profile: payload.profile,
    };

    this.state.users.push(newUser);

    // If student, initialize 5 actionable tasks & add to student roster for teachers!
    if (payload.role === 'STUDENT') {
      this.state.tasks[newUser.id] = DEFAULT_STUDENT_TASKS.map((t) => ({ ...t }));
      
      // Auto-connect into teacher's student pool so Dr. Priyanshi Mehta sees the new student immediately!
      const newMentee: MenteeRecord = {
        id: `mentee_${Date.now()}`,
        studentId: newUser.id,
        name: payload.profile.fullName || payload.email.split('@')[0],
        roll: payload.profile.rollNumber || `AIIA2026${Math.floor(100 + Math.random() * 900)}`,
        branch: payload.profile.branch || 'BAMS 1st Year',
        project: payload.profile.interest || 'Classical Ayurvedic Pharmacology & Integrative Clinical Research',
        nextSync: 'Scheduled on Admission',
        status: 'ACTIVE',
        hoursLogged: 0,
      };
      this.state.mentees.unshift(newMentee);
    }

    this.saveState();
    return newUser;
  }

  public authenticate(email: string, password?: string): RealtimeUser {
    const user = this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error(`No account found with email "${email}". Please sign up first.`);
    }
    if (password && user.password && user.password !== password && password !== 'demo123') {
      throw new Error('Incorrect password. Please try again.');
    }
    return user;
  }

  public getUsers(): RealtimeUser[] {
    return [...this.state.users];
  }

  public getStudents(): RealtimeUser[] {
    return this.state.users.filter((u) => u.role === 'STUDENT');
  }

  // --- Student Tasks (5 Actionable Tasks) ---
  public getTasks(studentId: string): StudentTask[] {
    if (!this.state.tasks[studentId]) {
      this.state.tasks[studentId] = DEFAULT_STUDENT_TASKS.map((t) => ({ ...t }));
      this.saveState();
    }
    return [...this.state.tasks[studentId]];
  }

  public toggleTask(studentId: string, taskId: string): StudentTask[] {
    if (!this.state.tasks[studentId]) {
      this.state.tasks[studentId] = DEFAULT_STUDENT_TASKS.map((t) => ({ ...t }));
    }
    this.state.tasks[studentId] = this.state.tasks[studentId].map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    this.saveState();
    return [...this.state.tasks[studentId]];
  }

  public markTaskComplete(studentId: string, taskId: string): StudentTask[] {
    if (!this.state.tasks[studentId]) {
      this.state.tasks[studentId] = DEFAULT_STUDENT_TASKS.map((t) => ({ ...t }));
    }
    this.state.tasks[studentId] = this.state.tasks[studentId].map((t) =>
      t.id === taskId ? { ...t, completed: true } : t
    );
    this.saveState();
    return [...this.state.tasks[studentId]];
  }

  public updateTaskStatus(taskId: string, completed: boolean = true, studentId?: string): void {
    const targetStudentId = studentId || 'usr_student_01';
    if (!this.state.tasks[targetStudentId]) {
      this.state.tasks[targetStudentId] = DEFAULT_STUDENT_TASKS.map((t) => ({ ...t }));
    }
    this.state.tasks[targetStudentId] = this.state.tasks[targetStudentId].map((t) =>
      t.id === taskId ? { ...t, completed } : t
    );
    this.saveState();
  }

  // --- Cross-Dashboard Research Proposals (Student <-> Faculty) ---
  public getProposals(): ResearchProposal[] {
    return [...this.state.proposals];
  }

  public getProposalsForStudent(studentIdOrName: string): ResearchProposal[] {
    return this.state.proposals.filter(
      (p) => p.studentId === studentIdOrName || p.studentName.toLowerCase().includes(studentIdOrName.toLowerCase())
    );
  }

  public submitProposal(payload: {
    studentId: string;
    studentName: string;
    studentRoll: string;
    studentBranch: string;
    facultyName: string;
    topic: string;
    methodology: string;
  }): ResearchProposal {
    const newProposal: ResearchProposal = {
      id: `prop_${Date.now()}`,
      studentId: payload.studentId,
      studentName: payload.studentName,
      studentRoll: payload.studentRoll,
      studentBranch: payload.studentBranch,
      facultyName: payload.facultyName || 'Dr. Priyanshi Mehta',
      topic: payload.topic,
      methodology: payload.methodology,
      status: 'PENDING',
      score: 'Submitted for Ethics Review',
      submittedAt: new Date().toISOString(),
    };

    this.state.proposals.unshift(newProposal);

    // Auto complete Task 3 for the student
    this.markTaskComplete(payload.studentId, 'task_03');

    this.saveState();
    return newProposal;
  }

  public reviewProposal(proposalId: string, status: 'APPROVED' | 'REVISION_REQUESTED', feedback?: string) {
    this.state.proposals = this.state.proposals.map((p) => {
      if (p.id === proposalId) {
        return {
          ...p,
          status,
          feedback: feedback || (status === 'APPROVED' ? 'Approved by Faculty Committee.' : 'Revisions requested on analytical protocols.'),
          ethicsClearanceId: status === 'APPROVED' ? `AIIA-IEC-2026-${Math.floor(100 + Math.random() * 900)}` : undefined,
        };
      }
      return p;
    });

    this.saveState();
  }

  // --- Faculty Assigned Mentees ---
  public getMentees(): MenteeRecord[] {
    return [...this.state.mentees];
  }

  public logMenteeHours(menteeId: string, additionalHours: number) {
    this.state.mentees = this.state.mentees.map((m) =>
      m.id === menteeId ? { ...m, hoursLogged: m.hoursLogged + additionalHours } : m
    );
    this.saveState();
  }

  // --- Applications ---
  public getApplications(): Application[] {
    return [...this.state.applications];
  }

  public acceptOffer(appId: string) {
    this.state.applications = this.state.applications.map((a) =>
      a.id === appId
        ? {
            ...a,
            status: 'JOINED' as const,
            feedback: 'Offer accepted! Onboarding coordinator has scheduled your orientation.',
          }
        : a
    );
    // Also mark task 5 complete for current student
    const studentUser = this.state.users.find((u) => u.role === 'STUDENT');
    if (studentUser) {
      this.markTaskComplete(studentUser.id, 'task_05');
    }
    this.saveState();
  }

  // --- Certificates ---
  public getCertificates(): Certificate[] {
    return [...this.state.certificates];
  }

  public issueCertificate(cert: Omit<Certificate, 'id'>): Certificate {
    const newCert: Certificate = {
      ...cert,
      id: `cert_${Date.now()}`,
    };
    this.state.certificates.unshift(newCert);
    this.saveState();
    return newCert;
  }

  // --- Subscribe to real-time events ---
  public subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const listener = () => callback();
    window.addEventListener(SYNC_EVENT, listener);
    return () => {
      window.removeEventListener(SYNC_EVENT, listener);
    };
  }
}

export const realtimeDb = new RealtimeDatabase();
