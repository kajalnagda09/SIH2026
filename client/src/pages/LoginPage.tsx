import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, dashboardPath } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import type { Role } from '@/lib/api';
import { ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemo = (role: Role) => {
    loginAsDemo(role);
    toast.success(`Logged in as ${role.toLowerCase()} demo account`);
    navigate(dashboardPath(role));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success('Successfully authenticated');
      navigate(dashboardPath(u.role));
    } catch (err: any) {
      toast.error(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle background decoration */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <Link to="/" className="font-display text-3xl font-bold tracking-tight text-primary">
          Setu
        </Link>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
          SIH26044
        </span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Ministry of Ayush / AIIA Institutional Gateway</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Sign in to Setu Portal
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Access your verified research projects, clinical internships, and institutional reports.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg space-y-6">
        {/* Instant Demo Accounts Card */}
        <Card className="border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase font-mono tracking-wider mb-3">
            <Sparkles className="h-4 w-4" /> 1-Click Fast Demo Logins
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Select an official pre-seeded Ayush persona to evaluate full role features:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleDemo('STUDENT')}
              className="justify-start text-xs border-primary/30 hover:border-primary"
            >
              🎓 Student (Ananya)
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleDemo('FACULTY')}
              className="justify-start text-xs border-blue-500/30 hover:border-blue-500"
            >
              👨‍🏫 Faculty (Dr. Priyanshi)
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleDemo('INDUSTRY')}
              className="justify-start text-xs border-amber-500/30 hover:border-accent"
            >
              🏢 Industry (Dabur R&amp;D)
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleDemo('ADMIN')}
              className="justify-start text-xs border-slate-500/30 hover:border-slate-600"
            >
              🏛️ Admin (Dr. Karthik)
            </Button>
          </div>
        </Card>

        {/* Standard Email/Password Form */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase font-mono mb-1.5">
                Institutional Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="student@setu.demo or scholar@aiia.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
                <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase font-mono mb-1.5">
                Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
                <Lock className="h-4 w-4 text-muted-foreground absolute left-3 top-3.5" />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground font-mono">
                Demo passwords: <span className="text-foreground">demo123</span>
              </p>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2 min-h-[46px] text-sm font-semibold">
              Sign In to Portal <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
            <span>New scholar, faculty, or partner?</span>
            <Link to="/register" className="text-primary font-bold hover:underline flex items-center gap-1">
              Create an Account <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
