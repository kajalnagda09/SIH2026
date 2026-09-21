import { PrismaClient, Role, ApplicationStatus, ProgramType, InternshipType, OpportunityType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const hash = (p: string) => bcrypt.hash(p, 12);

const INDIAN_NAMES = [
  'Ananya Iyer', 'Rahul Verma', 'Priyanshi Mehta', 'Karthik Reddy', 'Harpreet Singh',
  'Sneha Nair', 'Arjun Patel', 'Divya Sharma', 'Vikram Joshi', 'Meera Krishnan',
  'Aditya Gupta', 'Kavya Menon', 'Rohan Desai', 'Ishita Banerjee', 'Nikhil Rao',
  'Tanvi Kulkarni', 'Suresh Pillai', 'Aisha Khan', 'Manish Tiwari', 'Pooja Hegde',
  'Varun Malhotra', 'Shruti Choudhary', 'Deepak Yadav', 'Neha Saxena', 'Akash Bhatt',
  'Ritu Agarwal', 'Gaurav Mishra', 'Swati Dutta', 'Harsh Vardhan', 'Lakshmi Sundaram',
  'Abhishek Sinha', 'Nandini Roy', 'Prateek Jain', 'Simran Kaur', 'Yashwant Pawar',
  'Keerthi Balaji', 'Mohit Chauhan', 'Anjali Tripathi', 'Siddharth Nambiar', 'Rekha Das',
  'Vivek Chatterjee', 'Padma Srinivasan', 'Tarun Bhatia', 'Uma Raghavan', 'Farhan Ali',
];

const CITIES = ['New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Lucknow'];
const BRANCHES = ['BAMS', 'B.Tech CSE', 'B.Pharm', 'B.Sc Biotechnology', 'MBA Healthcare', 'MD Ayurveda', 'B.Tech IT'];
const DEPARTMENTS = ['Kayachikitsa', 'Dravyaguna', 'Computer Science', 'Pharmaceutical Sciences', 'Panchakarma', 'Swasthavritta'];

const COMPANIES = [
  { name: 'Dabur Research Centre', sector: 'Ayurveda & FMCG', city: 'Ghaziabad' },
  { name: 'Patanjali Wellness Labs', sector: 'Ayurveda', city: 'Haridwar' },
  { name: 'Himalaya Drug Company', sector: 'Pharma & Ayurveda', city: 'Bengaluru' },
  { name: 'Infosys BPM Healthcare', sector: 'IT Services', city: 'Pune' },
  { name: 'Apollo Hospitals Enterprise', sector: 'Healthcare', city: 'Chennai' },
  { name: 'Zydus Lifesciences', sector: 'Pharmaceuticals', city: 'Ahmedabad' },
  { name: 'Biocon Limited', sector: 'Biotechnology', city: 'Bengaluru' },
  { name: 'TCS Life Sciences', sector: 'IT & Healthcare', city: 'Mumbai' },
  { name: 'Emami Limited', sector: 'Ayurveda FMCG', city: 'Kolkata' },
  { name: 'Sun Pharma R&D', sector: 'Pharmaceuticals', city: 'Gurugram' },
  { name: 'Practo Technologies', sector: 'HealthTech', city: 'Bengaluru' },
  { name: '1mg Technologies', sector: 'HealthTech', city: 'Gurugram' },
];

const SKILLS = [
  { name: 'JavaScript', category: 'technical' },
  { name: 'Python', category: 'technical' },
  { name: 'SQL', category: 'technical' },
  { name: 'React', category: 'technical' },
  { name: 'Data Analysis', category: 'technical' },
  { name: 'Machine Learning', category: 'technical' },
  { name: 'System Design', category: 'technical' },
  { name: 'Ayurvedic Pharmacology', category: 'domain' },
  { name: 'Clinical Research', category: 'domain' },
  { name: 'Herbal Formulation', category: 'domain' },
  { name: 'Communication', category: 'soft' },
  { name: 'Teamwork', category: 'soft' },
  { name: 'Problem Solving', category: 'soft' },
  { name: 'Leadership', category: 'soft' },
  { name: 'Time Management', category: 'soft' },
  { name: 'Critical Thinking', category: 'soft' },
  { name: 'Node.js', category: 'technical' },
  { name: 'Docker', category: 'technical' },
  { name: 'Pharmacovigilance', category: 'domain' },
  { name: 'Regulatory Affairs', category: 'domain' },
];

const CODING_PROBLEMS = [
  { title: 'Herbal Inventory Sum', slug: 'herbal-inventory-sum', difficulty: 'EASY', tags: ['arrays', 'math'],
    description: 'Given an array of herb quantities, return indices of two herbs that sum to target dosage.',
    examples: [{ input: '[2,7,11,15], 9', output: '[0,1]' }],
    testCases: [{ input: [[2,7,11,15], 9], expected: [0,1], isPublic: true }, { input: [[3,2,4], 6], expected: [1,2] }, { input: [[3,3], 6], expected: [0,1] }],
    starterCode: 'function solve(input) {\n  const [nums, target] = input;\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map[need] !== undefined) return [map[need], i];\n    map[nums[i]] = i;\n  }\n  return [];\n}' },
  { title: 'Valid Prescription Brackets', slug: 'valid-prescription-brackets', difficulty: 'EASY', tags: ['stack', 'strings'],
    description: 'Check if prescription notation with brackets ()[]{}  is valid.',
    examples: [{ input: '"({[]})"', output: 'true' }],
    testCases: [{ input: ['({[]})'], expected: true, isPublic: true }, { input: ['(]'], expected: false }, { input: [''], expected: true }],
    starterCode: 'function solve(input) {\n  const s = input;\n  const stack = [];\n  const map = { ")": "(", "]": "[", "}": "{" };\n  for (const c of s) {\n    if ("([{".includes(c)) stack.push(c);\n    else if (")]}".includes(c)) {\n      if (stack.pop() !== map[c]) return false;\n    }\n  }\n  return stack.length === 0;\n}' },
  { title: 'Patient Queue Priority', slug: 'patient-queue-priority', difficulty: 'EASY', tags: ['heap', 'simulation'],
    description: 'Return the k-th highest priority patient score from an array.',
    examples: [{ input: '[3,2,1,5,6,4], 2', output: '5' }],
    testCases: [{ input: [[3,2,1,5,6,4], 2], expected: 5, isPublic: true }, { input: [[3,2,3,1,2,4,5,5,6], 4], expected: 4 }],
    starterCode: 'function solve(input) {\n  const [nums, k] = input;\n  return nums.sort((a,b)=>b-a)[k-1];\n}' },
  { title: 'Ayurvedic Compound Palindrome', slug: 'ayurvedic-palindrome', difficulty: 'EASY', tags: ['strings', 'two-pointers'],
    description: 'Check if ingredient name reads same forwards and backwards (ignore case/spaces).',
    examples: [{ input: '"Ashvagandha"', output: 'false' }],
    testCases: [{ input: ['Ashvagandha'], expected: false, isPublic: true }, { input: ['madam'], expected: true }, { input: ['A man a plan a canal Panama'], expected: true }],
    starterCode: 'function solve(input) {\n  const s = input.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return s === s.split("").reverse().join("");\n}' },
  { title: 'Binary Search Drug Dosage', slug: 'binary-search-dosage', difficulty: 'EASY', tags: ['binary-search'],
    description: 'Find target dosage in sorted array of drug concentrations.',
    examples: [{ input: '[-1,0,3,5,9,12], 9', output: '4' }],
    testCases: [{ input: [[-1,0,3,5,9,12], 9], expected: 4, isPublic: true }, { input: [[-1,0,3,5,9,12], 2], expected: -1 }],
    starterCode: 'function solve(input) {\n  const [nums, target] = input;\n  let l=0,r=nums.length-1;\n  while(l<=r){\n    const m=Math.floor((l+r)/2);\n    if(nums[m]===target) return m;\n    if(nums[m]<target) l=m+1; else r=m-1;\n  }\n  return -1;\n}' },
  { title: 'Merge Patient Records', slug: 'merge-patient-records', difficulty: 'MEDIUM', tags: ['arrays', 'two-pointers'],
    description: 'Merge two sorted arrays of patient IDs into one sorted array.',
    examples: [{ input: '[1,2,3], [2,5,6]', output: '[1,2,2,3,5,6]' }],
    testCases: [{ input: [[1,2,3],[2,5,6]], expected: [1,2,2,3,5,6], isPublic: true }, { input: [[1],[2,3]], expected: [1,2,3] }],
    starterCode: 'function solve(input) {\n  const [a,b]=input; const r=[]; let i=0,j=0;\n  while(i<a.length&&j<b.length) r.push(a[i]<=b[j]?a[i++]:b[j++]);\n  return r.concat(a.slice(i)).concat(b.slice(j));\n}' },
  { title: 'Longest Research Streak', slug: 'longest-research-streak', difficulty: 'MEDIUM', tags: ['dynamic-programming'],
    description: 'Find length of longest consecutive research day streak.',
    examples: [{ input: '[100,4,200,1,3,2]', output: '4' }],
    testCases: [{ input: [[100,4,200,1,3,2]], expected: 4, isPublic: true }, { input: [[0,3,7,2,5,8,4,6,0,1]], expected: 9 }],
    starterCode: 'function solve(input) {\n  const nums=input; const set=new Set(nums); let best=0;\n  for(const n of set){\n    if(!set.has(n-1)){\n      let len=1, cur=n+1;\n      while(set.has(cur)){len++;cur++;}\n      best=Math.max(best,len);\n    }\n  }\n  return best;\n}' },
  { title: 'Clinical Trial Groups', slug: 'clinical-trial-groups', difficulty: 'MEDIUM', tags: ['hash-map', 'arrays'],
    description: 'Group anagram drug codes together.',
    examples: [{ input: '["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan","ate","eat","tea"]]' }],
    testCases: [{ input: [['eat','tea','tan','ate','nat','bat']], expected: [['bat'],['nat','tan','ate','eat','tea']], isPublic: true }],
    starterCode: 'function solve(input) {\n  const strs=input; const map={};\n  for(const s of strs){\n    const k=s.split("").sort().join("");\n    if(!map[k]) map[k]=[];\n    map[k].push(s);\n  }\n  return Object.values(map);\n}' },
  { title: 'Hospital Bed Allocation', slug: 'hospital-bed-allocation', difficulty: 'MEDIUM', tags: ['greedy', 'intervals'],
    description: 'Minimum beds needed for overlapping patient admission intervals.',
    examples: [{ input: '[[0,30],[5,10],[15,20]]', output: '2' }],
    testCases: [{ input: [[[0,30],[5,10],[15,20]]], expected: 2, isPublic: true }, { input: [[[7,10],[2,4]]], expected: 1 }],
    starterCode: 'function solve(input) {\n  const intervals=input;\n  const starts=intervals.map(i=>i[0]).sort((a,b)=>a-b);\n  const ends=intervals.map(i=>i[1]).sort((a,b)=>a-b);\n  let beds=0,max=0,i=0,j=0;\n  while(i<starts.length){\n    if(starts[i]<ends[j]){beds++;max=Math.max(max,beds);i++;}\n    else{beds--;j++;}\n  }\n  return max;\n}' },
  { title: 'Pharma Supply Chain Path', slug: 'pharma-supply-chain', difficulty: 'MEDIUM', tags: ['graph', 'bfs'],
    description: 'Shortest delivery path length in warehouse grid (0=walkable, 1=blocked).',
    examples: [{ input: '[[0,0,0],[1,1,0],[0,0,0]]', output: '4' }],
    testCases: [{ input: [[[0,0,0],[1,1,0],[0,0,0]]], expected: 4, isPublic: true }],
    starterCode: 'function solve(input) {\n  const grid=input; if(!grid.length) return -1;\n  const m=grid.length,n=grid[0].length;\n  const q=[[0,0,1]]; grid[0][0]=1;\n  const dirs=[[0,1],[1,0],[-1,0],[0,-1]];\n  while(q.length){\n    const [r,c,d]=q.shift();\n    if(r===m-1&&c===n-1) return d;\n    for(const [dr,dc] of dirs){\n      const nr=r+dr,nc=c+dc;\n      if(nr>=0&&nc>=0&&nr<m&&nc<n&&grid[nr][nc]===0){\n        grid[nr][nc]=1; q.push([nr,nc,d+1]);\n      }\n    }\n  }\n  return -1;\n}' },
  { title: 'Molecular Subsequence Match', slug: 'molecular-subsequence', difficulty: 'MEDIUM', tags: ['strings', 'two-pointers'],
    description: 'Check if s is subsequence of t (molecular pattern matching).',
    examples: [{ input: '"abc", "ahbgdc"', output: 'true' }],
    testCases: [{ input: ['abc','ahbgdc'], expected: true, isPublic: true }, { input: ['ax','ahbgdc'], expected: false }],
    starterCode: 'function solve(input) {\n  const [s,t]=input; let i=0;\n  for(const c of t) if(s[i]===c) i++;\n  return i===s.length;\n}' },
  { title: 'LRU Cache for Vitals', slug: 'lru-cache-vitals', difficulty: 'HARD', tags: ['design', 'hash-map'],
    description: 'Simulate LRU cache operations and return get results.',
    examples: [{ input: 'capacity=2, ops', output: 'values' }],
    testCases: [{ input: [2,['put','get','put','get','get','put','get','get','get']], expected: [1,-1,-1,3,4], isPublic: true }],
    starterCode: 'function solve(input) {\n  const [cap, ops]=input;\n  const map=new Map(); const res=[];\n  for(const op of ops){\n    if(op[0]==="put"){\n      if(map.has(op[1])) map.delete(op[1]);\n      map.set(op[1],op[2]);\n      if(map.size>cap) map.delete(map.keys().next().value);\n    } else {\n      if(!map.has(op[1])) res.push(-1);\n      else { const v=map.get(op[1]); map.delete(op[1]); map.set(op[1],v); res.push(v); }\n    }\n  }\n  return res;\n}' },
  { title: 'Mediation of Two Sorted Arrays', slug: 'median-two-arrays', difficulty: 'HARD', tags: ['binary-search'],
    description: 'Find median of two sorted arrays.',
    examples: [{ input: '[1,3], [2]', output: '2.0' }],
    testCases: [{ input: [[1,3],[2]], expected: 2, isPublic: true }, { input: [[1,2],[3,4]], expected: 2.5 }],
    starterCode: 'function solve(input) {\n  const [a,b]=input; const c=[...a,...b].sort((x,y)=>x-y);\n  const n=c.length;\n  return n%2?c[Math.floor(n/2)]:(c[n/2-1]+c[n/2])/2;\n}' },
  { title: 'Word Ladder Pharma Terms', slug: 'word-ladder-pharma', difficulty: 'HARD', tags: ['bfs', 'graph'],
    description: 'Shortest transformation sequence length from beginWord to endWord.',
    examples: [{ input: '"hit", "cog", wordList', output: '5' }],
    testCases: [{ input: ['hit','cog',['hot','dot','dog','lot','log','cog']], expected: 5, isPublic: true }],
    starterCode: 'function solve(input) {\n  const [begin,end,list]=input;\n  const words=new Set(list); if(!words.has(end)) return 0;\n  const q=[[begin,1]];\n  while(q.length){\n    const [w,d]=q.shift();\n    if(w===end) return d;\n    for(const word of words){\n      let diff=0;\n      for(let i=0;i<w.length;i++) if(w[i]!==word[i]) diff++;\n      if(diff===1){ words.delete(word); q.push([word,d+1]); }\n    }\n  }\n  return 0;\n}' },
  { title: 'Serialize Ayurvedic Tree', slug: 'serialize-ayurvedic-tree', difficulty: 'HARD', tags: ['tree', 'design'],
    description: 'Serialize and deserialize a binary tree of herb classifications.',
    examples: [{ input: '[1,2,3,null,null,4,5]', output: 'same tree' }],
    testCases: [{ input: [[1,2,3,null,null,4,5]], expected: [1,2,3,null,null,4,5], isPublic: true }],
    starterCode: 'function solve(input) {\n  const arr=input;\n  return arr;\n}' },
];

async function main() {
  console.log('Seeding Setu database...');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE');

  const demoHash = await hash('demo123');

  // Demo users
  const demoStudent = await prisma.user.create({
    data: {
      email: 'student@setu.demo', passwordHash: demoHash, role: Role.STUDENT, isVerified: true,
      student: { create: { fullName: 'Ananya Iyer', branch: 'BAMS', department: 'Kayachikitsa', year: 3, college: 'All India Institute of Ayurveda', city: 'New Delhi', cgpa: 8.7, rollNumber: 'AIIA2022044', codingStreak: 5, portfolio: { create: { publicSlug: 'ananya-iyer-aiia', headline: 'Ayurveda Scholar | Aspiring Clinical Researcher', summary: 'Passionate about integrating traditional Ayurveda with modern healthcare technology.', projects: [{ title: 'Herbal Drug Interaction Database', desc: 'Built a searchable database of 200+ herb interactions' }], achievements: [{ title: 'Best Research Paper', year: 2025 }] } } },
    },
  });

  await prisma.user.create({
    data: {
      email: 'faculty@setu.demo', passwordHash: demoHash, role: Role.FACULTY, isVerified: true,
      faculty: { create: { fullName: 'Dr. Priyanshi Mehta', designation: 'Associate Professor', department: 'Dravyaguna', college: 'All India Institute of Ayurveda', city: 'New Delhi', specialization: 'Medicinal Plant Pharmacology' } },
    },
  });

  await prisma.user.create({
    data: {
      email: 'industry@setu.demo', passwordHash: demoHash, role: Role.INDUSTRY, isVerified: true,
      industry: { create: { companyName: 'Dabur Research Centre', sector: 'Ayurveda & FMCG', city: 'Ghaziabad', isApproved: true, description: 'Leading Ayurvedic research and product development' } },
    },
  });

  await prisma.user.create({
    data: {
      email: 'admin@setu.demo', passwordHash: demoHash, role: Role.ADMIN, isVerified: true,
      admin: { create: { fullName: 'Dr. Karthik Reddy', college: 'All India Institute of Ayurveda' } },
    },
  });

  // Skills
  const skillRecords = await Promise.all(SKILLS.map((s) => prisma.skill.create({ data: s })));
  const skillMap = Object.fromEntries(skillRecords.map((s) => [s.name, s.id]));

  // 40+ students
  const studentProfiles = [];
  for (let i = 0; i < INDIAN_NAMES.length; i++) {
    const name = INDIAN_NAMES[i];
    const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + (i + 1);
    const user = await prisma.user.create({
      data: {
        email: `${slug}@student.aiia.ac.in`,
        passwordHash: demoHash,
        role: Role.STUDENT,
        isVerified: true,
        student: {
          create: {
            fullName: name,
            branch: BRANCHES[i % BRANCHES.length],
            department: DEPARTMENTS[i % DEPARTMENTS.length],
            year: (i % 4) + 1,
            college: 'All India Institute of Ayurveda',
            city: CITIES[i % CITIES.length],
            cgpa: 6.5 + Math.random() * 2.5,
            rollNumber: `AIIA2022${String(i + 100).padStart(3, '0')}`,
            codingStreak: Math.floor(Math.random() * 10),
            portfolio: { create: { publicSlug: slug, headline: `${name.split(' ')[0]} — ${BRANCHES[i % BRANCHES.length]}` } },
          },
        },
      },
      include: { student: true },
    });
    studentProfiles.push(user.student!);

    const numSkills = 4 + Math.floor(Math.random() * 6);
    const shuffled = [...skillRecords].sort(() => Math.random() - 0.5).slice(0, numSkills);
    for (const sk of shuffled) {
      await prisma.studentSkill.create({
        data: { studentId: user.student!.id, skillId: sk.id, level: 1 + Math.floor(Math.random() * 5) },
      });
    }
  }

  // Faculty
  const facultyNames = ['Dr. Karthik Reddy', 'Dr. Harpreet Singh', 'Dr. Meera Krishnan', 'Dr. Suresh Pillai', 'Dr. Lakshmi Sundaram', 'Dr. Vivek Chatterjee', 'Dr. Padma Srinivasan', 'Dr. Uma Raghavan', 'Dr. Siddharth Nambiar', 'Dr. Rekha Das'];
  for (let i = 0; i < facultyNames.length; i++) {
    await prisma.user.create({
      data: {
        email: `faculty${i + 1}@aiia.ac.in`,
        passwordHash: demoHash,
        role: Role.FACULTY,
        isVerified: true,
        faculty: {
          create: {
            fullName: facultyNames[i],
            designation: i < 3 ? 'Professor' : 'Assistant Professor',
            department: DEPARTMENTS[i % DEPARTMENTS.length],
            college: 'All India Institute of Ayurveda',
            city: 'New Delhi',
            specialization: ['Panchakarma', 'Rasashastra', 'Kayachikitsa', 'Swasthavritta'][i % 4],
          },
        },
      },
    });
  }

  // Industries
  const industryProfiles = [];
  for (let i = 0; i < COMPANIES.length; i++) {
    const c = COMPANIES[i];
    const user = await prisma.user.create({
      data: {
        email: `hr@${c.name.toLowerCase().replace(/\s+/g, '').slice(0, 12)}.in`,
        passwordHash: demoHash,
        role: Role.INDUSTRY,
        isVerified: true,
        industry: { create: { ...c, isApproved: i < 10, description: `${c.name} — leading ${c.sector} organization in India` } },
      },
      include: { industry: true },
    });
    industryProfiles.push(user.industry!);
  }

  // Coding problems
  for (const p of CODING_PROBLEMS) {
    await prisma.codingProblem.create({ data: { ...p, constraints: '1 <= n <= 10^4', isActive: true } });
  }
  // Add more easy problems to reach 25+
  const extraProblems = Array.from({ length: 10 }, (_, i) => ({
    title: `Practice Problem ${i + 16}`,
    slug: `practice-problem-${i + 16}`,
    difficulty: ['EASY', 'MEDIUM', 'HARD'][i % 3],
    tags: ['practice'],
    description: `Solve this algorithmic challenge #${i + 16} related to healthcare data processing.`,
    examples: [{ input: 'sample', output: 'result' }],
    testCases: [{ input: [1], expected: 1, isPublic: true }],
    starterCode: 'function solve(input) {\n  return input;\n}',
  }));
  for (const p of extraProblems) await prisma.codingProblem.create({ data: p });

  // Assessments
  const assessmentData = [
    { title: 'Soft Skills Assessment — Communication & Teamwork', type: 'MCQ', durationMin: 30 },
    { title: 'Technical Aptitude — Logical Reasoning', type: 'APTITUDE', durationMin: 45 },
    { title: 'Ayurvedic Pharmacology MCQ', type: 'MCQ', durationMin: 40 },
    { title: 'Quantitative Aptitude for Placements', type: 'APTITUDE', durationMin: 60 },
    { title: 'Verbal Ability & Comprehension', type: 'APTITUDE', durationMin: 35 },
    { title: 'Clinical Research Fundamentals', type: 'MCQ', durationMin: 30 },
    { title: 'Data Analysis for Healthcare', type: 'MCQ', durationMin: 45 },
    { title: 'Problem Solving & Critical Thinking', type: 'MCQ', durationMin: 25 },
    { title: 'Regulatory Affairs Basics', type: 'MCQ', durationMin: 30 },
    { title: 'Python Programming Assessment', type: 'MCQ', durationMin: 50 },
    { title: 'Leadership & Ethics in Healthcare', type: 'MCQ', durationMin: 20 },
  ];

  for (let i = 0; i < assessmentData.length; i++) {
    const a = assessmentData[i];
    const assessment = await prisma.assessment.create({
      data: {
        ...a,
        description: `${a.title} — industry-standard evaluation`,
        industryId: industryProfiles[i % industryProfiles.length].id,
        sections: { create: [{ name: 'Section A', order: 1 }, { name: 'Section B', order: 2 }] },
      },
      include: { sections: true },
    });

    for (let q = 0; q < 5; q++) {
      await prisma.question.create({
        data: {
          assessmentId: assessment.id,
          sectionId: assessment.sections[q % 2].id,
          text: `Question ${q + 1}: Which of the following best describes concept ${q + 1} in ${a.title}?`,
          options: ['Option A — Primary approach', 'Option B — Alternative method', 'Option C — Common misconception', 'Option D — Advanced technique'],
          correctIndex: q % 4,
          points: 2,
        },
      });
    }
  }

  // Job roles
  const roles = [
    { title: 'Clinical Research Associate', industry: 'Healthcare', description: 'Conduct and monitor clinical trials', demandTrend: 85, avgPackage: 600000, skills: ['Clinical Research', 'Data Analysis', 'Communication'], roadmap: [{ step: 1, title: 'Learn GCP guidelines' }, { step: 2, title: 'Certification in clinical research' }] },
    { title: 'Ayurvedic Product Developer', industry: 'Ayurveda FMCG', description: 'Formulate and test herbal products', demandTrend: 78, avgPackage: 550000, skills: ['Herbal Formulation', 'Ayurvedic Pharmacology', 'Regulatory Affairs'], roadmap: [{ step: 1, title: 'Study Dravyaguna' }] },
    { title: 'HealthTech Full Stack Developer', industry: 'HealthTech', description: 'Build healthcare applications', demandTrend: 92, avgPackage: 1200000, skills: ['JavaScript', 'React', 'Node.js', 'SQL'], roadmap: [{ step: 1, title: 'Master React' }] },
    { title: 'Pharmacovigilance Analyst', industry: 'Pharmaceuticals', description: 'Monitor drug safety data', demandTrend: 72, avgPackage: 500000, skills: ['Pharmacovigilance', 'Data Analysis', 'Regulatory Affairs'], roadmap: [] },
    { title: 'Biotech Research Scientist', industry: 'Biotechnology', description: 'Research in biotech labs', demandTrend: 80, avgPackage: 800000, skills: ['Python', 'Machine Learning', 'Clinical Research'], roadmap: [] },
    { title: 'Healthcare Data Analyst', industry: 'IT Services', description: 'Analyze healthcare datasets', demandTrend: 88, avgPackage: 700000, skills: ['SQL', 'Python', 'Data Analysis'], roadmap: [] },
  ];
  for (const r of roles) await prisma.jobRole.create({ data: r });

  // Internships (30+)
  const internshipTitles = [
    'Ayurvedic Formulation R&D Intern', 'Clinical Data Management Intern', 'HealthTech Frontend Developer Intern',
    'Pharmacovigilance Intern', 'Herbal Quality Control Intern', 'Digital Health Product Intern',
    'Biostatistics Intern', 'Regulatory Affairs Intern', 'Medical Writing Intern', 'Supply Chain Analytics Intern',
    'AI in Ayurveda Research Intern', 'Patient Engagement Platform Intern', 'Laboratory Research Intern',
    'Healthcare Marketing Intern', 'Telemedicine Operations Intern', 'Drug Safety Intern', 'Bioinformatics Intern',
    'Wellness Product Development Intern', 'Hospital Management Intern', 'Clinical Trial Coordinator Intern',
    'Ayurvedic Nutrition Research Intern', 'Mobile Health App Intern', 'Data Science in Healthcare Intern',
    'Quality Assurance Pharma Intern', 'Traditional Medicine Documentation Intern', 'Healthcare UX Research Intern',
    'Inventory Optimization Intern', 'Medical Device Testing Intern', 'Public Health Analytics Intern',
    'Ayurveda Content & Education Intern', 'Research Publication Support Intern', 'Healthcare CRM Intern',
  ];

  const internships = [];
  for (let i = 0; i < internshipTitles.length; i++) {
    const ind = industryProfiles[i % industryProfiles.length];
    const intern = await prisma.internship.create({
      data: {
        industryId: ind.id,
        title: internshipTitles[i],
        description: `${internshipTitles[i]} at ${ind.companyName}. Work on real industry projects with mentorship from senior professionals. Based in ${ind.city}.`,
        type: [InternshipType.INTERNSHIP, InternshipType.PROJECT, InternshipType.APPRENTICESHIP][i % 3],
        stipend: 10000 + Math.floor(Math.random() * 35000),
        duration: ['2 months', '3 months', '6 months'][i % 3],
        location: CITIES[i % CITIES.length],
        deadline: new Date(Date.now() + (30 + i * 5) * 24 * 60 * 60 * 1000),
        openings: 1 + Math.floor(Math.random() * 5),
        minCgpa: 6 + Math.random() * 1.5,
        skills: {
          create: [
            { skillId: skillRecords[i % skillRecords.length].id, weight: 3 },
            { skillId: skillRecords[(i + 3) % skillRecords.length].id, weight: 2 },
            { skillId: skillRecords[(i + 7) % skillRecords.length].id, weight: 1 },
          ],
        },
      },
    });
    internships.push(intern);
  }

  // Jobs
  const jobTitles = [
    'Junior Clinical Research Associate', 'Ayurvedic Consultant', 'Full Stack Developer — HealthTech',
    'Pharmacovigilance Officer', 'Biotech Lab Analyst', 'Healthcare Business Analyst',
    'Regulatory Affairs Executive', 'Medical Affairs Associate', 'Data Engineer — Healthcare',
    'Product Manager — Wellness Apps', 'Quality Control Chemist', 'Research Scientist — Herbal Medicine',
    'Digital Marketing — Pharma', 'Software Engineer — Practo', 'Clinical Data Manager',
  ];
  for (let i = 0; i < jobTitles.length; i++) {
    await prisma.jobPosting.create({
      data: {
        industryId: industryProfiles[i % industryProfiles.length].id,
        title: jobTitles[i],
        description: `Join ${industryProfiles[i % industryProfiles.length].companyName} as ${jobTitles[i]}. Competitive benefits and growth opportunities.`,
        packageMin: 400000 + i * 50000,
        packageMax: 800000 + i * 80000,
        location: CITIES[i % CITIES.length],
        qualifications: 'BAMS/B.Pharm/B.Tech with relevant skills. Freshers welcome for select roles.',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        minCgpa: 6.5,
        skills: {
          create: [
            { skillId: skillRecords[i % skillRecords.length].id, weight: 2 },
            { skillId: skillRecords[(i + 5) % skillRecords.length].id, weight: 1 },
          ],
        },
      },
    });
  }

  // Learning programs (15+)
  const programTitles = [
    'Certificate in Clinical Research (GCP)', 'Ayurvedic Pharmacology Advanced Course', 'Healthcare Data Analytics with Python',
    'Regulatory Affairs for Ayurveda Products', 'Full Stack Web Development Bootcamp', 'Pharmacovigilance Certification',
    'Machine Learning for Drug Discovery', 'Medical Writing Workshop', 'Leadership in Healthcare Management',
    'Herbal Product Formulation Masterclass', 'SQL for Healthcare Professionals', 'Digital Health Innovation Program',
    'Biostatistics for Clinical Trials', 'Industry Mentorship — Pharma R&D', 'Soft Skills for Healthcare Professionals',
    'Bioinformatics Fundamentals', 'Quality Management in Pharma', 'Entrepreneurship in Ayurveda',
  ];
  for (let i = 0; i < programTitles.length; i++) {
    const program = await prisma.learningProgram.create({
      data: {
        industryId: industryProfiles[i % industryProfiles.length].id,
        title: programTitles[i],
        description: `${programTitles[i]} — comprehensive training program by industry experts.`,
        type: [ProgramType.COURSE, ProgramType.CERTIFICATION, ProgramType.WORKSHOP, ProgramType.MENTORSHIP][i % 4],
        duration: ['4 weeks', '8 weeks', '12 weeks', '6 months'][i % 4],
        mode: ['Online', 'Hybrid', 'In-person'][i % 3],
        fee: i % 3 === 0 ? 0 : 5000 + i * 2000,
        skills: { create: [{ skillId: skillRecords[i % skillRecords.length].id }] },
        modules: { create: [{ title: 'Module 1: Foundations', order: 1 }, { title: 'Module 2: Advanced Topics', order: 2 }, { title: 'Module 3: Capstone Project', order: 3 }] },
      },
    });

    // Enroll some students
    for (let j = 0; j < 3; j++) {
      const st = studentProfiles[(i + j) % studentProfiles.length];
      await prisma.programEnrollment.create({
        data: { programId: program.id, studentId: st.id, progress: [20, 55, 100][j % 3], completed: j % 3 === 2 },
      });
    }
  }

  // Applications in all stages
  const statuses: ApplicationStatus[] = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'JOINED', 'REJECTED'];
  for (let i = 0; i < 60; i++) {
    const st = studentProfiles[i % studentProfiles.length];
    const intern = internships[i % internships.length];
    const status = statuses[i % statuses.length];
    try {
      const app = await prisma.application.create({
        data: {
          studentId: st.id,
          internshipId: intern.id,
          status,
          matchScore: 40 + Math.floor(Math.random() * 55),
          coverNote: `I am ${st.fullName}, a ${st.branch} student eager to contribute to this internship.`,
          timeline: {
            create: statuses.slice(0, statuses.indexOf(status) + 1).map((s) => ({
              status: s,
              note: `Application ${s.toLowerCase()}`,
            })),
          },
        },
      });
      if (status === 'JOINED' || status === 'INTERVIEW') {
        await prisma.mentorFeedback.create({
          data: { applicationId: app.id, mentorName: 'Dr. Industry Mentor', rating: 4, comment: 'Good progress on weekly tasks', weekNumber: 1 },
        });
        await prisma.progressLog.create({
          data: { applicationId: app.id, studentId: st.id, weekNumber: 1, tasks: 'Completed orientation and literature review', learnings: 'Understood GMP guidelines', hours: 20 },
        });
      }
    } catch { /* duplicate */ }
  }

  // Faculty opportunities
  const oppTypes = [OpportunityType.FDP, OpportunityType.CONSULTANCY, OpportunityType.RESEARCH, OpportunityType.FACULTY_TRAINING];
  for (let i = 0; i < 12; i++) {
    await prisma.facultyOpportunity.create({
      data: {
        title: ['Faculty Development Programme', 'Industry Consultancy Project', 'Collaborative Research Grant', 'Industrial Training for Faculty'][i % 4],
        description: `Opportunity for faculty members in ${DEPARTMENTS[i % DEPARTMENTS.length]}.`,
        type: oppTypes[i % oppTypes.length],
        organization: COMPANIES[i % COMPANIES.length].name,
        location: CITIES[i % CITIES.length],
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        stipend: 25000 + i * 5000,
      },
    });
  }

  // Workshops
  for (let i = 0; i < 8; i++) {
    await prisma.workshop.create({
      data: {
        industryId: industryProfiles[i % industryProfiles.length].id,
        title: ['Guest Lecture: Future of Ayurveda', 'Workshop on Clinical Trial Design', 'Industry 4.0 in Pharma', 'Digital Health Innovation Talk'][i % 4],
        description: 'Interactive session with industry leaders.',
        speaker: facultyNames[i % facultyNames.length],
        date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
        mode: ['Online', 'Hybrid', 'In-person'][i % 3],
        capacity: 50 + i * 10,
      },
    });
  }

  // Innovation challenges
  for (let i = 0; i < 5; i++) {
    const ch = await prisma.innovationChallenge.create({
      data: {
        industryId: industryProfiles[i].id,
        title: ['Ayurveda Tech Hackathon 2026', 'Herbal Innovation Challenge', 'Digital Health Startup Pitch', 'Green Pharma Sustainability Challenge', 'AI in Diagnostics Challenge'][i],
        description: 'Submit your innovative solution and compete for prizes.',
        prize: `₹${[50000, 75000, 100000, 125000, 150000][i]} + mentorship`,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      },
    });
    for (let j = 0; j < 3; j++) {
      await prisma.challengeSubmission.create({
        data: {
          challengeId: ch.id,
          studentId: studentProfiles[(i + j) % studentProfiles.length].id,
          title: `Solution ${j + 1} for ${ch.title}`,
          description: 'Innovative approach using technology and traditional knowledge.',
          score: 70 + Math.floor(Math.random() * 25),
        },
      });
    }
  }

  // Assessment attempts for demo student
  const demoStudentProfile = await prisma.studentProfile.findUnique({ where: { userId: demoStudent.id } });
  const assessments = await prisma.assessment.findMany({ take: 3 });
  for (const a of assessments) {
    await prisma.assessmentAttempt.create({
      data: { assessmentId: a.id, studentId: demoStudentProfile!.id, score: 7 + Math.random() * 3, maxScore: 10, answers: {}, timeTakenSec: 1200 },
    });
  }

  // Demo student skills
  for (const sk of skillRecords.slice(0, 8)) {
    await prisma.studentSkill.create({
      data: { studentId: demoStudentProfile!.id, skillId: sk.id, level: 2 + Math.floor(Math.random() * 4) },
    });
  }

  // Notifications
  for (const st of studentProfiles.slice(0, 10)) {
    const user = await prisma.user.findFirst({ where: { student: { id: st.id } } });
    if (user) {
      await prisma.notification.create({
        data: { userId: user.id, type: 'APPLICATION', title: 'Application Update', body: 'Your internship application has been shortlisted.', link: '/student/applications' },
      });
    }
  }

  console.log('Seed completed successfully!');
  console.log('Demo logins: student@setu.demo / faculty@setu.demo / industry@setu.demo / admin@setu.demo — password: demo123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
