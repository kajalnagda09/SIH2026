import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MOCK_CERTIFICATES, type Certificate } from '@/lib/mockData';
import { downloadCertificatePDF } from '@/lib/pdfExport';
import { DocumentPreviewModal } from '@/components/ui/DocumentPreviewModal';
import { Trophy, Plus, Award, QrCode, CheckCircle2, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function AdminCertificates() {
  const [certs, setCerts] = useState<Certificate[]>(MOCK_CERTIFICATES);
  const [showModal, setShowModal] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [courseTitle, setCourseTitle] = useState('');

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !courseTitle) return;
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      studentName,
      rollNumber: rollNumber || 'AIIA2022099',
      courseTitle,
      issuedBy: 'All India Institute of Ayurveda & Ministry of Ayush',
      issueDate: '21 September 2026',
      credentialId: `SETU-AIIA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      verificationUrl: `https://setu.ayush.gov.in/verify/SETU-AIIA-2026`,
      skillsVerified: ['Clinical GCP', 'Pharmacology Standards', 'Ayush Integrity'],
    };
    setCerts([newCert, ...certs]);
    setShowModal(false);
    setStudentName('');
    setCourseTitle('');
    toast.success(`Issued digitally signed certificate ${newCert.credentialId} to ${studentName}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            <Trophy className="h-3.5 w-3.5" />
            <span>Verifiable Digital Credentials</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Digital Certificate Authority &amp; Registry
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cryptographically signed micro-credentials compliant with India's Academic Bank of Credits (ABC).
          </p>
        </div>

        <Button onClick={() => setShowModal(true)} className="min-h-[44px]">
          <Plus className="h-4 w-4 mr-1" /> Issue Verifiable Credential
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardTitle>Issue Digitally Signed Certificate</CardTitle>
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Scholar Full Name</label>
                <Input placeholder="e.g. Rahul Verma" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Roll Number</label>
                <Input placeholder="e.g. AIIA2022089" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Course / Assessment Title</label>
                <Input placeholder="e.g. Advanced Pharmacovigilance & CTRI Protocols" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Digitally Sign &amp; Issue</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {certs.map((c) => (
          <Card key={c.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-primary/20 hover:border-primary/40 transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <h4 className="font-bold text-base text-foreground">{c.courseTitle}</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Awarded to <strong className="text-foreground">{c.studentName}</strong> ({c.rollNumber}) • Issued on {c.issueDate}
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-primary pt-1">
                <span>Credential ID: <strong>{c.credentialId}</strong></span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> ABC Ledger Synced
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setPreviewCert(c)}
              >
                <Eye className="h-3.5 w-3.5 mr-1" /> Preview Credential
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  downloadCertificatePDF(c);
                  toast.success(`Official certificate PDF ${c.credentialId} generated!`);
                }}
              >
                <Download className="h-3.5 w-3.5 mr-1" /> Export PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Animated Pop Up Document Preview Modal on top of screen */}
      <DocumentPreviewModal
        isOpen={!!previewCert}
        onClose={() => setPreviewCert(null)}
        docType="CERTIFICATE"
        title={previewCert?.courseTitle || 'Certificate of Verified Competency'}
        data={previewCert}
        onDownloadPdf={() => {
          if (previewCert) {
            downloadCertificatePDF(previewCert);
          }
        }}
      />
    </div>
  );
}
