/**
 * Deterministic seeding for the art resolvers: the same seed always picks the same real-art entry
 * (stable stories, stable visual tests, stable SSR markup). Nothing in examples/art may call
 * Math.random.
 */
export type Seed = number | string;

/** FNV-1a over `salt:seed`, finished with a murmur3-style avalanche. Returns an unsigned 32-bit int. */
export function hashSeed(seed: Seed, salt = ''): number {
  const s = `${salt}:${seed}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}
