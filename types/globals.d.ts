// Global type definitions for the project

declare global {
  interface Window {
    // Add any global window properties here
  }
}

// Supabase types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Utility types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

export interface PaginationOptions {
  page: number
  limit: number
}

export interface OrderStats {
  total: number
  pending: number
  completed: number
  cancelled: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url?: string
  bio?: string
  social_links?: Json
}

export {};