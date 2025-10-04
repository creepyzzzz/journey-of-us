"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import { supabase } from "./supabase";
import type {
  MultiplayerGameRoom,
  PlayerInfo,
  TurnInfo,
  WheelSpin,
} from "./types";

interface MultiplayerStore {
  currentRoom: MultiplayerGameRoom | null;
  isHost: boolean;
  playerId: string;
  playerName: string;

  // Actions
  createRoom: (
    gameId: string,
    hostName: string
  ) => Promise<MultiplayerGameRoom>;
  joinRoom: (
    gameCode: string,
    playerName: string
  ) => Promise<MultiplayerGameRoom>;
  leaveRoom: () => Promise<void>;
  startGame: () => Promise<void>;
  updatePlayerReady: (playerId: string, isReady: boolean) => Promise<void>;
  spinWheel: (levelId: number, questionId?: string) => Promise<WheelSpin>;
  completeTurn: (turnId: string) => Promise<void>;
  subscribeToRoom: (roomId: string) => void;
  unsubscribeFromRoom: () => void;
}

// Generate a 6-character game code
const generateGameCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate a unique player ID
const generatePlayerId = (): string => {
  return nanoid(12);
};

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  currentRoom: null,
  isHost: false,
  playerId: generatePlayerId(),
  playerName: "",

  createRoom: async (gameId: string, hostName: string) => {
    const { playerId } = get();
    const gameCode = generateGameCode();

    const newRoom: MultiplayerGameRoom = {
      id: nanoid(),
      gameId,
      gameCode,
      hostPlayerId: playerId,
      hostPlayerName: hostName,
      joinedPlayers: [
        {
          id: playerId,
          name: hostName,
          joinedAt: new Date().toISOString(),
          isHost: true,
          isReady: false,
        },
      ],
      status: "waiting",
      wheelHistory: [],
      createdAt: new Date().toISOString(),
    };

    // Save to database
    const { error } = await supabase.from("multiplayer_rooms").insert({
      id: newRoom.id,
      game_id: newRoom.gameId,
      game_code: newRoom.gameCode,
      host_player_id: newRoom.hostPlayerId,
      host_player_name: newRoom.hostPlayerName,
      joined_players: newRoom.joinedPlayers,
      status: newRoom.status,
      wheel_history: newRoom.wheelHistory,
      created_at: newRoom.createdAt,
    });

    if (error) {
      throw new Error(`Failed to create room: ${error.message}`);
    }

    set({
      currentRoom: newRoom,
      isHost: true,
      playerName: hostName,
    });

    // Subscribe to room updates
    get().subscribeToRoom(newRoom.id);

    return newRoom;
  },

  joinRoom: async (gameCode: string, playerName: string) => {
    const { playerId } = get();

    // Find room by game code
    const { data: roomData, error: findError } = await supabase
      .from("multiplayer_rooms")
      .select("*")
      .eq("game_code", gameCode)
      .eq("status", "waiting")
      .single();

    if (findError || !roomData) {
      throw new Error("Room not found or game already started");
    }

    // Check if room is full (max 2 players)
    if (roomData.joined_players.length >= 2) {
      throw new Error("Room is full");
    }

    // Add player to room
    const newPlayer: PlayerInfo = {
      id: playerId,
      name: playerName,
      joinedAt: new Date().toISOString(),
      isHost: false,
      isReady: false,
    };

    const updatedPlayers = [...roomData.joined_players, newPlayer];

    const { error: updateError } = await supabase
      .from("multiplayer_rooms")
      .update({ joined_players: updatedPlayers })
      .eq("id", roomData.id);

    if (updateError) {
      throw new Error(`Failed to join room: ${updateError.message}`);
    }

    const room: MultiplayerGameRoom = {
      id: roomData.id,
      gameId: roomData.game_id,
      gameCode: roomData.game_code,
      hostPlayerId: roomData.host_player_id,
      hostPlayerName: roomData.host_player_name,
      joinedPlayers: updatedPlayers,
      status: roomData.status as "waiting" | "active" | "completed",
      currentTurn: roomData.current_turn,
      wheelHistory: roomData.wheel_history || [],
      createdAt: roomData.created_at,
      startedAt: roomData.started_at,
      completedAt: roomData.completed_at,
    };

    set({
      currentRoom: room,
      isHost: false,
      playerName,
    });

    // Subscribe to room updates
    get().subscribeToRoom(room.id);

    return room;
  },

  leaveRoom: async () => {
    const { currentRoom, playerId } = get();
    if (!currentRoom) return;

    // Remove player from room
    const updatedPlayers = currentRoom.joinedPlayers.filter(
      p => p.id !== playerId
    );

    if (updatedPlayers.length === 0) {
      // Delete room if no players left
      await supabase
        .from("multiplayer_rooms")
        .delete()
        .eq("id", currentRoom.id);
    } else {
      // Update room with remaining players
      await supabase
        .from("multiplayer_rooms")
        .update({ joined_players: updatedPlayers })
        .eq("id", currentRoom.id);
    }

    get().unsubscribeFromRoom();
    set({ currentRoom: null, isHost: false, playerName: "" });
  },

  startGame: async () => {
    const { currentRoom, isHost } = get();
    if (!currentRoom || !isHost) return;

    const { error } = await supabase
      .from("multiplayer_rooms")
      .update({
        status: "active",
        started_at: new Date().toISOString(),
      })
      .eq("id", currentRoom.id);

    if (error) {
      throw new Error(`Failed to start game: ${error.message}`);
    }
  },

  updatePlayerReady: async (playerId: string, isReady: boolean) => {
    const { currentRoom } = get();
    if (!currentRoom) return;

    const updatedPlayers = currentRoom.joinedPlayers.map(p =>
      p.id === playerId ? { ...p, isReady } : p
    );

    const { error } = await supabase
      .from("multiplayer_rooms")
      .update({ joined_players: updatedPlayers })
      .eq("id", currentRoom.id);

    if (error) {
      throw new Error(`Failed to update player ready status: ${error.message}`);
    }
  },

  spinWheel: async (levelId: number, questionId?: string) => {
    const { currentRoom } = get();
    if (!currentRoom) {
      throw new Error("No active room found");
    }

    // Generate random result
    const results: ("player1" | "player2" | "both")[] = [
      "player1",
      "player2",
      "both",
    ];
    const randomResult = results[Math.floor(Math.random() * results.length)];

    const wheelSpin: WheelSpin = {
      id: nanoid(),
      result: randomResult,
      timestamp: new Date().toISOString(),
      levelId,
      questionId,
    };

    const updatedWheelHistory = [...currentRoom.wheelHistory, wheelSpin];

    // Determine current turn
    const currentTurn: TurnInfo = {
      playerId:
        randomResult === "both"
          ? "both"
          : currentRoom.joinedPlayers.find(p =>
              randomResult === "player1"
                ? p.id === currentRoom.joinedPlayers[0].id
                : p.id === currentRoom.joinedPlayers[1].id
            )?.id || "",
      playerName:
        randomResult === "both"
          ? "Both Players"
          : currentRoom.joinedPlayers.find(p =>
              randomResult === "player1"
                ? p.id === currentRoom.joinedPlayers[0].id
                : p.id === currentRoom.joinedPlayers[1].id
            )?.name || "",
      turnType: randomResult,
      levelId,
      questionId,
      startedAt: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("multiplayer_rooms")
      .update({
        wheel_history: updatedWheelHistory,
        current_turn: currentTurn,
      })
      .eq("id", currentRoom.id);

    if (error) {
      throw new Error(`Failed to update wheel spin: ${error.message}`);
    }

    return wheelSpin;
  },

  completeTurn: async (turnId: string) => {
    const { currentRoom } = get();
    if (!currentRoom || !currentRoom.currentTurn) return;

    const completedTurn = {
      ...currentRoom.currentTurn,
      completedAt: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("multiplayer_rooms")
      .update({
        current_turn: completedTurn,
      })
      .eq("id", currentRoom.id);

    if (error) {
      throw new Error(`Failed to complete turn: ${error.message}`);
    }
  },

  subscribeToRoom: (roomId: string) => {
    const subscription = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "multiplayer_rooms",
          filter: `id=eq.${roomId}`,
        },
        payload => {
          const roomData = payload.new;
          const room: MultiplayerGameRoom = {
            id: roomData.id,
            gameId: roomData.game_id,
            gameCode: roomData.game_code,
            hostPlayerId: roomData.host_player_id,
            hostPlayerName: roomData.host_player_name,
            joinedPlayers: roomData.joined_players,
            status: roomData.status,
            currentTurn: roomData.current_turn,
            wheelHistory: roomData.wheel_history || [],
            createdAt: roomData.created_at,
            startedAt: roomData.started_at,
            completedAt: roomData.completed_at,
          };
          set({ currentRoom: room });
        }
      )
      .subscribe();

    // Store subscription for cleanup
    (get() as any).subscription = subscription;
  },

  unsubscribeFromRoom: () => {
    const subscription = (get() as any).subscription;
    if (subscription) {
      supabase.removeChannel(subscription);
      (get() as any).subscription = null;
    }
  },
}));
