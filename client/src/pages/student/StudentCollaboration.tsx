import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Handshake, User, Building2, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function StudentCollaboration() {
  const [requested, setRequested] = useState(false);
  const [proposal, setProposal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal) return;
    setRequested(true);
    toast.success('Mentorship & research proposal submitted to Dr. Priyanshi Mehta.');
    setProposal('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
          <Handshake className="h-3.5 w-3.5" />
          <span>Cross-Disciplinary R&amp;D Mentorship</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Faculty Collaboration &amp; Research Labs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect directly with accredited faculty guides for clinical thesis guidance and industry-funded R&amp;D.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 space-y-5">
          <CardTitle className="text-xl">Propose a Research Initiative or Thesis Mentorship</CardTitle>
          <CardDescription>
            Selected proposals are reviewed under AIIA Institutional Research Ethics guidelines.
          </CardDescription>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Assigned Faculty Guide</label>
              <Input value="Dr. Priyanshi Mehta (Associate Professor, Dravyaguna Vigyan)" disabled />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Research Domain / Topic</label>
              <Input placeholder="e.g. Standardizing Polyherbal Formulation for Glycemic Control" required />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Abstract &amp; Proposed Methodology</label>
              <textarea
                rows={4}
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                placeholder="Describe your research question, classical reference (Charaka/Sushruta), and proposed analytical assays..."
                className="w-full rounded-[var(--radius-md)] border border-border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
                required
              />
            </div>

            <Button type="submit" className="min-h-[44px]">
              <Send className="h-4 w-4 mr-1" /> Submit Proposal for Faculty Review
            </Button>
          </form>

          {requested && (
            <div className="p-4 rounded-[var(--radius-md)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Proposal #PR-2026-081 logged into AIIA Academic Review Queue.</span>
            </div>
          )}
        </Card>

        {/* Faculty Guide Profile Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-lg">
              PM
            </div>
            <div>
              <h4 className="font-semibold text-sm">Dr. Priyanshi Mehta</h4>
              <p className="text-xs text-muted-foreground">Chair of Dravyaguna Vigyan</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground pt-2 border-t border-border">
            <p><strong>Specialization:</strong> Medicinal Plant Standardization, Chromatography, Herbal Pharmacopoeia</p>
            <p><strong>Active Mentees:</strong> 18 Scholars</p>
            <p><strong>Sponsored Projects:</strong> 6 Active Industry Grants (Dabur, Himalaya)</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
