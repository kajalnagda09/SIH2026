import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BarChart } from '@/components/charts/BarChart';
import { useAuth } from '@/context/AuthContext';
import { MOCK_ADMIN_METRICS, type AdminProfile } from '@/lib/mockData';
import { downloadNIRFReportPDF } from '@/lib/pdfExport';
import {
  ShieldCheck, Users, GraduationCap, Building2, BarChart3,
  Award, CheckCircle2, TrendingUp, Download, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { user } = useAuth();
  const profile = (user?.profile || {}) as Partial<AdminProfile>;
  const metrics = MOCK_ADMIN_METRICS;

  const [verifications, setVerifications] = useState([
    { id: 'v1', name: 'Zydus Lifesciences', type: 'Industry Partner Onboarding', date: '21 Sep 2026', status: 'PENDING' },
    { id: 'v2', name: 'Ananya Iyer (Roll AIIA2022044)', type: 'National Ayush Merit Scholarship Credit', date: '20 Sep 2026', status: 'PENDING' },
    { id: 'v3', name: 'Dr. Suresh Pillai', type: 'Faculty Research Grant Allocation (₹14L)', date: '19 Sep 2026', status: 'PENDING' },
  ]);

  const handleApprove = (id: string, name: string) => {
    setVerifications((prev) => prev.filter((v) => v.id !== id));
    toast.success(`Approved & ratified: "${name}". Updated institutional ledger.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Institutional Governance Office • All India Institute of Ayurveda</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Administrative Command &amp; Compliance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Academic Dean: <strong className="text-foreground">{profile.fullName || 'Dr. Karthik Reddy'}</strong> • SIH26044 Ministry Oversight
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              downloadNIRFReportPDF();
              toast.success('NIRF & NAAC Accreditation Report PDF downloaded!');
            }}
          >
            <Download className="h-4 w-4 mr-1" /> Export NIRF Audit Report (PDF)
          </Button>
          <Button onClick={() => toast.info('Accreditation portal synced with Ministry of Ayush.')}>
            Sync National Ledger
          </Button>
        </div>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{metrics.totalStudents} Scholars</div>
            <p className="text-xs text-muted-foreground font-medium">Enrolled ({metrics.verifiedStudents} Verified)</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{metrics.partnerIndustries} Enterprise</div>
            <p className="text-xs text-muted-foreground font-medium">Active Partners ({metrics.totalMoUs} MoUs)</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{metrics.internshipFillRate}</div>
            <p className="text-xs text-muted-foreground font-medium">Internship Placement Rate</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{metrics.avgStipend}</div>
            <p className="text-xs text-muted-foreground font-medium">Average Monthly Stipend</p>
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Department Placement EChart (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6">
            <CardTitle className="text-lg">Departmental Placement &amp; Internship Rate (%)</CardTitle>
            <CardDescription>NIRF Academic Output metric across AIIA specialty departments</CardDescription>
            <div className="mt-4">
              <BarChart data={metrics.departmentPlacements} />
            </div>
          </Card>

          {/* Pending Verifications Queue */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <CardTitle className="text-lg">Pending Compliance Approvals</CardTitle>
                <CardDescription>Industry onboarding &amp; scholarship verification requests</CardDescription>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted">
                {verifications.length} Pending
              </span>
            </div>

            {verifications.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                All institutional verifications have been processed.
              </div>
            ) : (
              <div className="space-y-3">
                {verifications.map((item) => (
                  <div key={item.id} className="p-4 rounded-[var(--radius-md)] border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h5 className="font-semibold text-sm text-foreground">{item.name}</h5>
                      <p className="text-xs text-muted-foreground">{item.type} • {item.date}</p>
                    </div>

                    <Button size="sm" onClick={() => handleApprove(item.id, item.name)} className="min-h-[44px] text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Ratify &amp; Verify
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (5 cols): Sector breakdown & Fast Actions */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <CardTitle className="text-lg">Industry Partner Collaboration Mix</CardTitle>
            <CardDescription>Percentage distribution across healthcare sub-sectors</CardDescription>

            <div className="space-y-3 pt-2">
              {metrics.industrySectors.map((sec) => (
                <div key={sec.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{sec.name}</span>
                    <span className="font-mono font-bold text-primary">{sec.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${sec.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Institutional Compliance Card */}
          <Card className="p-6 space-y-3 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="h-4 w-4" /> NAAC / NIRF Audit Readiness: 98.4%
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All student internship contracts, stipend payments, and faculty mentorship logs meet statutory National Commission for Indian System of Medicine (NCISM) mandates.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
