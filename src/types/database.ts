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
      user_profiles: {
        Row: {
          id: string
          user_id: string
          big_five_scores: Json
          personality_type: string | null
          mental_health_history: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          big_five_scores?: Json
          personality_type?: string | null
          mental_health_history?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          big_five_scores?: Json
          personality_type?: string | null
          mental_health_history?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      journals: {
        Row: {
          id: string
          user_id: string
          content: string
          mood_score: number
          mood_tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          mood_score: number
          mood_tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          mood_score?: number
          mood_tags?: string[] | null
          created_at?: string
        }
      }
      diagnoses: {
        Row: {
          id: string
          user_id: string
          journal_id: string | null
          analysis: Json
          dsm5_codes: string[] | null
          severity: number
          suggestions: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          journal_id?: string | null
          analysis?: Json
          dsm5_codes?: string[] | null
          severity: number
          suggestions?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          journal_id?: string | null
          analysis?: Json
          dsm5_codes?: string[] | null
          severity?: number
          suggestions?: string[] | null
          created_at?: string
        }
      }
      vents: {
        Row: {
          id: string
          anonymous_id: string
          content: string
          is_anonymized: boolean
          created_at: string
        }
        Insert: {
          id?: string
          anonymous_id: string
          content: string
          is_anonymized?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          anonymous_id?: string
          content?: string
          is_anonymized?: boolean
          created_at?: string
        }
      }
      peer_connections: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          match_score: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          match_score: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          match_score?: number
          status?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          connection_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          connection_id: string
          sender_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          connection_id?: string
          sender_id?: string
          content?: string
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          member_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          member_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          member_count?: number
          created_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      group_posts: {
        Row: {
          id: string
          group_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      therapist_reports: {
        Row: {
          id: string
          user_id: string
          report_data: Json
          pdf_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          report_data: Json
          pdf_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          report_data?: Json
          pdf_url?: string | null
          created_at?: string
        }
      }
      gratitude_entries: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      cbt_reframes: {
        Row: {
          id: string
          user_id: string
          original_thought: string
          distortions: string[] | null
          reframe: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_thought: string
          distortions?: string[] | null
          reframe: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_thought?: string
          distortions?: string[] | null
          reframe?: string
          created_at?: string
        }
      }
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
  }
}

