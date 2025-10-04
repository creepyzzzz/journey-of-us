export type ID = string;

export interface GuessingQuestion {
  id: ID;
  label: string;
  creatorAnswer?: string;
  choices?: string[];
  type: "text" | "choice";
  correctChoiceIndex?: number; // Index of the correct choice (-1 means no correct answer selected)
}

export interface GameItem {
  id: ID;
  text: string;
  tags?: string[];
  romanceIntensity?: 1 | 2 | 3 | 4 | 5;
  levelTags?: string[];
}

export interface GameContent {
  id: ID;
  title: string;
  description?: string;
  coverGradient?: string;
  creatorName?: string;
  partnerNameHint?: string;
  truths: GameItem[];
  dares: GameItem[];
  secrets: GameItem[];
  memories: GameItem[];
  romanticSentences: GameItem[];
  guessingQuestions: GuessingQuestion[];
  createdAt: string;
  updatedAt: string;
  version?: number;
  published?: boolean;
  visibility?: "private" | "link" | "public";
  slug?: string;
  loveCode?: string;
  passphraseProtected?: boolean;
  creatorFingerprint?: string;
}

export interface GameState {
  gameId: ID;
  sessionId?: ID; // Track the session ID for database references
  playerNames: [string, string];
  currentLevel: number;
  progress: Record<
    number,
    {
      completed: boolean;
      score?: number;
    }
  >;
  answers?: Record<string, any>;
  createdFromSlug?: string;
}

export type PlayMode = "quick" | "full";

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  score?: number;
  answers?: any;
}

export type RomanceIntensity = "playful" | "deep" | "spicy" | "memory";

export interface EditorState {
  activeTab:
    | "truths"
    | "dares"
    | "secrets"
    | "memories"
    | "romantic"
    | "guessing"
    | "answers";
  previewMode: boolean;
  isDirty: boolean;
}

export interface SwipeGestureState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

export interface GameSession {
  id: ID;
  gameId: ID;
  playerNames: [string, string];
  mode: PlayMode;
  currentLevel: number;
  progress: Record<number, LevelProgress>;
  answers: Record<string, any>;
  startedAt: string;
  completedAt?: string;
  createdFromSlug?: string;
  // Multiplayer fields
  isMultiplayer?: boolean;
  gameCode?: string;
  hostPlayerId?: string;
  joinedPlayers?: string[];
  currentTurn?: TurnInfo;
  wheelHistory?: WheelSpin[];
}

export interface TurnInfo {
  playerId: string;
  playerName: string;
  turnType: "player1" | "player2" | "both";
  levelId: number;
  questionId?: string;
  startedAt: string;
  completedAt?: string;
}

export interface WheelSpin {
  id: string;
  result: "player1" | "player2" | "both";
  timestamp: string;
  levelId: number;
  questionId?: string;
}

export interface MultiplayerGameRoom {
  id: ID;
  gameId: ID;
  gameCode: string;
  hostPlayerId: string;
  hostPlayerName: string;
  joinedPlayers: PlayerInfo[];
  status: "waiting" | "active" | "completed";
  currentTurn?: TurnInfo;
  wheelHistory: WheelSpin[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface PlayerInfo {
  id: string;
  name: string;
  joinedAt: string;
  isHost: boolean;
}

export interface GameAnalytics {
  gameId: ID;
  totalPlays: number;
  completionRate: number;
  averagePlayTime: number;
  mostPopularLevel: number;
  lastPlayed: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  animations: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  autoSave: boolean;
  language: string;
}

export interface GameTemplate {
  id: ID;
  name: string;
  description: string;
  category: "romantic" | "fun" | "deep" | "adventure" | "custom";
  content: Partial<GameContent>;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  downloads: number;
  rating: number;
}

export interface PlayerAnswer {
  id: string;
  gameId: ID;
  sessionId: ID;
  questionId: string;
  questionType:
    | "truth"
    | "dare"
    | "secret"
    | "memory"
    | "romantic"
    | "guessing";
  questionText: string;
  answer: string;
  playerName: string;
  levelId: number;
  timestamp: string;
  metadata?: {
    score?: number;
    isCorrect?: boolean;
    creatorAnswer?: string;
    correctAnswer?: string;
    questionType?: "text" | "choice";
    romanceIntensity?: number;
  };
}

export interface GameSessionAnswers {
  sessionId: ID;
  gameId: ID;
  playerNames: [string, string];
  answers: PlayerAnswer[];
  startedAt: string;
  completedAt?: string;
  totalScore?: number;
}
