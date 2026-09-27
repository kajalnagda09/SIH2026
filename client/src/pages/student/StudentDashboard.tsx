import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RadarChart } from '@/components/charts/RadarChart';
import { MOCK_INTERNSHIPS, MOCK_CERTIFICATES, type StudentProfile } from '@/lib/mockData';
import { realtimeDb, type StudentTask } from '@/lib/realtimeDb';
import { downloadStudentTranscriptPDF, downloadCertificatePDF } from '@/lib/pdfExport';
import { formatINR } from '@/lib/utils';
import {
  Sparkles, Award, ArrowRight, Code2, Briefcase, BookOpen, CheckCircle2,
  Calendar, Flame, TrendingUp, Compass, Clock, CheckSquare, Square,
  Download, ListTodo, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

import { DocumentPreviewModal, type PreviewDocType } from '@/components/ui/DocumentPreviewModal';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentId = user?.id || 'usr_student_01';
  const profile = (user?.profile || {}) as Partial<StudentProfile>;
  
  const [tasks, setTasks] = useState<StudentTask[]>(() => realtimeDb.getTasks(studentId));
  const [applications, setApplications] = useState(() => realtimeDb.getApplications());
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    docType: PreviewDocType;
    title: string;
    data: any;
    downloadFn: () => void;
  }>({
    isOpen: false,
    docType: 'TRANSCRIPT',
    title: '',
    data: null,
    downloadFn: () => {},
  });
  const recentInternships = MOCK_INTERNSHIPS.slice(0, 3);

  useEffect(() => {
    setTasks(realtimeDb.getTasks(studentId));
    setApplications(realtimeDb.getApplications());

    const unsubscribe = realtimeDb.subscribe(() => {
      setTasks(realtimeDb.getTasks(studentId));
      setApplications(realtimeDb.getApplications());
    });
    return () => unsubscribe();
  }, [studentId]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  const handleToggleTask = (taskId: string, title: string) => {
    const updated = realtimeDb.toggleTask(studentId, taskId);
    setTasks(updated);
    const toggled = updated.find((t) => t.id === taskId);
    if (toggled?.completed) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      toast.success(`Completed task: "${title}" (+${toggled.points} Academic Credits)!`);
    } else {
      toast.info(`Marked task as pending: "${title}"`);
    }
  };

  const handleOpenTranscriptPreview = () => {
    setPreviewModal({
      isOpen: true,
      docType: 'TRANSCRIPT',
      title: 'Official Academic Progress Transcript',
      data: {
        ...profile,
        tasks,
        skills: profile.skills,
        fullName: profile.fullName || user?.email?.split('@')[0],
      },
      downloadFn: () => {
        downloadStudentTranscriptPDF(profile, tasks);
        toast.success('Official Academic Progress Transcript PDF downloaded!');
      },
    });
  };

  const handleOpenCertificatePreview = () => {
    const cert = MOCK_CERTIFICATES[0];
    setPreviewModal({
      isOpen: true,
      docType: 'CERTIFICATE',
      title: 'Verified Competency Credential',
      data: {
        ...cert,
        studentName: profile.fullName || 'Scholar Student',
        rollNumber: profile.rollNumber || 'AIIA2026108',
      },
      downloadFn: () => {
        downloadCertificatePDF({
          ...cert,
          studentName: profile.fullName || 'Scholar Student',
        });
        toast.success('Verified Clinical Competency Certificate downloaded!');
      },
    });
  };

  const radarData = (profile.skills || [
    { name: 'Pharmacognosy', level: 85 },
    { name: 'GCP Trials', level: 90 },
    { name: 'HPTLC Standards', level: 82 },
    { name: 'Biostatistics', level: 75 },
    { name: 'Formulation', level: 88 },
  ]).map((s: any) => ({
    name: s.name.split(' ')[0],
    value: s.level,
  }));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Scholar Command Centre • All India Institute of Ayurveda</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Namaste, {profile.fullName || user?.email?.split('@')[0] || 'Scholar'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {profile.branch || 'BAMS 3rd Year'} • {profile.department || 'Dravyaguna Vigyan'} • Roll:{' '}
            <span className="font-mono">{profile.rollNumber || 'AIIA2026108'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button variant="secondary" onClick={handleOpenTranscriptPreview} className="min-h-[44px]">
            <Download className="h-4 w-4 mr-1.5" /> Export Transcript (PDF)
          </Button>
          <Button onClick={() => navigate('/student/internships')} className="min-h-[44px]">
            Browse Internships <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* 4-Stat Metric Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{applications.length}</div>
            <p className="text-xs text-muted-foreground font-medium">Active Applications</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Flame className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{profile.codingStreak || 5} Days</div>
            <p className="text-xs text-muted-foreground font-medium">Coding Arena Streak</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{(profile.skills || []).length || 4} Verified</div>
            <p className="text-xs text-muted-foreground font-medium">Skill Badges</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {profile.cgpa ? Number(profile.cgpa).toFixed(1) : '8.7'}
            </div>
            <p className="text-xs text-muted-foreground font-medium">Academic CGPA</p>
          </div>
        </Card>
      </div>

      {/* 5 ACTIONABLE TASKS SECTION - REQUESTED BY USER */}
      <Card className="p-6 border-primary/30 shadow-md space-y-5 bg-gradient-to-br from-card via-card to-primary/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary mb-1">
              <ListTodo className="h-4 w-4" />
              <span>Realtime Curricular Checklist</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
              Action Items &amp; Tasks (5 To Do)
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Complete these 5 actionable institutional milestones to unlock verified placement credentials and thesis clearance.
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-mono text-muted-foreground">Overall Progress</div>
              <div className="text-lg font-mono font-bold text-primary">
                {completedCount} / {tasks.length} ({progressPercent}%)
              </div>
            </div>
            <div className="w-24 sm:w-32 h-3 rounded-full bg-muted overflow-hidden border border-border">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5 Task Items */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`p-4 rounded-[var(--radius-md)] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                task.completed
                  ? 'border-emerald-500/30 bg-emerald-500/5 opacity-85'
                  : 'border-border hover:border-primary/40 bg-card shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggleTask(task.id, task.title)}
                  className="mt-0.5 shrink-0 text-primary hover:text-primary/80 transition-transform active:scale-90"
                  title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                >
                  {task.completed ? (
                    <CheckSquare className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground font-semibold">
                      #{index + 1}
                    </span>
                    <h4
                      className={`text-sm font-semibold ${
                        task.completed
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {task.category}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                      +{task.points} Credits
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {task.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/50">
                <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Due: {task.dueDate}
                </span>

                <Button
                  size="sm"
                  variant={task.completed ? 'secondary' : 'primary'}
                  className="text-xs min-h-[38px] px-3 font-medium"
                  onClick={() => navigate(task.actionUrl)}
                >
                  {task.actionLabel} <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Bento Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Active Pipeline & Latest Offer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Highlight Banner */}
          <Card className="p-6 border-primary/30 bg-primary/5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-primary">
                  <Award className="h-4 w-4" /> Priority Notification
                </span>
                <CardTitle className="text-xl">Internship Offer from Practo HealthTech</CardTitle>
                <CardDescription>
                  Digital Health Platform Product Associate • Stipend:{' '}
                  <strong className="text-primary font-mono">₹30,000 / month</strong>
                </CardDescription>
              </div>
              <Badge status="OFFERED" />
            </div>

            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              "Exceptional cross-disciplinary acumen blending BAMS clinical perspective with tech product roadmaps. Offer letter dispatched with formal AIIA endorsement."
            </p>

            <div className="mt-4 pt-4 border-t border-primary/20 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">Action required by 28 Sep 2026</span>
              <Button size="sm" onClick={() => navigate('/student/applications')}>
                Review Offer Details
              </Button>
            </div>
          </Card>

          {/* Active Application Stages */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-lg">Application Tracking Pipeline</CardTitle>
                <CardDescription>Real-time status across partner research institutions</CardDescription>
              </div>
              <Link
                to="/student/applications"
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-border">
              {applications.map((app) => (
                <div key={app.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{app.roleTitle}</h4>
                      <p className="text-xs text-muted-foreground">
                        {app.company} • Applied {app.appliedDate}
                      </p>
                    </div>
                    <Badge status={app.status} />
                  </div>

                  {app.interviewDate && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-500/10 dark:text-amber-400 p-2 rounded-[var(--radius-sm)]">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        Interview Scheduled: <strong>{app.interviewDate}</strong>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended Internships */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-lg">Recommended for Your Profile</CardTitle>
                <CardDescription>Matched with your Ayurvedic Pharmacology &amp; GCP skills</CardDescription>
              </div>
              <Link
                to="/student/internships"
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                Explore catalog <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentInternships.map((intn) => (
                <div
                  key={intn.id}
                  className="p-4 rounded-[var(--radius-md)] border border-border hover:border-primary/40 bg-card transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-foreground">{intn.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {intn.company} • {intn.city}
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      {intn.skillsRequired.slice(0, 2).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="font-mono text-sm font-bold text-primary">{formatINR(intn.stipend)}</div>
                    <div className="text-[10px] text-muted-foreground">{intn.duration}</div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-2 text-xs"
                      onClick={() => navigate('/student/internships')}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): Radar Chart, Coding Arena, Quick Nav */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skill Competency Radar */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Skill Radar Profile</CardTitle>
                <CardDescription>Verified domain &amp; technical proficiency</CardDescription>
              </div>
              <Link to="/student/skills" className="text-xs text-primary font-medium hover:underline">
                Edit Skills
              </Link>
            </div>
            <div className="mt-2">
              <RadarChart data={radarData} />
            </div>
          </Card>

          {/* Coding Arena Quick Challenge */}
          <Card className="p-6 border-accent/20 bg-accent/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-accent" />
                <span className="font-semibold text-sm">Ayush Coding Arena</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent font-bold">
                Daily Problem
              </span>
            </div>

            <h4 className="font-display text-lg font-bold text-foreground">Herbal Inventory Sum</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Find two botanical batch indices that match target dosage formula.
            </p>

            <div className="mt-4 pt-3 border-t border-accent/20 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">Difficulty: Easy</span>
              <Button size="sm" onClick={() => navigate('/student/coding')}>
                Solve Challenge <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <Card className="p-6 space-y-3">
            <CardTitle className="text-base">Quick Academic Actions &amp; Downloads</CardTitle>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="justify-start text-xs min-h-[44px]"
                onClick={() => navigate('/student/assessments')}
              >
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                Take GCP &amp; Dravyaguna Diagnostics
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="justify-start text-xs min-h-[44px]"
                onClick={handleOpenCertificatePreview}
              >
                <Award className="h-4 w-4 mr-2 text-primary" />
                Download Verified Skill Certificate (PDF)
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="justify-start text-xs min-h-[44px]"
                onClick={handleOpenTranscriptPreview}
              >
                <Download className="h-4 w-4 mr-2 text-primary" />
                Download Full Academic Transcript (PDF)
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="justify-start text-xs min-h-[44px]"
                onClick={() => navigate('/student/collaboration')}
              >
                <Compass className="h-4 w-4 mr-2 text-primary" />
                Request Faculty Research Mentorship
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Animated Fullscreen Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((p) => ({ ...p, isOpen: false }))}
        docType={previewModal.docType}
        title={previewModal.title}
        data={previewModal.data}
        onDownloadPdf={previewModal.downloadFn}
      />
    </div>
  );
}
