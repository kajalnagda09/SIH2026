export interface StudentProfile {
  fullName: string;
  branch: string;
  department: string;
  year: number;
  college: string;
  city: string;
  cgpa: number;
  rollNumber: string;
  codingStreak: number;
  headline: string;
  summary: string;
  skills: { name: string; level: number; category: 'technical' | 'domain' | 'soft' }[];
  portfolio: {
    publicSlug: string;
    projects: { title: string; desc: string; link?: string }[];
    achievements: { title: string; year: number }[];
  };
}

export interface FacultyProfile {
  fullName: string;
  designation: string;
  department: string;
  college: string;
  city: string;
  specialization: string;
  totalMentees: number;
  activeProjects: number;
}

export interface IndustryProfile {
  companyName: string;
  sector: string;
  city: string;
  description: string;
  isApproved: boolean;
  activePostings: number;
}

export interface AdminProfile {
  fullName: string;
  college: string;
  designation: string;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  sector: string;
  city: string;
  type: 'CLINICAL' | 'RESEARCH' | 'TECHNICAL' | 'MANAGEMENT';
  stipend: number;
  duration: string;
  skillsRequired: string[];
  description: string;
  openings: number;
  deadline: string;
  applied?: boolean;
  status?: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFERED' | 'JOINED';
}

export interface CodingProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  description: string;
  examples: { input: string; output: string }[];
  starterCode: string;
  solved?: boolean;
}

export interface Assessment {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  userScore?: number;
  status: 'PENDING' | 'PASSED' | 'FAILED';
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface Application {
  id: string;
  roleTitle: string;
  company: string;
  appliedDate: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFERED' | 'JOINED' | 'REJECTED';
  stageTimeline: { stage: string; date: string; completed: boolean }[];
  feedback?: string;
  interviewDate?: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  rollNumber: string;
  courseTitle: string;
  issuedBy: string;
  issueDate: string;
  credentialId: string;
  verificationUrl: string;
  skillsVerified: string[];
}

export const DEMO_PROFILES = {
  STUDENT: {
    id: 'usr_student_01',
    email: 'student@setu.demo',
    role: 'STUDENT' as const,
    isVerified: true,
    profile: {
      fullName: 'Ananya Iyer',
      branch: 'BAMS (Ayurvedacharya)',
      department: 'Kayachikitsa & Integrative Medicine',
      year: 3,
      college: 'All India Institute of Ayurveda (AIIA), New Delhi',
      city: 'New Delhi',
      cgpa: 8.7,
      rollNumber: 'AIIA2022044',
      codingStreak: 5,
      headline: 'Ayurveda Scholar | Clinical Data & Herbogenomics Researcher',
      summary: 'Passionate BAMS undergraduate integrating classical Charaka Samhita diagnostics with computational toxicology and clinical pharmacovigilance.',
      skills: [
        { name: 'Ayurvedic Pharmacology', level: 92, category: 'domain' },
        { name: 'Clinical Research & GCP', level: 86, category: 'domain' },
        { name: 'Herbal Formulation', level: 88, category: 'domain' },
        { name: 'Python & Biostatistics', level: 75, category: 'technical' },
        { name: 'Data Analysis', level: 80, category: 'technical' },
        { name: 'System Design', level: 65, category: 'technical' },
        { name: 'Clinical Communication', level: 90, category: 'soft' },
        { name: 'Critical Thinking', level: 85, category: 'soft' },
      ],
      portfolio: {
        publicSlug: 'ananya-iyer-aiia',
        projects: [
          {
            title: 'Herbal Drug Interaction & Safety Matrix',
            desc: 'Curated and indexed 240+ interactions between classical Ayurvedic polyherbal decoctions and allopathic antidiabetic drugs.',
            link: 'https://github.com/setu-aiia/herbal-interactions',
          },
          {
            title: 'Panchakarma Protocol Digital Logbook',
            desc: 'Developed an automated compliance monitoring web app for patient vitals pre and post Virechana karma.',
          },
        ],
        achievements: [
          { title: 'Best Clinical Research Paper — National Ayush Conclave', year: 2025 },
          { title: 'AIIA Meritorious Scholar Award', year: 2024 },
        ],
      },
    } as StudentProfile,
  },
  FACULTY: {
    id: 'usr_faculty_01',
    email: 'faculty@setu.demo',
    role: 'FACULTY' as const,
    isVerified: true,
    profile: {
      fullName: 'Dr. Priyanshi Mehta',
      designation: 'Associate Professor & Research Chair',
      department: 'Dravyaguna Vigyan',
      college: 'All India Institute of Ayurveda',
      city: 'New Delhi',
      specialization: 'Medicinal Plant Standardization & Quality Control',
      totalMentees: 18,
      activeProjects: 6,
    } as FacultyProfile,
  },
  INDUSTRY: {
    id: 'usr_industry_01',
    email: 'industry@setu.demo',
    role: 'INDUSTRY' as const,
    isVerified: true,
    profile: {
      companyName: 'Dabur Research & Development Centre',
      sector: 'Ayurveda, Nutra & FMCG Healthcare',
      city: 'Ghaziabad, NCR',
      description: 'Premier Ayurvedic research division dedicated to evidence-based herbal pharmacopoeia and clinical trials.',
      isApproved: true,
      activePostings: 7,
    } as IndustryProfile,
  },
  ADMIN: {
    id: 'usr_admin_01',
    email: 'admin@setu.demo',
    role: 'ADMIN' as const,
    isVerified: true,
    profile: {
      fullName: 'Dr. Karthik Reddy',
      designation: 'Dean of Academic Collaborations & SIH Co-ordinator',
      college: 'All India Institute of Ayurveda',
    } as AdminProfile,
  },
};

export const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: 'int_01',
    title: 'Phytochemistry & Formulation Research Intern',
    company: 'Dabur Research Centre',
    sector: 'Ayurveda FMCG',
    city: 'Ghaziabad / Hybrid',
    type: 'RESEARCH',
    stipend: 25000,
    duration: '6 Months',
    skillsRequired: ['Ayurvedic Pharmacology', 'Herbal Formulation', 'Data Analysis'],
    description: 'Lead botanical raw-material fingerprinting via HPTLC and assist in clinical standardization for immunity-boosting rasayana formulations.',
    openings: 4,
    deadline: '2026-10-15',
    applied: true,
    status: 'INTERVIEW',
  },
  {
    id: 'int_02',
    title: 'Clinical Trial Associate (Integrative Oncology)',
    company: 'Apollo Hospitals & Ayush Research',
    sector: 'Healthcare & Clinical Trials',
    city: 'New Delhi',
    type: 'CLINICAL',
    stipend: 28000,
    duration: '3 Months',
    skillsRequired: ['Clinical Research', 'Pharmacovigilance', 'Communication'],
    description: 'Work with AIIA oncology faculty to monitor patient compliance in palliative Ayurvedic adjuvant protocols.',
    openings: 2,
    deadline: '2026-10-20',
    applied: true,
    status: 'SHORTLISTED',
  },
  {
    id: 'int_03',
    title: 'Healthcare Informatics & AI Engineer Intern',
    company: 'TCS Life Sciences Innovation Lab',
    sector: 'IT & Digital Health',
    city: 'Bengaluru / Remote',
    type: 'TECHNICAL',
    stipend: 35000,
    duration: '6 Months',
    skillsRequired: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
    description: 'Build NLP pipelines to extract formulation relationships from classical Charaka and Sushruta Sanskrit treatises.',
    openings: 5,
    deadline: '2026-11-01',
    applied: false,
  },
  {
    id: 'int_04',
    title: 'Quality Assurance & Regulatory Affairs Intern',
    company: 'Himalaya Wellness Company',
    sector: 'Ayurveda & Pharmaceuticals',
    city: 'Bengaluru',
    type: 'RESEARCH',
    stipend: 22000,
    duration: '4 Months',
    skillsRequired: ['Regulatory Affairs', 'Herbal Formulation', 'Pharmacovigilance'],
    description: 'Support international dossier preparations complying with WHO GMP guidelines for herbal botanical dietary supplements.',
    openings: 3,
    deadline: '2026-10-28',
    applied: false,
  },
  {
    id: 'int_05',
    title: 'Digital Health Platform Product Associate',
    company: 'Practo HealthTech',
    sector: 'HealthTech',
    city: 'Bengaluru',
    type: 'MANAGEMENT',
    stipend: 30000,
    duration: '5 Months',
    skillsRequired: ['System Design', 'Communication', 'Problem Solving'],
    description: 'Design telemedicine workflow integrations specifically tailored for Ayush wellness consultants and dispensaries.',
    openings: 2,
    deadline: '2026-11-10',
    applied: true,
    status: 'OFFERED',
  },
  {
    id: 'int_06',
    title: 'Translational Genomics & Bio-Analytical Intern',
    company: 'Biocon Biologics',
    sector: 'Biotechnology',
    city: 'Bengaluru',
    type: 'RESEARCH',
    stipend: 32000,
    duration: '6 Months',
    skillsRequired: ['Data Analysis', 'Clinical Research', 'Python'],
    description: 'Investigate the epigenetic biomarkers in response to standardized Ashwagandha root extract administrations.',
    openings: 3,
    deadline: '2026-10-30',
    applied: false,
  },
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app_01',
    roleTitle: 'Digital Health Platform Product Associate',
    company: 'Practo HealthTech',
    appliedDate: '2026-08-28',
    status: 'OFFERED',
    stageTimeline: [
      { stage: 'Application Submitted', date: '28 Aug 2026', completed: true },
      { stage: 'Profile Shortlisted', date: '04 Sep 2026', completed: true },
      { stage: 'Technical & Domain Assessment', date: '11 Sep 2026', completed: true },
      { stage: 'Panel Interview', date: '16 Sep 2026', completed: true },
      { stage: 'Formal Offer Issued', date: '19 Sep 2026', completed: true },
    ],
    feedback: 'Exceptional cross-disciplinary acumen blending BAMS clinical perspective with tech product roadmaps. Offer letter dispatched with ₹30,000/mo stipend.',
  },
  {
    id: 'app_02',
    roleTitle: 'Phytochemistry & Formulation Research Intern',
    company: 'Dabur Research Centre',
    appliedDate: '2026-09-02',
    status: 'INTERVIEW',
    stageTimeline: [
      { stage: 'Application Submitted', date: '02 Sep 2026', completed: true },
      { stage: 'Profile Shortlisted', date: '08 Sep 2026', completed: true },
      { stage: 'Technical Assessment', date: '14 Sep 2026', completed: true },
      { stage: 'Scientific Board Interview', date: '24 Sep 2026 (Upcoming)', completed: false },
      { stage: 'Final Selection', date: 'Pending', completed: false },
    ],
    interviewDate: '24 Sep 2026, 11:30 AM IST (Google Meet)',
    feedback: 'Scored 94% on Ayurvedic Pharmacology Assessment. Selected for Round 2 technical panel interview.',
  },
  {
    id: 'app_03',
    roleTitle: 'Clinical Trial Associate (Integrative Oncology)',
    company: 'Apollo Hospitals & Ayush Research',
    appliedDate: '2026-09-10',
    status: 'SHORTLISTED',
    stageTimeline: [
      { stage: 'Application Submitted', date: '10 Sep 2026', completed: true },
      { stage: 'Profile Shortlisted', date: '18 Sep 2026', completed: true },
      { stage: 'Document & GCP Verification', date: 'Pending', completed: false },
      { stage: 'Principal Investigator Interview', date: 'Pending', completed: false },
    ],
    feedback: 'Verified AIIA recommendation letter from Dr. Priyanshi Mehta attached.',
  },
];

export const MOCK_CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'prob_01',
    title: 'Herbal Inventory Sum',
    slug: 'herbal-inventory-sum',
    difficulty: 'EASY',
    tags: ['arrays', 'hash-table', 'ayush-inventory'],
    description: `Given an array of herb batch weights in kilograms and an integer target dosage, return the indices of two batches such that they add up to the exact target dosage.
    
Each input has exactly one solution, and you may not use the same element twice.`,
    examples: [
      { input: 'weights = [2, 7, 11, 15], target = 9', output: '[0, 1] (because weights[0] + weights[1] == 9)' },
      { input: 'weights = [3, 2, 4], target = 6', output: '[1, 2]' },
    ],
    starterCode: `function solve(weights, target) {
  // Map values to index
  const seen = new Map();
  for (let i = 0; i < weights.length; i++) {
    const complement = target - weights[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(weights[i], i);
  }
  return [];
}`,
    solved: true,
  },
  {
    id: 'prob_02',
    title: 'Valid Prescription Brackets',
    slug: 'valid-prescription-brackets',
    difficulty: 'EASY',
    tags: ['stack', 'strings', 'clinical-notation'],
    description: `Ayush digital prescriptions use nested notation with brackets '()', '[]', and '{}' to specify combined dosage tiers. Validate if the bracket sequence is completely balanced and properly closed.`,
    examples: [
      { input: 's = "{[()]} "', output: 'true' },
      { input: 's = "([)]"', output: 'false' },
    ],
    starterCode: `function solve(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  
  for (const char of s.trim()) {
    if (['(', '[', '{'].includes(char)) {
      stack.push(char);
    } else if ([')', ']', '}'].includes(char)) {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
    solved: true,
  },
  {
    id: 'prob_03',
    title: 'Patient Queue Priority',
    slug: 'patient-queue-priority',
    difficulty: 'EASY',
    tags: ['heap', 'sorting', 'hospital-triage'],
    description: `In the AIIA OPD emergency triage, each incoming patient has an urgency score. Find the k-th highest triage score among all waiting patients.`,
    examples: [
      { input: 'scores = [3, 2, 1, 5, 6, 4], k = 2', output: '5' },
    ],
    starterCode: `function solve(scores, k) {
  scores.sort((a, b) => b - a);
  return scores[k - 1];
}`,
    solved: false,
  },
  {
    id: 'prob_04',
    title: 'Ayurvedic Compound Palindrome',
    slug: 'ayurvedic-palindrome',
    difficulty: 'EASY',
    tags: ['strings', 'two-pointers'],
    description: `Given a Latinized Sanskrit formulation name, check if the string reads the same forwards and backwards, ignoring non-alphanumeric characters and casing.`,
    examples: [
      { input: 's = "Rasakar"', output: 'false' },
      { input: 's = "Naman"', output: 'true' },
    ],
    starterCode: `function solve(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
    solved: false,
  },
  {
    id: 'prob_05',
    title: 'Binary Search Drug Concentration',
    slug: 'binary-search-dosage',
    difficulty: 'MEDIUM',
    tags: ['binary-search', 'pharmacokinetics'],
    description: `Given a sorted array of standardized herb extract concentrations (mg/mL), perform a logarithmic binary search to locate the exact index of the therapeutic target concentration, or return -1.`,
    examples: [
      { input: 'concentrations = [10, 25, 45, 80, 120, 200], target = 80', output: '3' },
    ],
    starterCode: `function solve(concentrations, target) {
  let low = 0;
  let high = concentrations.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (concentrations[mid] === target) return mid;
    if (concentrations[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    solved: false,
  },
];

export const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 'ass_01',
    title: 'Ayurvedic Pharmacognosy & Dravyaguna Standardization',
    category: 'Domain Expertise',
    durationMinutes: 20,
    totalQuestions: 5,
    passingScore: 70,
    userScore: 92,
    status: 'PASSED',
    questions: [
      {
        id: 'q1',
        question: 'Which active chemical constituent in Withania somnifera (Ashwagandha) contributes predominantly to its adaptogenic properties?',
        options: ['Withanolides & Withaferin A', 'Curcuminoids', 'Piperine', 'Bacopasides'],
        correctIndex: 0,
      },
      {
        id: 'q2',
        question: 'What is the primary objective of "Shodhana" in classical Rasashastra mineral pharmacology?',
        options: ['Increasing cosmetic appeal', 'Purification and detoxification of heavy metals/minerals', 'Speeding up melting point', 'Color enhancement'],
        correctIndex: 1,
      },
      {
        id: 'q3',
        question: 'Which analytical technique is standard for fingerprinting polyherbal formulations according to the Ayurvedic Pharmacopoeia of India (API)?',
        options: ['High-Performance Thin-Layer Chromatography (HPTLC)', 'Simple Flame Test', 'Standard Titration only', 'Paper filter visual inspection'],
        correctIndex: 0,
      },
      {
        id: 'q4',
        question: 'In Charaka Samhita, what are the three sub-pillars (Trayopasthambha) of life?',
        options: ['Ahara, Nidra, Brahmacharya', 'Vata, Pitta, Kapha', 'Rasa, Rakta, Mamsa', 'Prana, Tejas, Ojas'],
        correctIndex: 0,
      },
      {
        id: 'q5',
        question: 'Triphala formulation consists of Haritaki, Bibhitaki, and which other fruit?',
        options: ['Amalaki (Emblica officinalis)', 'Guduchi', 'Tulsi', 'Shatavari'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'ass_02',
    title: 'Good Clinical Practice (GCP) & Ethical Human Trials',
    category: 'Clinical Governance',
    durationMinutes: 15,
    totalQuestions: 4,
    passingScore: 75,
    userScore: 85,
    status: 'PASSED',
    questions: [
      {
        id: 'g1',
        question: 'Which entity is legally mandated to approve human clinical trials before participant enrollment in India?',
        options: ['Institutional Ethics Committee (IEC) and CDSCO (CTRI registration)', 'Local Municipal Office', 'College Alumni Association', 'Pharmacy Council only'],
        correctIndex: 0,
      },
      {
        id: 'g2',
        question: 'What is the essential prerequisite before administering any investigational herbal drug to a trial subject?',
        options: ['Written Informed Consent Form (ICF) signed by subject', 'Oral consent over phone', 'Notice on noticeboard', 'Fee payment'],
        correctIndex: 0,
      },
      {
        id: 'g3',
        question: 'What does CTRI stand for in the Indian clinical research framework?',
        options: ['Clinical Trials Registry - India', 'Central Therapeutic Research Institute', 'Council of Toxicological Research India', 'Clinical Testing & Reporting Interface'],
        correctIndex: 0,
      },
      {
        id: 'g4',
        question: 'Within how many hours must a Serious Adverse Event (SAE) be reported to the regulatory authority?',
        options: ['24 Hours', '7 Days', '30 Days', 'At end of study'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'ass_03',
    title: 'Python for Healthcare Analytics & Biostatistics',
    category: 'Technical Computing',
    durationMinutes: 25,
    totalQuestions: 4,
    passingScore: 70,
    status: 'PENDING',
    questions: [
      {
        id: 'p1',
        question: 'Which Python library is the standard industry choice for structured tabular health record analysis?',
        options: ['Pandas', 'Flask', 'Turtle', 'PyGame'],
        correctIndex: 0,
      },
      {
        id: 'p2',
        question: 'In statistical hypothesis testing for clinical trial drug vs placebo comparison, a p-value < 0.05 indicates:',
        options: ['Statistically significant difference rejecting null hypothesis', 'Experiment is invalid', 'No difference between groups', 'Placebo caused 100% cure'],
        correctIndex: 0,
      },
      {
        id: 'p3',
        question: 'What is the function used in Pandas to calculate summary statistics (mean, std, min, max)?',
        options: ['df.describe()', 'df.inspect()', 'df.summary()', 'df.analyze()'],
        correctIndex: 0,
      },
      {
        id: 'p4',
        question: 'Which module handles non-parametric hypothesis tests (e.g. Mann-Whitney U test) in Python?',
        options: ['scipy.stats', 'math.random', 'sys.analytics', 'os.stats'],
        correctIndex: 0,
      },
    ],
  },
];

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_01',
    studentName: 'Ananya Iyer',
    rollNumber: 'AIIA2022044',
    courseTitle: 'Advanced Phytopharmaceutical Standardization & HPLC Fingerprinting',
    issuedBy: 'All India Institute of Ayurveda & Dabur R&D Joint Council',
    issueDate: '15 July 2026',
    credentialId: 'SETU-AIIA-2026-PHYTO-0842',
    verificationUrl: 'https://setu.ayush.gov.in/verify/SETU-AIIA-2026-PHYTO-0842',
    skillsVerified: ['Ayurvedic Pharmacology', 'HPTLC Analysis', 'Quality Control', 'API Compliance'],
  },
  {
    id: 'cert_02',
    studentName: 'Ananya Iyer',
    rollNumber: 'AIIA2022044',
    courseTitle: 'Ethical Human Clinical Trials & Good Clinical Practice (GCP-ICH E6 R2)',
    issuedBy: 'Ministry of Ayush National Training Board',
    issueDate: '22 August 2026',
    credentialId: 'SETU-AYUSH-GCP-2026-9931',
    verificationUrl: 'https://setu.ayush.gov.in/verify/SETU-AYUSH-GCP-2026-9931',
    skillsVerified: ['Clinical Research', 'GCP Compliance', 'Pharmacovigilance', 'Informed Consent'],
  },
];

export const MOCK_ADMIN_METRICS = {
  totalStudents: 42,
  verifiedStudents: 38,
  totalFaculty: 11,
  partnerIndustries: 12,
  activeInternships: 28,
  placedStudents: 31,
  totalMoUs: 8,
  internshipFillRate: '86.4%',
  avgStipend: '₹26,500/mo',
  departmentPlacements: [
    { name: 'Kayachikitsa', value: 88 },
    { name: 'Dravyaguna', value: 94 },
    { name: 'Rasashastra', value: 82 },
    { name: 'Panchakarma', value: 90 },
    { name: 'Swasthavritta', value: 76 },
    { name: 'Shalya Tantra', value: 85 },
  ],
  funnelStages: [
    { status: 'Applied', count: 184 },
    { status: 'Shortlisted', count: 96 },
    { status: 'Interview', count: 52 },
    { status: 'Offered', count: 34 },
    { status: 'Joined', count: 31 },
  ],
  industrySectors: [
    { name: 'Ayurveda FMCG', value: 38 },
    { name: 'Pharma & Biotech', value: 26 },
    { name: 'HealthTech & IT', value: 20 },
    { name: 'Hospitals & Research', value: 16 },
  ],
};
