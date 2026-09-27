import { useState } from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_CODING_PROBLEMS, type CodingProblem } from '@/lib/mockData';
import { executeCodeTests, type TestRunResult } from '@/lib/testRunner';
import { useAuth } from '@/context/AuthContext';
import { realtimeDb } from '@/lib/realtimeDb';
import {
  Code2, Play, CheckCircle2, XCircle, RotateCcw, Sparkles, Terminal,
  Flame, AlertTriangle, Check, X, Bug, Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

const SAMPLE_SOLUTIONS: Record<string, string> = {
  'herbal-inventory-sum': `function solve(weights, target) {
  // Map values to index
  const seen = new Map();
  for (let i = 0; i < weights.length; i++) {
    const complement = target - weights[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(weights[i], i);
  }
  return [];
}`,
  'valid-prescription-brackets': `function solve(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  
  for (const char of s.trim()) {
    if (['(', '[', '{'].includes(char)) {
      stack.push(char);
    } else if ([')', ']', '}'].includes(char)) {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
  'patient-queue-priority': `function solve(scores, k) {
  scores.sort((a, b) => b - a);
  return scores[k - 1];
}`,
  'ayurvedic-palindrome': `function solve(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
  'binary-search-dosage': `function solve(concentrations, target) {
  let low = 0;
  let high = concentrations.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (concentrations[mid] === target) return mid;
    if (concentrations[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
};

const STARTER_TEMPLATES: Record<string, string> = {
  'herbal-inventory-sum': `/**
 * Ayurvedic Formulation Inventory Sum
 * @param {number[]} weights - Herb batch weights in kg
 * @param {number} target - Required formulation target weight
 * @return {number[]} - Indices of the two batches
 */
function solve(weights, target) {
  // Write your solution here:
  // If your code has syntax/logical errors, test cases will FAIL.
  // When your solution is correct, all test cases will PASS!
  
}
`,
  'valid-prescription-brackets': `/**
 * Valid Prescription Brackets
 * @param {string} s - Nested prescription tier string
 * @return {boolean} - True if brackets are balanced, false otherwise
 */
function solve(s) {
  // Define bracket validator
  
}
`,
  'patient-queue-priority': `/**
 * Patient Queue Priority Triage
 * @param {number[]} scores - Emergency triage scores
 * @param {number} k - Rank priority to locate
 * @return {number} - The k-th highest triage score
 */
function solve(scores, k) {
  // Return the k-th highest urgency score
  
}
`,
  'ayurvedic-palindrome': `/**
 * Ayurvedic Compound Palindrome Validator
 * @param {string} s - Botanical formulation name
 * @return {boolean} - True if symmetrical
 */
function solve(s) {
  // Validate alphanumeric case-insensitive symmetry
  
}
`,
  'binary-search-dosage': `/**
 * Binary Search Drug Concentration
 * @param {number[]} concentrations - Sorted extract concentrations
 * @param {number} target - Target dosage to search
 * @return {number} - Index or -1 if missing
 */
function solve(concentrations, target) {
  // Implement logarithmic binary search
  
}
`,
};

export function StudentCoding() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<CodingProblem[]>(() =>
    MOCK_CODING_PROBLEMS.map((p) => ({
      ...p,
      starterCode: STARTER_TEMPLATES[p.slug] || p.starterCode,
    }))
  );
  const [selectedId, setSelectedId] = useState<string>(problems[0].id);
  const [code, setCode] = useState<string>(problems[0].starterCode);
  const [testResult, setTestResult] = useState<TestRunResult | null>(null);
  const [running, setRunning] = useState(false);

  const currentProblem = problems.find((p) => p.id === selectedId) || problems[0];

  const handleSelectProblem = (p: CodingProblem) => {
    setSelectedId(p.id);
    setCode(STARTER_TEMPLATES[p.slug] || p.starterCode);
    setTestResult(null);
  };

  const handleRunTests = () => {
    setRunning(true);
    setTimeout(() => {
      const res = executeCodeTests(currentProblem.slug, code);
      setTestResult(res);
      setRunning(false);

      if (res.passed) {
        toast.success(`Passed ${res.passedTests}/${res.totalTests} tests in ${res.executionTimeMs}ms! 🚀`);
      } else {
        toast.error(`Tests failed: ${res.passedTests}/${res.totalTests} passed.`);
      }
    }, 250);
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
        // Automatically complete task 2 in the realtime database!
        if (user?.id) {
          realtimeDb.markTaskComplete(user.id, 'task_02');
        }
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        toast.success('Accepted! All test cases validated and solution verified on national ledger.');
      } else {
        toast.error('Submission rejected: Solution failed one or more test cases. Review error diff below.');
      }
    }, 350);
  };

  const handleLoadSolution = () => {
    const sol = SAMPLE_SOLUTIONS[currentProblem.slug];
    if (sol) {
      setCode(sol);
      setTestResult(null);
      toast.info('Loaded optimal reference solution. Click "Run Tests" to execute against live vectors.');
    }
  };

  const handleInjectError = () => {
    setCode(`function solve(...) {\n  // Intentionally invalid return value to test error handling\n  return "INVALID_OUTPUT_VECTOR";\n}`);
    setTestResult(null);
    toast.warning('Injected error case. Click "Run Tests" to verify that test runner fails gracefully!');
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
                Example Input / Output Vectors:
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
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-xs text-slate-300">solution.js (JavaScript Node 20 Sandbox)</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoadSolution}
                  className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 h-8"
                  title="Load reference working solution"
                >
                  <Lightbulb className="h-3 w-3 mr-1" /> Load Solution
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleInjectError}
                  className="text-xs text-amber-400 hover:text-amber-300 hover:bg-slate-800 h-8"
                  title="Test failure case"
                >
                  <Bug className="h-3 w-3 mr-1" /> Test Error
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCode(STARTER_TEMPLATES[currentProblem.slug] || currentProblem.starterCode);
                    setTestResult(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white hover:bg-slate-800 h-8"
                >
                  <RotateCcw className="h-3 w-3 mr-1" /> Reset
                </Button>
              </div>
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
                Sandbox evaluates syntax, edge cases, and runtime performance.
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
