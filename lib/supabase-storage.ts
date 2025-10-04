import { supabase } from './supabase';
import { GameContent, GameState, PlayerAnswer, GameSessionAnswers } from './types';

// Helper function to convert database row to GameContent
const dbRowToGameContent = (row: any): GameContent => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  coverGradient: row.cover_gradient || '',
  creatorName: row.creator_name || '',
  partnerNameHint: row.partner_name_hint || '',
  truths: row.truths || [],
  dares: row.dares || [],
  secrets: row.secrets || [],
  memories: row.memories || [],
  romanticSentences: row.romantic_sentences || [],
  guessingQuestions: row.guessing_questions || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  version: row.version || 1,
  published: row.published || false,
  visibility: row.visibility || 'private',
  slug: row.slug || undefined,
  loveCode: row.love_code || undefined,
  passphraseProtected: row.passphrase_protected || false,
  creatorFingerprint: row.creator_fingerprint || undefined,
});

// Helper function to convert GameContent to database row
const gameContentToDbRow = (game: GameContent) => ({
  id: game.id,
  title: game.title,
  description: game.description || null,
  cover_gradient: game.coverGradient || null,
  creator_name: game.creatorName || null,
  partner_name_hint: game.partnerNameHint || null,
  truths: game.truths || [],
  dares: game.dares || [],
  secrets: game.secrets || [],
  memories: game.memories || [],
  romantic_sentences: game.romanticSentences || [],
  guessing_questions: game.guessingQuestions || [],
  created_at: game.createdAt,
  updated_at: game.updatedAt,
  version: game.version || 1,
  published: game.published || false,
  visibility: game.visibility || 'private',
  slug: game.slug || null,
  love_code: game.loveCode || null,
  passphrase_protected: game.passphraseProtected || false,
  creator_fingerprint: game.creatorFingerprint || null,
});

// Helper function to convert database row to GameState
const dbRowToGameState = (row: any): GameState => ({
  gameId: row.game_id,
  playerNames: row.player_names as [string, string],
  currentLevel: row.current_level,
  progress: row.progress || {},
  answers: row.answers || {},
  createdFromSlug: row.created_from_slug || undefined,
});

// Helper function to convert GameState to database row
const gameStateToDbRow = (session: GameState, sessionId: string) => ({
  id: sessionId,
  game_id: session.gameId,
  player_names: session.playerNames,
  mode: 'full' as const,
  current_level: session.currentLevel,
  progress: session.progress || {},
  answers: session.answers || {},
  started_at: new Date().toISOString(),
  completed_at: null,
  created_from_slug: session.createdFromSlug || null,
});

// Helper function to convert database row to PlayerAnswer
const dbRowToPlayerAnswer = (row: any): PlayerAnswer => ({
  id: row.id,
  gameId: row.game_id,
  sessionId: row.session_id,
  questionId: row.question_id,
  questionType: row.question_type,
  questionText: row.question_text,
  answer: row.answer,
  playerName: row.player_name,
  levelId: row.level_id,
  timestamp: row.timestamp,
  metadata: row.metadata || undefined,
});

// Helper function to convert PlayerAnswer to database row
const playerAnswerToDbRow = (answer: PlayerAnswer) => ({
  id: answer.id,
  game_id: answer.gameId,
  session_id: answer.sessionId,
  question_id: answer.questionId,
  question_type: answer.questionType,
  question_text: answer.questionText,
  answer: answer.answer,
  player_name: answer.playerName,
  level_id: answer.levelId,
  timestamp: answer.timestamp,
  metadata: answer.metadata || null,
});

export const supabaseStorage = {
  games: {
    async getAll(): Promise<GameContent[]> {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching games:', error);
        throw new Error(`Failed to fetch games: ${error.message}`);
      }

      return data?.map(dbRowToGameContent) || [];
    },

    async getByCreatorFingerprint(creatorFingerprint: string): Promise<GameContent[]> {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('creator_fingerprint', creatorFingerprint)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching games by creator fingerprint:', error);
        throw new Error(`Failed to fetch games by creator fingerprint: ${error.message}`);
      }

      return data?.map(dbRowToGameContent) || [];
    },

    async get(id: string): Promise<GameContent | null> {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows returned
        }
        console.error('Error fetching game:', error);
        throw new Error(`Failed to fetch game: ${error.message}`);
      }

      return data ? dbRowToGameContent(data) : null;
    },

    async getBySlug(slug: string): Promise<GameContent | null> {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows returned
        }
        console.error('Error fetching game by slug:', error);
        throw new Error(`Failed to fetch game by slug: ${error.message}`);
      }

      return data ? dbRowToGameContent(data) : null;
    },

    async getByLoveCode(loveCode: string): Promise<GameContent | null> {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('love_code', loveCode)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows returned
        }
        console.error('Error fetching game by love code:', error);
        throw new Error(`Failed to fetch game by love code: ${error.message}`);
      }

      return data ? dbRowToGameContent(data) : null;
    },

    async set(id: string, game: GameContent): Promise<void> {
      const dbRow = gameContentToDbRow(game);
      
      const { error } = await supabase
        .from('games')
        .upsert(dbRow);

      if (error) {
        console.error('Error saving game:', error);
        throw new Error(`Failed to save game: ${error.message}`);
      }
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting game:', error);
        throw new Error(`Failed to delete game: ${error.message}`);
      }
    },

    async clear(): Promise<void> {
      const { error } = await supabase
        .from('games')
        .delete()
        .neq('id', ''); // Delete all rows

      if (error) {
        console.error('Error clearing games:', error);
        throw new Error(`Failed to clear games: ${error.message}`);
      }
    },
  },

  sessions: {
    async getAll(): Promise<GameState[]> {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        throw new Error(`Failed to fetch sessions: ${error.message}`);
      }

      return data?.map(dbRowToGameState) || [];
    },

    async get(id: string): Promise<GameState | null> {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows returned
        }
        console.error('Error fetching session:', error);
        throw new Error(`Failed to fetch session: ${error.message}`);
      }

      return data ? dbRowToGameState(data) : null;
    },

    async getByGameId(gameId: string): Promise<GameState[]> {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('game_id', gameId)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching sessions by game ID:', error);
        throw new Error(`Failed to fetch sessions by game ID: ${error.message}`);
      }

      return data?.map(dbRowToGameState) || [];
    },

    async set(id: string, session: GameState): Promise<void> {
      const dbRow = gameStateToDbRow(session, id);
      
      const { error } = await supabase
        .from('game_sessions')
        .upsert(dbRow);

      if (error) {
        console.error('Error saving session:', error);
        throw new Error(`Failed to save session: ${error.message}`);
      }
    },

    async update(id: string, updates: Partial<GameState>): Promise<void> {
      const updateData: any = {};
      
      if (updates.currentLevel !== undefined) updateData.current_level = updates.currentLevel;
      if (updates.progress !== undefined) updateData.progress = updates.progress;
      if (updates.answers !== undefined) updateData.answers = updates.answers;
      if (updates.playerNames !== undefined) updateData.player_names = updates.playerNames;
      
      const { error } = await supabase
        .from('game_sessions')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating session:', error);
        throw new Error(`Failed to update session: ${error.message}`);
      }
    },

    async completeSession(id: string): Promise<void> {
      const { error } = await supabase
        .from('game_sessions')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error completing session:', error);
        throw new Error(`Failed to complete session: ${error.message}`);
      }
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('game_sessions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting session:', error);
        throw new Error(`Failed to delete session: ${error.message}`);
      }
    },

    async clear(): Promise<void> {
      const { error } = await supabase
        .from('game_sessions')
        .delete()
        .neq('id', ''); // Delete all rows

      if (error) {
        console.error('Error clearing sessions:', error);
        throw new Error(`Failed to clear sessions: ${error.message}`);
      }
    },
  },

  answers: {
    async getAll(): Promise<PlayerAnswer[]> {
      const { data, error } = await supabase
        .from('player_answers')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching answers:', error);
        throw new Error(`Failed to fetch answers: ${error.message}`);
      }

      return data?.map(dbRowToPlayerAnswer) || [];
    },

    async getByGameId(gameId: string): Promise<PlayerAnswer[]> {
      const { data, error } = await supabase
        .from('player_answers')
        .select('*')
        .eq('game_id', gameId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching answers by game ID:', error);
        throw new Error(`Failed to fetch answers by game ID: ${error.message}`);
      }

      return data?.map(dbRowToPlayerAnswer) || [];
    },

    async getBySessionId(sessionId: string): Promise<PlayerAnswer[]> {
      const { data, error } = await supabase
        .from('player_answers')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching answers by session ID:', error);
        throw new Error(`Failed to fetch answers by session ID: ${error.message}`);
      }

      return data?.map(dbRowToPlayerAnswer) || [];
    },

    async get(id: string): Promise<PlayerAnswer | null> {
      const { data, error } = await supabase
        .from('player_answers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows returned
        }
        console.error('Error fetching answer:', error);
        throw new Error(`Failed to fetch answer: ${error.message}`);
      }

      return data ? dbRowToPlayerAnswer(data) : null;
    },

    async set(id: string, answer: PlayerAnswer): Promise<void> {
      const dbRow = playerAnswerToDbRow(answer);
      
      const { error } = await supabase
        .from('player_answers')
        .upsert(dbRow);

      if (error) {
        console.error('Error saving answer:', error);
        throw new Error(`Failed to save answer: ${error.message}`);
      }
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('player_answers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting answer:', error);
        throw new Error(`Failed to delete answer: ${error.message}`);
      }
    },

    async clear(): Promise<void> {
      const { error } = await supabase
        .from('player_answers')
        .delete()
        .neq('id', ''); // Delete all rows

      if (error) {
        console.error('Error clearing answers:', error);
        throw new Error(`Failed to clear answers: ${error.message}`);
      }
    },
  },

  analytics: {
    async getGameAnalytics(gameId: string) {
      const { data, error } = await supabase
        .from('game_analytics')
        .select('*')
        .eq('game_id', gameId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No analytics data yet
        }
        console.error('Error fetching game analytics:', error);
        throw new Error(`Failed to fetch game analytics: ${error.message}`);
      }

      return data;
    },

    async getAllAnalytics() {
      const { data, error } = await supabase
        .from('game_analytics')
        .select('*')
        .order('last_played', { ascending: false });

      if (error) {
        console.error('Error fetching all analytics:', error);
        throw new Error(`Failed to fetch analytics: ${error.message}`);
      }

      return data || [];
    },
  },
};
