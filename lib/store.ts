import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameContent, GameState, EditorState, PlayerAnswer, GameSessionAnswers } from "./types";
import { supabaseStorage } from "./supabase-storage";
import { nanoid } from "nanoid";

interface GameStore {
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
}

export const useGameStore = create<GameStore>()(
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
    }),
    {
      name: "game-store",
      partialize: (state) => ({ editorState: state.editorState }),
    }
  )
);

interface PlaySessionStore {
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
}

export const usePlaySessionStore = create<PlaySessionStore>((set, get) => ({
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

    const sessionId = nanoid();
    await supabaseStorage.sessions.set(sessionId, current);
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
}));
