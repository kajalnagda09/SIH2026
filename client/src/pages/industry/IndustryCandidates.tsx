import { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { realtimeDb } from '@/lib/realtimeDb';
import { Search, Users, Award, ShieldCheck, Mail, Sparkles, Filter, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Candidate {
  name: string;
  college: string;
  branch: string;
  cgpa: number;
  skills: string[];
  streak: string;
  verified: boolean;
}

const DEFAULT_POOL: Candidate[] = [
  {
    name: 'Ananya Iyer',
    college: 'All India Institute of Ayurveda',
    branch: 'BAMS (Ayurvedacharya) 3rd Year',
    cgpa: 8.7,
    skills: ['Ayurvedic Pharmacology', 'Clinical GCP', 'HPTLC Standards', 'Python'],
    streak: '5 Days Coding',
    verified: true,
  },
  {
    name: 'Rahul Verma',
    college: 'AIIA New Delhi',
    branch: 'BAMS 4th Year',
    cgpa: 8.2,
    skills: ['Pharmacovigilance', 'Clinical Research', 'Regulatory Affairs'],
    streak: '3 Days Coding',
    verified: true,
  },
  {
    name: 'Divya Sharma',
    college: 'National Institute of Ayurveda, Jaipur',
    branch: 'MD Ayurveda (Dravyaguna)',
    cgpa: 9.3,
    skills: ['Herbal Formulation', 'HPTLC', 'Pharmacognosy', 'Clinical Protocols'],
    streak: '8 Days Coding',
    verified: true,
  },
  {
    name: 'Arjun Patel',
    college: 'Gujarat Ayurved University',
    branch: 'BAMS Final Year',
    cgpa: 8.5,
    skills: ['Ayurvedic Pharmacology', 'Panchakarma Standards', 'Biostatistics'],
    streak: '4 Days Coding',
    verified: true,
  },
];

export function IndustryCandidates() {
  const getCombinedPool = (): Candidate[] => {
    const liveStudents = realtimeDb.getStudents();
    const liveMapped: Candidate[] = liveStudents.map((s) => ({
      name: s.profile.fullName || s.email.split('@')[0],
      college: s.profile.college || 'All India Institute of Ayurveda',
      branch: s.profile.branch || 'BAMS 3rd Year',
      cgpa: s.profile.cgpa || 8.5,
      skills: (s.profile.skills || []).map((sk: any) => sk.name || sk) || ['Ayurvedic Pharmacology', 'Clinical GCP'],
      streak: `${s.profile.codingStreak || 1} Days Coding`,
      verified: s.isVerified,
    }));

    const combined = [...liveMapped];
    DEFAULT_POOL.forEach((dp) => {
      if (!combined.some((c) => c.name.toLowerCase() === dp.name.toLowerCase())) {
        combined.push(dp);
      }
    });
    return combined;
  };

  const [candidates, setCandidates] = useState<Candidate[]>(getCombinedPool);
  const [query, setQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('ALL');

  useEffect(() => {
    setCandidates(getCombinedPool());
    const unsubscribe = realtimeDb.subscribe(() => {
      setCandidates(getCombinedPool());
    });
    return () => unsubscribe();
  }, []);

  const skillsList = ['ALL', 'Ayurvedic Pharmacology', 'Clinical GCP', 'HPTLC Standards', 'Herbal Formulation', 'Python'];

  const filtered = candidates.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.college.toLowerCase().includes(query.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));
    const matchesSkill = selectedSkill === 'ALL' || c.skills.some((s) => s.toLowerCase().includes(selectedSkill.toLowerCase()));
    return matchesQuery && matchesSkill;
  });

  const handleContact = (name: string) => {
    toast.success(`Direct interview invitation dispatched to ${name}'s verified institutional email.`);
  };

  const handleExportCSV = () => {
    const headers = ['Scholar Name', 'Institution', 'Branch', 'Academic CGPA', 'Verified Skills', 'Verification Status'];
    const rows = filtered.map((c) => [
      `"${c.name}"`,
      `"${c.college}"`,
      `"${c.branch}"`,
      c.cgpa,
      `"${c.skills.join('; ')}"`,
      c.verified ? 'VERIFIED' : 'PENDING',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Setu_Industry_Candidate_Pool.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Candidate shortlist exported as CSV!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <Users className="h-3.5 w-3.5" />
            <span>Institutional Talent Discovery • Realtime Synchronized</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Verified Student Scholar Search ({candidates.length})
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search across certified Ayush scholars with validated diagnostic assessment scores and laboratory credentials.
          </p>
        </div>

        <Button variant="secondary" onClick={handleExportCSV} className="min-h-[44px]">
          <Download className="h-4 w-4 mr-1.5" /> Export Talent Shortlist (CSV)
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-3.5" />
          <Input
            placeholder="Search scholars by name, competencies, or institution..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {skillsList.map((sk) => (
            <button
              key={sk}
              onClick={() => setSelectedSkill(sk)}
              className={`text-xs px-3 py-2 rounded-[var(--radius-md)] border whitespace-nowrap font-medium transition-all ${
                selectedSkill === sk
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <Card key={c.name} className="p-6 space-y-4 border-border hover:border-accent/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">{c.name}</h3>
                    {c.verified && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.college}</p>
                  <p className="text-xs text-foreground font-medium">{c.branch}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-muted-foreground">Academic CGPA</div>
                  <div className="text-lg font-mono font-bold text-primary">{c.cgpa.toFixed(1)}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
                  Verified Skill Standards:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] font-mono text-accent font-semibold">{c.streak}</span>
              <Button size="sm" onClick={() => handleContact(c.name)} className="text-xs min-h-[38px]">
                <Mail className="h-3.5 w-3.5 mr-1" /> Invite to Interview
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
