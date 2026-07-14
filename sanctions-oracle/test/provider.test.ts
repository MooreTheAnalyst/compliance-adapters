import { SanctionsProvider } from '../src/SanctionsProvider';
import { MockSanctionsProvider, MOCK_FLAGGED_ADDRESSES } from '../src/mockProvider';

const KNOWN_FLAGGED_ADDRESS = Object.keys(MOCK_FLAGGED_ADDRESSES)[0];
const KNOWN_UNFLAGGED_ADDRESS = 'GDNOTPRESENTINANYMOCKWATCHLISTAAAAAAAAAAAAAAAAAAAAAAAAAA';

async function assertConformsToSanctionsProvider(provider: SanctionsProvider): Promise<void> {
  const flaggedResult = await provider.checkAddress(KNOWN_FLAGGED_ADDRESS);
  expect(typeof flaggedResult.flagged).toBe('boolean');
  expect(typeof flaggedResult.source).toBe('string');
  expect(flaggedResult.source.length).toBeGreaterThan(0);

  const unflaggedResult = await provider.checkAddress(KNOWN_UNFLAGGED_ADDRESS);
  expect(typeof unflaggedResult.flagged).toBe('boolean');
  expect(typeof unflaggedResult.source).toBe('string');
  expect(unflaggedResult.source.length).toBeGreaterThan(0);
}

describe('SanctionsProvider interface conformance', () => {
  it('MockSanctionsProvider conforms to the SanctionsProvider shape', async () => {
    await assertConformsToSanctionsProvider(new MockSanctionsProvider());
  });
});

describe('MockSanctionsProvider', () => {
  it('flags a known mock-watchlist address', async () => {
    const provider = new MockSanctionsProvider();
    const result = await provider.checkAddress(KNOWN_FLAGGED_ADDRESS);
    expect(result.flagged).toBe(true);
    expect(result.source).toBe(MOCK_FLAGGED_ADDRESSES[KNOWN_FLAGGED_ADDRESS]);
  });

  it('does not flag an address absent from the mock watchlist', async () => {
    const provider = new MockSanctionsProvider();
    const result = await provider.checkAddress(KNOWN_UNFLAGGED_ADDRESS);
    expect(result.flagged).toBe(false);
    expect(result.source).toBe('mock-watchlist-v1');
  });
});
