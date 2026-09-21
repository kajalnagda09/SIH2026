import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { MOCK_INTERNSHIPS, type Internship } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import { Search, Briefcase, MapPin, Clock, CheckCircle2, Building2, Sparkles, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export function StudentInternships() {
  const [internships, setInternships] = useState<Internship[]>(MOCK_INTERNSHIPS);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const sectors = ['ALL', 'Ayurveda FMCG', 'Healthcare & Clinical Trials', 'IT & Digital Health', 'Biotechnology', 'HealthTech'];

  const filtered = internships.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.skillsRequired.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesSector = selectedSector === 'ALL' || item.sector.includes(selectedSector) || selectedSector.includes(item.sector);
    return matchesSearch && matchesSector;
  });

  const handleApply = (id: string, title: string) => {
    setInternships((prev) =>
      prev.map((item) => (item.id === id ? { ...item, applied: true, status: 'APPLIED' } : item))
    );
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    toast.success(`Application submitted for "${title}"! Verified AIIA dossier attached.`);
    setApplyingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
          <Briefcase className="h-3.5 w-3.5" />
          <span>Industry &amp; Research Postings</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Ayush &amp; Health Sciences Internships
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Curated clinical, R&amp;D, and bio-informatics openings from verified enterprise partners. Stipends compliant with national internship standards.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-3.5" />
          <Input
            placeholder="Search by role title, partner company, or required skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {sectors.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSelectedSector(sec)}
              className={`text-xs px-3 py-2 rounded-[var(--radius-md)] whitespace-nowrap transition-all border font-medium ${
                selectedSector === sec
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {sec === 'ALL' ? 'All Sectors' : sec}
            </button>
          ))}
        </div>
      </div>

      {/* Internships Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No internships match your filter"
          description="Try broadening your search query or selecting 'All Sectors'."
          actionLabel="Reset Filters"
          onAction={() => { setSearch(''); setSelectedSector('ALL'); }}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className={`p-6 flex flex-col justify-between transition-all ${
                item.applied ? 'border-primary/40 bg-primary/[0.02]' : 'hover:border-primary/40'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
                      {item.sector}
                    </span>
                    <CardTitle className="text-xl mt-0.5">{item.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-medium">
                      <Building2 className="h-3.5 w-3.5 text-foreground" />
                      <span className="text-foreground">{item.company}</span>
                      <span>•</span>
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{item.city}</span>
                    </div>
                  </div>

                  {item.applied ? (
                    <Badge status={item.status || 'APPLIED'} />
                  ) : (
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-muted text-foreground border border-border">
                      {item.openings} Openings
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {/* Skills tags */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-muted-foreground font-medium">Required Competencies:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.skillsRequired.map((sk) => (
                      <span
                        key={sk}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-muted text-foreground border border-border/80 font-mono"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom footer: stipend + CTA */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold font-mono text-primary">
                    {formatINR(item.stipend)}
                    <span className="text-xs font-normal text-muted-foreground"> / month</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Duration: {item.duration} • Apply by {item.deadline}
                  </div>
                </div>

                <div>
                  {item.applied ? (
                    <Button variant="secondary" size="sm" disabled className="text-xs font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-primary" /> Application Active
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleApply(item.id, item.title)}
                      className="text-xs min-h-[44px]"
                    >
                      Apply with Profile
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
