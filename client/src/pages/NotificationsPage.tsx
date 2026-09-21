import { useState } from 'react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, CheckCircle2, Clock, Award, Briefcase, Video } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'OFFER' | 'INTERVIEW' | 'VERIFIED' | 'SYSTEM';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Formal Internship Offer Dispatched',
    desc: 'Practo HealthTech has issued an official offer letter for Digital Health Platform Product Associate with ₹30,000/mo stipend.',
    time: '2 hours ago',
    unread: true,
    type: 'OFFER',
  },
  {
    id: 'n2',
    title: 'Scientific Panel Interview Scheduled',
    desc: 'Dabur Research Centre confirmed Round 2 interview for Phytochemistry Intern on 24 Sep at 11:30 AM IST.',
    time: 'Yesterday',
    unread: true,
    type: 'INTERVIEW',
  },
  {
    id: 'n3',
    title: 'Competency Endorsement Received',
    desc: 'Dr. Priyanshi Mehta endorsed your Ayurvedic Pharmacology & HPTLC skill with 92% proficiency badge.',
    time: '3 days ago',
    unread: false,
    type: 'VERIFIED',
  },
  {
    id: 'n4',
    title: 'Institutional Audit Credit Approved',
    desc: 'AIIA Academic Office approved your clinical research dossier for national NIRF accreditation index.',
    time: '5 days ago',
    unread: false,
    type: 'SYSTEM',
  },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
            <Bell className="h-3.5 w-3.5" />
            <span>Activity Log</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Notifications &amp; Advisories
          </h1>
        </div>

        <Button variant="secondary" size="sm" onClick={markAllAsRead} className="text-xs">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n.id}
            className={`p-5 transition-all flex items-start gap-4 ${
              n.unread ? 'border-primary/40 bg-primary/[0.02]' : 'opacity-80'
            }`}
          >
            <div className={`p-2.5 rounded-full shrink-0 ${
              n.type === 'OFFER' ? 'bg-emerald-500/10 text-emerald-600' :
              n.type === 'INTERVIEW' ? 'bg-amber-500/10 text-amber-600' :
              n.type === 'VERIFIED' ? 'bg-blue-500/10 text-blue-600' : 'bg-muted text-foreground'
            }`}>
              {n.type === 'OFFER' && <Award className="h-5 w-5" />}
              {n.type === 'INTERVIEW' && <Video className="h-5 w-5" />}
              {n.type === 'VERIFIED' && <CheckCircle2 className="h-5 w-5" />}
              {n.type === 'SYSTEM' && <Briefcase className="h-5 w-5" />}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-foreground">{n.title}</h4>
                <span className="text-[11px] font-mono text-muted-foreground">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.desc}</p>
            </div>

            {n.unread && (
              <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
