import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GraduationCap, Calendar, Clock, MapPin, CheckCircle2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const PROGRAMS = [
  {
    id: 'prg_01',
    title: 'National Ayush Botanical Fingerprinting & HPTLC Fellowship',
    partner: 'Dabur Research & AIIA Dravyaguna Dept',
    type: 'FELLOWSHIP',
    duration: '8 Weeks',
    seats: 15,
    stipend: '₹18,000 / month',
    deadline: '2026-10-10',
    description: 'Hands-on laboratory residency training on High-Performance Thin-Layer Chromatography, botanical identification, and marker compound quantification.',
    enrolled: true,
  },
  {
    id: 'prg_02',
    title: 'Good Clinical Practice (GCP) & CTRI Protocol Design Cohort',
    partner: 'Apollo Hospitals & Ministry of Ayush',
    type: 'CERTIFICATE_COHORT',
    duration: '4 Weeks',
    seats: 25,
    stipend: 'Sponsored (Free)',
    deadline: '2026-10-25',
    description: 'Regulatory training for ethical human trials, informed consent mechanisms, and electronic data capture for clinical research associates.',
    enrolled: false,
  },
  {
    id: 'prg_03',
    title: 'Computational Phytopharmacology & Herbogenomics BootCamp',
    partner: 'TCS Life Sciences & Biocon',
    type: 'WORKSHOP',
    duration: '6 Weeks',
    seats: 20,
    stipend: '₹22,000 / month',
    deadline: '2026-11-05',
    description: 'Learn bio-computational molecular docking, target binding affinity prediction for polyherbal active metabolites using Python.',
    enrolled: false,
  },
];

export function StudentPrograms() {
  const [programs, setPrograms] = useState(PROGRAMS);

  const handleEnroll = (id: string, title: string) => {
    setPrograms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enrolled: true } : p))
    );
    toast.success(`Enrolled in "${title}". Academic coordinator will review prerequisite credits.`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Institutional Fellowships &amp; Cohorts</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Academia-Industry Programs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Joint capacity-building initiatives co-certified by AIIA and industry leaders.
        </p>
      </div>

      <div className="space-y-6">
        {programs.map((prg) => (
          <Card key={prg.id} className="p-6 sm:p-8 space-y-4 hover:border-primary/40 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase font-semibold text-primary">
                  {prg.type}
                </span>
                <CardTitle className="text-2xl mt-1">{prg.title}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Building2 className="h-3.5 w-3.5 text-foreground" />
                  <span className="text-foreground font-medium">{prg.partner}</span>
                </div>
              </div>

              {prg.enrolled ? (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled Cohort
                </span>
              ) : (
                <span className="text-xs font-mono font-semibold px-2 py-1 rounded bg-muted text-foreground">
                  {prg.seats} Seats Available
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{prg.description}</p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border">
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {prg.duration}</span>
                <span>•</span>
                <span className="font-bold text-primary">{prg.stipend}</span>
                <span>•</span>
                <span>Deadline: {prg.deadline}</span>
              </div>

              <div>
                {prg.enrolled ? (
                  <Button variant="secondary" size="sm" disabled className="text-xs">
                    Curriculum In Progress
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => handleEnroll(prg.id, prg.title)} className="min-h-[44px]">
                    Register for Cohort
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
