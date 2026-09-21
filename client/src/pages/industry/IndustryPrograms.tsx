import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Handshake, Award, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function IndustryPrograms() {
  const [mous] = useState([
    {
      code: 'MOU-AIIA-2024-DABUR',
      title: 'Joint Centre for Herbal Formulation Standardization',
      status: 'ACTIVE_RATIFIED',
      tenure: '2024 - 2029 (5 Years)',
      scope: 'Laboratory infrastructure funding, 15 annual student fellowships, co-patenting of HPTLC marker methods.',
    },
    {
      code: 'MOU-AYUSH-2025-CSR',
      title: 'National Ayush Youth Skill Enhancement Initiative (CSR)',
      status: 'ACTIVE_RATIFIED',
      tenure: '2025 - 2027 (2 Years)',
      scope: 'Sponsoring 100 student certifications in Good Clinical Practice and regulatory pharmacovigilance.',
    },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
          <Handshake className="h-3.5 w-3.5" />
          <span>Institutional Agreements</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Corporate MoUs &amp; Academic Programs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Legally ratified partnerships with Ministry of Ayush and All India Institute of Ayurveda.
        </p>
      </div>

      <div className="space-y-4">
        {mous.map((m) => (
          <Card key={m.code} className="p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border pb-3">
              <div>
                <span className="text-[11px] font-mono text-accent font-bold uppercase">{m.code}</span>
                <CardTitle className="text-xl mt-0.5">{m.title}</CardTitle>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active &amp; Ratified
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{m.scope}</p>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Tenure: {m.tenure}</span>
              <Button size="sm" variant="secondary" onClick={() => toast.info('Full MoU deed downloaded.')}>
                Download Ratified MoU Deed
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
