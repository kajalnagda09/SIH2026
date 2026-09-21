import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Briefcase, Plus, Building2, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function FacultyOpportunities() {
  const [opportunities, setOpportunities] = useState([
    {
      id: 'opp_1',
      title: 'Botanical Marker Fingerprinting Research Fellowship',
      partner: 'Dabur R&D Lab',
      stipend: '₹25,000 / mo',
      slots: 2,
      duration: '6 Months',
      applicants: 8,
    },
    {
      id: 'opp_2',
      title: 'Clinical Adjuvant Protocol Study (Integrative Oncology)',
      partner: 'Apollo Hospitals & AIIA',
      stipend: '₹28,000 / mo',
      slots: 1,
      duration: '4 Months',
      applicants: 12,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [partner, setPartner] = useState('');
  const [stipend, setStipend] = useState('₹25,000 / mo');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !partner) return;
    setOpportunities([
      ...opportunities,
      {
        id: `opp_${Date.now()}`,
        title,
        partner,
        stipend,
        slots: 2,
        duration: '6 Months',
        applicants: 0,
      },
    ]);
    setShowModal(false);
    setTitle('');
    setPartner('');
    toast.success('Research opportunity posted and broadcast to verified student scholars.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider mb-1">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Faculty Research Postings</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Research Opportunities &amp; Fellowships
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Post co-sponsored laboratory internships and thesis assistantships for undergraduate and MD scholars.
          </p>
        </div>

        <Button onClick={() => setShowModal(true)} className="min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-1" /> Post New Opening
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardTitle>Create Faculty Research Opportunity</CardTitle>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Project Title</label>
                <Input placeholder="e.g. In-vitro Cytotoxicity of Haritaki Extracts" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Partner Enterprise / Lab</label>
                <Input placeholder="e.g. Himalaya Wellness or AIIA Research Lab" value={partner} onChange={(e) => setPartner(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Monthly Stipend</label>
                <Input value={stipend} onChange={(e) => setStipend(e.target.value)} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Publish Opening</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {opportunities.map((opp) => (
          <Card key={opp.id} className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{opp.title}</CardTitle>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                <span>{opp.partner}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-2">
                <span>Slots: {opp.slots}</span>
                <span>•</span>
                <span>Duration: {opp.duration}</span>
                <span>•</span>
                <span className="font-bold text-primary">{opp.stipend}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                {opp.applicants} Student Applicants
              </span>
              <Button size="sm" variant="secondary" onClick={() => toast.info(`Reviewing ${opp.applicants} applicants.`)}>
                Review Dossiers
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
