import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileCheck, CheckCircle2, XCircle, ShieldCheck, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminVerification() {
  const [queue, setQueue] = useState([
    {
      id: 'req_1',
      title: 'Dabur R&D Centre — Partnership Renewal MoU',
      entity: 'Enterprise Partner (Ayurveda FMCG)',
      submitted: '18 Sep 2026',
      docs: ['MoU_Draft_Signed.pdf', 'Corporate_GST_Registration.pdf'],
    },
    {
      id: 'req_2',
      title: 'BAMS Batch 2022 Clinical Postings Accreditation',
      entity: 'AIIA Kayachikitsa Hospital Wing',
      submitted: '19 Sep 2026',
      docs: ['Rotational_OPD_Hours_Summary.pdf'],
    },
    {
      id: 'req_3',
      title: 'Patanjali Wellness Labs — Joint Fellowship Scheme',
      entity: 'Industry Partner',
      submitted: '21 Sep 2026',
      docs: ['CSR_Grant_Sanction_Order.pdf'],
    },
  ]);

  const handleApprove = (id: string, title: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
    toast.success(`Ratified & approved: "${title}". Digital signature recorded.`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Statutory Compliance Queue</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Verification &amp; Ratification Requests
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review corporate legal agreements, clinical trial approvals, and academic fellowships.
        </p>
      </div>

      <div className="space-y-4">
        {queue.map((q) => (
          <Card key={q.id} className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border pb-3">
              <div>
                <CardTitle className="text-xl">{q.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">{q.entity} • Submitted {q.submitted}</p>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700">
                Pending Signature
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-muted-foreground">Attached Verified Evidences:</div>
              <div className="flex flex-wrap gap-2">
                {q.docs.map((d) => (
                  <span key={d} className="text-xs px-2.5 py-1 rounded bg-muted text-foreground font-mono border">
                    📄 {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => toast.info('Previewing legal documents.')} className="text-xs">
                Inspect Document
              </Button>
              <Button size="sm" onClick={() => handleApprove(q.id, q.title)} className="text-xs min-h-[44px]">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Ratify &amp; Apply Digital Seal
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
