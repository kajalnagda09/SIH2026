import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useAuth, dashboardPath } from '@/context/AuthContext';
import { type Role } from '@/lib/api';
import { Search, Sparkles, BookOpen, Briefcase, Code2, Users, FileCheck, LogOut, Sun, Moon } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, loginAsDemo, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleRoleSwitch = (role: Role) => {
    loginAsDemo(role);
    navigate(dashboardPath(role));
    setOpen(false);
  };

  const runCommand = (action: () => void) => {
    action();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-xs p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex flex-col w-full">
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command, internship, or jump to page... (Esc to close)"
              className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="hidden sm:inline-block rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 text-sm">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No matching results found.
            </Command.Empty>

            <Command.Group heading="⚡ Switch Demo Persona" className="px-2 py-1 text-xs font-semibold text-muted-foreground">
              <Command.Item
                onSelect={() => handleRoleSwitch('STUDENT')}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="font-medium">Student Persona</span>
                <span className="text-xs text-muted-foreground ml-auto">Ananya Iyer (BAMS)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleRoleSwitch('FACULTY')}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm cursor-pointer hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-medium">Faculty Persona</span>
                <span className="text-xs text-muted-foreground ml-auto">Dr. Priyanshi Mehta (Dravyaguna)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleRoleSwitch('INDUSTRY')}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm cursor-pointer hover:bg-amber-500/10 hover:text-amber-700 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-medium">Industry Persona</span>
                <span className="text-xs text-muted-foreground ml-auto">Dabur Research Centre</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleRoleSwitch('ADMIN')}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm cursor-pointer hover:bg-slate-500/10 hover:text-slate-800 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-slate-500" />
                <span className="font-medium">Institution Admin Persona</span>
                <span className="text-xs text-muted-foreground ml-auto">Dr. Karthik Reddy (AIIA)</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="📌 Quick Navigation" className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/student/internships'))}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm cursor-pointer hover:bg-muted"
              >
                <Briefcase className="h-4 w-4 text-primary" />
                <span>Explore Ayush Internships</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/student/coding'))}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm cursor-pointer hover:bg-muted"
              >
                <Code2 className="h-4 w-4 text-primary" />
                <span>Ayush Coding Arena & Algorithmic Prescriptions</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/student/assessments'))}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm cursor-pointer hover:bg-muted"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Skill Assessments & Diagnostic Tests</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/student/applications'))}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm cursor-pointer hover:bg-muted"
              >
                <FileCheck className="h-4 w-4 text-primary" />
                <span>My Applications & Status Pipeline</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/admin/analytics'))}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm cursor-pointer hover:bg-muted"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Institutional Analytics & NIRF Ready Metrics</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="⚙️ Preferences & Session" className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">
              <Command.Item
                onSelect={() => runCommand(toggleDarkMode)}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm cursor-pointer hover:bg-muted"
              >
                {isDark ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-500" />}
                <span>Toggle {isDark ? 'Light' : 'Dark'} Mode</span>
              </Command.Item>
              {user && (
                <Command.Item
                  onSelect={() => runCommand(async () => { await logout(); navigate('/login'); })}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm text-destructive cursor-pointer hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Command.Item>
              )}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
