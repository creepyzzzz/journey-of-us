"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingHearts } from "@/components/floating-hearts";

interface RomanceLevelProps {
  gameContent: any;
  onComplete: () => void;
}

export function RomanceLevel({ gameContent, onComplete }: RomanceLevelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHearts, setShowHearts] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const romanticSentences = gameContent.romanticSentences || [];
  const currentSentence = romanticSentences[currentIndex];

  useEffect(() => {
    if (currentSentence) {
      setIsRevealed(false);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 3000);
    }
  }, [currentIndex, currentSentence]);

  const handleReveal = () => {
    setIsRevealed(true);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 2000);
  };

  const handleNext = () => {
    if (currentIndex < romanticSentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  if (romanticSentences.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No romantic sentences available</p>
            <Button onClick={onComplete} className="mt-4">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / romanticSentences.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {showHearts && <FloatingHearts count={12} duration={3} />}
      
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="w-full bg-white/50 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-rose-500 to-pink-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-sm text-rose-600 mt-2 text-center font-medium">
            Romance {currentIndex + 1} of {romanticSentences.length}
          </p>
        </div>

        {/* Romance Chamber Card */}
        <Card className="overflow-hidden bg-gradient-to-br from-white to-rose-50/50 border-rose-200">
          <CardHeader className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white p-6 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="h-12 w-12 mx-auto mb-3 fill-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Romance Chamber</CardTitle>
            <p className="text-rose-100 mt-2">Share these beautiful words with your partner</p>
          </CardHeader>
          
          <CardContent className="p-8 text-center">
            {!isRevealed ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-center space-x-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-8 w-8 text-rose-400" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="h-8 w-8 text-yellow-400 fill-current" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: [0, -360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Flower2 className="h-8 w-8 text-pink-400" />
                  </motion.div>
                </div>
                
                <h3 className="text-xl font-semibold text-rose-700 mb-4">
                  Ready to share some romance?
                </h3>
                
                <Button
                  onClick={handleReveal}
                  size="lg"
                  className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-full"
                >
                  <Heart className="h-5 w-5 mr-2 fill-white" />
                  Reveal Romantic Message
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-8 border border-rose-200"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="h-8 w-8 mx-auto mb-4 text-rose-500 fill-rose-500" />
                  </motion.div>
                  <blockquote className="text-xl md:text-2xl font-medium text-rose-800 leading-relaxed italic">
                    "{currentSentence?.text}"
                  </blockquote>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <p className="text-rose-600 font-medium">
                    Take a moment to share this with your partner
                  </p>
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-full"
                  >
                    {currentIndex === romanticSentences.length - 1 ? "Complete Romance Chamber" : "Next Romantic Message"}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
