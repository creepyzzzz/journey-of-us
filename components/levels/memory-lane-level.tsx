"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Flower2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FloatingHearts } from "@/components/floating-hearts";
import { useSupabasePlaySessionStore } from "@/lib/supabase-store";

interface MemoryLaneLevelProps {
  gameContent: any;
  onComplete: () => void;
}

export function MemoryLaneLevel({ gameContent, onComplete }: MemoryLaneLevelProps) {
  const { currentSession, savePlayerAnswer } = useSupabasePlaySessionStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showHearts, setShowHearts] = useState(false);

  const memories = gameContent.memories || [];
  const currentMemory = memories[currentIndex];

  const handleResponseChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentMemory.id]: value
    }));
  };

  const handleNext = async () => {
    if (!currentSession) return;

    // Save the current answer if there's a response
    const currentResponse = responses[currentMemory?.id];
    if (currentResponse?.trim()) {
      await savePlayerAnswer({
        gameId: currentSession.gameId,
        sessionId: currentSession.sessionId || currentSession.gameId, // Use sessionId if available, fallback to gameId
        questionId: currentMemory.id,
        questionType: "memory",
        questionText: currentMemory.text,
        answer: currentResponse.trim(),
        playerName: currentSession.playerNames[0],
        levelId: 4, // Memory lane is typically level 4
        metadata: {
          romanceIntensity: currentMemory.romanceIntensity,
        },
      });
    }

    if (currentIndex < memories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 2000);
    } else {
      onComplete();
    }
  };

  if (memories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <Heart className="h-16 w-16 mx-auto mb-4 text-rose-400 fill-rose-400" />
          <p className="text-rose-600 font-lovable text-lg mb-6">No memories to share yet 💕</p>
          <Button 
            onClick={onComplete} 
            className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white rounded-full px-8 py-3 font-lovable"
          >
            Continue ✨
          </Button>
        </motion.div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / memories.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {showHearts && <FloatingHearts count={8} duration={3} />}
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-8 h-8 bg-rose-200/30 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-16 w-6 h-6 bg-pink-200/40 rounded-full"
        />
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-20 w-4 h-4 bg-purple-200/30 rounded-full"
        />
      </div>
      
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Simple Progress Indicator */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center space-x-2">
            {Array.from({ length: memories.length }).map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentIndex 
                    ? 'bg-gradient-to-r from-rose-400 to-pink-400' 
                    : 'bg-rose-200'
                }`}
                animate={index === currentIndex ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ))}
          </div>
        </div>

        {/* Memory Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
            <CardContent className="p-8 sm:p-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center space-y-8"
              >
                {/* Memory Prompt */}
                <div className="space-y-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <Heart className="h-12 w-12 text-rose-400 fill-rose-400" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1 -right-1"
                      >
                        <Sparkles className="h-4 w-4 text-pink-400" />
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <h2 className="text-2xl sm:text-3xl font-lovable text-rose-800 leading-relaxed">
                    {currentMemory?.text}
                  </h2>
                  
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Flower2 className="h-8 w-8 mx-auto text-pink-400" />
                  </motion.div>
                </div>

                {/* Response Area */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <Textarea
                    value={responses[currentMemory?.id] || ""}
                    onChange={(e) => handleResponseChange(e.target.value)}
                    placeholder="Share this beautiful memory... ✨"
                    rows={5}
                    className="resize-none text-base text-center font-lovable border-2 border-rose-200 focus:border-rose-400 focus:ring-rose-200 rounded-2xl bg-gradient-to-br from-white to-rose-50/30 shadow-inner p-6"
                  />
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white py-4 px-8 rounded-full font-lovable text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={!responses[currentMemory?.id]?.trim()}
                  >
                    {currentIndex === memories.length - 1 ? "Complete ✨" : "Next Memory"}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
