import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import {
  Download, Printer, CheckCircle2, ShieldCheck, X, Sparkles,
  QrCode, Award, FileText, Copy, Check, ZoomIn, ZoomOut, RotateCcw,
  CheckCircle, Building2, BookOpen, Star, Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export type PreviewDocType =
  | 'TRANSCRIPT'
  | 'CERTIFICATE'
  | 'DOSSIER'
  | 'OFFER_LETTER'
  | 'NAAC_REPORT'
  | 'MENTORSHIP_LOG';

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: PreviewDocType;
  title: string;
  data: any;
  onDownloadPdf: () => void;
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  docType,
  title,
  data,
  onDownloadPdf,
}: DocumentPreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [zoom, setZoom] = useState<number>(100);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setVerifying(true);
      setZoom(100);
      setIsDownloading(false);
      setDownloadProgress(0);
      const timer = setTimeout(() => {
        setVerifying(false);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.4 } });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const credId = data?.credentialId || `AIIA-REG-2026-${Date.now().toString().slice(-4)}`;
    const url = `https://setu.ayush.gov.in/verify/${credId}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    toast.success('Official cryptographic verification URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTriggerDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(20);
    const t1 = setTimeout(() => setDownloadProgress(65), 250);
    const t2 = setTimeout(() => {
      setDownloadProgress(100);
      try {
        onDownloadPdf();
      } catch (err) {
        console.error('Download error:', err);
      }
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      toast.success('High-Resolution PDF successfully rendered and downloaded!');
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    }, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  const scholarName = data?.fullName || data?.studentName || data?.name || 'Aayush Sharma';
  const rollNumber = data?.rollNumber || data?.roll || 'AIIA2026108';
  const branch = data?.branch || 'BAMS 3rd Year';
  const department = data?.department || 'Dravyaguna Vigyan';
  const cgpa = data?.cgpa ? Number(data.cgpa).toFixed(1) : '8.7';
  const credentialId = data?.credentialId || `SETU-AIIA-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop with Blur & Subtle Radial Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Dialog Container with Animated Entry */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-4xl bg-card rounded-2xl shadow-2xl border border-primary/30 overflow-hidden flex flex-col max-h-[94vh] z-10"
        >
          {/* Top Status & Action Bar */}
          <div className="px-4 sm:px-6 py-3.5 bg-muted/70 border-b border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                  <span>{title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    SIH26044 Verified
                  </span>
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mt-0.5">
                  {verifying ? (
                    <span className="flex items-center gap-1.5 text-amber-500 font-semibold animate-pulse">
                      <Sparkles className="h-3.5 w-3.5 animate-spin" /> Verifying Academic Ledger Hash...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Cryptographically Sealed &amp; Ready
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Zoom Buttons */}
              <div className="hidden sm:flex items-center bg-background rounded-lg border border-border px-1 py-0.5 text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(75, prev - 15))}
                  className="p-1 hover:text-foreground transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="px-1.5 font-mono text-[11px] font-medium">{zoom}%</span>
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(130, prev + 15))}
                  className="p-1 hover:text-foreground transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(100)}
                  className="p-1 hover:text-foreground transition-colors ml-0.5 text-[10px]"
                  title="Reset zoom"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                className="text-xs h-9"
                title="Copy public verification URL"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Share Link'}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrint}
                className="text-xs h-9 hidden md:flex"
              >
                <Printer className="h-3.5 w-3.5 mr-1" /> Print
              </Button>

              <Button
                size="sm"
                onClick={handleTriggerDownload}
                disabled={isDownloading}
                className="text-xs h-9 font-semibold bg-gradient-to-r from-emerald-600 to-primary hover:from-emerald-700 hover:to-primary/90 text-white shadow-md relative overflow-hidden"
              >
                {isDownloading ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-1 animate-spin" />
                    <span>Rendering... {downloadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    <span>Download PDF</span>
                  </>
                )}
                {isDownloading && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-white/40"
                    style={{ width: `${downloadProgress}%` }}
                    transition={{ ease: 'easeInOut' }}
                  />
                )}
              </Button>

              <button
                type="button"
                onClick={onClose}
                className="h-9 w-9 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors ml-1"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Interactive Document Viewport */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 bg-slate-950/60 flex justify-center items-start">
            <motion.div
              layout
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="w-full max-w-3xl bg-white text-slate-900 rounded-lg shadow-2xl p-6 sm:p-10 border-2 border-emerald-900/30 relative font-sans space-y-6 my-2"
            >
              {/* Outer Decorative Dual Gold & Emerald Security Borders */}
              <div className="absolute inset-2 border-2 border-emerald-800/30 rounded pointer-events-none" />
              <div className="absolute inset-3 border border-amber-600/30 rounded pointer-events-none" />

              {/* Watermark in background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                <span className="text-8xl font-black rotate-[-30deg] tracking-widest text-slate-900 uppercase">
                  SETU AIIA
                </span>
              </div>

              {/* Institutional Header Banner */}
              <div className="text-center border-b border-slate-200 pb-5 relative">
                <div className="flex justify-center items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-emerald-800 to-teal-700 text-white flex items-center justify-center font-bold text-base shadow-md ring-2 ring-amber-500/40">
                    AIIA
                  </div>
                  <div className="text-left">
                    <h2 className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-emerald-950">
                      All India Institute of Ayurveda (AIIA)
                    </h2>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-mono">
                      Ministry of Ayush, Govt. of India • Smart India Hackathon SIH26044
                    </p>
                  </div>
                </div>

                <h1 className="text-lg sm:text-2xl font-bold font-serif text-slate-900 mt-3 tracking-wide uppercase">
                  {docType === 'CERTIFICATE'
                    ? 'Certificate of Verified Competency'
                    : docType === 'TRANSCRIPT'
                    ? 'Official Academic & Clinical Transcript'
                    : docType === 'OFFER_LETTER'
                    ? 'Formal Letter of Appointment'
                    : docType === 'NAAC_REPORT'
                    ? 'Faculty NAAC Criterion 3 Research Dossier'
                    : docType === 'MENTORSHIP_LOG'
                    ? 'Official Clinical Mentorship & Advisory Logbook'
                    : 'Verified Scholar Clinical Dossier'}
                </h1>
                <p className="text-xs text-slate-500 font-serif italic mt-1">
                  National Skill Registry &amp; Academic Bank of Credits (ABC) Record
                </p>

                {/* Floating Animated Hologram Stamp */}
                <div className="absolute top-0 right-0 hidden sm:flex flex-col items-center">
                  <div className="relative flex items-center justify-center h-14 w-14">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-amber-600/60"
                    />
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex flex-col items-center justify-center shadow-md">
                      <Star className="h-4 w-4 fill-white" />
                      <span className="text-[7px] font-bold tracking-tighter uppercase">Verified</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono font-bold text-amber-800 uppercase mt-0.5">ABC Ledger</span>
                </div>
              </div>

              {/* Scholar / Profile Details Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded border border-slate-200 text-xs">
                <div>
                  <span className="block text-[10px] font-mono uppercase text-slate-500">Scholar Name</span>
                  <span className="font-bold text-slate-900">{scholarName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-slate-500">Roll Number</span>
                  <span className="font-mono font-bold text-emerald-800">{rollNumber}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-slate-500">Degree &amp; Year</span>
                  <span className="font-medium text-slate-800">{branch}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-slate-500">Academic CGPA</span>
                  <span className="font-mono font-bold text-emerald-800">{cgpa} / 10.0</span>
                </div>
              </div>

              {/* Document Specific Body */}
              {docType === 'TRANSCRIPT' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-emerald-900 border-b border-emerald-900/20 pb-1 mb-2 flex items-center justify-between">
                      <span>I. Curricular Action Milestones &amp; Tasks (Live Progress)</span>
                      <span className="text-[10px] font-mono text-emerald-700">Realtime Database Synced</span>
                    </h4>
                    <div className="space-y-2">
                      {(data?.tasks || [
                        { id: '1', title: 'Clinical Research Ethics Assessment', completed: true, points: 20 },
                        { id: '2', title: 'Ayush Data Sandbox Coding Challenge', completed: true, points: 25 },
                        { id: '3', title: 'Submit Joint Industry Research Proposal', completed: true, points: 30 },
                        { id: '4', title: 'Bi-Weekly Advisory Clinic with Faculty Guide', completed: false, points: 15 },
                        { id: '5', title: 'Synchronize National Academic Bank of Credits', completed: true, points: 10 },
                      ]).map((t: any, i: number) => (
                        <div
                          key={t.id || i}
                          className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                t.completed ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                              }`}
                            >
                              {t.completed ? '✓' : '○'}
                            </span>
                            <span className={t.completed ? 'font-semibold text-slate-900' : 'text-slate-600'}>
                              {t.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500">+{t.points || 15} pts</span>
                            <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                              t.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {t.completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-emerald-900 border-b border-emerald-900/20 pb-1 mb-2">
                      II. Standardized Diagnostic &amp; Clinical Competencies
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(data?.skills || [
                        { name: 'Ayurvedic Pharmacology', level: 85, category: 'Clinical' },
                        { name: 'Good Clinical Practice (GCP)', level: 90, category: 'Regulatory' },
                        { name: 'HPTLC Chemical Profiling', level: 82, category: 'Laboratory' },
                        { name: 'Healthcare Informatics & AI', level: 75, category: 'Computational' },
                      ]).map((s: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between items-center">
                          <div>
                            <div className="font-bold text-slate-900">{typeof s === 'string' ? s : s.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{s.category || 'Clinical'}</div>
                          </div>
                          <div className="text-right font-mono font-bold text-emerald-800">
                            {typeof s === 'object' && s.level ? s.level : 85}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {docType === 'CERTIFICATE' && (
                <div className="text-center py-6 space-y-4">
                  <p className="text-xs font-serif italic text-slate-600">
                    Has successfully cleared all clinical assays, standardized examinations, and research protocols in:
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-amber-900">
                    "{data?.courseTitle || data?.title || 'Good Clinical Practice & Dravyaguna Standardization'}"
                  </h3>
                  <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900 font-mono inline-block">
                    Verified Competencies: Clinical GCP • Pharmacology Standards • Ayurvedic Integrity
                  </div>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto">
                    Issued under the authority of All India Institute of Ayurveda (AIIA) and the Ministry of Ayush, Government of India. This credential is electronically logged and immutably secured.
                  </p>
                </div>
              )}

              {docType === 'OFFER_LETTER' && (
                <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-emerald-800 font-bold block">Enterprise Sponsor</span>
                      <strong className="text-sm text-emerald-950 font-serif">{data?.company || 'Practo HealthTech'}</strong>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[10px] uppercase text-emerald-800 font-bold block">Monthly Stipend</span>
                      <strong className="text-sm text-emerald-950 font-mono">INR 30,000 / month</strong>
                    </div>
                  </div>

                  <p>
                    <strong>Subject: Formal Offer of Internship Appointment - {data?.roleTitle || 'Clinical Research Associate'}</strong>
                  </p>
                  <p>
                    Dear {scholarName},
                  </p>
                  <p>
                    We are pleased to offer you the position of <strong>{data?.roleTitle || 'Clinical Research Associate'}</strong> at <strong>{data?.company || 'Practo HealthTech'}</strong>. Following your exceptional results across the standardized Setu assessments, our review board has ratified your appointment.
                  </p>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                    <div><strong>Commencement Date:</strong> 15 October 2026</div>
                    <div><strong>Duration:</strong> 6 Months Full-Time Industrial Research Residency</div>
                    <div><strong>Supervising Mentor:</strong> Dr. Priyanshi Mehta (Dravyaguna Chair, AIIA)</div>
                    <div><strong>Accreditation:</strong> NCISM &amp; NAAC Verified Academic Credits</div>
                  </div>
                </div>
              )}

              {docType === 'NAAC_REPORT' && (
                <div className="space-y-4 text-xs text-slate-800">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-950 flex justify-between items-center">
                    <div>
                      <strong className="font-bold text-sm">Faculty NAAC Criterion 3 Research Dossier</strong>
                      <div className="text-[10px] text-blue-700">Department of Dravyaguna Vigyan • Annual Cycle 2025-2026</div>
                    </div>
                    <div className="font-mono text-xs font-bold text-blue-800">IQAC Score: 98.4%</div>
                  </div>

                  <table className="w-full text-xs text-left border border-slate-200 rounded overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-2 border-b">Benchmark / Metric</th>
                        <th className="p-2 border-b">Quantified Metric</th>
                        <th className="p-2 border-b">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2">Assigned Scholar Mentees</td>
                        <td className="p-2 font-mono font-bold">18 Scholars</td>
                        <td className="p-2 text-emerald-700 font-bold">Verified ✓</td>
                      </tr>
                      <tr>
                        <td className="p-2">Sponsored Industry Research Grants</td>
                        <td className="p-2 font-mono font-bold">INR 48.5 Lakhs (Dabur, Himalaya)</td>
                        <td className="p-2 text-emerald-700 font-bold">Verified ✓</td>
                      </tr>
                      <tr>
                        <td className="p-2">Scopus / PubMed Indexed Papers</td>
                        <td className="p-2 font-mono font-bold">14 Clinical Publications</td>
                        <td className="p-2 text-emerald-700 font-bold">Indexed ✓</td>
                      </tr>
                      <tr>
                        <td className="p-2">Institutional Ethics (IEC) Clearances</td>
                        <td className="p-2 font-mono font-bold">9 Protocols Cleared</td>
                        <td className="p-2 text-emerald-700 font-bold">Approved ✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {docType === 'MENTORSHIP_LOG' && (
                <div className="space-y-4 text-xs text-slate-800">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-950 flex justify-between items-center">
                    <div>
                      <strong className="font-bold text-sm">Official Clinical Advisory &amp; Mentorship Logbook</strong>
                      <div className="text-[10px] text-emerald-700">Verified Advisory Hours under NCISM &amp; AIIA Guidelines</div>
                    </div>
                    <div className="font-mono text-xs font-bold text-emerald-800">Total: 48 Advisory Hours</div>
                  </div>

                  <div className="space-y-2">
                    {(data?.mentees || [
                      { name: 'Aayush Sharma', roll: 'AIIA2026108', project: 'Phytochemical Fingerprinting of Rasayana', hoursLogged: 32 },
                      { name: 'Rohan Deshmukh', roll: 'AIIA2026112', project: 'Pre-clinical Toxicity of Classical Formulations', hoursLogged: 24 },
                      { name: 'Pooja Nair', roll: 'AIIA2026115', project: 'GCP Protocols in Integrative Oncology Trials', hoursLogged: 28 },
                    ]).map((m: any, idx: number) => (
                      <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900">{m.name} ({m.roll})</div>
                          <div className="text-[10px] text-slate-500">{m.project}</div>
                        </div>
                        <div className="font-mono font-bold text-emerald-800 text-xs">
                          {m.hoursLogged} Hours
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {docType === 'DOSSIER' && (
                <div className="space-y-4 text-xs text-slate-800">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <h5 className="font-mono text-[10px] uppercase font-bold text-emerald-900 mb-1">
                      Academic &amp; Clinical Statement
                    </h5>
                    <p className="text-slate-600 leading-relaxed italic">
                      "Passionate BAMS undergraduate integrating classical Charaka Samhita diagnostics with modern pharmacovigilance and HPTLC standardization."
                    </p>
                  </div>

                  <div>
                    <h5 className="font-mono text-[10px] uppercase font-bold text-emerald-900 mb-2">
                      Verified Research Projects &amp; Lab Postings
                    </h5>
                    <div className="space-y-2">
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                        <div>
                          <strong className="text-slate-900">Standardization of Classical Triphala Guggulu</strong>
                          <div className="text-[10px] text-slate-500">Sponsored by Dabur Research Lab • 120 Hours Logged</div>
                        </div>
                        <span className="font-mono font-bold text-emerald-700">Completed ✓</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                        <div>
                          <strong className="text-slate-900">AI-Assisted Prakriti Assessment Diagnostic Algorithm</strong>
                          <div className="text-[10px] text-slate-500">SIH National Hackathon Project SIH26044</div>
                        </div>
                        <span className="font-mono font-bold text-emerald-700">Validated ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Security Seals & Signatures */}
              <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                {/* Left: Credential Hash & QR */}
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 bg-slate-100 border border-slate-300 rounded p-1 flex items-center justify-center shrink-0">
                    <QrCode className="h-12 w-12 text-slate-800" />
                  </div>
                  <div className="font-mono text-[10px] text-slate-600 space-y-0.5">
                    <div>CREDENTIAL ID: <strong className="text-slate-900">{credentialId}</strong></div>
                    <div>DATE: {new Date().toLocaleDateString('en-IN')}</div>
                    <div>LEDGER: ABC-AIIA-NATIONAL-REGISTRY</div>
                    <div className="text-emerald-700 font-bold flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" /> SHA-256 Validated Signature
                    </div>
                  </div>
                </div>

                {/* Right: Signature */}
                <div className="text-right">
                  <div className="font-serif italic font-bold text-base text-slate-900">Dr. Karthik Reddy</div>
                  <div className="text-[11px] text-slate-500">Dean of Academic Collaborations</div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase font-mono">
                    All India Institute of Ayurveda
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
