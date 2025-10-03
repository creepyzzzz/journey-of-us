import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string
          title: string
          description: string | null
          cover_gradient: string | null
          creator_name: string | null
          partner_name_hint: string | null
          truths: any[]
          dares: any[]
          secrets: any[]
          memories: any[]
          romantic_sentences: any[]
          guessing_questions: any[]
          created_at: string
          updated_at: string
          version: number | null
          published: boolean | null
          visibility: 'private' | 'link' | 'public' | null
          slug: string | null
          love_code: string | null
          passphrase_protected: boolean | null
        }
        Insert: {
          id: string
          title: string
          description?: string | null
          cover_gradient?: string | null
          creator_name?: string | null
          partner_name_hint?: string | null
          truths?: any[]
          dares?: any[]
          secrets?: any[]
          memories?: any[]
          romantic_sentences?: any[]
          guessing_questions?: any[]
          created_at?: string
          updated_at?: string
          version?: number | null
          published?: boolean | null
          visibility?: 'private' | 'link' | 'public' | null
          slug?: string | null
          love_code?: string | null
          passphrase_protected?: boolean | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cover_gradient?: string | null
          creator_name?: string | null
          partner_name_hint?: string | null
          truths?: any[]
          dares?: any[]
          secrets?: any[]
          memories?: any[]
          romantic_sentences?: any[]
          guessing_questions?: any[]
          created_at?: string
          updated_at?: string
          version?: number | null
          published?: boolean | null
          visibility?: 'private' | 'link' | 'public' | null
          slug?: string | null
          love_code?: string | null
          passphrase_protected?: boolean | null
        }
      }
      game_sessions: {
        Row: {
          id: string
          game_id: string
          player_names: string[]
          mode: 'quick' | 'full'
          current_level: number
          progress: any
          answers: any
          started_at: string
          completed_at: string | null
          created_from_slug: string | null
        }
        Insert: {
          id: string
          game_id: string
          player_names: string[]
          mode: 'quick' | 'full'
          current_level?: number
          progress?: any
          answers?: any
          started_at?: string
          completed_at?: string | null
          created_from_slug?: string | null
        }
        Update: {
          id?: string
          game_id?: string
          player_names?: string[]
          mode?: 'quick' | 'full'
          current_level?: number
          progress?: any
          answers?: any
          started_at?: string
          completed_at?: string | null
          created_from_slug?: string | null
        }
      }
      player_answers: {
        Row: {
          id: string
          game_id: string
          session_id: string
          question_id: string
          question_type: 'truth' | 'dare' | 'secret' | 'memory' | 'romantic' | 'guessing'
          question_text: string
          answer: string
          player_name: string
          level_id: number
          timestamp: string
          metadata: any | null
        }
        Insert: {
          id: string
          game_id: string
          session_id: string
          question_id: string
          question_type: 'truth' | 'dare' | 'secret' | 'memory' | 'romantic' | 'guessing'
          question_text: string
          answer: string
          player_name: string
          level_id: number
          timestamp?: string
          metadata?: any | null
        }
        Update: {
          id?: string
          game_id?: string
          session_id?: string
          question_id?: string
          question_type?: 'truth' | 'dare' | 'secret' | 'memory' | 'romantic' | 'guessing'
          question_text?: string
          answer?: string
          player_name?: string
          level_id?: number
          timestamp?: string
          metadata?: any | null
        }
      }
      game_analytics: {
        Row: {
          game_id: string
          total_plays: number
          completion_rate: number
          average_play_time: number
          most_popular_level: number
          last_played: string
        }
        Insert: {
          game_id: string
          total_plays?: number
          completion_rate?: number
          average_play_time?: number
          most_popular_level?: number
          last_played?: string
        }
        Update: {
          game_id?: string
          total_plays?: number
          completion_rate?: number
          average_play_time?: number
          most_popular_level?: number
          last_played?: string
        }
      }
    }
  }
}
