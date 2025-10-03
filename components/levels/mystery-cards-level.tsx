"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shuffle, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingHearts } from "@/components/floating-hearts";

interface MysteryCardsLevelProps {
  gameContent: any;
  onComplete: () => void;
}

export function MysteryCardsLevel({ gameContent, onComplete }: MysteryCardsLevelProps) {
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [showHearts, setShowHearts] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Mix truths and dares for mystery cards and shuffle them once
  const shuffledCards = useMemo(() => {
    const allCards = [
      ...gameContent.truths.slice(0, 3).map((item: any) => ({ ...item, type: "truth" })),
      ...gameContent.dares.slice(0, 3).map((item: any) => ({ ...item, type: "dare" })),
    ];
    return allCards.sort(() => Math.random() - 0.5);
  }, [gameContent.truths, gameContent.dares]);

  useEffect(() => {
    if (shuffledCards.length > 0) {
      setCurrentCard(shuffledCards[cardIndex]);
    }
  }, [cardIndex, shuffledCards]);

  const handleCardFlip = () => {
    setIsFlipped(true);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 2000);
  };

  const handleNext = () => {
    if (cardIndex < shuffledCards.length - 1) {
      setCardIndex(cardIndex + 1);
      setIsFlipped(false);
    } else {
      onComplete();
    }
  };

  if (shuffledCards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No mystery cards available</p>
            <Button onClick={onComplete} className="mt-4">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((cardIndex + 1) / shuffledCards.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      {showHearts && <FloatingHearts count={8} duration={2} />}
      
      <motion.div
        key={cardIndex}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="w-full max-w-2xl"
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Card {cardIndex + 1} of {shuffledCards.length}
          </p>
        </div>

        {/* Mystery Card */}
        <motion.div
          className="relative"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            className="relative w-full h-80"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Card Back */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ backfaceVisibility: "hidden" }}
            >
              <Card className="h-full bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white overflow-hidden">
                <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="h-16 w-16 mb-4" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-4">Mystery Card</h2>
                  <p className="text-lg opacity-90 mb-6">Tap to reveal your challenge!</p>
                  <Button
                    onClick={handleCardFlip}
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Shuffle className="h-5 w-5 mr-2" />
                    Reveal Card
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Card Front */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <Card className="h-full">
                <CardHeader className={`text-white p-6 ${
                  currentCard?.type === "truth" 
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
                    : "bg-gradient-to-r from-orange-500 to-red-500"
                }`}>
                  <CardTitle className="text-center flex items-center justify-center gap-2">
                    {currentCard?.type === "truth" ? (
                      <Heart className="h-6 w-6 fill-white" />
                    ) : (
                      <Zap className="h-6 w-6 fill-white" />
                    )}
                    {currentCard?.type === "truth" ? "Truth" : "Dare"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 flex items-center justify-center"
                  >
                    <h3 className="text-xl font-semibold leading-relaxed">
                      {currentCard?.text}
                    </h3>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="w-full"
                    >
                      {cardIndex === shuffledCards.length - 1 ? "Complete Level" : "Next Card"}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
