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
 */

// Placeholder types - will be replaced after running database migration
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
