/**
 * Implement this interface to plug an external sanctions/watchlist data
 * source into the denylist-gate sync flow (see `sync.ts`).
 *
 * `sync.ts` only depends on this shape, so any provider — a REST client
 * for a commercial watchlist API, a local CSV loader, a cache in front of
 * multiple upstream lists, etc. — can be swapped in without touching the
 * sync logic itself.
 *
 * @example
 * ```ts
 * class MyProvider implements SanctionsProvider {
 *   async checkAddress(address: string) {
 *     const flagged = await myWatchlistApi.lookup(address);
 *     return { flagged: Boolean(flagged), source: 'my-watchlist-api' };
 *   }
 * }
 * ```
 */
export interface SanctionsProvider {
  checkAddress(address: string): Promise<{ flagged: boolean; source: string }>;
}
