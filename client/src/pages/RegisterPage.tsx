import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, dashboardPath } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import type { Role } from '@/lib/api';
import {
  ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Lock, Mail, User,
  GraduationCap, Building2, Briefcase, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export function RegisterPage() {
  const [role, setRole] = useState<Role>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('All India Institute of Ayurveda, New Delhi');
  const [branch, setBranch] = useState('BAMS (Ayurvedacharya) 3rd Year');
  const [department, setDepartment] = useState('Dravyaguna Vigyan');
  const [rollNumber, setRollNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('Ayurvedic Pharmaceuticals & FMCG');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter institutional email and password.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      let profileData: any = { fullName };

      if (role === 'STUDENT') {
        profileData = {
          fullName: fullName || 'Scholar Student',
          rollNumber: rollNumber || `AIIA2026${Math.floor(100 + Math.random() * 900)}`,
          branch: branch || 'BAMS 3rd Year',
          department: department || 'Kayachikitsa',
          college: college || 'All India Institute of Ayurveda',
          cgpa: 8.5,
          year: 3,
          codingStreak: 1,
          skills: [
            { name: 'Ayurvedic Pharmacology', level: 85, category: 'Clinical' },
            { name: 'Clinical GCP Guidelines', level: 90, category: 'Regulatory' },
            { name: 'HPTLC Chemical Profiling', level: 82, category: 'Laboratory' },
            { name: 'Python Bio-Informatics', level: 75, category: 'Computational' },
          ],
          portfolio: {
            publicSlug: (fullName || 'scholar').toLowerCase().replace(/\s+/g, '-'),
            projects: [
              {
                title: 'Standardizing Herbal Extracts for Metabolic Health',
                desc: 'Comparative study on phytochemical active markers in Withania somnifera and Tinospora cordifolia.',
              },
            ],
          },
        };
      } else if (role === 'FACULTY') {
        profileData = {
          fullName: fullName || 'Dr. Faculty Member',
          designation: designation || 'Associate Professor',
          department: department || 'Dravyaguna Vigyan',
          college: college || 'All India Institute of Ayurveda',
          city: 'New Delhi',
          specialization: 'Medicinal Plants & Classical Ayurvedic Pharmacology',
          menteesCount: 0,
        };
      } else if (role === 'INDUSTRY') {
        profileData = {
          companyName: companyName || fullName || 'Ayush Biotech Enterprise',
          sector: sector || 'Ayurveda FMCG & Healthcare',
          city: 'New Delhi / Hybrid',
          description: 'Leading research and development partner in classical and modern botanical health sciences.',
          activePostings: 1,
        };
      } else if (role === 'ADMIN') {
        profileData = {
          fullName: fullName || 'Institutional Administrator',
          designation: 'Institutional Governance Dean',
          college: college || 'All India Institute of Ayurveda',
        };
      }

      const registeredUser = await register(email, password, role, profileData);

      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      toast.success(`Welcome to Setu, ${profileData.fullName || email}! Your institutional account has been created.`);
      navigate(dashboardPath(registeredUser.role));
    } catch (err: any) {
      toast.error(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Brand Header */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <Link to="/" className="font-display text-3xl font-bold tracking-tight text-primary">
          Setu
        </Link>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
          SIH26044
        </span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Realtime Institutional Account Provisioning</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Join Setu Collaboration Network
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Register with your institutional credentials to connect with teachers, industry R&amp;D partners, and accredited certifications.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-border">
          {/* Step 1: Select Role */}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase font-mono mb-2">
              Select Your Institutional Role:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`p-3 rounded-[var(--radius-md)] border text-left flex flex-col items-start gap-1.5 transition-all ${
                  role === 'STUDENT'
                    ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                <GraduationCap className="h-5 w-5" />
                <span className="font-bold text-xs">Student Scholar</span>
                <span className="text-[10px] opacity-75">BAMS / MD / Research</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('FACULTY')}
                className={`p-3 rounded-[var(--radius-md)] border text-left flex flex-col items-start gap-1.5 transition-all ${
                  role === 'FACULTY'
                    ? 'border-blue-600 bg-blue-500/10 text-blue-600 ring-2 ring-blue-500/20'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                <User className="h-5 w-5" />
                <span className="font-bold text-xs">Teacher / Faculty</span>
                <span className="text-[10px] opacity-75">Advisory &amp; Thesis</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('INDUSTRY')}
                className={`p-3 rounded-[var(--radius-md)] border text-left flex flex-col items-start gap-1.5 transition-all ${
                  role === 'INDUSTRY'
                    ? 'border-amber-600 bg-amber-500/10 text-accent ring-2 ring-amber-500/20'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span className="font-bold text-xs">Industry Partner</span>
                <span className="text-[10px] opacity-75">R&amp;D &amp; Placements</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`p-3 rounded-[var(--radius-md)] border text-left flex flex-col items-start gap-1.5 transition-all ${
                  role === 'ADMIN'
                    ? 'border-slate-600 bg-slate-500/10 text-foreground ring-2 ring-slate-500/20'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
                <span className="font-bold text-xs">Institution Admin</span>
                <span className="text-[10px] opacity-75">Dean &amp; Compliance</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase font-mono mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={role === 'STUDENT' ? 'e.g. Siddharth Sharma' : role === 'FACULTY' ? 'e.g. Dr. Rajesh Kumar' : 'e.g. Dr. Anita Gupta'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase font-mono mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="name@aiia.ac.in or student@setu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="h-4 w-4 text-muted-foreground absolute right-3 top-3.5" />
                </div>
              </div>
            </div>

            {/* Role Specific Fields */}
            {role === 'STUDENT' && (
              <div className="grid sm:grid-cols-3 gap-3 p-4 rounded-[var(--radius-md)] bg-muted/40 border border-border">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                    Roll / Enrolment No.
                  </label>
                  <Input
                    placeholder="e.g. AIIA2026108"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                    Academic Branch
                  </label>
                  <Input
                    placeholder="BAMS 3rd Year"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                    Speciality / Dept
                  </label>
                  <Input
                    placeholder="Dravyaguna / Kayachikitsa"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {role === 'FACULTY' && (
              <div className="grid sm:grid-cols-2 gap-3 p-4 rounded-[var(--radius-md)] bg-blue-500/5 border border-blue-500/20">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                    Designation
                  </label>
                  <Input
                    placeholder="Associate Professor & Guide"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                    Academic Department
                  </label>
                  <Input
                    placeholder="Department of Dravyaguna Vigyan"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {role === 'INDUSTRY' && (
              <div className="grid sm:grid-cols-2 gap-3 p-4 rounded-[var(--radius-md)] bg-amber-500/5 border border-amber-500/20">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                    Company / Enterprise Name
                  </label>
                  <Input
                    placeholder="e.g. Himalaya Wellness R&D"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                    Industry Sector
                  </label>
                  <Input
                    placeholder="Botanical Therapeutics / FMCG"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase font-mono mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="•••••••• (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock className="h-4 w-4 text-muted-foreground absolute right-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase font-mono mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Lock className="h-4 w-4 text-muted-foreground absolute right-3 top-3.5" />
                </div>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full min-h-[48px] text-sm mt-4 font-semibold">
              Create Realtime Account &amp; Access Dashboard <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </form>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
            <span>Already have an institutional account?</span>
            <Link to="/login" className="text-primary font-semibold hover:underline flex items-center gap-1">
              Sign In to Existing Account <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
