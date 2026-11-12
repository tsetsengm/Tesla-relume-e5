/** Supabase Storage bucket for images uploaded from /admin (public, admin-only writes). */
export const MODEL_IMAGES_BUCKET = "model-images";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // matches the bucket's file_size_limit

/** Public URL prefix for uploaded images, e.g. https://<ref>.supabase.co/storage/v1/object/public/model-images/ */
export function storagePrefix(supabaseUrl: string) {
  return `${supabaseUrl}/storage/v1/object/public/${MODEL_IMAGES_BUCKET}/`;
}

/** Only images next/image is configured to serve: local /assets files or our bucket. */
export function isAllowedImageSrc(src: string, supabaseUrl: string) {
  return src.startsWith("/assets/") || src.startsWith(storagePrefix(supabaseUrl));
}
