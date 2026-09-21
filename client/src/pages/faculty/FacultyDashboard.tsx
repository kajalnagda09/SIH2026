import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart } from '@/components/charts/BarChart';
import { useAuth } from '@/context/AuthContext';
import { type FacultyProfile } from '@/lib/mockData';
import {
  GraduationCap, Users, BookOpen, Briefcase, CheckCircle2, XCircle,
  Sparkles, Handshake, Calendar, ArrowRight, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

const PENDING_STUDENTS = [
  {
    id: 'prop_01',
    student: 'Ananya Iyer',
    branch: 'BAMS 3rd Year',
    topic: 'Standardizing Polyherbal Formulation for Glycemic Control via HPTLC',
    status: 'PENDING_REVIEW',
    score: '92% in Pharmacognosy',
  },
  {
    id: 'prop_02',
    student: 'Karthik Reddy',
    branch: 'BAMS 4th Year',
    topic: 'Pharmacovigilance Study on Ashwagandha-Metformin Drug Interactions',
    status: 'PENDING_REVIEW',
    score: '88% in GCP Ethics',
  },
  {
    id: 'prop_03',
    student: 'Sneha Nair',
    branch: 'MD Ayurveda (Kayachikitsa)',
    topic: 'Clinical Efficacy of Virechana Karma in Metabolic Syndrome',
    status: 'PENDING_REVIEW',
    score: '95% in Clinical Protocols',
  },
];

const MENTEE_SKILL_DATA = [
  { name: 'Pharmacognosy', value: 92 },
  { name: 'HPTLC Standards', value: 86 },
  { name: 'GCP Trials', value: 89 },
  { name: 'Biostatistics', value: 74 },
  { name: 'Formulation', value: 88 },
];

export function FacultyDashboard() {
  const { user } = useAuth();
  const profile = (user?.profile || {}) as Partial<FacultyProfile>;
  const [requests, setRequests] = useState(PENDING_STUDENTS);

  const handleApprove = (id: string, name: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success(`Endorsed research proposal for ${name}. Logged into AIIA Institutional Ethics Committee portal.`);
  };

  const handleReject = (id: string, name: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.info(`Sent revision feedback to ${name}.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider mb-1">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Faculty Directorate • Department of Dravyaguna Vigyan</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Welcome, {profile.fullName || 'Dr. Priyanshi Mehta'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {profile.designation || 'Associate Professor & Research Chair'} • {profile.college || 'All India Institute of Ayurveda'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => toast.info('Exporting NAAC Criterion 3 Research Report.')}>
            NAAC Faculty Report
          </Button>
          <Button onClick={() => toast.success('New opportunity drafted.')}>
            + Post Research Opening
          </Button>
        </div>
      </div>

      {/* 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">18 Scholars</div>
            <p className="text-xs text-muted-foreground font-medium">Assigned Mentees</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">6 Funded</div>
            <p className="text-xs text-muted-foreground font-medium">Industry Projects</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{requests.length} Pending</div>
            <p className="text-xs text-muted-foreground font-medium">Proposal Reviews</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <Handshake className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">3 Active</div>
            <p className="text-xs text-muted-foreground font-medium">Corporate MoUs</p>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Pending Student Proposals */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <CardTitle className="text-lg">Student Research Proposals for Endorsement</CardTitle>
                <CardDescription>Review and issue faculty accreditation credit for clinical trials</CardDescription>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted">
                {requests.length} Submissions
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                All student proposals have been reviewed and forwarded.
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="p-4 rounded-[var(--radius-md)] border border-border bg-card space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{req.student}</h4>
                        <p className="text-xs text-muted-foreground">{req.branch} • <strong className="text-primary">{req.score}</strong></p>
                      </div>
                      <Badge status="APPLIED" />
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong>Topic:</strong> {req.topic}
                    </p>

                    <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleReject(req.id, req.student)}
                      >
                        Request Revision
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleApprove(req.id, req.student)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Endorse &amp; Forward
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Active Industry Joint Grants */}
          <Card className="p-6 space-y-3">
            <CardTitle className="text-lg">Active Sponsored Industry Grants</CardTitle>
            <div className="divide-y divide-border text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-foreground">Phytochemical Marker Fingerprinting of Classical Rasayana</h5>
                  <p className="text-muted-foreground">Sponsored by Dabur Research Centre • Grant: ₹24.5 Lakhs</p>
                </div>
                <span className="font-mono text-primary font-bold">In Progress</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-foreground">Evaluation of Standardization Protocols for Withania somnifera</h5>
                  <p className="text-muted-foreground">Sponsored by Himalaya Wellness • Grant: ₹18.0 Lakhs</p>
                </div>
                <span className="font-mono text-primary font-bold">In Progress</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): Mentee Skill Aggregation Chart */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <CardTitle className="text-lg">Mentee Competency Distribution</CardTitle>
            <CardDescription>Average diagnostic assessment benchmark across 18 scholars</CardDescription>
            <div className="mt-4">
              <BarChart data={MENTEE_SKILL_DATA} />
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="p-6 space-y-3">
            <CardTitle className="text-base">Faculty Quick Actions</CardTitle>
            <div className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full justify-start text-xs min-h-[44px]">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                Schedule Mentorship Group Clinic
              </Button>
              <Button variant="secondary" size="sm" className="w-full justify-start text-xs min-h-[44px]">
                <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                Issue Verified Institutional Skill Endorsement
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
