import { z } from "zod";

export const guessingQuestionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Question label is required"),
  creatorAnswer: z.string().optional(),
  choices: z.array(z.string()).optional(),
  type: z.enum(["text", "choice"]),
});

export const gameItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Text is required"),
  tags: z.array(z.string()).optional(),
  romanceIntensity: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  levelTags: z.array(z.string()).optional(),
});

export const gameContentSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  coverGradient: z.string().optional(),
  creatorName: z.string().max(50).optional(),
  partnerNameHint: z.string().max(50).optional(),
  truths: z.array(gameItemSchema),
  dares: z.array(gameItemSchema),
  secrets: z.array(gameItemSchema),
  memories: z.array(gameItemSchema),
  romanticSentences: z.array(gameItemSchema),
  guessingQuestions: z.array(guessingQuestionSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.number().optional(),
  published: z.boolean().optional(),
  visibility: z.enum(["private", "link", "public"]).optional(),
  slug: z.string().optional(),
  loveCode: z.string().optional(),
  passphraseProtected: z.boolean().optional(),
  creatorFingerprint: z.string().optional(),
});

export const gameStateSchema = z.object({
  gameId: z.string(),
  playerNames: z.tuple([z.string(), z.string()]),
  currentLevel: z.number().min(0).max(9),
  progress: z.record(
    z.object({
      completed: z.boolean(),
      score: z.number().optional(),
    })
  ),
  answers: z.record(z.any()).optional(),
  createdFromSlug: z.string().optional(),
});

export const createGameRequestSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  creatorName: z.string().max(50).optional(),
  partnerNameHint: z.string().max(50).optional(),
});

export const updateGameRequestSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  content: gameContentSchema.partial().optional(),
  visibility: z.enum(["private", "link", "public"]).optional(),
});

export const publishGameRequestSchema = z.object({
  visibility: z.enum(["link", "public"]),
  passphraseProtected: z.boolean().optional(),
  passphrase: z.string().min(4).max(50).optional(),
  generateAccessCode: z.boolean().optional(),
});

export const swipeGestureStateSchema = z.object({
  startX: z.number(),
  startY: z.number(),
  endX: z.number(),
  endY: z.number(),
});

export const turnInfoSchema = z.object({
  playerId: z.string(),
  playerName: z.string(),
  turnType: z.enum(["player1", "player2", "both"]),
  levelId: z.number(),
  questionId: z.string().optional(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
});

export const wheelSpinSchema = z.object({
  id: z.string(),
  result: z.enum(["player1", "player2", "both"]),
  timestamp: z.string(),
  levelId: z.number(),
  questionId: z.string().optional(),
});

export const playerInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  joinedAt: z.string(),
  isHost: z.boolean(),
  isReady: z.boolean(),
});

export const multiplayerGameRoomSchema = z.object({
  id: z.string(),
  gameId: z.string(),
  gameCode: z.string(),
  hostPlayerId: z.string(),
  hostPlayerName: z.string(),
  joinedPlayers: z.array(playerInfoSchema),
  status: z.enum(["waiting", "active", "completed"]),
  currentTurn: turnInfoSchema.optional(),
  wheelHistory: z.array(wheelSpinSchema),
  createdAt: z.string(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
});

export const gameSessionSchema = z.object({
  id: z.string(),
  gameId: z.string(),
  playerNames: z.tuple([z.string(), z.string()]),
  mode: z.enum(["quick", "full"]),
  currentLevel: z.number().min(0).max(9),
  progress: z.record(z.object({
    levelId: z.number(),
    completed: z.boolean(),
    score: z.number().optional(),
    answers: z.any().optional(),
  })),
  answers: z.record(z.any()),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  createdFromSlug: z.string().optional(),
  // Multiplayer fields
  isMultiplayer: z.boolean().optional(),
  gameCode: z.string().optional(),
  hostPlayerId: z.string().optional(),
  joinedPlayers: z.array(z.string()).optional(),
  currentTurn: turnInfoSchema.optional(),
  wheelHistory: z.array(wheelSpinSchema).optional(),
});

export const gameAnalyticsSchema = z.object({
  gameId: z.string(),
  totalPlays: z.number().min(0),
  completionRate: z.number().min(0).max(100),
  averagePlayTime: z.number().min(0),
  mostPopularLevel: z.number().min(0).max(9),
  lastPlayed: z.string(),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "auto"]),
  animations: z.boolean(),
  soundEffects: z.boolean(),
  hapticFeedback: z.boolean(),
  autoSave: z.boolean(),
  language: z.string(),
});

export const gameTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum(["romantic", "fun", "deep", "adventure", "custom"]),
  content: gameContentSchema.partial(),
  isPublic: z.boolean(),
  createdBy: z.string(),
  createdAt: z.string(),
  downloads: z.number().min(0),
  rating: z.number().min(0).max(5),
});

export const importExportDataSchema = z.object({
  version: z.string(),
  game: gameContentSchema,
  metadata: z.object({
    exportedAt: z.string(),
    exportedBy: z.string(),
    appVersion: z.string(),
  }),
});

export type GuessingQuestion = z.infer<typeof guessingQuestionSchema>;
export type GameItem = z.infer<typeof gameItemSchema>;
export type GameContent = z.infer<typeof gameContentSchema>;
export type GameState = z.infer<typeof gameStateSchema>;
export type CreateGameRequest = z.infer<typeof createGameRequestSchema>;
export type UpdateGameRequest = z.infer<typeof updateGameRequestSchema>;
export type PublishGameRequest = z.infer<typeof publishGameRequestSchema>;
export type SwipeGestureState = z.infer<typeof swipeGestureStateSchema>;
export type GameSession = z.infer<typeof gameSessionSchema>;
export type GameAnalytics = z.infer<typeof gameAnalyticsSchema>;
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type GameTemplate = z.infer<typeof gameTemplateSchema>;
export type ImportExportData = z.infer<typeof importExportDataSchema>;
export type TurnInfo = z.infer<typeof turnInfoSchema>;
export type WheelSpin = z.infer<typeof wheelSpinSchema>;
export type PlayerInfo = z.infer<typeof playerInfoSchema>;
export type MultiplayerGameRoom = z.infer<typeof multiplayerGameRoomSchema>;
