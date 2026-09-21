import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileCheck, CheckCircle2, User, Award, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function FacultyApplications() {
  const [candidates, setCandidates] = useState([
    {
      id: 'c1',
      name: 'Ananya Iyer',
      roll: 'AIIA2022044',
      program: 'BAMS 3rd Year',
      cgpa: 8.7,
      role: 'Phytochemistry Research Intern (Dabur)',
      assessmentScore: '92% in Pharmacognosy',
      status: 'VERIFIED_BY_FACULTY',
    },
    {
      id: 'c2',
      name: 'Rahul Verma',
      roll: 'AIIA2022089',
      program: 'BAMS 4th Year',
      cgpa: 8.2,
      role: 'Clinical Trial Associate (Apollo)',
      assessmentScore: '85% in GCP Ethics',
      status: 'PENDING_APPROVAL',
    },
    {
      id: 'c3',
      name: 'Sneha Nair',
      roll: 'AIIA2021012',
      program: 'MD Ayurveda 2nd Year',
      cgpa: 9.1,
      role: 'Translational Genomics Intern (Biocon)',
      assessmentScore: '94% in Formulation Standards',
      status: 'PENDING_APPROVAL',
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'VERIFIED_BY_FACULTY' } : c))
    );
    toast.success(`Issued official faculty endorsement for ${name}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider mb-1">
          <FileCheck className="h-3.5 w-3.5" />
          <span>Institutional Verification Roster</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Review Student Applications &amp; MoUs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verify academic eligibility, clinical prerequisites, and sign official faculty recommendation letters.
        </p>
      </div>

      <div className="space-y-4">
        {candidates.map((cand) => (
          <Card key={cand.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h4 className="font-display text-lg font-bold text-foreground">{cand.name}</h4>
                <span className="font-mono text-xs text-muted-foreground">({cand.roll})</span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-foreground font-mono">
                  CGPA: {cand.cgpa}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Applying for: <strong className="text-foreground">{cand.role}</strong>
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-primary font-medium">
                <Award className="h-3.5 w-3.5" />
                <span>{cand.assessmentScore}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {cand.status === 'VERIFIED_BY_FACULTY' ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-4 w-4" /> Endorsed by Faculty
                </span>
              ) : (
                <Button size="sm" onClick={() => handleApprove(cand.id, cand.name)} className="min-h-[44px]">
                  Endorse Application
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
