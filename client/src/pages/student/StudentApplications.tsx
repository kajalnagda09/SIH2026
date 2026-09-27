import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_APPLICATIONS, type Application } from '@/lib/mockData';
import { downloadOfferLetterPDF } from '@/lib/pdfExport';
import { DocumentPreviewModal } from '@/components/ui/DocumentPreviewModal';
import {
  FileCheck, Calendar, Clock, CheckCircle2, Circle, AlertCircle,
  Building2, Sparkles, Video, ExternalLink, Download, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export function StudentApplications() {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [selectedAppForPreview, setSelectedAppForPreview] = useState<Application | null>(null);

  const handleAcceptOffer = (id: string, company: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: 'JOINED',
              feedback: 'Offer accepted! Onboarding coordinator has sent orientation schedule.',
            }
          : app
      )
    );
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    toast.success(`🎉 Congratulations! You have accepted the formal internship offer at ${company}!`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
          <FileCheck className="h-3.5 w-3.5" />
          <span>Application Lifecycle Tracker</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          My Applications &amp; Decision Status
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track stage progression, interview panel bookings, assessment evaluations, and formal stipend offers.
        </p>
      </div>

      <div className="space-y-6">
        {applications.map((app) => (
          <Card key={app.id} className="p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-1">
                  <span>Applied on {app.appliedDate}</span>
                  <span>•</span>
                  <span>ID: {app.id}</span>
                </div>
                <CardTitle className="text-2xl">{app.roleTitle}</CardTitle>
                <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-primary">
                  <Building2 className="h-4 w-4" />
                  <span>{app.company}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-end gap-2">
                <Badge status={app.status} className="text-sm px-3 py-1" />
              </div>
            </div>

            {/* Stage Progression Visualizer */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-mono tracking-wider text-muted-foreground font-semibold">
                Selection Pipeline Milestones:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {app.stageTimeline.map((stage, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-[var(--radius-md)] border text-left transition-all ${
                      stage.completed
                        ? 'border-primary/40 bg-primary/5 text-primary'
                        : 'border-border/60 bg-muted/20 text-muted-foreground opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      {stage.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span className="truncate">{stage.stage}</span>
                    </div>
                    <div className="text-[10px] font-mono mt-1 text-muted-foreground">
                      {stage.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduled Interview Banner if any */}
            {app.interviewDate && (
              <div className="p-4 rounded-[var(--radius-md)] bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono">
                    <Video className="h-4 w-4" /> Technical &amp; Scientific Panel Interview
                  </div>
                  <p className="text-sm font-medium">{app.interviewDate}</p>
                </div>
                <Button
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white min-h-[44px]"
                  onClick={() => toast.info('Meeting room opens 10 minutes prior to scheduled session.')}
                >
                  Join Google Meet <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            )}

            {/* Feedback / Evaluation note */}
            {app.feedback && (
              <div className="p-4 rounded-[var(--radius-md)] bg-muted/50 border border-border/80 text-xs leading-relaxed space-y-1">
                <span className="font-semibold text-foreground uppercase font-mono text-[10px]">
                  Institutional Review &amp; Employer Notes:
                </span>
                <p className="text-muted-foreground">{app.feedback}</p>
              </div>
            )}

            {/* Offer Action Buttons if OFFERED */}
            {app.status === 'OFFERED' && (
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-500/5 p-4 rounded-[var(--radius-md)] border-emerald-500/20">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Formal Offer Letter Pending Your Acceptance</h4>
                  <p className="text-xs text-muted-foreground">Stipend: ₹30,000/month • Commencing 15 October 2026</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcceptOffer(app.id, app.company)}
                    className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Accept &amp; Sign MoU
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="min-h-[44px]"
                    onClick={() => setSelectedAppForPreview(app)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View &amp; Download Offer
                  </Button>
                </div>
              </div>
            )}

            {app.status === 'JOINED' && (
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>You are formally enrolled in this internship. Mentor: Dr. Priyanshi Mehta.</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-primary"
                  onClick={() => setSelectedAppForPreview(app)}
                >
                  <FileCheck className="h-3.5 w-3.5 mr-1" /> View Letter
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Animated Pop Up Document Preview Modal on top of screen */}
      <DocumentPreviewModal
        isOpen={!!selectedAppForPreview}
        onClose={() => setSelectedAppForPreview(null)}
        docType="OFFER_LETTER"
        title={selectedAppForPreview ? `Formal Appointment Offer - ${selectedAppForPreview.company}` : 'Offer Letter'}
        data={selectedAppForPreview}
        onDownloadPdf={() => {
          if (selectedAppForPreview) {
            downloadOfferLetterPDF(selectedAppForPreview);
          }
        }}
      />
    </div>
  );
}
