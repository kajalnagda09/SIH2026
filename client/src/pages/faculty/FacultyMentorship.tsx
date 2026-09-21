import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Handshake, User, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function FacultyMentorship() {
  const [mentees] = useState([
    { name: 'Ananya Iyer', roll: 'AIIA2022044', project: 'Polyherbal Formulation for Glycemic Control', nextSync: '25 Sep 2026, 3:00 PM' },
    { name: 'Rahul Verma', roll: 'AIIA2022089', project: 'Phytochemical Screening of Withanolides', nextSync: '28 Sep 2026, 11:00 AM' },
    { name: 'Divya Sharma', roll: 'AIIA2022104', project: 'Clinical Safety Protocol for Rasashastra Bhasma', nextSync: '02 Oct 2026, 2:30 PM' },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider mb-1">
          <Handshake className="h-3.5 w-3.5" />
          <span>Academic Advisory &amp; Clinical Mentorship</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Assigned Scholar Mentees
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor thesis milestones, log clinical review hours, and provide feedback on research publications.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {mentees.map((m) => (
          <Card key={m.roll} className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                  {m.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{m.name}</h4>
                  <p className="text-[11px] font-mono text-muted-foreground">{m.roll}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground pt-2">
                <strong>Thesis:</strong> {m.project}
              </p>

              <div className="p-2.5 rounded-[var(--radius-sm)] bg-muted text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <span>Next Advisory: {m.nextSync}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1 text-xs" onClick={() => toast.info('Advisory logs opened.')}>
                Log Hours
              </Button>
              <Button size="sm" className="flex-1 text-xs" onClick={() => toast.success('Meeting link sent.')}>
                Start Sync
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
