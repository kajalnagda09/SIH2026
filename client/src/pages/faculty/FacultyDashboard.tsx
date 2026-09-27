import { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart } from '@/components/charts/BarChart';
import { useAuth } from '@/context/AuthContext';
import { type FacultyProfile } from '@/lib/mockData';
import { realtimeDb, type ResearchProposal } from '@/lib/realtimeDb';
import { downloadFacultyNAACReportPDF } from '@/lib/pdfExport';
import {
  GraduationCap, Users, BookOpen, Briefcase, CheckCircle2, XCircle,
  Sparkles, Handshake, Calendar, ArrowRight, ShieldCheck, Download,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

import { DocumentPreviewModal } from '@/components/ui/DocumentPreviewModal';

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
  
  const [proposals, setProposals] = useState<ResearchProposal[]>(() =>
    realtimeDb.getProposals().filter((p) => p.status === 'PENDING')
  );
  const [mentees, setMentees] = useState(() => realtimeDb.getMentees());
  const [showNaacModal, setShowNaacModal] = useState(false);

  useEffect(() => {
    const update = () => {
      setProposals(realtimeDb.getProposals().filter((p) => p.status === 'PENDING'));
      setMentees(realtimeDb.getMentees());
    };
    update();
    const unsubscribe = realtimeDb.subscribe(update);
    return () => unsubscribe();
  }, []);

  const handleApprove = (id: string, name: string) => {
    realtimeDb.reviewProposal(
      id,
      'APPROVED',
      'Endorsed by Dr. Priyanshi Mehta. Cleared for AIIA Institutional Ethics Committee.'
    );
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    toast.success(`Endorsed research proposal for ${name}. Logged into Institutional Ethics Committee portal.`);
  };

  const handleReject = (id: string, name: string) => {
    realtimeDb.reviewProposal(
      id,
      'REVISION_REQUESTED',
      'Please revise analytical chromatography protocols to include positive botanical standards.'
    );
    toast.info(`Sent revision feedback to ${name}.`);
  };

  const handleOpenNaacModal = () => {
    setShowNaacModal(true);
  };

  const handleDownloadNAAC = () => {
    downloadFacultyNAACReportPDF(profile);
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

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button variant="secondary" onClick={handleOpenNaacModal} className="min-h-[44px]">
            <Download className="h-4 w-4 mr-1.5" /> NAAC Criterion 3 Report (PDF)
          </Button>
          <Button onClick={() => toast.success('New PhD/BAMS research opening drafted on national ledger.')} className="min-h-[44px]">
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
            <div className="text-2xl font-bold font-mono text-foreground">{mentees.length} Scholars</div>
            <p className="text-xs text-muted-foreground font-medium">Assigned Mentees</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">6 Funded</div>
            <p className="text-xs text-muted-foreground font-medium">Industry Projects (₹48L)</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{proposals.length} Pending</div>
            <p className="text-xs text-muted-foreground font-medium">Proposal Reviews (Live)</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
            <Handshake className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">3 Active</div>
            <p className="text-xs text-muted-foreground font-medium">Corporate MoUs (Dabur)</p>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Pending Student Proposals */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4 shadow-sm border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Student Research Proposals for Endorsement</CardTitle>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Live Sync
                  </span>
                </div>
                <CardDescription className="text-xs mt-0.5">
                  Review student thesis topics submitted in realtime. Approving grants institutional ethics clearance.
                </CardDescription>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted">
                {proposals.length} Pending
              </span>
            </div>

            {proposals.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground font-mono">
                All student proposals have been reviewed and approved. When a student submits a new proposal, it will appear here in real time.
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((req) => (
                  <div key={req.id} className="p-4 rounded-[var(--radius-md)] border border-border bg-card space-y-3 hover:border-blue-500/40 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{req.studentName}</h4>
                        <p className="text-xs text-muted-foreground">
                          {req.studentBranch} • Roll: <span className="font-mono">{req.studentRoll}</span> •{' '}
                          <strong className="text-primary">{req.score || 'GCP Assessment Passed'}</strong>
                        </p>
                      </div>
                      <Badge status="APPLIED" />
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong>Topic:</strong> {req.topic}
                    </p>

                    <p className="text-[11px] text-muted-foreground italic bg-muted/40 p-2 rounded">
                      <strong>Methodology:</strong> {req.methodology}
                    </p>

                    <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleReject(req.id, req.studentName)}
                      >
                        Request Revision
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs min-h-[40px] bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        onClick={() => handleApprove(req.id, req.studentName)}
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
            <CardDescription>Average diagnostic assessment benchmark across assigned scholars</CardDescription>
            <div className="mt-4">
              <BarChart data={MENTEE_SKILL_DATA} />
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="p-6 space-y-3">
            <CardTitle className="text-base">Faculty Quick Actions &amp; Reports</CardTitle>
            <div className="space-y-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start text-xs min-h-[44px]"
                onClick={handleOpenNaacModal}
              >
                <Download className="h-4 w-4 mr-2 text-blue-600" />
                Download NAAC Research Report (PDF)
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start text-xs min-h-[44px]"
                onClick={() => toast.success('Mentorship clinic link generated & shared with scholars.')}
              >
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                Schedule Mentorship Group Clinic
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start text-xs min-h-[44px]"
                onClick={() => toast.success('Skill endorsement certificate verified on AIIA ledger.')}
              >
                <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                Issue Verified Institutional Skill Endorsement
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Animated Pop Up Document Preview Modal on top of screen */}
      <DocumentPreviewModal
        isOpen={showNaacModal}
        onClose={() => setShowNaacModal(false)}
        docType="NAAC_REPORT"
        title="Faculty NAAC Criterion 3 Research Dossier"
        data={profile}
        onDownloadPdf={handleDownloadNAAC}
      />
    </div>
  );
}
