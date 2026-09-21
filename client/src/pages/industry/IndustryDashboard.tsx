import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FunnelChart } from '@/components/charts/FunnelChart';
import { useAuth } from '@/context/AuthContext';
import { type IndustryProfile } from '@/lib/mockData';
import {
  Building2, Users, Briefcase, Award, CheckCircle2, Video,
  ArrowRight, ShieldCheck, Sparkles, Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

const FUNNEL_DATA = [
  { status: 'Applied', count: 48 },
  { status: 'Shortlisted', count: 24 },
  { status: 'Interview', count: 12 },
  { status: 'Offered', count: 6 },
  { status: 'Joined', count: 4 },
];

const CANDIDATES = [
  {
    id: 'cand_1',
    name: 'Ananya Iyer',
    college: 'All India Institute of Ayurveda',
    program: 'BAMS (Ayurvedacharya)',
    cgpa: 8.7,
    roleApplied: 'Phytochemistry & Formulation Research Intern',
    assessmentScore: '92% in Pharmacognosy',
    status: 'INTERVIEW',
    interviewSlot: '24 Sep 2026, 11:30 AM',
  },
  {
    id: 'cand_2',
    name: 'Rahul Verma',
    college: 'AIIA New Delhi',
    program: 'BAMS 4th Year',
    cgpa: 8.2,
    roleApplied: 'Quality Assurance & Regulatory Intern',
    assessmentScore: '86% in GCP Ethics',
    status: 'SHORTLISTED',
  },
  {
    id: 'cand_3',
    name: 'Divya Sharma',
    college: 'AIIA New Delhi',
    program: 'B.Pharm (Ayurveda)',
    cgpa: 8.9,
    roleApplied: 'Herbal Formulation Associate',
    assessmentScore: '94% in Dravyaguna Standards',
    status: 'APPLIED',
  },
];

export function IndustryDashboard() {
  const { user } = useAuth();
  const profile = (user?.profile || {}) as Partial<IndustryProfile>;
  const [candidates, setCandidates] = useState(CANDIDATES);

  const handleAdvanceToInterview = (id: string, name: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'INTERVIEW', interviewSlot: '26 Sep 2026, 2:00 PM' } : c))
    );
    toast.success(`Advanced ${name} to Technical Interview panel.`);
  };

  const handleIssueOffer = (id: string, name: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'OFFERED' } : c))
    );
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    toast.success(`Formal internship offer letter dispatched to ${name} with ₹25,000/mo stipend.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <Building2 className="h-3.5 w-3.5" />
            <span>Enterprise Partner Portal • Dabur R&amp;D Division</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {profile.companyName || 'Dabur Research & Development Centre'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {profile.sector || 'Ayurveda & FMCG Healthcare'} • Headquartered in {profile.city || 'Ghaziabad, NCR'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => toast.info('Exporting talent pipeline CSV.')}>
            Export Recruitment Log
          </Button>
          <Button onClick={() => toast.success('New internship posted.')}>
            + Post New Internship
          </Button>
        </div>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">7 Roles</div>
            <p className="text-xs text-muted-foreground font-medium">Active Openings</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">48 Profiles</div>
            <p className="text-xs text-muted-foreground font-medium">Total Applicants</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">12 Scheduled</div>
            <p className="text-xs text-muted-foreground font-medium">Panel Interviews</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">4 Joined</div>
            <p className="text-xs text-muted-foreground font-medium">Joined Scholars</p>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Candidate Pipeline */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <CardTitle className="text-lg">Recent Applicant Dossiers</CardTitle>
                <CardDescription>Verified academic and diagnostic assessment credentials</CardDescription>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted">
                {candidates.length} Profiles Pending
              </span>
            </div>

            <div className="space-y-4">
              {candidates.map((cand) => (
                <div key={cand.id} className="p-5 rounded-[var(--radius-md)] border border-border bg-card space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-lg font-bold text-foreground">{cand.name}</h4>
                        <span className="text-xs px-2 py-0.2 rounded bg-muted font-mono font-medium">
                          CGPA: {cand.cgpa}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {cand.program} • {cand.college}
                      </p>
                      <p className="text-xs text-foreground font-medium mt-1">
                        Applied for: <strong className="text-primary">{cand.roleApplied}</strong>
                      </p>
                    </div>

                    <Badge status={cand.status} />
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
                    <Award className="h-4 w-4" />
                    <span>Verified Assessment: {cand.assessmentScore}</span>
                  </div>

                  {cand.interviewSlot && (
                    <div className="p-2.5 rounded-[var(--radius-sm)] bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-800 dark:text-amber-200 flex items-center gap-2">
                      <Video className="h-3.5 w-3.5 shrink-0" />
                      <span>Interview: {cand.interviewSlot}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                    {cand.status === 'APPLIED' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs"
                        onClick={() => handleAdvanceToInterview(cand.id, cand.name)}
                      >
                        Shortlist for Interview
                      </Button>
                    )}
                    {cand.status === 'INTERVIEW' && (
                      <Button
                        size="sm"
                        className="text-xs min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleIssueOffer(cand.id, cand.name)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Issue Formal Offer Letter
                      </Button>
                    )}
                    {cand.status === 'OFFERED' && (
                      <span className="text-xs text-emerald-600 font-semibold">Offer Letter Sent ✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): Funnel Chart */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <CardTitle className="text-lg">Recruitment Funnel Conversion</CardTitle>
            <CardDescription>From initial application to onboarded research intern</CardDescription>
            <div className="mt-2">
              <FunnelChart data={FUNNEL_DATA} />
            </div>
          </Card>

          {/* Institutional MoU summary */}
          <Card className="p-6 space-y-3">
            <CardTitle className="text-base">All India Institute of Ayurveda MoU</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Active Institutional Partnership Agreement #MOU-AYUSH-2024-DABUR in effect through 2029. Covers joint clinical trials, PG dissertation fellowships, and proprietary botanical fingerprinting.
            </p>
            <div className="pt-2">
              <Button variant="secondary" size="sm" className="w-full text-xs" onClick={() => toast.info('MoU terms verified.')}>
                View Active MoU Terms
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
