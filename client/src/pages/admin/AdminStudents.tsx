import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Search, Users, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const STUDENTS_LIST = [
  { id: '1', name: 'Ananya Iyer', roll: 'AIIA2022044', branch: 'BAMS', year: 3, cgpa: 8.7, verified: true, activeOffer: 'Practo HealthTech' },
  { id: '2', name: 'Rahul Verma', roll: 'AIIA2022089', branch: 'BAMS', year: 4, cgpa: 8.2, verified: true, activeOffer: 'Dabur R&D' },
  { id: '3', name: 'Priyanshi Mehta', roll: 'AIIA2020005', branch: 'MD Ayurveda', year: 2, cgpa: 9.3, verified: true, activeOffer: 'Biocon' },
  { id: '4', name: 'Karthik Reddy', roll: 'AIIA2022018', branch: 'BAMS', year: 3, cgpa: 7.9, verified: false, activeOffer: 'None' },
  { id: '5', name: 'Sneha Nair', roll: 'AIIA2021045', branch: 'B.Pharm', year: 4, cgpa: 8.5, verified: true, activeOffer: 'Himalaya' },
];

export function AdminStudents() {
  const [students, setStudents] = useState(STUDENTS_LIST);
  const [search, setSearch] = useState('');

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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            <Users className="h-3.5 w-3.5" />
            <span>Academic Registry</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Student Scholar Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official roster of enrolled Ayush scholars with validated CGPA and institutional audit status.
          </p>
        </div>

        <Button variant="secondary" onClick={() => toast.info('Exporting student roster to Excel.')} className="min-h-[44px]">
          Export Scholar Roster
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
                <th className="p-4">Scholar Name</th>
                <th className="p-4">Roll Number</th>
                <th className="p-4">Degree &amp; Year</th>
                <th className="p-4">CGPA</th>
                <th className="p-4">Active Placement</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-semibold text-foreground text-sm">{s.name}</td>
                  <td className="p-4 font-mono text-muted-foreground">{s.roll}</td>
                  <td className="p-4">{s.branch} • Year {s.year}</td>
                  <td className="p-4 font-mono font-bold text-primary">{s.cgpa}</td>
                  <td className="p-4 font-medium">{s.activeOffer}</td>
                  <td className="p-4">
                    {s.verified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs"
                      onClick={() => toggleVerify(s.id, s.name)}
                    >
                      {s.verified ? 'Revoke' : 'Verify'}
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
