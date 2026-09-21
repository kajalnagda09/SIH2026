import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { type StudentProfile } from '@/lib/mockData';
import { Award, CheckCircle2, Plus, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export function StudentSkills() {
  const { user } = useAuth();
  const profile = (user?.profile || {}) as Partial<StudentProfile>;
  const [skills, setSkills] = useState(profile.skills || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(80);
  const [newSkillCategory, setNewSkillCategory] = useState<'technical' | 'domain' | 'soft'>('domain');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const newEntry = {
      name: newSkillName.trim(),
      level: Number(newSkillLevel),
      category: newSkillCategory,
    };
    setSkills([...skills, newEntry]);
    setShowAddModal(false);
    setNewSkillName('');
    toast.success(`Skill "${newEntry.name}" added to your verified profile.`);
  };

  const domainSkills = skills.filter((s) => s.category === 'domain');
  const technicalSkills = skills.filter((s) => s.category === 'technical');
  const softSkills = skills.filter((s) => s.category === 'soft');

  const SkillSection = ({ title, desc, list, iconColor }: { title: string; desc: string; list: typeof skills; iconColor: string }) => (
    <Card className="p-6 space-y-4">
      <div className="border-b border-border pb-3">
        <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>

      <div className="space-y-4">
        {list.map((sk) => (
          <div key={sk.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck className={`h-4 w-4 ${iconColor}`} />
                <span>{sk.name}</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-muted text-muted-foreground font-mono">
                  Verified
                </span>
              </div>
              <span className="font-mono font-bold text-primary">{sk.level}%</span>
            </div>

            {/* Proficiency progress bar */}
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${sk.level}%` }}
              />
            </div>

            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
              <UserCheck className="h-3 w-3 text-blue-500" />
              <span>Faculty Endorsement: Dr. Priyanshi Mehta (Dravyaguna Chair)</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
            <Award className="h-3.5 w-3.5" />
            <span>Curriculum &amp; Industry Alignment</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Verified Skill Competencies
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Standardized mapping adhering to National Ayush Morbidity and Standardized Terminologies.
          </p>
        </div>

        <Button onClick={() => setShowAddModal(true)} className="min-h-[44px]">
          <Plus className="h-4 w-4 mr-1" /> Add Competency
        </Button>
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardTitle>Add Verified Skill / Certification</CardTitle>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">Competency Name</label>
                <Input
                  placeholder="e.g. Rasashastra Bhasma Analysis"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">Category</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full h-11 rounded-[var(--radius-md)] border border-border bg-card px-3 text-sm"
                >
                  <option value="domain">Ayush &amp; Clinical Domain</option>
                  <option value="technical">Technical / Biostats / IT</option>
                  <option value="soft">Clinical Soft Skills</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-1">
                  Proficiency Level: {newSkillLevel}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Skill</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Skill Categories Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <SkillSection
          title="Ayush &amp; Clinical Domain"
          desc="Pharmacology, Dravyaguna, and Clinical Trial Protocols"
          list={domainSkills}
          iconColor="text-primary"
        />

        <SkillSection
          title="Technical &amp; Informatics"
          desc="Python, Biostatistics, and Formulation Data Architecture"
          list={technicalSkills}
          iconColor="text-blue-500"
        />

        <SkillSection
          title="Soft &amp; Patient Care"
          desc="Clinical Consultation, Ethics, and Governance"
          list={softSkills}
          iconColor="text-accent"
        />
      </div>
    </div>
  );
}
