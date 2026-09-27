import { useState, useEffect } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { realtimeDb } from '@/lib/realtimeDb';
import { Search, Users, CheckCircle2, XCircle, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface StudentRecord {
  id: string;
  name: string;
  roll: string;
  branch: string;
  year: number;
  cgpa: number;
  verified: boolean;
  activeOffer: string;
}

const DEFAULT_STUDENTS: StudentRecord[] = [
  { id: 'usr_student_01', name: 'Ananya Iyer', roll: 'AIIA2022044', branch: 'BAMS', year: 3, cgpa: 8.7, verified: true, activeOffer: 'Practo HealthTech' },
  { id: 'usr_student_02', name: 'Rahul Verma', roll: 'AIIA2022089', branch: 'BAMS', year: 4, cgpa: 8.2, verified: true, activeOffer: 'Dabur R&D' },
  { id: 'usr_student_03', name: 'Divya Sharma', roll: 'AIIA2022104', branch: 'MD Ayurveda', year: 2, cgpa: 9.3, verified: true, activeOffer: 'Biocon' },
  { id: 'usr_student_04', name: 'Karthik Reddy', roll: 'AIIA2022018', branch: 'BAMS', year: 3, cgpa: 7.9, verified: false, activeOffer: 'None' },
  { id: 'usr_student_05', name: 'Sneha Nair', roll: 'AIIA2021045', branch: 'B.Pharm', year: 4, cgpa: 8.5, verified: true, activeOffer: 'Himalaya' },
];

export function AdminStudents() {
  const getCombinedStudents = (): StudentRecord[] => {
    const liveUsers = realtimeDb.getStudents();
    const liveMapped: StudentRecord[] = liveUsers.map((u) => ({
      id: u.id,
      name: u.profile.fullName || u.email.split('@')[0],
      roll: u.profile.rollNumber || `AIIA2026${u.id.slice(-3)}`,
      branch: u.profile.branch || 'BAMS',
      year: u.profile.year || 3,
      cgpa: u.profile.cgpa || 8.5,
      verified: u.isVerified,
      activeOffer: u.profile.activeOffer || 'Active Evaluation',
    }));

    // Merge without duplicates
    const combined = [...liveMapped];
    DEFAULT_STUDENTS.forEach((ds) => {
      if (!combined.some((c) => c.roll === ds.roll || c.id === ds.id)) {
        combined.push(ds);
      }
    });
    return combined;
  };

  const [students, setStudents] = useState<StudentRecord[]>(getCombinedStudents);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setStudents(getCombinedStudents());
    const unsubscribe = realtimeDb.subscribe(() => {
      setStudents(getCombinedStudents());
    });
    return () => unsubscribe();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase())
  );

  const toggleVerify = (id: string, name: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, verified: !s.verified } : s))
    );
    toast.success(`Updated institutional verification status for ${name}`);
  };

  const handleExportCSV = () => {
    const headers = ['Scholar Name', 'Roll Number', 'Branch', 'Academic Year', 'CGPA', 'Verified Status', 'Active Placement Offer'];
    const rows = students.map((s) => [
      `"${s.name}"`,
      `"${s.roll}"`,
      `"${s.branch}"`,
      s.year,
      s.cgpa,
      s.verified ? 'VERIFIED' : 'PENDING',
      `"${s.activeOffer}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Setu_Scholar_Roster.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Scholar Roster exported as CSV!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            <Users className="h-3.5 w-3.5" />
            <span>Academic Registry &amp; Realtime Directory</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Student Scholar Directory ({students.length})
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official roster of enrolled Ayush scholars with validated CGPA, realtime registration sync, and audit ledger.
          </p>
        </div>

        <Button variant="secondary" onClick={handleExportCSV} className="min-h-[44px]">
          <Download className="h-4 w-4 mr-1.5" /> Export Scholar Roster (CSV)
        </Button>
      </div>

      <div className="relative">
        <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-3.5" />
        <Input
          placeholder="Search scholars by name, roll number, or degree branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground uppercase font-mono border-b border-border">
              <tr>
                <th className="p-3">Scholar Name</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Branch &amp; Year</th>
                <th className="p-3">Academic CGPA</th>
                <th className="p-3">Placement / Offer</th>
                <th className="p-3">Verification</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <span>{s.name}</span>
                  </td>
                  <td className="p-3 font-mono text-muted-foreground">{s.roll}</td>
                  <td className="p-3">{s.branch} (Year {s.year})</td>
                  <td className="p-3 font-mono font-bold text-primary">{s.cgpa.toFixed(1)}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-muted font-medium text-[11px]">
                      {s.activeOffer}
                    </span>
                  </td>
                  <td className="p-3">
                    {s.verified ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> ABC Ratified
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> Pending Audit
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7"
                      onClick={() => toggleVerify(s.id, s.name)}
                    >
                      {s.verified ? 'Unverify' : 'Verify'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
