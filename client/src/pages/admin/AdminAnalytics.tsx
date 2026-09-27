import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart } from '@/components/charts/BarChart';
import { FunnelChart } from '@/components/charts/FunnelChart';
import { MOCK_ADMIN_METRICS } from '@/lib/mockData';
import { downloadAdminAnalyticsCSV } from '@/lib/pdfExport';
import { BarChart3, Download, TrendingUp, ShieldCheck, Award } from 'lucide-react';
import { toast } from 'sonner';

export function AdminAnalytics() {
  const metrics = MOCK_ADMIN_METRICS;

  const handleExportDataset = () => {
    downloadAdminAnalyticsCSV();
    toast.success('Official institutional accreditation dataset exported as CSV!');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Institutional Data Intelligence</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            NIRF &amp; NAAC Metric Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Academic-industry research metrics, placement conversion ratios, and skill gap benchmarks.
          </p>
        </div>

        <Button onClick={handleExportDataset} className="min-h-[44px]">
          <Download className="h-4 w-4 mr-1" /> Export Audit Dataset (CSV)
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardTitle className="text-lg">Departmental Placement Conversion (%)</CardTitle>
          <CardDescription>Percentage of scholars with verified clinical or research postings</CardDescription>
          <div className="mt-4">
            <BarChart data={metrics.departmentPlacements} />
          </div>
        </Card>

        <Card className="p-6">
          <CardTitle className="text-lg">Setu Talent Pipeline Funnel</CardTitle>
          <CardDescription>Across 184 total applications to partner enterprises</CardDescription>
          <div className="mt-4">
            <FunnelChart data={metrics.funnelStages} />
          </div>
        </Card>
      </div>

      {/* Skill Gap Analysis Table */}
      <Card className="p-6 space-y-4">
        <CardTitle className="text-lg">Ayush Industry Skill Gap Index</CardTitle>
        <CardDescription>Comparison between industry demand and scholar assessment benchmarks</CardDescription>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted text-muted-foreground uppercase font-mono border-b border-border">
              <tr>
                <th className="p-3">Competency Area</th>
                <th className="p-3">Industry Demand Index</th>
                <th className="p-3">Scholar Proficiency Avg</th>
                <th className="p-3">Curricular Gap Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-semibold">High-Performance Thin-Layer Chromatography (HPTLC)</td>
                <td className="p-3 font-mono font-bold text-foreground">94%</td>
                <td className="p-3 font-mono text-primary">89%</td>
                <td className="p-3 text-emerald-600 font-semibold">Optimal Alignment ✓</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Good Clinical Practice (GCP-ICH E6 R2)</td>
                <td className="p-3 font-mono font-bold text-foreground">91%</td>
                <td className="p-3 font-mono text-primary">86%</td>
                <td className="p-3 text-emerald-600 font-semibold">Optimal Alignment ✓</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Healthcare Informatics &amp; Python Biostatistics</td>
                <td className="p-3 font-mono font-bold text-foreground">85%</td>
                <td className="p-3 font-mono text-amber-600">68%</td>
                <td className="p-3 text-amber-600 font-semibold">Bridge Cohort Recommended</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Pharmacovigilance &amp; WHO-GMP Regulatory Dossiers</td>
                <td className="p-3 font-mono font-bold text-foreground">88%</td>
                <td className="p-3 font-mono text-primary">82%</td>
                <td className="p-3 text-emerald-600 font-semibold">Optimal Alignment ✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
