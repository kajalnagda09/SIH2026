import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Users, Building2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function FacultyWorkshops() {
  const [workshops] = useState([
    {
      title: 'Current Trends in HPTLC & LC-MS Fingerprinting for Herbal Formulations',
      hostedBy: 'Dabur R&D Centre & AIIA Dravyaguna Dept',
      date: '28 Sep 2026, 10:00 AM - 4:00 PM',
      venue: 'AIIA Main Auditorium & Virtual Webex',
      registered: 64,
    },
    {
      title: 'Regulatory Submissions for Ayurvedic Drugs under CDSCO & WHO-GMP',
      hostedBy: 'Ministry of Ayush & Himalaya Wellness',
      date: '12 Oct 2026, 2:00 PM - 5:30 PM',
      venue: 'Virtual Seminar Room',
      registered: 82,
    },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider mb-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>Continuous Medical &amp; Clinical Education</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Industry Workshops &amp; Guest Masterclasses
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Jointly organized symposiums, expert seminars, and laboratory methodology workshops.
        </p>
      </div>

      <div className="space-y-4">
        {workshops.map((w, idx) => (
          <Card key={idx} className="p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <CardTitle className="text-xl">{w.title}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 font-medium">
                  <Building2 className="h-3.5 w-3.5 text-blue-600" />
                  <span>{w.hostedBy}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-muted text-foreground">
                {w.registered} Participants Registered
              </span>
            </div>

            <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-4 font-mono">
                <span>Date: {w.date}</span>
                <span>•</span>
                <span>{w.venue}</span>
              </div>
              <Button size="sm" onClick={() => toast.success('Registered faculty seat confirmed.')} className="min-h-[44px]">
                Confirm Attendance
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
