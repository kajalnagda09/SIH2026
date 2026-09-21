import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GraduationCap, BookOpen, Users, Award, Mail } from 'lucide-react';
import { toast } from 'sonner';

const FACULTY_ROSTER = [
  {
    name: 'Dr. Priyanshi Mehta',
    designation: 'Associate Professor & Research Chair',
    department: 'Dravyaguna Vigyan',
    specialization: 'Medicinal Plant Pharmacology & HPTLC',
    mentees: 18,
    grants: '₹42.5 Lakhs (Dabur, Himalaya)',
  },
  {
    name: 'Dr. Karthik Reddy',
    designation: 'Professor & Dean of Academic Affairs',
    department: 'Kayachikitsa',
    specialization: 'Integrative Medicine & Clinical Protocols',
    mentees: 12,
    grants: '₹35.0 Lakhs (Apollo, ICMR)',
  },
  {
    name: 'Dr. Harpreet Singh',
    designation: 'Professor & Head',
    department: 'Rasashastra & Bhaishajya Kalpana',
    specialization: 'Herbal Mineral Processing & Nanomedicine',
    mentees: 14,
    grants: '₹28.0 Lakhs (Patanjali Wellness)',
  },
];

export function AdminFaculty() {
  const [faculty] = useState(FACULTY_ROSTER);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Faculty Council Roster</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Faculty Roster &amp; Research Chairs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Supervisory allocations, sponsored corporate grants, and mentee cohort assignments.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {faculty.map((f) => (
          <Card key={f.name} className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {f.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">{f.name}</h4>
                  <p className="text-xs text-muted-foreground">{f.designation}</p>
                </div>
              </div>

              <p className="text-xs text-primary font-medium">{f.department}</p>
              <p className="text-xs text-muted-foreground pt-1">{f.specialization}</p>

              <div className="pt-2 border-t border-border text-xs space-y-1 font-mono text-muted-foreground">
                <div className="flex justify-between">
                  <span>Assigned Mentees:</span>
                  <span className="font-bold text-foreground">{f.mentees}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Grants:</span>
                  <span className="font-bold text-primary">{f.grants}</span>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs"
              onClick={() => toast.info(`Viewing NIRF research portfolio for ${f.name}.`)}
            >
              View Research Dossier
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
