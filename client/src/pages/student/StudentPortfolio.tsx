import { useState } from 'react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { type StudentProfile, MOCK_CERTIFICATES, type Certificate } from '@/lib/mockData';
import { downloadCertificatePDF, downloadStudentDossierPDF } from '@/lib/pdfExport';
import { DocumentPreviewModal, type PreviewDocType } from '@/components/ui/DocumentPreviewModal';
import {
  Award, ShieldCheck, Share2, Download, ExternalLink,
  CheckCircle2, QrCode
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentPortfolio() {
  const { user } = useAuth();
  const profile = (user?.profile || {}) as Partial<StudentProfile>;
  const portfolio = profile.portfolio || {
    publicSlug: (profile.fullName || user?.email?.split('@')[0] || 'scholar').toLowerCase().replace(/\s+/g, '-'),
    projects: [],
    achievements: [],
  };

  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    docType: PreviewDocType;
    title: string;
    data: any;
    downloadFn: () => void;
  }>({
    isOpen: false,
    docType: 'DOSSIER',
    title: '',
    data: null,
    downloadFn: () => {},
  });

  const handleShare = () => {
    navigator.clipboard?.writeText(`https://setu.edu.in/portfolio/${portfolio.publicSlug}`);
    toast.success('Public verified portfolio link copied to clipboard!');
  };

  const handleDownloadDossier = () => {
    setPreviewModal({
      isOpen: true,
      docType: 'DOSSIER',
      title: 'Official Scholar Clinical Dossier',
      data: profile,
      downloadFn: () => {
        downloadStudentDossierPDF(profile);
        toast.success('Official Student Dossier PDF generated and downloaded!');
      },
    });
  };

  const handleDownloadCert = (cert: Certificate) => {
    setPreviewModal({
      isOpen: true,
      docType: 'CERTIFICATE',
      title: 'Verified Competency Credential',
      data: {
        ...cert,
        studentName: profile.fullName || 'Scholar Student',
        rollNumber: profile.rollNumber || 'AIIA2026108',
      },
      downloadFn: () => {
        downloadCertificatePDF({
          ...cert,
          studentName: profile.fullName || 'Scholar Student',
        });
        toast.success(`Official Certificate PDF downloaded for ${cert.credentialId}!`);
      },
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Setu Verified Credential Registry</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Academic &amp; Clinical Research Portfolio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official institutional record ratified by All India Institute of Ayurveda and partner enterprises.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleShare} className="min-h-[44px]">
            <Share2 className="h-4 w-4 mr-1" /> Share Link
          </Button>
          <Button onClick={handleDownloadDossier} className="min-h-[44px]">
            <Download className="h-4 w-4 mr-1" /> Download Dossier (PDF)
          </Button>
        </div>
      </div>

      {/* Main Official Dossier Card */}
      <Card className="p-8 border-primary/40 relative overflow-hidden space-y-8 bg-card shadow-lg">
        {/* Top Header info */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display text-2xl font-bold shrink-0">
              AI
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  {profile.fullName || 'Ananya Iyer'}
                </h2>
                <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verified Scholar
                </span>
              </div>
              <p className="text-sm font-medium text-primary">
                {profile.headline || 'Health Sciences Scholar | Clinical Data & Botanical Genomics Researcher'}
              </p>
              <p className="text-xs text-muted-foreground">
                {profile.college || 'All India Institute of Ayurveda, New Delhi'} • Roll: <span className="font-mono font-semibold">{profile.rollNumber || 'AIIA2022044'}</span>
              </p>
            </div>
          </div>

          {/* Verification QR / Credential ID */}
          <div className="p-3 rounded-[var(--radius-md)] bg-muted/50 border border-border/80 text-center font-mono text-[10px] space-y-1 self-start">
            <div className="h-14 w-14 mx-auto bg-card border border-border flex items-center justify-center rounded">
              <QrCode className="h-10 w-10 text-foreground" />
            </div>
            <div className="text-muted-foreground">ID: SETU-AIIA-2022044</div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="font-mono text-xs uppercase font-semibold text-muted-foreground tracking-wider">
            Curriculum Statement &amp; Research Focus:
          </h3>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {profile.summary ||
              'Passionate undergraduate researcher integrating clinical diagnostics with computational pharmacology, HPTLC botanical standardization, and Good Clinical Practice protocols.'}
          </p>
        </div>

        {/* Clinical Research & Software Projects */}
        <div className="space-y-4">
          <h3 className="font-mono text-xs uppercase font-semibold text-muted-foreground tracking-wider">
            Peer-Reviewed Projects &amp; Contributions:
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {(portfolio.projects || []).map((proj, idx) => (
              <div key={idx} className="p-4 rounded-[var(--radius-md)] border border-border bg-muted/20 space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-sm text-foreground">{proj.title}</h4>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{proj.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Issued Verified Certificates */}
        <div className="space-y-4">
          <h3 className="font-mono text-xs uppercase font-semibold text-muted-foreground tracking-wider">
            Verified Micro-Credentials &amp; Certified Specializations:
          </h3>
          <div className="space-y-3">
            {MOCK_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="p-4 rounded-[var(--radius-md)] border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <h5 className="font-semibold text-sm text-foreground">{cert.courseTitle}</h5>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Issued by <strong className="text-foreground">{cert.issuedBy}</strong> on {cert.issueDate}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cert.skillsVerified.map((sk) => (
                      <span key={sk} className="text-[10px] px-2 py-0.2 rounded bg-card text-muted-foreground border font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[10px] font-mono text-primary font-semibold block mb-1">
                    {cert.credentialId}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDownloadCert(cert)}
                  >
                    <Download className="h-3 w-3 mr-1" /> Download Certificate (PDF)
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Animated Screen Popup Modal */}
      <DocumentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((p) => ({ ...p, isOpen: false }))}
        docType={previewModal.docType}
        title={previewModal.title}
        data={previewModal.data}
        onDownloadPdf={previewModal.downloadFn}
      />
    </div>
  );
}
