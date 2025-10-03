"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FloatingHearts } from "@/components/floating-hearts";
import { useSupabasePlaySessionStore } from "@/lib/supabase-store";

interface QuestionDeckLevelProps {
  gameContent: any;
  onComplete: () => void;
}

export function QuestionDeckLevel({ gameContent, onComplete }: QuestionDeckLevelProps) {
  const { currentSession, savePlayerAnswer } = useSupabasePlaySessionStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showHearts, setShowHearts] = useState(false);

  // Shuffle the truths for variety - memoized to prevent recreation on every render
  const shuffledTruths = useMemo(() => {
    return [...(gameContent.truths || [])].sort(() => Math.random() - 0.5);
  }, [gameContent.truths]);
  
  const currentQuestion = shuffledTruths[currentIndex];

  const handleResponseChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = async () => {
    if (!currentSession) return;

    // Save the current answer if there's a response
    const currentResponse = responses[currentQuestion?.id];
    if (currentResponse?.trim()) {
      await savePlayerAnswer({
        gameId: currentSession.gameId,
        sessionId: currentSession.sessionId || currentSession.gameId, // Use sessionId if available, fallback to gameId
        questionId: currentQuestion.id,
        questionType: "truth",
        questionText: currentQuestion.text,
        answer: currentResponse.trim(),
        playerName: currentSession.playerNames[0],
        levelId: 2, // Question deck is typically level 2
        metadata: {
          romanceIntensity: currentQuestion.romanceIntensity,
        },
      });
    }

    if (currentIndex < shuffledTruths.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 2000);
    } else {
      onComplete();
    }
  };

  if (shuffledTruths.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No questions available</p>
            <Button onClick={onComplete} className="mt-4">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / shuffledTruths.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-love-gradient">
      {showHearts && <FloatingHearts count={3} duration={2} />}
      
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        {/* Simple Progress */}
        <div className="mb-6">
          <div className="w-full bg-pink-100 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-pink-400 to-rose-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Main Card */}
        <Card className="cute-shadow romantic-border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white p-6 text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Heart className="h-8 w-8 mx-auto mb-2 fill-white" />
            </motion.div>
            <CardTitle className="text-xl font-romantic">Question Deck ❓</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 sm:p-8 space-y-6 bg-gradient-to-br from-white to-pink-50/30">
            {/* Question */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h2 className="text-2xl font-lovable text-pink-800 leading-relaxed">
                {currentQuestion?.text}
              </h2>
            </motion.div>

            {/* Response Area */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Textarea
                value={responses[currentQuestion?.id] || ""}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder="Share your thoughts... 💭"
                rows={5}
                className="resize-none text-base text-center font-lovable border-pink-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl"
              />
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={handleNext}
                size="lg"
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 font-lovable"
                disabled={!responses[currentQuestion?.id]?.trim()}
              >
                {currentIndex === shuffledTruths.length - 1 ? "Finish ✨" : "Next"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
