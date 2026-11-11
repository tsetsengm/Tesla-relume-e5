import { model3 } from "./model-3";
import { isModelSlug, modelSlugs, type ModelSlug } from "./slugs";
import type { ModelDetail } from "./types";

const details: Record<ModelSlug, ModelDetail> = {
  "model-3": model3,
};

export { modelSlugs };

export function getModelDetail(slug: string): ModelDetail | undefined {
  return isModelSlug(slug) ? details[slug] : undefined;
}
