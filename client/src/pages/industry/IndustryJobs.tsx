import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Building2, Plus, Users, MapPin, Briefcase } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { toast } from 'sonner';

export function IndustryJobs() {
  const [jobs] = useState([
    {
      title: 'Junior Scientist — Phytomedicines & Natural Products',
      location: 'Ghaziabad R&D Centre',
      ctc: '₹8.5 - 12.0 LPA',
      experience: '0-2 Years (Freshers with BAMS/MD eligible)',
      openings: 3,
    },
    {
      title: 'Clinical Pharmacovigilance Executive',
      location: 'New Delhi / Hybrid',
      ctc: '₹7.0 - 9.5 LPA',
      experience: 'Freshers with GCP Certification',
      openings: 2,
    },
    {
      title: 'Ayush Digital Health Product Associate',
      location: 'Bengaluru / Remote',
      ctc: '₹10.0 - 14.0 LPA',
      experience: 'Interdisciplinary Ayush + Tech background',
      openings: 2,
    },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <Building2 className="h-3.5 w-3.5" />
            <span>Graduate Recruitment</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Full-Time R&amp;D &amp; Clinical Careers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Campus placement offers and full-time hiring for graduating Ayush and health sciences scholars.
          </p>
        </div>

        <Button onClick={() => toast.success('New career opening drafted.')} className="min-h-[44px] bg-accent hover:bg-accent/90 text-white">
          <Plus className="h-4 w-4 mr-1" /> Post Graduate Opening
        </Button>
      </div>

      <div className="space-y-4">
        {jobs.map((job, idx) => (
          <Card key={idx} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">{job.title}</CardTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                <span>•</span>
                <span className="font-mono text-primary font-bold">{job.ctc}</span>
                <span>•</span>
                <span>{job.experience}</span>
              </div>
            </div>

            <Button size="sm" variant="secondary" onClick={() => toast.info('Accessing institutional applicant pool.')}>
              View Candidates ({job.openings} Openings)
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
