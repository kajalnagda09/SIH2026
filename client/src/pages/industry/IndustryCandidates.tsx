import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, Users, Award, ShieldCheck, Mail, Sparkles, Filter } from 'lucide-react';
import { toast } from 'sonner';

const TALENT_POOL = [
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
    name: 'Priyanshi Mehta',
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
  const [candidates, setCandidates] = useState(TALENT_POOL);
  const [query, setQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('ALL');

  const skillsList = ['ALL', 'Ayurvedic Pharmacology', 'Clinical GCP', 'HPTLC', 'Herbal Formulation', 'Python'];

  const filtered = candidates.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()));
    const matchesSkill = selectedSkill === 'ALL' || c.skills.some((s) => s.includes(selectedSkill));
    return matchesQuery && matchesSkill;
  });

  const handleContact = (name: string) => {
    toast.success(`Direct interview invitation dispatched to ${name}'s verified institutional email.`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
          <Users className="h-3.5 w-3.5" />
          <span>Institutional Talent Discovery</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Verified Student Scholar Search
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search across certified Ayush undergraduates and postgraduates with validated diagnostic test scores.
        </p>
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
              {sk === 'ALL' ? 'All Competencies' : sk}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((c) => (
          <Card key={c.name} className="p-6 space-y-4 flex flex-col justify-between hover:border-accent/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-bold text-foreground">{c.name}</h3>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-mono font-semibold px-2 py-0.5">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.branch}</p>
                  <p className="text-xs text-muted-foreground font-medium">{c.college}</p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-primary">CGPA {c.cgpa}</span>
                  <div className="text-[10px] font-mono text-muted-foreground">{c.streak}</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] text-muted-foreground font-mono">Assessed Competencies:</div>
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map((sk) => (
                    <span key={sk} className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-foreground border font-mono">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">Pre-assessed dossier ready</span>
              <Button size="sm" onClick={() => handleContact(c.name)} className="min-h-[44px]">
                <Mail className="h-3.5 w-3.5 mr-1" /> Invite to Interview
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
