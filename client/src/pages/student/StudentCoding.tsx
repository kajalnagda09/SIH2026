import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_CODING_PROBLEMS, type CodingProblem } from '@/lib/mockData';
import { executeCodeTests, type TestRunResult } from '@/lib/testRunner';
import {
  Code2, Play, CheckCircle2, XCircle, RotateCcw, Sparkles, Terminal,
  Flame, AlertTriangle, Check, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export function StudentCoding() {
  const [problems, setProblems] = useState<CodingProblem[]>(MOCK_CODING_PROBLEMS);
  const [selectedId, setSelectedId] = useState<string>(problems[0].id);
  const [code, setCode] = useState<string>(problems[0].starterCode);
  const [testResult, setTestResult] = useState<TestRunResult | null>(null);
  const [running, setRunning] = useState(false);

  const currentProblem = problems.find((p) => p.id === selectedId) || problems[0];

  const handleSelectProblem = (p: CodingProblem) => {
    setSelectedId(p.id);
    setCode(p.starterCode);
    setTestResult(null);
  };

  const handleRunTests = () => {
    setRunning(true);
    setTimeout(() => {
      const res = executeCodeTests(currentProblem.slug, code);
      setTestResult(res);
      setRunning(false);

      if (res.passed) {
        toast.success(`Passed ${res.passedTests}/${res.totalTests} tests in ${res.executionTimeMs}ms!`);
      } else {
        toast.error(`Tests failed: ${res.passedTests}/${res.totalTests} passed`);
      }
    }, 300);
  };

  const handleSubmit = () => {
    setRunning(true);
    setTimeout(() => {
      const res = executeCodeTests(currentProblem.slug, code);
      setTestResult(res);
      setRunning(false);

      if (res.passed) {
        setProblems((prev) =>
          prev.map((p) => (p.id === currentProblem.id ? { ...p, solved: true } : p))
        );
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        toast.success('Accepted! All test cases validated and solution verified on national ledger.');
      } else {
        toast.error('Submission rejected: Solution failed one or more test cases.');
      }
    }, 450);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-1">
            <Code2 className="h-3.5 w-3.5" />
            <span>Healthcare Algorithms &amp; Bio-Informatics Lab</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Coding Arena &amp; Test Suite
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real sandbox code execution engine testing computational formulation algorithms against live test vectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold">
            <Flame className="h-4 w-4" /> 5 Day Streak
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            {problems.filter((p) => p.solved).length} / {problems.length} Solved
          </div>
        </div>
      </div>

      {/* Problem Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {problems.map((prob) => (
          <button
            key={prob.id}
            onClick={() => handleSelectProblem(prob)}
            className={`flex items-center gap-2 text-xs px-3.5 py-2 rounded-[var(--radius-md)] border font-medium whitespace-nowrap transition-all ${
              prob.id === currentProblem.id
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-card text-muted-foreground border-border hover:bg-muted'
            }`}
          >
            {prob.solved && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
            <span>{prob.title}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                prob.difficulty === 'EASY'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {prob.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Split Workstation Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Problem Description (5 cols) */}
        <Card className="lg:col-span-5 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <CardTitle className="text-xl">{currentProblem.title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge status={currentProblem.difficulty} />
                {currentProblem.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
            {currentProblem.solved && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                Solved ✓
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p className="whitespace-pre-line text-foreground font-normal">
              {currentProblem.description}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="font-mono text-xs font-semibold text-foreground uppercase">
                Example Input / Output:
              </h4>
              {currentProblem.examples.map((ex, idx) => (
                <div key={idx} className="p-3 rounded-[var(--radius-sm)] bg-muted/60 border border-border/70 font-mono text-[11px] space-y-1">
                  <div>
                    <strong className="text-muted-foreground">Input:</strong>{' '}
                    <span className="text-foreground">{ex.input}</span>
                  </div>
                  <div>
                    <strong className="text-muted-foreground">Expected:</strong>{' '}
                    <span className="text-primary font-bold">{ex.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Code Editor & Test Runner (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-4 bg-slate-950 text-slate-100 border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-xs text-slate-300">solution.js (JavaScript Node 20)</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCode(currentProblem.starterCode);
                  setTestResult(null);
                }}
                className="text-xs text-slate-400 hover:text-white hover:bg-slate-800 h-8"
              >
                <RotateCcw className="h-3 w-3 mr-1" /> Reset Code
              </Button>
            </div>

            {/* Editor Area */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={13}
                className="w-full font-mono text-xs bg-transparent text-emerald-300 border-0 focus:outline-none resize-none leading-relaxed p-2"
                spellCheck={false}
              />
            </div>

            {/* Run / Submit buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Live sandbox validator tests your code in real time.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  loading={running}
                  onClick={handleRunTests}
                  className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 text-xs min-h-[44px]"
                >
                  <Play className="h-3.5 w-3.5 mr-1" /> Run Tests
                </Button>
                <Button
                  size="sm"
                  loading={running}
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs min-h-[44px]"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1" /> Submit Solution
                </Button>
              </div>
            </div>
          </Card>

          {/* Test Case Output Console */}
          {testResult && (
            <Card
              className={`p-5 font-mono text-xs space-y-3 border transition-all ${
                testResult.passed
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/20 border-red-500/40 text-red-200'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 border-current/20">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {testResult.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
                <span className="text-[10px] font-mono opacity-75">
                  Execution: {testResult.executionTimeMs}ms
                </span>
              </div>

              {testResult.results.length > 0 && (
                <div className="space-y-2 pt-1 text-[11px]">
                  {testResult.results.map((r) => (
                    <div
                      key={r.index}
                      className={`p-2.5 rounded-[var(--radius-sm)] border ${
                        r.passed
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-red-500/10 border-red-500/30 text-red-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          {r.passed ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                          Test Case #{r.index}: {r.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="mt-1 space-y-0.5 opacity-90 pl-5">
                        <div>
                          <strong>Input:</strong> {r.inputStr}
                        </div>
                        <div>
                          <strong>Expected:</strong> {r.expectedStr}
                        </div>
                        <div>
                          <strong>Your Output:</strong>{' '}
                          <span className={r.passed ? 'font-bold' : 'font-bold underline'}>
                            {r.actualStr}
                          </span>
                        </div>
                        {r.error && <div className="text-red-400 font-bold">Error: {r.error}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
