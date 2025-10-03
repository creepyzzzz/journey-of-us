import localforage from "localforage";
import { GameContent, GameState, PlayerAnswer, GameSessionAnswers } from "./types";

const gamesStore = localforage.createInstance({
  name: "journey-of-us",
  storeName: "games",
});

const sessionsStore = localforage.createInstance({
  name: "journey-of-us",
  storeName: "sessions",
});

const answersStore = localforage.createInstance({
  name: "journey-of-us",
  storeName: "answers",
});

export const storage = {
  games: {
    async getAll(): Promise<GameContent[]> {
      const keys = await gamesStore.keys();
      const games: GameContent[] = [];
      for (const key of keys) {
        const game = await gamesStore.getItem<GameContent>(key);
        if (game) games.push(game);
      }
      return games.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },

    async get(id: string): Promise<GameContent | null> {
      return await gamesStore.getItem<GameContent>(id);
    },

    async set(id: string, game: GameContent): Promise<void> {
      await gamesStore.setItem(id, game);
    },

    async delete(id: string): Promise<void> {
      await gamesStore.removeItem(id);
    },

    async clear(): Promise<void> {
      await gamesStore.clear();
    },
  },

  sessions: {
    async getAll(): Promise<GameState[]> {
      const keys = await sessionsStore.keys();
      const sessions: GameState[] = [];
      for (const key of keys) {
        const session = await sessionsStore.getItem<GameState>(key);
        if (session) sessions.push(session);
      }
      return sessions;
    },

    async get(id: string): Promise<GameState | null> {
      return await sessionsStore.getItem<GameState>(id);
    },

    async set(id: string, session: GameState): Promise<void> {
      await sessionsStore.setItem(id, session);
    },

    async delete(id: string): Promise<void> {
      await sessionsStore.removeItem(id);
    },

    async clear(): Promise<void> {
      await sessionsStore.clear();
    },
  },

  answers: {
    async getAll(): Promise<PlayerAnswer[]> {
      const keys = await answersStore.keys();
      const answers: PlayerAnswer[] = [];
      for (const key of keys) {
        const answer = await answersStore.getItem<PlayerAnswer>(key);
        if (answer) answers.push(answer);
      }
      return answers.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },

    async getByGameId(gameId: string): Promise<PlayerAnswer[]> {
      const allAnswers = await this.getAll();
      return allAnswers.filter(answer => answer.gameId === gameId);
    },

    async getBySessionId(sessionId: string): Promise<PlayerAnswer[]> {
      const allAnswers = await this.getAll();
      return allAnswers.filter(answer => answer.sessionId === sessionId);
    },

    async get(id: string): Promise<PlayerAnswer | null> {
      return await answersStore.getItem<PlayerAnswer>(id);
    },

    async set(id: string, answer: PlayerAnswer): Promise<void> {
      await answersStore.setItem(id, answer);
    },

    async delete(id: string): Promise<void> {
      await answersStore.removeItem(id);
    },

    async clear(): Promise<void> {
      await answersStore.clear();
    },
  },
};

