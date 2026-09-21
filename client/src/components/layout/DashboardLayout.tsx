import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth, dashboardPath } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { CommandPalette } from './CommandPalette';
import { cn } from '@/lib/utils';
import type { Role } from '@/lib/api';
import {
  LayoutDashboard, BookOpen, Code2, Briefcase, GraduationCap, User, Bell, LogOut,
  Users, Building2, BarChart3, FileCheck, Handshake, Calendar, Trophy, Menu, X,
  Search, ShieldCheck, Moon, Sun,
} from 'lucide-react';

const NAV: Record<string, { to: string; label: string; icon: typeof LayoutDashboard }[]> = {
  STUDENT: [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/internships', label: 'Internships', icon: Briefcase },
    { to: '/student/applications', label: 'Applications', icon: FileCheck },
    { to: '/student/coding', label: 'Coding Arena', icon: Code2 },
    { to: '/student/assessments', label: 'Assessments', icon: BookOpen },
    { to: '/student/skills', label: 'Skill Profile', icon: User },
    { to: '/student/portfolio', label: 'Portfolio', icon: User },
    { to: '/student/programs', label: 'Programs', icon: GraduationCap },
    { to: '/student/collaboration', label: 'Collaboration', icon: Handshake },
  ],
  FACULTY: [
    { to: '/faculty', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/faculty/opportunities', label: 'Opportunities', icon: Briefcase },
    { to: '/faculty/applications', label: 'Review Applications', icon: FileCheck },
    { to: '/faculty/mentorship', label: 'Mentorship', icon: Handshake },
    { to: '/faculty/workshops', label: 'Workshops', icon: Calendar },
  ],
  INDUSTRY: [
    { to: '/industry', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/industry/internships', label: 'Postings & Internships', icon: Briefcase },
    { to: '/industry/candidates', label: 'Talent Search', icon: Users },
    { to: '/industry/jobs', label: 'Jobs & R&D Roles', icon: Building2 },
    { to: '/industry/programs', label: 'MoUs & Programs', icon: GraduationCap },
  ],
  ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/analytics', label: 'NIRF Analytics', icon: BarChart3 },
    { to: '/admin/students', label: 'Student Directory', icon: Users },
    { to: '/admin/faculty', label: 'Faculty Roster', icon: GraduationCap },
    { to: '/admin/verification', label: 'Verifications', icon: FileCheck },
    { to: '/admin/certificates', label: 'Certificates', icon: Trophy },
  ],
};

const ROLE_COLORS: Record<string, { border: string; badge: string; label: string }> = {
  STUDENT: { border: 'border-l-primary', badge: 'bg-primary/10 text-primary', label: 'Student Scholar' },
  FACULTY: { border: 'border-l-blue-600', badge: 'bg-blue-500/10 text-blue-600', label: 'Faculty Guide' },
  INDUSTRY: { border: 'border-l-accent', badge: 'bg-amber-500/10 text-amber-700', label: 'Industry Partner' },
  ADMIN: { border: 'border-l-slate-700', badge: 'bg-slate-500/10 text-slate-800 dark:text-slate-200', label: 'Institution Admin' },
};

export function DashboardLayout() {
  const { user, loginAsDemo, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  if (!user) return null;
  const nav = NAV[user.role] || [];
  const currentRoleConfig = ROLE_COLORS[user.role] || ROLE_COLORS.STUDENT;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSwitchPersona = (role: Role) => {
    loginAsDemo(role);
    navigate(dashboardPath(role));
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="space-y-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to.split('/').length <= 2}
          onClick={() => mobile && setMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]',
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <CommandPalette />

      {/* Desktop Sidebar */}
      <aside className={cn('hidden w-68 flex-col border-r border-border bg-card md:flex', currentRoleConfig.border, 'border-l-4')}>
        <div className="border-b border-border p-5">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="font-display text-2xl tracking-tight text-primary flex items-baseline gap-2">
              <span className="font-extrabold">Setu</span>
              <span className="text-xs font-bold text-accent font-display">सेतु</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-semibold">SIH26044</span>
            </NavLink>
          </div>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>National Higher Education Bridge • AIIA</span>
          </p>

          <div className="mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase font-mono" style={{ background: 'var(--color-muted)' }}>
            {currentRoleConfig.label}
          </div>
        </div>

        {/* Quick Role Switcher */}
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <div className="text-[10px] uppercase font-mono text-muted-foreground font-semibold mb-2">Switch Active Persona:</div>
          <div className="grid grid-cols-2 gap-1.5">
            {(['STUDENT', 'FACULTY', 'INDUSTRY', 'ADMIN'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleSwitchPersona(r)}
                className={cn(
                  'text-[11px] py-1 px-2 rounded-[var(--radius-sm)] font-medium text-left transition-all border',
                  user.role === r
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                    : 'border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {r === 'STUDENT' && '🎓 Student'}
                {r === 'FACULTY' && '👨‍🏫 Faculty'}
                {r === 'INDUSTRY' && '🏢 Industry'}
                {r === 'ADMIN' && '🏛️ Admin'}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Main navigation">
          <NavItems />
        </nav>

        {/* Bottom User Card */}
        <div className="border-t border-border p-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">
                {(user.profile as Record<string, string>)?.fullName || user.email.split('@')[0]}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-72 bg-card p-5 shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="font-display text-2xl font-bold text-primary">Setu</span>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">AIIA Skill Bridge</p>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-[var(--radius-sm)] hover:bg-muted"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-3">
              <div className="text-[10px] uppercase font-mono text-muted-foreground font-semibold mb-1.5">Switch Persona:</div>
              <div className="grid grid-cols-2 gap-1.5">
                {(['STUDENT', 'FACULTY', 'INDUSTRY', 'ADMIN'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { handleSwitchPersona(r); setMobileOpen(false); }}
                    className={cn(
                      'text-xs py-1.5 px-2 rounded-[var(--radius-sm)] border text-left',
                      user.role === r ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto space-y-1">
              <NavItems mobile />
            </nav>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[var(--radius-md)] border border-border hover:bg-muted"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
                document.dispatchEvent(event);
              }}
              className="hidden sm:flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-muted/40 px-3.5 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:bg-card transition-all"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search internships, skills, candidates...</span>
              <kbd className="ml-3 rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[var(--radius-md)] border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle dark theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
            </button>

            <NavLink
              to={`${dashboardPath(user.role)}/notifications`}
              className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-md)] border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent animate-pulse" />
            </NavLink>

            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-border">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-muted-foreground">AIIA Verified Portal</span>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Navigation bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-card/95 backdrop-blur md:hidden shadow-lg" aria-label="Mobile navigation">
          {nav.slice(0, 5).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.split('/').length <= 2}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center justify-center gap-1 py-1.5 text-[10px] min-h-[56px] transition-colors',
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span className="truncate max-w-[64px]">{label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
