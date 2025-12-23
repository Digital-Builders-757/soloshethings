/**
 * Supabase Database Types
 *
 * GENERATED FILE - DO NOT EDIT MANUALLY
 *
 * This file is auto-generated from the Supabase database schema.
 *
 * To regenerate:
 * supabase gen types typescript --local > types/database.ts
 *
 * Reference: docs/database_schema_audit.md
 *
 * NOTE: This is a manually created types file based on the migration.
 * For production, regenerate from actual database using:
 * supabase gen types typescript --local > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type user_role = 'talent' | 'client'
export type privacy_level = 'public' | 'limited' | 'private'
export type subscription_status = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'
export type post_status = 'draft' | 'published' | 'archived' | 'removed'
export type report_reason = 'spam' | 'harassment' | 'inappropriate' | 'copyright' | 'other'
export type report_status = 'pending' | 'reviewed' | 'resolved' | 'dismissed'
export type event_status = 'draft' | 'published' | 'cancelled' | 'completed'
export type saved_post_type = 'wordpress' | 'community'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          role: user_role
          privacy_level: privacy_level
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: user_role
          privacy_level?: privacy_level
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: user_role
          privacy_level?: privacy_level
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status: subscription_status
          trial_start: string | null
          trial_end: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          status: subscription_status
          trial_start?: string | null
          trial_end?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          status?: subscription_status
          trial_start?: string | null
          trial_end?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      community_posts: {
        Row: {
          id: string
          author_id: string
          title: string
          content: string
          is_public: boolean
          is_featured: boolean
          status: post_status
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          content: string
          is_public?: boolean
          is_featured?: boolean
          status?: post_status
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          content?: string
          is_public?: boolean
          is_featured?: boolean
          status?: post_status
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      post_images: {
        Row: {
          id: string
          post_id: string
          image_url: string
          storage_path: string
          alt_text: string | null
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          image_url: string
          storage_path: string
          alt_text?: string | null
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          image_url?: string
          storage_path?: string
          alt_text?: string | null
          order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_images_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_posts: {
        Row: {
          id: string
          user_id: string
          post_type: saved_post_type
          wp_post_slug: string | null
          community_post_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_type: saved_post_type
          wp_post_slug?: string | null
          community_post_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_type?: saved_post_type
          wp_post_slug?: string | null
          community_post_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_posts_community_post_id_fkey"
            columns: ["community_post_id"]
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          post_id: string | null
          profile_id: string | null
          reason: report_reason
          description: string | null
          status: report_status
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          post_id?: string | null
          profile_id?: string | null
          reason: report_reason
          description?: string | null
          status?: report_status
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          post_id?: string | null
          profile_id?: string | null
          reason?: report_reason
          description?: string | null
          status?: report_status
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          location: string | null
          max_attendees: number | null
          created_by: string
          status: event_status
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          location?: string | null
          max_attendees?: number | null
          created_by: string
          status?: event_status
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          location?: string | null
          max_attendees?: number | null
          created_by?: string
          status?: event_status
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          read_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: user_role
      privacy_level: privacy_level
      subscription_status: subscription_status
      post_status: post_status
      report_reason: report_reason
      report_status: report_status
      event_status: event_status
      saved_post_type: saved_post_type
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
