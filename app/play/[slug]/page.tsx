"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import { nanoid } from "nanoid";
import { useSupabaseGameStore, useSupabasePlaySessionStore } from "@/lib/supabase-store";
import { GuessingLevel } from "@/components/levels/guessing-level";
import { MysteryCardsLevel } from "@/components/levels/mystery-cards-level";
import { QuestionDeckLevel } from "@/components/levels/question-deck-level";
import { SecretSharingLevel } from "@/components/levels/secret-sharing-level";
import { MemoryLaneLevel } from "@/components/levels/memory-lane-level";
import { RomanceLevel } from "@/components/levels/romance-level";
import { SummaryLevel } from "@/components/levels/summary-level";
import { LevelIndicator } from "@/components/level-indicator";

export default function PlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isPreview = searchParams.get("preview") === "true";

  const { getGameBySlug, getGameByLoveCode } = useSupabaseGameStore();
  const { currentSession, setCurrentSession, saveSession } = useSupabasePlaySessionStore();
  const [gameContent, setGameContent] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState(0); // Start at first game level

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
          // Initialize session with names from game creation
          const newSession = {
            gameId: game.id,
            sessionId: nanoid(), // Generate session ID for database references
            playerNames: [game.creatorName || "Player 1", game.partnerNameHint || "Player 2"],
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
  }, [slug, getGameBySlug, getGameByLoveCode, setCurrentSession]);

  const handleLevelComplete = () => {
    setCurrentLevel((prev) => prev + 1);
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

  const levelNames = [
    "Guessing Game 💭",
    "Mystery Cards 🎴",
    "Question Deck ❓",
    "Secret Sharing 🤫",
    "Memory Lane 💭",
    "Romance Level 💕",
    "Journey Summary 📖"
  ];

  const levels = [
    <GuessingLevel
      key="guessing"
      gameContent={gameContent}
      onComplete={handleLevelComplete}
    />,
    <MysteryCardsLevel
      key="mystery"
      gameContent={gameContent}
      onComplete={handleLevelComplete}
    />,
    <QuestionDeckLevel
      key="questions"
      gameContent={gameContent}
      onComplete={handleLevelComplete}
    />,
    <SecretSharingLevel
      key="secrets"
      gameContent={gameContent}
      onComplete={handleLevelComplete}
    />,
    <MemoryLaneLevel
      key="memories"
      gameContent={gameContent}
      onComplete={handleLevelComplete}
    />,
    <RomanceLevel
      key="romance"
      gameContent={gameContent}
      onComplete={handleLevelComplete}
    />,
    <SummaryLevel
      key="summary"
      gameContent={gameContent}
      session={currentSession}
    />,
  ];

  return (
    <div className="min-h-screen bg-love-gradient">
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
