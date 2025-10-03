"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, Key, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FloatingHearts } from "@/components/floating-hearts";
import { useSupabasePlaySessionStore } from "@/lib/supabase-store";

interface SecretSharingLevelProps {
  gameContent: any;
  onComplete: () => void;
}

export function SecretSharingLevel({ gameContent, onComplete }: SecretSharingLevelProps) {
  const { currentSession, savePlayerAnswer } = useSupabasePlaySessionStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [showHearts, setShowHearts] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const secrets = gameContent.secrets || [];
  const currentSecret = secrets[currentIndex];

  const handleResponseChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentSecret.id]: value
    }));
  };

  const handleReveal = () => {
    setIsRevealed(true);
    setShowHearts(true);
    setTimeout(() => setShowHearts(false), 2000);
  };

  const handleNext = async () => {
    if (!currentSession) return;

    // Save the current answer if there's a response
    const currentResponse = responses[currentSecret?.id];
    if (currentResponse?.trim()) {
      await savePlayerAnswer({
        gameId: currentSession.gameId,
        sessionId: currentSession.sessionId || currentSession.gameId, // Use sessionId if available, fallback to gameId
        questionId: currentSecret.id,
        questionType: "secret",
        questionText: currentSecret.text,
        answer: currentResponse.trim(),
        playerName: currentSession.playerNames[0],
        levelId: 3, // Secret sharing is typically level 3
        metadata: {
          romanceIntensity: currentSecret.romanceIntensity,
        },
      });
    }

    if (currentIndex < secrets.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(false);
    } else {
      onComplete();
    }
  };

  if (secrets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No secrets available</p>
            <Button onClick={onComplete} className="mt-4">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / secrets.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      {showHearts && <FloatingHearts count={5} duration={3} />}
      
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Unique Progress - Circular */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-purple-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                className="text-purple-500"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${progress}, 100` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Clean Card Design */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          
          <Card className="overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30 border-2 border-purple-200/50 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white p-6 text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Lock className="h-10 w-10 mx-auto mb-3" />
              </motion.div>
              <CardTitle className="text-2xl font-romantic">Secret Sharing 🦉</CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8 bg-gradient-to-br from-white to-purple-50/20">
              {!isRevealed ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-8"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  >
                    <Key className="h-20 w-20 mx-auto mb-6 text-purple-500" />
                  </motion.div>
                  <h3 className="text-3xl font-lovable text-purple-800 leading-relaxed">
                    Ready to share a secret? 💫
                  </h3>
                  <Button
                    onClick={handleReveal}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 font-lovable px-8 py-4 text-lg rounded-2xl shadow-lg"
                  >
                    <Eye className="h-6 w-6 mr-3" />
                    Reveal Secret
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  {/* Secret Prompt - Simple and Normal */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full text-center"
                  >
                    <h2 className="text-2xl font-lovable text-purple-800 leading-relaxed px-4 py-6 bg-purple-50 rounded-2xl border border-purple-200">
                      {currentSecret?.text}
                    </h2>
                  </motion.div>

                  {/* Response Area - Clean and Properly Aligned */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full"
                  >
                    <Textarea
                      value={responses[currentSecret?.id] || ""}
                      onChange={(e) => handleResponseChange(e.target.value)}
                      placeholder="Share your secret... 🤫"
                      rows={6}
                      className="w-full resize-none text-base text-center font-lovable border-2 border-purple-200 focus:border-purple-400 focus:ring-purple-200 rounded-2xl bg-gradient-to-br from-white to-purple-50/30 shadow-inner p-4"
                    />
                  </motion.div>

                  {/* Action Button - Clean and Properly Aligned */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full"
                  >
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 font-lovable py-4 text-lg rounded-2xl shadow-lg"
                      disabled={!responses[currentSecret?.id]?.trim()}
                    >
                      {currentIndex === secrets.length - 1 ? "Finish ✨" : "Next"}
                      <ArrowRight className="h-6 w-6 ml-3" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
