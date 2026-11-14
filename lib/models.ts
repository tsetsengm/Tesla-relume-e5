import { cacheLife, cacheTag } from "next/cache";
import type { Model, ShowcaseMedia } from "@/data/models";
import { createSupabaseClient } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";

function toShowcaseMedia(row: Tables<"models">): ShowcaseMedia {
  if (row.showcase_media_type === "video") {
    return { type: "video", poster: row.showcase_video_poster ?? "", label: row.showcase_video_label ?? "" };
  }
  return { type: "image", src: row.showcase_image ?? "", alt: row.showcase_image_alt ?? "" };
}

function toModel(row: Tables<"models">): Model {
  return {
    slug: row.slug,
    name: row.name,
    detailHref: row.detail_href ?? undefined,
    card: { image: row.card_image, alt: row.card_alt, description: row.card_description },
    loan:
      row.loan_rate || row.lease_from
        ? { rate: row.loan_rate ?? undefined, leaseFrom: row.lease_from ?? undefined }
        : undefined,
    deposit: row.deposit_amount ?? undefined,
    showcase: {
      media: toShowcaseMedia(row),
      paragraphs: row.showcase_paragraphs,
      primaryAction: row.showcase_primary_action,
    },
  };
}

/**
 * Published models from the Supabase `models` table, ordered for display.
 * Cached with the `minutes` profile: edits in Supabase show up on the site within about a minute.
 */
export async function getModels(): Promise<Model[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("models");

  const { data, error } = await createSupabaseClient()
    .from("models")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load models from Supabase: ${error.message}`);
  return data.map(toModel);
}
