import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameContent, GameState, EditorState, PlayerAnswer } from "./types";
import { supabaseStorage } from "./supabase-storage";
import { nanoid } from "nanoid";

interface SupabaseGameStore {
  currentGame: GameContent | null;
  games: GameContent[];
  editorState: EditorState;
  setCurrentGame: (game: GameContent | null) => void;
  setGames: (games: GameContent[]) => void;
  updateGame: (updates: Partial<GameContent>) => Promise<void>;
  saveGame: () => Promise<void>;
  loadGames: () => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  setEditorState: (state: Partial<EditorState>) => void;
  getGameBySlug: (slug: string) => Promise<GameContent | null>;
  getGameByLoveCode: (loveCode: string) => Promise<GameContent | null>;
  checkLoveCodeAvailability: (loveCode: string, excludeGameId?: string) => Promise<boolean>;
  publishGame: (gameId: string, visibility: 'link' | 'public', options?: {
    passphraseProtected?: boolean;
    passphrase?: string;
    generateAccessCode?: boolean;
  }) => Promise<{ slug?: string; loveCode?: string }>;
}

export const useSupabaseGameStore = create<SupabaseGameStore>()(
  persist(
    (set, get) => ({
      currentGame: null,
      games: [],
      editorState: {
        activeTab: "truths",
        previewMode: false,
        isDirty: false,
      },

      setCurrentGame: (game) => set({ currentGame: game }),

      setGames: (games) => set({ games }),

      updateGame: async (updates) => {
        const current = get().currentGame;
        if (!current) return;

        const updatedGame: GameContent = {
          ...current,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        set({
          currentGame: updatedGame,
          editorState: { ...get().editorState, isDirty: true },
        });
      },

      saveGame: async () => {
        const current = get().currentGame;
        if (!current) return;

        await supabaseStorage.games.set(current.id, current);
        await get().loadGames();
        set({
          editorState: { ...get().editorState, isDirty: false },
        });
      },

      loadGames: async () => {
        const games = await supabaseStorage.games.getAll();
        set({ games });
      },

      deleteGame: async (id) => {
        await supabaseStorage.games.delete(id);
        await get().loadGames();
        if (get().currentGame?.id === id) {
          set({ currentGame: null });
        }
      },

      setEditorState: (state) =>
        set({ editorState: { ...get().editorState, ...state } }),

      getGameBySlug: async (slug: string) => {
        return await supabaseStorage.games.getBySlug(slug);
      },

      getGameByLoveCode: async (loveCode: string) => {
        return await supabaseStorage.games.getByLoveCode(loveCode);
      },

      checkLoveCodeAvailability: async (loveCode: string, excludeGameId?: string) => {
        if (!loveCode) return true;
        const existingGame = await supabaseStorage.games.getByLoveCode(loveCode);
        return !existingGame || existingGame.id === excludeGameId;
      },

      publishGame: async (gameId: string, visibility: 'link' | 'public', options = {}) => {
        const current = get().currentGame;
        if (!current || current.id !== gameId) {
          throw new Error('Game not found');
        }

        // Check if custom love code is available
        if (current.loveCode) {
          const isAvailable = await get().checkLoveCodeAvailability(current.loveCode, gameId);
          if (!isAvailable) {
            throw new Error('Love code is already in use. Please choose a different code.');
          }
        }

        const updates: Partial<GameContent> = {
          published: true,
          visibility,
          passphraseProtected: options.passphraseProtected || false,
        };

        // Generate slug for link visibility
        if (visibility === 'link') {
          updates.slug = nanoid(8);
        }

        // Generate love code if requested and no custom code is set
        if (options.generateAccessCode && !current.loveCode) {
          updates.loveCode = nanoid(6).toUpperCase();
        }

        const updatedGame: GameContent = {
          ...current,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        await supabaseStorage.games.set(gameId, updatedGame);
        set({ currentGame: updatedGame });
        await get().loadGames();

        return {
          slug: updatedGame.slug,
          loveCode: updatedGame.loveCode,
        };
      },
    }),
    {
      name: "supabase-game-store",
      partialize: (state) => ({ editorState: state.editorState }),
    }
  )
);

interface SupabasePlaySessionStore {
  currentSession: GameState | null;
  sessions: GameState[];
  setCurrentSession: (session: GameState | null) => void;
  updateSession: (updates: Partial<GameState>) => Promise<void>;
  saveSession: () => Promise<void>;
  loadSessions: () => Promise<void>;
  completeLevel: (levelId: number, score?: number) => Promise<void>;
  setAnswer: (key: string, value: any) => Promise<void>;
  savePlayerAnswer: (answerData: Omit<PlayerAnswer, 'id' | 'timestamp'>) => Promise<void>;
  getGameAnswers: (gameId: string) => Promise<PlayerAnswer[]>;
  getSessionAnswers: (sessionId: string) => Promise<PlayerAnswer[]>;
  completeSession: () => Promise<void>;
  startSession: (gameId: string, playerNames: [string, string], mode?: 'quick' | 'full') => Promise<void>;
}

export const useSupabasePlaySessionStore = create<SupabasePlaySessionStore>((set, get) => ({
  currentSession: null,
  sessions: [],

  setCurrentSession: (session) => set({ currentSession: session }),

  updateSession: async (updates) => {
    const current = get().currentSession;
    if (!current) return;

    const updatedSession: GameState = {
      ...current,
      ...updates,
    };

    set({ currentSession: updatedSession });
  },

  saveSession: async () => {
    const current = get().currentSession;
    if (!current) return;

    const sessionId = current.sessionId || nanoid();
    await supabaseStorage.sessions.set(sessionId, current);
    
    // Update the current session with the session ID if it wasn't set
    if (!current.sessionId) {
      await get().updateSession({ sessionId });
    }
    
    await get().loadSessions();
  },

  loadSessions: async () => {
    const sessions = await supabaseStorage.sessions.getAll();
    set({ sessions });
  },

  completeLevel: async (levelId, score) => {
    const current = get().currentSession;
    if (!current) return;

    const updatedProgress = {
      ...current.progress,
      [levelId]: {
        completed: true,
        score,
      },
    };

    await get().updateSession({
      progress: updatedProgress,
      currentLevel: levelId + 1,
    });
    await get().saveSession();
  },

  setAnswer: async (key, value) => {
    const current = get().currentSession;
    if (!current) return;

    const updatedAnswers = {
      ...current.answers,
      [key]: value,
    };

    await get().updateSession({ answers: updatedAnswers });
    await get().saveSession();
  },

  savePlayerAnswer: async (answerData) => {
    const current = get().currentSession;
    if (!current) return;

    const answer: PlayerAnswer = {
      ...answerData,
      id: nanoid(),
      timestamp: new Date().toISOString(),
    };

    await supabaseStorage.answers.set(answer.id, answer);
  },

  getGameAnswers: async (gameId) => {
    return await supabaseStorage.answers.getByGameId(gameId);
  },

  getSessionAnswers: async (sessionId) => {
    return await supabaseStorage.answers.getBySessionId(sessionId);
  },

  completeSession: async () => {
    const current = get().currentSession;
    if (!current) return;

    // Mark session as completed in the database
    const sessionId = nanoid(); // In a real app, you'd track the session ID
    await supabaseStorage.sessions.completeSession(sessionId);
  },

  startSession: async (gameId: string, playerNames: [string, string], mode: 'quick' | 'full' = 'full') => {
    const newSession: GameState = {
      gameId,
      sessionId: nanoid(), // Generate session ID upfront
      playerNames,
      currentLevel: 0,
      progress: {},
      answers: {},
    };

    set({ currentSession: newSession });
    await get().saveSession();
  },
}));
