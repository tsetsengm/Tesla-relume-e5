import type { NextConfig } from "next";

// Images uploaded from /admin live in the public Supabase Storage bucket "model-images".
const supabaseUrl = process.env.SUPABASE_URL ?? "https://iiryufozcwslwneebiyl.supabase.co";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [new URL(`${supabaseUrl}/storage/v1/object/public/model-images/**`)],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
