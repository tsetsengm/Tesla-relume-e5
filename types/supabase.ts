// Generated from the Supabase project "tsetsengm's test tesla" (iiryufozcwslwneebiyl).
// Regenerate after schema changes (Supabase MCP generate_typescript_types, or
// `npx supabase gen types typescript --project-id iiryufozcwslwneebiyl`).

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      models: {
        Row: {
          card_alt: string;
          card_description: string;
          card_image: string;
          created_at: string;
          deposit_amount: number | null;
          detail_href: string | null;
          id: number;
          is_published: boolean;
          lease_from: string | null;
          loan_rate: string | null;
          name: string;
          showcase_image: string | null;
          showcase_image_alt: string | null;
          showcase_media_type: string;
          showcase_paragraphs: string[];
          showcase_primary_action: string;
          showcase_video_label: string | null;
          showcase_video_poster: string | null;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          card_alt: string;
          card_description: string;
          card_image: string;
          created_at?: string;
          deposit_amount?: number | null;
          detail_href?: string | null;
          id?: never;
          is_published?: boolean;
          lease_from?: string | null;
          loan_rate?: string | null;
          name: string;
          showcase_image?: string | null;
          showcase_image_alt?: string | null;
          showcase_media_type: string;
          showcase_paragraphs?: string[];
          showcase_primary_action: string;
          showcase_video_label?: string | null;
          showcase_video_poster?: string | null;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          card_alt?: string;
          card_description?: string;
          card_image?: string;
          created_at?: string;
          deposit_amount?: number | null;
          detail_href?: string | null;
          id?: never;
          is_published?: boolean;
          lease_from?: string | null;
          loan_rate?: string | null;
          name?: string;
          showcase_image?: string | null;
          showcase_image_alt?: string | null;
          showcase_media_type?: string;
          showcase_paragraphs?: string[];
          showcase_primary_action?: string;
          showcase_video_label?: string | null;
          showcase_video_poster?: string | null;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          amount: number | null;
          byl_checkout_id: number | null;
          created_at: string;
          customer_email: string | null;
          customer_name: string | null;
          customer_phone: string | null;
          id: string;
          model_name: string;
          model_slug: string;
          note: string | null;
          paid_at: string | null;
          status: string;
          trim: string | null;
        };
        Insert: {
          amount: number | null;
          byl_checkout_id?: number | null;
          created_at?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          id?: string;
          model_name: string;
          model_slug: string;
          note: string | null;
          paid_at?: string | null;
          status?: string;
          trim?: string | null;
        };
        Update: {
          amount?: number | null;
          byl_checkout_id?: number | null;
          created_at?: string;
          customer_email?: string | null;
          customer_name?: string | null;
          customer_phone?: string | null;
          id?: string;
          model_name?: string;
          model_slug?: string;
          note?: string | null;
          paid_at?: string | null;
          status?: string;
          trim?: string | null;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
