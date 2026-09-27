import { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { realtimeDb, type ResearchProposal } from '@/lib/realtimeDb';
import {
  Handshake, User, Send, CheckCircle2, Clock, AlertTriangle,
  FileText, ShieldCheck, Sparkles, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export function StudentCollaboration() {
  const { user } = useAuth();
  const profile = user?.profile || {};
  const studentId = user?.id || 'usr_student_01';
  const studentName = profile.fullName || user?.email?.split('@')[0] || 'Scholar Student';
  const studentRoll = profile.rollNumber || 'AIIA2026108';
  const studentBranch = profile.branch || 'BAMS 3rd Year';

  const [topic, setTopic] = useState('');
  const [methodology, setMethodology] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [proposals, setProposals] = useState<ResearchProposal[]>(() =>
    realtimeDb.getProposalsForStudent(studentName)
  );

  useEffect(() => {
    setProposals(realtimeDb.getProposalsForStudent(studentName));
    const unsubscribe = realtimeDb.subscribe(() => {
      setProposals(realtimeDb.getProposalsForStudent(studentName));
    });
    return () => unsubscribe();
  }, [studentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !methodology) {
      toast.error('Please provide both the research topic and methodology abstract.');
      return;
    }

    setSubmitting(true);
    try {
      const created = realtimeDb.submitProposal({
        studentId,
        studentName,
        studentRoll,
        studentBranch,
        facultyName: 'Dr. Priyanshi Mehta',
        topic,
        methodology,
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      toast.success(
        `Proposal #${created.id} submitted! Dr. Priyanshi Mehta has received it in real time.`
      );
      setTopic('');
      setMethodology('');
    } catch {
      toast.error('Failed to submit proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
          <Handshake className="h-3.5 w-3.5" />
          <span>Realtime Cross-Disciplinary R&amp;D Mentorship</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Faculty Collaboration &amp; Research Labs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Submit clinical research proposals directly to accredited faculty guides. Review decisions and ethics clearance are updated live across dashboards.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Proposal Submission Form (7 cols) */}
        <Card className="lg:col-span-7 p-6 sm:p-8 space-y-6 shadow-md border-border">
          <div>
            <CardTitle className="text-xl">Propose a Research Initiative or Thesis Mentorship</CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Submissions are immediately dispatched to your designated faculty chair and queued for Institutional Ethics Committee review.
            </CardDescription>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1 font-semibold">
                Assigned Faculty Guide
              </label>
              <Input
                value="Dr. Priyanshi Mehta (Associate Professor, Chair of Dravyaguna Vigyan)"
                disabled
                className="bg-muted font-medium text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1 font-semibold">
                Research Domain / Proposed Title
              </label>
              <Input
                placeholder="e.g. Standardizing Polyherbal Formulation for Glycemic Control via HPTLC"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1 font-semibold">
                Abstract &amp; Proposed Analytical Assays
              </label>
              <textarea
                rows={4}
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="Describe your research question, botanical specimens, and proposed chromatography / clinical assays..."
                className="w-full rounded-[var(--radius-md)] border border-border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                required
              />
            </div>

            <Button type="submit" loading={submitting} className="min-h-[44px] w-full font-semibold">
              <Send className="h-4 w-4 mr-1.5" /> Submit Proposal for Realtime Faculty Review
            </Button>
          </form>
        </Card>

        {/* Assigned Faculty Guide Profile Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4 border-blue-500/30 bg-blue-500/5">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                PM
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold">
                  Assigned Guide
                </span>
                <h4 className="font-bold text-base text-foreground mt-0.5">Dr. Priyanshi Mehta</h4>
                <p className="text-xs text-muted-foreground">Department of Dravyaguna Vigyan, AIIA</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border">
              <p>
                <strong>Specialization:</strong> Medicinal Plant Chemical Fingerprinting, HPTLC Standards, Pharmacopoeia.
              </p>
              <p>
                <strong>Institutional Office:</strong> Room 304, Charaka Block, All India Institute of Ayurveda.
              </p>
              <p>
                <strong>Advisory Sync:</strong> Bi-weekly clinical rounds on Thursdays.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Realtime Submitted Proposals Tracking List */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <CardTitle className="text-lg">Your Submitted Research Proposals ({proposals.length})</CardTitle>
            <CardDescription className="text-xs">
              Live updates when Dr. Priyanshi Mehta approves or submits review feedback.
            </CardDescription>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Realtime Sync Active
          </span>
        </div>

        {proposals.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground font-mono">
            No research proposals submitted yet. Use the form above to submit your thesis topic to Dr. Priyanshi Mehta.
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((prop) => (
              <div
                key={prop.id}
                className="p-4 rounded-[var(--radius-md)] border border-border bg-card space-y-2 hover:border-primary/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h4 className="font-bold text-sm text-foreground">{prop.topic}</h4>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                      prop.status === 'APPROVED'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : prop.status === 'REVISION_REQUESTED'
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                    }`}
                  >
                    {prop.status === 'APPROVED' ? 'APPROVED & ETHICS CLEARED ✓' : prop.status === 'REVISION_REQUESTED' ? 'REVISIONS REQUESTED' : 'PENDING FACULTY REVIEW'}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {prop.methodology}
                </p>

                {prop.feedback && (
                  <div className="p-3 rounded-[var(--radius-sm)] bg-muted/60 border border-border text-xs text-foreground font-mono">
                    <strong>Faculty Feedback:</strong> {prop.feedback}
                    {prop.ethicsClearanceId && (
                      <span className="block text-emerald-600 font-bold mt-1">
                        Institutional Ethics Clearance No: {prop.ethicsClearanceId}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
                  <span>Reviewed By: {prop.facultyName}</span>
                  <span>Submitted: {new Date(prop.submittedAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
