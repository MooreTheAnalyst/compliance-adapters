import { computeBackoffDelayMs } from '../src/backoff';

describe('computeBackoffDelayMs', () => {
  it('grows exponentially with the attempt number when jitter is disabled', () => {
    const delays = [0, 1, 2, 3, 4].map((attempt) =>
      computeBackoffDelayMs(attempt, { jitter: false }),
    );

    expect(delays).toEqual([500, 1000, 2000, 4000, 8000]);
  });

  it('caps the delay at maxMs', () => {
    const delay = computeBackoffDelayMs(10, { jitter: false, maxMs: 30000 });
    expect(delay).toBe(30000);
  });

  it('respects a custom baseMs', () => {
    const delay = computeBackoffDelayMs(2, { jitter: false, baseMs: 100 });
    expect(delay).toBe(400);
  });

  it('is deterministic when a fixed randomFn is injected', () => {
    const delay = computeBackoffDelayMs(1, { randomFn: () => 0.5 });
    // uncapped = 500 * 2^1 = 1000, jitter factor = 0.5 + 0.5*0.5 = 0.75
    expect(delay).toBe(750);
  });

  it('applies jitter within the documented [0.5, 1) range of the capped value', () => {
    const first = computeBackoffDelayMs(3, { randomFn: Math.random });
    const second = computeBackoffDelayMs(3, { randomFn: Math.random });

    const cappedValue = 500 * 2 ** 3;

    for (const delay of [first, second]) {
      expect(delay).toBeGreaterThanOrEqual(cappedValue * 0.5);
      expect(delay).toBeLessThan(cappedValue);
    }
  });
});
