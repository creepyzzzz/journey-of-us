"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Heart, Users } from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { useSupabaseGameStore, useSupabasePlaySessionStore } from "@/lib/supabase-store";
import { useMultiplayerStore } from "@/lib/multiplayer-store";
import { GuessingLevel } from "@/components/levels/guessing-level";
import { MysteryCardsLevel } from "@/components/levels/mystery-cards-level";
import { QuestionDeckLevel } from "@/components/levels/question-deck-level";
import { SecretSharingLevel } from "@/components/levels/secret-sharing-level";
import { MemoryLaneLevel } from "@/components/levels/memory-lane-level";
import { RomanceLevel } from "@/components/levels/romance-level";
import { SummaryLevel } from "@/components/levels/summary-level";
import { LevelIndicator } from "@/components/level-indicator";
import { MultiplayerLevelWrapper } from "@/components/multiplayer/multiplayer-level-wrapper";
import { GameCreation, WaitingRoom } from "@/components/multiplayer/game-creation";
import { GameJoining, GameModeSelection } from "@/components/multiplayer/game-joining";

type GameMode = 'single' | 'multiplayer' | 'create' | 'join' | 'waiting' | 'playing';

export default function PlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isPreview = searchParams.get("preview") === "true";
  const joinCode = searchParams.get("join");

  const { getGameBySlug, getGameByLoveCode } = useSupabaseGameStore();
  const { currentSession, setCurrentSession, saveSession } = useSupabasePlaySessionStore();
  const { currentRoom, startGame } = useMultiplayerStore();
  const [gameContent, setGameContent] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [multiplayerRoom, setMultiplayerRoom] = useState<any>(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        // Try to find game by slug first, then by love code
        let game = await getGameBySlug(slug);
        if (!game) {
          game = await getGameByLoveCode(slug);
        }
        
        if (game) {
          setGameContent(game);
          
          // Check if this is a multiplayer join request
          if (joinCode) {
            setGameMode('join');
            return;
          }
          
          // Initialize session with names from game creation
          const newSession = {
            gameId: game.id,
            sessionId: nanoid(), // Generate session ID for database references
            playerNames: [game.creatorName || "Player 1", game.partnerNameHint || "Player 2"] as [string, string],
            mode: "full", // Default to full journey mode
            currentLevel: 0,
            progress: {},
            createdFromSlug: slug,
          };
          setCurrentSession(newSession);
          // Save the session to the database immediately
          await saveSession();
        }
      } catch (error) {
        console.error('Error loading game:', error);
      }
    };
    loadGame();
  }, [slug, joinCode, getGameBySlug, getGameByLoveCode, setCurrentSession]);

  // Handle multiplayer room state changes
  useEffect(() => {
    if (currentRoom) {
      setMultiplayerRoom(currentRoom);
      if (currentRoom.status === 'active') {
        setGameMode('playing');
      } else if (currentRoom.status === 'waiting') {
        setGameMode('waiting');
      }
    }
  }, [currentRoom]);

  const handleLevelComplete = () => {
    setCurrentLevel((prev) => prev + 1);
  };

  const handleRoomCreated = (room: any) => {
    setMultiplayerRoom(room);
    setGameMode('waiting');
  };

  const handleRoomJoined = (room: any) => {
    setMultiplayerRoom(room);
    setGameMode('waiting');
  };

  const handleGameStart = async () => {
    try {
      await startGame();
      setGameMode('playing');
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  };

  if (!gameContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Heart className="h-12 w-12 text-rose-400 animate-pulse mx-auto mb-4 fill-rose-400" />
          <p className="text-lg text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  // Render multiplayer mode selection
  if (gameMode === 'multiplayer') {
    return (
      <GameModeSelection
        onCreateGame={() => setGameMode('create')}
        onJoinGame={() => setGameMode('join')}
      />
    );
  }

  // Render game creation
  if (gameMode === 'create') {
    return (
      <GameCreation
        gameId={gameContent.id}
        onRoomCreated={handleRoomCreated}
      />
    );
  }

  // Render game joining
  if (gameMode === 'join') {
    return (
      <GameJoining
        gameId={gameContent.id}
        onRoomJoined={handleRoomJoined}
        onBack={() => setGameMode('multiplayer')}
      />
    );
  }

  // Render waiting room
  if (gameMode === 'waiting' && multiplayerRoom) {
    return (
      <WaitingRoom
        room={multiplayerRoom}
        onGameStart={handleGameStart}
      />
    );
  }

  const levelNames = [
    "Guessing Game 💭",
    "Mystery Cards 🎴",
    "Question Deck ❓",
    "Secret Sharing 🤫",
    "Memory Lane 💭",
    "Romance Level 💕",
    "Journey Summary 📖"
  ];

  const createLevelComponent = (levelComponent: React.ReactElement, levelId: number) => {
    if (gameMode === 'playing' && multiplayerRoom) {
      return (
        <MultiplayerLevelWrapper
          key={`multiplayer-${levelId}`}
          levelId={levelId}
          levelName={levelNames[levelId]}
          onLevelComplete={handleLevelComplete}
          gameContent={gameContent}
        >
          {levelComponent}
        </MultiplayerLevelWrapper>
      );
    }
    return levelComponent;
  };

  const levels = [
    createLevelComponent(
      <GuessingLevel
        key="guessing"
        gameContent={gameContent}
        onComplete={handleLevelComplete}
      />,
      0
    ),
    createLevelComponent(
      <MysteryCardsLevel
        key="mystery"
        gameContent={gameContent}
        onComplete={handleLevelComplete}
      />,
      1
    ),
    createLevelComponent(
      <QuestionDeckLevel
        key="questions"
        gameContent={gameContent}
        onComplete={handleLevelComplete}
      />,
      2
    ),
    createLevelComponent(
      <SecretSharingLevel
        key="secrets"
        gameContent={gameContent}
        onComplete={handleLevelComplete}
      />,
      3
    ),
    createLevelComponent(
      <MemoryLaneLevel
        key="memories"
        gameContent={gameContent}
        onComplete={handleLevelComplete}
      />,
      4
    ),
    createLevelComponent(
      <RomanceLevel
        key="romance"
        gameContent={gameContent}
        onComplete={handleLevelComplete}
      />,
      5
    ),
    createLevelComponent(
      <SummaryLevel
        key="summary"
        gameContent={gameContent}
        session={currentSession}
      />,
      6
    ),
  ];

  // Add multiplayer mode button for single player mode
  const showMultiplayerButton = gameMode === 'single' && !isPreview;

  return (
    <div className="min-h-screen bg-love-gradient">
      {showMultiplayerButton && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setGameMode('multiplayer')}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-2 border-rose-300 text-rose-600 hover:bg-rose-50 shadow-lg"
          >
            <Users className="w-4 h-4 mr-2" />
            Multiplayer
          </Button>
        </div>
      )}
      
      <LevelIndicator 
        currentLevel={currentLevel} 
        totalLevels={levels.length} 
        levelNames={levelNames}
      />
      <div className="pt-20">
        {levels[currentLevel]}
      </div>
    </div>
  );
}
