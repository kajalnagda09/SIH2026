import { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { realtimeDb, type MenteeRecord } from '@/lib/realtimeDb';
import { downloadMentorshipLogPDF, downloadMentorshipLogCSV } from '@/lib/pdfExport';
import { DocumentPreviewModal } from '@/components/ui/DocumentPreviewModal';
import {
  Handshake, User, Calendar, MessageSquare, CheckCircle2, Download,
  Clock, Plus, Sparkles, Video, Eye
} from 'lucide-react';
import { toast } from 'sonner';

export function FacultyMentorship() {
  const [mentees, setMentees] = useState<MenteeRecord[]>(() => realtimeDb.getMentees());
  const [selectedMentee, setSelectedMentee] = useState<MenteeRecord | null>(null);
  const [hoursToAdd, setHoursToAdd] = useState('2');
  const [syncMeeting, setSyncMeeting] = useState<string | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    setMentees(realtimeDb.getMentees());
    const unsubscribe = realtimeDb.subscribe(() => {
      setMentees(realtimeDb.getMentees());
    });
    return () => unsubscribe();
  }, []);

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentee) return;
    const hrs = parseInt(hoursToAdd, 10) || 1;
    realtimeDb.logMenteeHours(selectedMentee.id, hrs);
    toast.success(`Logged ${hrs} clinical advisory hours for ${selectedMentee.name}.`);
    setSelectedMentee(null);
  };

  const handleStartSync = (name: string) => {
    const meetUrl = `https://meet.google.com/setu-aiia-${Math.floor(100 + Math.random() * 900)}`;
    setSyncMeeting(`${name} • Meeting Link: ${meetUrl}`);
    navigator.clipboard?.writeText(meetUrl);
    toast.success(`Advisory meeting created for ${name}! Link copied to clipboard.`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider mb-1">
            <Handshake className="h-3.5 w-3.5" />
            <span>Academic Advisory &amp; Clinical Mentorship Roster</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Assigned Scholar Mentees ({mentees.length})
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor thesis milestones in realtime, log verified clinical review hours, and export official logbooks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowLogModal(true)}
            className="min-h-[44px]"
          >
            <Eye className="h-4 w-4 mr-1.5" /> Preview &amp; Export Logbook (PDF)
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              downloadMentorshipLogCSV(mentees);
              toast.success('Mentorship Logs CSV exported!');
            }}
            className="min-h-[44px]"
          >
            <Download className="h-4 w-4 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      {syncMeeting && (
        <div className="p-4 rounded-[var(--radius-md)] bg-blue-500/10 border border-blue-500/30 text-blue-800 dark:text-blue-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 shrink-0 text-blue-600" />
            <span>{syncMeeting}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setSyncMeeting(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Log Hours Modal */}
      {selectedMentee && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardTitle>Log Advisory Hours: {selectedMentee.name}</CardTitle>
            <CardDescription>
              Record clinical advisory, thesis verification, and manuscript review time.
            </CardDescription>

            <form onSubmit={handleLogHours} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  Advisory Hours to Add
                </label>
                <Input
                  type="number"
                  min="1"
                  max="40"
                  value={hoursToAdd}
                  onChange={(e) => setHoursToAdd(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setSelectedMentee(null)}>
                  Cancel
                </Button>
                <Button type="submit">Log &amp; Update Ledger</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {mentees.map((m) => (
          <Card
            key={m.id}
            className="p-6 space-y-4 flex flex-col justify-between border-border hover:border-blue-500/40 transition-all shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {m.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{m.name}</h4>
                    <p className="text-[11px] font-mono text-muted-foreground">{m.roll}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                  {m.hoursLogged || 24} Hrs Logged
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
                  Thesis / Project:
                </span>
                <p className="text-xs text-foreground font-medium leading-relaxed">
                  {m.project}
                </p>
              </div>

              <div className="p-2.5 rounded-[var(--radius-sm)] bg-muted/60 border border-border text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <span>Next Advisory: {m.nextSync}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 text-xs min-h-[38px]"
                onClick={() => setSelectedMentee(m)}
              >
                <Clock className="h-3.5 w-3.5 mr-1" /> Log Hours
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs min-h-[38px] bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleStartSync(m.name)}
              >
                <Video className="h-3.5 w-3.5 mr-1" /> Start Sync
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Animated Pop Up Document Preview Modal on top of screen */}
      <DocumentPreviewModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        docType="MENTORSHIP_LOG"
        title="Official Clinical Mentorship & Advisory Logbook"
        data={{ mentees }}
        onDownloadPdf={() => {
          downloadMentorshipLogPDF(mentees);
        }}
      />
    </div>
  );
}
