/**
 * Slugs that have a detail page. Kept dependency-free so proxy.ts can import it cheaply.
 * Adding a slug here without a matching entry in ./index.ts is a type error.
 */
export const modelSlugs = ["model-3"] as const;

export type ModelSlug = (typeof modelSlugs)[number];

export function isModelSlug(slug: string): slug is ModelSlug {
  return (modelSlugs as readonly string[]).includes(slug);
}
