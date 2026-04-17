import type { Recipe } from '@/types/recipe'

type Difficulty = Recipe['difficulty']

/**
 * Tailwind background + text classes for each difficulty badge.
 * Typed against `Recipe['difficulty']` so adding a new union member
 * without updating this map is a compile error.
 */
export const difficultyTextClass: Record<Difficulty, string> = {
  Easy: 'bg-ground-b text-white',
  Medium: 'bg-alternate-b text-white',
  Intermediate: 'bg-alternate-a-400 text-white',
  Hard: 'bg-accent-400 text-white',
}

/**
 * Hex colors matching the backend's brand palette, used by chart libraries
 * (Chart.js) that need raw color strings rather than CSS classes.
 */
export const difficultyHex: Record<Difficulty, string> = {
  Easy: '#c0a659',
  Medium: '#a9c57c',
  Intermediate: '#6fc3aa',
  Hard: '#f37f20',
}

/**
 * Fallback hex for unexpected labels from the backend (defensive — the
 * chart data uses `Record<string, number>` so TypeScript can't guarantee
 * every key is a known difficulty).
 */
export const difficultyHexFallback = '#d7b25b'
