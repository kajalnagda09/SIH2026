import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_ASSESSMENTS, type Assessment } from '@/lib/mockData';
import { BookOpen, Award, CheckCircle2, Clock, Play, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export function StudentAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>(MOCK_ASSESSMENTS);
  const [activeTest, setActiveTest] = useState<Assessment | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [testResult, setTestResult] = useState<{ score: number; passed: boolean } | null>(null);

  const handleStart = (test: Assessment) => {
    setActiveTest(test);
    setSelectedAnswers({});
    setTestResult(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;
    let correct = 0;
    activeTest.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const percentage = Math.round((correct / activeTest.questions.length) * 100);
    const passed = percentage >= activeTest.passingScore;

    setTestResult({ score: percentage, passed });
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === activeTest.id
          ? { ...a, status: passed ? 'PASSED' : 'FAILED', userScore: percentage }
          : a
      )
    );

    if (passed) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      toast.success(`Passed with ${percentage}%! Verified credential badge issued.`);
    } else {
      toast.error(`Score: ${percentage}%. You need ${activeTest.passingScore}% to pass.`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Institutional Competency Verification</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Skill Assessments &amp; Diagnostic Tests
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Standardized clinical pharmacology, regulatory ethics, and healthcare informatics benchmarks vetted by AIIA Academic Council.
        </p>
      </div>

      {/* If Active Test in progress */}
      {activeTest ? (
        <Card className="p-6 sm:p-8 space-y-6 border-primary/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono uppercase font-semibold text-primary">
                {activeTest.category} Assessment
              </span>
              <CardTitle className="text-2xl mt-1">{activeTest.title}</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {activeTest.durationMinutes} Minutes
              </span>
              <Button variant="ghost" size="sm" onClick={() => setActiveTest(null)} className="text-xs">
                Exit Assessment
              </Button>
            </div>
          </div>

          {/* Result view if submitted */}
          {testResult ? (
            <div className={`p-6 rounded-[var(--radius-lg)] text-center space-y-4 border ${
              testResult.passed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200' : 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200'
            }`}>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-card shadow-sm mx-auto">
                <Award className={`h-8 w-8 ${testResult.passed ? 'text-emerald-600' : 'text-red-600'}`} />
              </div>
              <h3 className="font-display text-3xl font-bold">
                {testResult.passed ? 'Assessment Successfully Passed!' : 'Assessment Not Cleared'}
              </h3>
              <p className="text-sm">
                Your Score: <strong className="font-mono text-lg">{testResult.score}%</strong> (Passing Benchmark: {activeTest.passingScore}%)
              </p>
              <div className="pt-2">
                <Button onClick={() => setActiveTest(null)} className="min-h-[44px]">
                  Return to Assessment Roster
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTest.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-[var(--radius-md)] border border-border bg-card space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                      Q{idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-foreground leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-[var(--radius-sm)] text-left text-xs font-medium border transition-all ${
                          selectedAnswers[q.id] === optIdx
                            ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                            : 'bg-muted/40 text-foreground border-border hover:bg-muted'
                        }`}
                      >
                        <span className="font-mono mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  Answered: {Object.keys(selectedAnswers).length} / {activeTest.questions.length} Questions
                </span>
                <Button onClick={handleSubmitTest} className="min-h-[44px]">
                  Submit Test for Evaluation
                </Button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        /* List of Assessments */
        <div className="grid md:grid-cols-3 gap-6">
          {assessments.map((item) => (
            <Card key={item.id} className="p-6 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase font-semibold text-primary">
                    {item.category}
                  </span>
                  <Badge status={item.status} />
                </div>

                <CardTitle className="text-xl leading-snug">{item.title}</CardTitle>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span className="font-mono text-foreground">{item.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Questions:</span>
                    <span className="font-mono text-foreground">{item.totalQuestions} Multiple Choice</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Passing Standard:</span>
                    <span className="font-mono text-foreground">{item.passingScore}%</span>
                  </div>
                  {item.userScore !== undefined && (
                    <div className="flex items-center justify-between font-bold text-primary pt-1 border-t border-border">
                      <span>Highest Score:</span>
                      <span className="font-mono">{item.userScore}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                {item.status === 'PASSED' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-semibold"
                    onClick={() => handleStart(item)}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" /> Retake Test
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full text-xs font-semibold min-h-[44px]"
                    onClick={() => handleStart(item)}
                  >
                    <Play className="h-3.5 w-3.5 mr-1" /> Start Assessment
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
