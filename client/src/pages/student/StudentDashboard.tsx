import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RadarChart } from '@/components/charts/RadarChart';
import { MOCK_APPLICATIONS, MOCK_INTERNSHIPS, MOCK_CODING_PROBLEMS, type StudentProfile } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import {
  Sparkles, Award, ArrowRight, Code2, Briefcase, BookOpen, CheckCircle2,
  Calendar, Flame, TrendingUp, Compass, Clock
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const profile = (user?.profile || {}) as Partial<StudentProfile>;
  const activeApplications = MOCK_APPLICATIONS;
  const recentInternships = MOCK_INTERNSHIPS.slice(0, 3);

  const radarData = (profile.skills || []).map((s) => ({
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
            <span>Scholar Command Centre • AIIA New Delhi</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Namaste, {profile.fullName || 'Scholar'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {profile.branch || 'BAMS'} • {profile.department || 'Kayachikitsa'} • Roll: <span className="font-mono">{profile.rollNumber || 'AIIA2022044'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate('/student/portfolio')} className="min-h-[44px]">
            View Public Portfolio
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
            <div className="text-2xl font-bold font-mono text-foreground">{activeApplications.length}</div>
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
            <div className="text-2xl font-bold font-mono text-foreground">{(profile.skills || []).length} Verified</div>
            <p className="text-xs text-muted-foreground font-medium">Skill Badges</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{profile.cgpa?.toFixed(1) || '8.7'}</div>
            <p className="text-xs text-muted-foreground font-medium">Academic CGPA</p>
          </div>
        </Card>
      </div>

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
                  Digital Health Platform Product Associate • Stipend: <strong className="text-primary font-mono">₹30,000 / month</strong>
                </CardDescription>
              </div>
              <Badge status="OFFERED" />
            </div>

            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              "Exceptional cross-disciplinary acumen blending BAMS clinical perspective with tech product roadmaps. Offer letter dispatched with formal AIIA endorsement."
            </p>

            <div className="mt-4 pt-4 border-t border-primary/20 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">Action required by 25 Sep 2026</span>
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
              <Link to="/student/applications" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-border">
              {activeApplications.map((app) => (
                <div key={app.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{app.roleTitle}</h4>
                      <p className="text-xs text-muted-foreground">{app.company} • Applied {app.appliedDate}</p>
                    </div>
                    <Badge status={app.status} />
                  </div>

                  {app.interviewDate && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-500/10 dark:text-amber-400 p-2 rounded-[var(--radius-sm)]">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>Interview Scheduled: <strong>{app.interviewDate}</strong></span>
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
              <Link to="/student/internships" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
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
                    <p className="text-xs text-muted-foreground">{intn.company} • {intn.city}</p>
                    <div className="flex gap-1.5 pt-1">
                      {intn.skillsRequired.slice(0, 2).map((sk) => (
                        <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="font-mono text-sm font-bold text-primary">{formatINR(intn.stipend)}</div>
                    <div className="text-[10px] text-muted-foreground">{intn.duration}</div>
                    <Button size="sm" variant="secondary" className="mt-2 text-xs" onClick={() => navigate('/student/internships')}>
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

            <h4 className="font-display text-lg font-bold text-foreground">
              Herbal Inventory Sum
            </h4>
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
            <CardTitle className="text-base">Quick Academic Actions</CardTitle>
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
                onClick={() => navigate('/student/portfolio')}
              >
                <Award className="h-4 w-4 mr-2 text-primary" />
                Download Verified Skill Certificate
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
    </div>
  );
}
