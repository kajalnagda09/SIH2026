export interface TestCase {
  input: any[];
  expected: any;
  description?: string;
}

export interface TestRunResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  executionTimeMs: number;
  message: string;
  results: {
    index: number;
    passed: boolean;
    inputStr: string;
    expectedStr: string;
    actualStr: string;
    error?: string;
  }[];
}

export const PROBLEM_TEST_CASES: Record<string, TestCase[]> = {
  'herbal-inventory-sum': [
    { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: 'Weights [2, 7, 11, 15] with Target 9' },
    { input: [[3, 2, 4], 6], expected: [1, 2], description: 'Weights [3, 2, 4] with Target 6' },
    { input: [[3, 3], 6], expected: [0, 1], description: 'Weights [3, 3] with Target 6' },
  ],
  'valid-prescription-brackets': [
    { input: ['{[()]}'], expected: true, description: 'Nested symmetric brackets {[()]}' },
    { input: ['([)]'], expected: false, description: 'Mismatched order ([)]' },
    { input: ['()[]{}'], expected: true, description: 'Sequential pairs ()[]{}' },
    { input: ['('], expected: false, description: 'Unclosed open bracket (' },
  ],
  'patient-queue-priority': [
    { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5, description: 'Triage scores [3, 2, 1, 5, 6, 4], k=2' },
    { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4, description: 'Triage scores [3, 2, 3, 1, 2, 4, 5, 5, 6], k=4' },
    { input: [[10, 20, 30], 1], expected: 30, description: 'Top priority patient' },
  ],
  'ayurvedic-palindrome': [
    { input: ['Naman'], expected: true, description: 'Palindrome name "Naman"' },
    { input: ['Ashvagandha'], expected: false, description: 'Non-palindrome "Ashvagandha"' },
    { input: ['Madam'], expected: true, description: 'Case-insensitive "Madam"' },
    { input: ['A man a plan a canal Panama'], expected: true, description: 'Phrase with spaces' },
  ],
  'binary-search-dosage': [
    { input: [[10, 25, 45, 80, 120, 200], 80], expected: 3, description: 'Target 80 at index 3' },
    { input: [[10, 25, 45, 80, 120, 200], 50], expected: -1, description: 'Target 50 missing (-1)' },
    { input: [[5, 15, 25], 5], expected: 0, description: 'Target 5 at index 0' },
  ],
};

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === 'object' && a !== null && b !== null) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

export function executeCodeTests(slug: string, userCode: string): TestRunResult {
  const testCases = PROBLEM_TEST_CASES[slug] || [];
  if (testCases.length === 0) {
    return {
      passed: true,
      totalTests: 0,
      passedTests: 0,
      executionTimeMs: 0,
      message: 'No test suite defined for this problem.',
      results: [],
    };
  }

  const startTime = performance.now();
  const results: TestRunResult['results'] = [];
  let passedCount = 0;

  let solveFn: (...args: any[]) => any;

  try {
    // Extract or evaluate function
    // Expect user function to be `function solve(...) { ... }`
    const evaluated = new Function(`
      ${userCode}
      if (typeof solve !== 'undefined') return solve;
      return null;
    `)();

    if (typeof evaluated !== 'function') {
      return {
        passed: false,
        totalTests: testCases.length,
        passedTests: 0,
        executionTimeMs: 0,
        message: 'Compilation Error: Please define a function named "solve(...)".',
        results: [],
      };
    }
    solveFn = evaluated;
  } catch (err: any) {
    return {
      passed: false,
      totalTests: testCases.length,
      passedTests: 0,
      executionTimeMs: 0,
      message: `Syntax/Runtime Error during initialization: ${err?.message || err}`,
      results: [],
    };
  }

  // Execute each test case
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const inputStr = tc.input.map((arg) => JSON.stringify(arg)).join(', ');
    const expectedStr = JSON.stringify(tc.expected);

    try {
      const clonedArgs = JSON.parse(JSON.stringify(tc.input));
      const actual = solveFn(...clonedArgs);
      const actualStr = JSON.stringify(actual);
      const isPassed = deepEqual(actual, tc.expected);

      if (isPassed) {
        passedCount++;
      }

      results.push({
        index: i + 1,
        passed: isPassed,
        inputStr,
        expectedStr,
        actualStr,
      });
    } catch (err: any) {
      results.push({
        index: i + 1,
        passed: false,
        inputStr,
        expectedStr,
        actualStr: 'ERROR',
        error: err?.message || String(err),
      });
    }
  }

  const endTime = performance.now();
  const duration = Math.round(endTime - startTime);
  const allPassed = passedCount === testCases.length;

  return {
    passed: allPassed,
    totalTests: testCases.length,
    passedTests: passedCount,
    executionTimeMs: duration,
    message: allPassed
      ? `All ${testCases.length}/${testCases.length} Test Cases Passed in ${duration}ms! 🚀`
      : `${passedCount}/${testCases.length} Test Cases Passed. ${testCases.length - passedCount} Failed.`,
    results,
  };
}
