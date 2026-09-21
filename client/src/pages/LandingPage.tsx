import { useNavigate } from 'react-router-dom';
import { useAuth, dashboardPath } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Role } from '@/lib/api';
import {
  Sparkles, ShieldCheck, ArrowRight, Briefcase, Code2,
  GraduationCap, ChevronRight, Award, Compass, TrendingUp, Users, Building2
} from 'lucide-react';

export function LandingPage() {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemoLaunch = (role: Role) => {
    loginAsDemo(role);
    navigate(dashboardPath(role));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card/85 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold tracking-tight text-primary">Setu</span>
              <span className="font-display text-sm font-semibold text-accent hidden sm:inline-block">सेतु</span>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
              SIH26044
            </span>
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground border-l border-border pl-4">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>National Higher Education &amp; Research Bridge • AIIA</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate(dashboardPath(user.role))} className="min-h-[44px]">
                Open {user.role.toLowerCase()} Console <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')} className="min-h-[44px]">
                  Sign In
                </Button>
                <Button onClick={() => handleDemoLaunch('STUDENT')} className="min-h-[44px]">
                  Explore Scholar Portal <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-border">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(var(--color-primary) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>National Academia-Industry Convergence Platform</span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
                Where Clinical Wisdom Meets Modern R&amp;D.
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground font-normal leading-relaxed max-w-2xl">
                Setu bridges undergraduate scholars, academic faculties, and leading pharmaceutical &amp; bio-informatics enterprises. Powered by transparent clinical internships, computational coding arenas, and verifiable digital credentials.
              </p>

              {/* Direct Demo Launcher Grid */}
              <div className="pt-4 space-y-3">
                <p className="text-xs uppercase tracking-wider font-mono text-muted-foreground font-semibold">
                  Test the fully functional prototype with one click:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => handleDemoLaunch('STUDENT')}
                    className="p-4 text-left rounded-[var(--radius-md)] border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all group"
                  >
                    <div className="text-[11px] font-mono text-primary font-bold mb-1">01. Scholar</div>
                    <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">Student</div>
                    <div className="text-[11px] text-muted-foreground truncate">Ananya Iyer (BAMS)</div>
                  </button>

                  <button
                    onClick={() => handleDemoLaunch('FACULTY')}
                    className="p-4 text-left rounded-[var(--radius-md)] border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500 transition-all group"
                  >
                    <div className="text-[11px] font-mono text-blue-600 font-bold mb-1">02. Mentor</div>
                    <div className="font-bold text-sm text-foreground group-hover:text-blue-600 transition-colors">Faculty</div>
                    <div className="text-[11px] text-muted-foreground truncate">Dr. Priyanshi Mehta</div>
                  </button>

                  <button
                    onClick={() => handleDemoLaunch('INDUSTRY')}
                    className="p-4 text-left rounded-[var(--radius-md)] border border-accent/30 bg-accent/5 hover:bg-accent/10 hover:border-accent transition-all group"
                  >
                    <div className="text-[11px] font-mono text-accent font-bold mb-1">03. Enterprise</div>
                    <div className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">Industry</div>
                    <div className="text-[11px] text-muted-foreground truncate">Dabur R&amp;D Centre</div>
                  </button>

                  <button
                    onClick={() => handleDemoLaunch('ADMIN')}
                    className="p-4 text-left rounded-[var(--radius-md)] border border-slate-500/30 bg-slate-500/5 hover:bg-slate-500/10 hover:border-slate-500 transition-all group"
                  >
                    <div className="text-[11px] font-mono text-slate-600 font-bold mb-1">04. Authority</div>
                    <div className="font-bold text-sm text-foreground group-hover:text-slate-800 transition-colors">Admin</div>
                    <div className="text-[11px] text-muted-foreground truncate">Dr. Karthik Reddy</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Live Data Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-[var(--radius-xl)] border border-border bg-card p-7 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                      AI
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-foreground">Ananya Iyer</h4>
                      <p className="text-xs text-muted-foreground">3rd Year Scholar • AIIA New Delhi</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs px-2.5 py-0.5 font-bold">
                    ABC Ledger Verified
                  </span>
                </div>

                {/* Metric pill row */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-[var(--radius-md)] bg-muted/50 border border-border/50">
                    <div className="text-xl font-bold text-primary font-mono">8.7</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-mono">CGPA</div>
                  </div>
                  <div className="p-3 rounded-[var(--radius-md)] bg-muted/50 border border-border/50">
                    <div className="text-xl font-bold text-accent font-mono">5 Days</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-mono">Code Streak</div>
                  </div>
                  <div className="p-3 rounded-[var(--radius-md)] bg-muted/50 border border-border/50">
                    <div className="text-xl font-bold text-foreground font-mono">92%</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-mono">Clinical GCP</div>
                  </div>
                </div>

                {/* Active Offer Notification */}
                <div className="p-4 rounded-[var(--radius-md)] bg-primary/5 border border-primary/20 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-primary">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Award className="h-4 w-4" /> Formal Internship Offer Issued
                    </span>
                    <span className="font-mono font-bold">₹30,000 / mo</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Practo HealthTech • Digital Health Platform Product Associate
                  </p>
                </div>

                {/* Verified Skills Stack */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground">Verified Domain Competencies:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Ayurvedic Pharmacology', 'Clinical GCP Protocols', 'HPTLC Fingerprinting', 'Python & Biostats', 'Pharmacovigilance'].map((sk) => (
                      <span key={sk} className="text-xs px-2.5 py-1 rounded-md bg-muted text-foreground font-medium border border-border">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <Button onClick={() => handleDemoLaunch('STUDENT')} className="w-full min-h-[44px]">
                  Explore Scholar Portal <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Statistics Banner */}
      <section className="bg-card border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/60">
            <div className="space-y-1">
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-primary">12+</div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Partner Health Industries</p>
            </div>
            <div className="space-y-1 pl-4 sm:pl-8">
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">86.4%</div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Internship Placement Rate</p>
            </div>
            <div className="space-y-1 pl-4 sm:pl-8">
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-accent">₹26,500</div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Average Monthly Stipend</p>
            </div>
            <div className="space-y-1 pl-4 sm:pl-8">
              <div className="font-display text-4xl sm:text-5xl font-extrabold text-foreground">8</div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Active Research MoUs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: 4 Core Pillars of Setu */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            A Structured Continuum for Higher Education &amp; R&amp;D
          </h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Architected to unify traditional clinical curricula, advanced laboratory research, and industrial talent demands.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Bento Item 1 */}
          <Card className="md:col-span-2 p-8 flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-[var(--radius-md)] bg-primary/10 text-primary flex items-center justify-center">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Domain-Tailored R&amp;D &amp; Clinical Internships
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                Direct postings from partners like Dabur Research Centre, Himalaya Wellness, Apollo Oncology, and Biocon. Transparent tracking from application submission, assessment evaluations, to formal stipend offers with real PDF downloads.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <span>• HPTLC Fingerprinting</span>
                <span>• Clinical GCP Trials</span>
                <span>• Pharmacovigilance</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDemoLaunch('STUDENT')}>
                View Openings <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </Card>

          {/* Bento Item 2 */}
          <Card className="p-8 flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-[var(--radius-md)] bg-accent/10 text-accent flex items-center justify-center">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Healthcare Coding Arena
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Live sandbox test runner executing real algorithms — botanical inventory sums, balanced prescription brackets, and clinical trial queue algorithms with instant pass/fail validation.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <span className="text-xs font-mono text-accent font-semibold">Live Sandbox Runner</span>
              <Button variant="ghost" size="sm" onClick={() => handleDemoLaunch('STUDENT')}>
                Open Arena <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </Card>

          {/* Bento Item 3 */}
          <Card className="p-8 flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-[var(--radius-md)] bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Faculty Mentorship &amp; MoUs
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empower professors to endorse scholar competencies, supervise funded industry research grants, and log clinical thesis advisory hours.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">Dr. Priyanshi Mehta</span>
              <Button variant="ghost" size="sm" onClick={() => handleDemoLaunch('FACULTY')}>
                Faculty Console <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </Card>

          {/* Bento Item 4 */}
          <Card className="md:col-span-2 p-8 flex flex-col justify-between group hover:border-primary/50 transition-all">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-[var(--radius-md)] bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Verifiable Micro-Credentials &amp; Real PDF Dossiers
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                Cryptographically verifiable credentials synced with the Academic Bank of Credits (ABC). Instant client-side generation and download of signed certificates and student dossiers.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <span>• Real PDF Generation</span>
                <span>• ABC Ledger Ready</span>
                <span>• Institutional Seal</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDemoLaunch('ADMIN')}>
                Institution Console <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Industry Partners Section */}
      <section className="bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-wider font-mono text-muted-foreground font-semibold mb-8">
            Collaborating Enterprise Partners &amp; Research Centers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-80 grayscale hover:grayscale-0 transition-all">
            {['Dabur Research Centre', 'Himalaya Wellness', 'Patanjali Wellness Labs', 'Apollo Hospitals', 'Biocon Limited', 'TCS Life Sciences'].map((org) => (
              <div key={org} className="font-display text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors">
                {org}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-background py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-primary">Setu</span>
            <span>— Smart India Hackathon (SIH26044)</span>
          </div>
          <div>
            All India Institute of Ayurveda (AIIA) &amp; Partner Research Directorate
          </div>
        </div>
      </footer>
    </div>
  );
}
