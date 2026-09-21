import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Briefcase, Plus, Users, Clock, CheckCircle2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { toast } from 'sonner';

export function IndustryInternships() {
  const [postings, setPostings] = useState([
    {
      id: 'post_1',
      title: 'Phytochemistry & Formulation Research Intern',
      department: 'Botanical Standardization Lab',
      stipend: 25000,
      openings: 4,
      applicants: 18,
      status: 'ACTIVE',
    },
    {
      id: 'post_2',
      title: 'Clinical Adjuvant Protocol Associate',
      department: 'Clinical Pharmacology Unit',
      stipend: 28000,
      openings: 2,
      applicants: 14,
      status: 'ACTIVE',
    },
    {
      id: 'post_3',
      title: 'Quality Assurance & Regulatory Affairs Intern',
      department: 'Regulatory Compliance Cell',
      stipend: 22000,
      openings: 3,
      applicants: 9,
      status: 'ACTIVE',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('');
  const [stipend, setStipend] = useState(25000);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setPostings([
      ...postings,
      {
        id: `post_${Date.now()}`,
        title,
        department: dept || 'Research Division',
        stipend: Number(stipend),
        openings: 2,
        applicants: 0,
        status: 'ACTIVE',
      },
    ]);
    setShowModal(false);
    setTitle('');
    toast.success('Internship opening published across AIIA student network.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Recruitment Portal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Manage Enterprise Internships
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Published clinical, laboratory, and technical trainee openings for academic scholars.
          </p>
        </div>

        <Button onClick={() => setShowModal(true)} className="min-h-[44px] bg-accent hover:bg-accent/90 text-white">
          <Plus className="h-4 w-4 mr-1" /> Create Internship
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardTitle>Post Internship Opening</CardTitle>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Role Title</label>
                <Input placeholder="e.g. Phytopharmacy Research Associate" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Department / Lab</label>
                <Input placeholder="e.g. Natural Product Chemistry Lab" value={dept} onChange={(e) => setDept(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Monthly Stipend (INR)</label>
                <Input type="number" value={stipend} onChange={(e) => setStipend(Number(e.target.value))} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit">Publish Opening</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {postings.map((p) => (
          <Card key={p.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">{p.title}</CardTitle>
              <p className="text-xs text-muted-foreground">{p.department}</p>
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                <span className="font-bold text-primary">{formatINR(p.stipend)} / mo</span>
                <span>•</span>
                <span>{p.openings} Openings</span>
                <span>•</span>
                <span className="text-accent font-semibold">{p.applicants} Applicants</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => toast.info(`Reviewing ${p.applicants} applicants.`)}>
                View Applicants
              </Button>
              <Button size="sm" onClick={() => toast.success('Listing refreshed on Setu national feed.')}>
                Manage
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
