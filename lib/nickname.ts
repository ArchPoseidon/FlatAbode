const ADJECTIVES = [
  'Cozy', 'Sunny', 'Breezy', 'Charming', 'Quiet', 'Leafy', 'Bright', 'Snug', 'Airy', 'Cheerful',
];
const NOUNS = ['Nest', 'Corner', 'Retreat', 'Haven', 'Hideaway', 'Den', 'Perch', 'Nook'];

// Deterministic per-listing nickname for manual entries (no LLM call), or as a
// fallback if extraction didn't produce one. Same seed always gives the same
// nickname, but different listings in the same locality still vary.
export function generateNickname(seed: string, locality: string | null): string {
  const base = locality || 'Bangalore';
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const adj = ADJECTIVES[hash % ADJECTIVES.length];
  const noun = NOUNS[Math.floor(hash / ADJECTIVES.length) % NOUNS.length];
  return `The ${adj} ${base} ${noun}`;
}
