export interface TestCase {
  input: unknown;
  expected: unknown;
}

export interface TestResult {
  passed: boolean;
  input: unknown;
  expected: unknown;
  actual: unknown;
  error?: string;
}

export function runCodeAgainstTests(
  code: string,
  testCases: TestCase[]
): { passed: boolean; results: TestResult[]; runtimeMs: number } {
  const start = Date.now();
  const results: TestResult[] = [];
  let allPassed = true;

  let fn: (input: unknown) => unknown;
  try {
    // eslint-disable-next-line no-new-func
    fn = new Function('input', `${code}\nreturn typeof solve === 'function' ? solve(input) : null;`) as (
      input: unknown
    ) => unknown;
  } catch (e) {
    return {
      passed: false,
      runtimeMs: Date.now() - start,
      results: [{ passed: false, input: null, expected: null, actual: null, error: String(e) }],
    };
  }

  for (const tc of testCases) {
    try {
      const actual = fn(tc.input);
      const passed = JSON.stringify(actual) === JSON.stringify(tc.expected);
      if (!passed) allPassed = false;
      results.push({ passed, input: tc.input, expected: tc.expected, actual });
    } catch (e) {
      allPassed = false;
      results.push({
        passed: false,
        input: tc.input,
        expected: tc.expected,
        actual: null,
        error: String(e),
      });
    }
  }

  return { passed: allPassed, results, runtimeMs: Date.now() - start };
}
