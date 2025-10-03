"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validateAnswer } from "@/lib/slug-generator";
import { FloatingHearts } from "@/components/floating-hearts";
import { useSupabasePlaySessionStore } from "@/lib/supabase-store";

interface GuessingLevelProps {
  gameContent: any;
  onComplete: () => void;
}

export function GuessingLevel({ gameContent, onComplete }: GuessingLevelProps) {
  const { currentSession, savePlayerAnswer } = useSupabasePlaySessionStore();
  const questions = gameContent.guessingQuestions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [showHearts, setShowHearts] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSubmit = async () => {
    if (!answer.trim() || !currentSession) return;

    let isCorrect = false;
    
    if (currentQuestion.type === "choice" && currentQuestion.choices && currentQuestion.correctChoiceIndex >= 0) {
      // For multiple choice questions, check if the answer matches the correct choice
      const correctAnswer = currentQuestion.choices[currentQuestion.correctChoiceIndex];
      isCorrect = validateAnswer(answer, correctAnswer);
    } else if (currentQuestion.creatorAnswer) {
      // For text questions, use the creator's answer
      isCorrect = validateAnswer(answer, currentQuestion.creatorAnswer);
    } else {
      // If no correct answer is set, consider it correct
      isCorrect = true;
    }

    setFeedback(isCorrect ? "correct" : "incorrect");

    // Save the player's answer
    await savePlayerAnswer({
      gameId: currentSession.gameId,
      sessionId: currentSession.sessionId || currentSession.gameId, // Use sessionId if available, fallback to gameId
      questionId: currentQuestion.id,
      questionType: "guessing",
      questionText: currentQuestion.label,
      answer: answer.trim(),
      playerName: currentSession.playerNames[0], // Assuming first player is answering
      levelId: 0, // Guessing is typically level 0
      metadata: {
        isCorrect,
        creatorAnswer: currentQuestion.type === "choice" && currentQuestion.choices && currentQuestion.correctChoiceIndex >= 0
          ? currentQuestion.choices[currentQuestion.correctChoiceIndex]
          : currentQuestion.creatorAnswer,
        correctAnswer: currentQuestion.type === "choice" && currentQuestion.choices && currentQuestion.correctChoiceIndex >= 0
          ? currentQuestion.choices[currentQuestion.correctChoiceIndex]
          : currentQuestion.creatorAnswer,
        questionType: currentQuestion.type,
        score: isCorrect ? 1 : 0,
      },
    });

    if (isCorrect) {
      setScore(score + 1);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 2000);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnswer("");
        setFeedback(null);
      } else {
        onComplete();
      }
    }, 1500);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No guessing questions available</p>
            <Button onClick={onComplete} className="mt-4">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-love-gradient">
      {showHearts && <FloatingHearts />}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-3 sm:mb-4">
          <div className="w-full bg-pink-100 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 h-3 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0 bg-white/30 rounded-full"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <p className="text-sm font-lovable text-pink-600 mt-2 text-center">
            Question {currentIndex + 1} of {questions.length} • Score: {score} 💕
          </p>
        </div>

        <Card className="cute-shadow romantic-border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white p-4 sm:p-6">
            <CardTitle className="text-center text-lg sm:text-xl font-romantic">
              <Heart className="inline h-5 w-5 sm:h-6 sm:w-6 mb-1 fill-white" /> Guessing Game
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-gradient-to-br from-white to-pink-50/30">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <h2 className="text-2xl font-lovable text-pink-800 mb-6 leading-relaxed">{currentQuestion.label}</h2>
              
              {currentQuestion.type === "choice" && currentQuestion.choices && currentQuestion.choices.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-pink-600 font-lovable mb-4">Choose your answer:</p>
                  <div className="grid gap-3">
                    {currentQuestion.choices.map((choice: string, index: number) => (
                      <motion.button
                        key={index}
                        onClick={() => setAnswer(choice)}
                        disabled={feedback !== null}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 font-lovable text-lg ${
                          answer === choice
                            ? "bg-pink-100 border-pink-400 text-pink-800 shadow-md"
                            : "bg-white border-pink-200 text-pink-700 hover:border-pink-300 hover:bg-pink-50"
                        } ${feedback !== null ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        whileHover={feedback === null ? { scale: 1.02 } : {}}
                        whileTap={feedback === null ? { scale: 0.98 } : {}}
                      >
                        {choice}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <Input
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Your answer... 💭"
                  className="text-lg text-center font-lovable border-pink-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl"
                  disabled={feedback !== null}
                />
              )}
            </motion.div>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center p-4 rounded-xl font-lovable ${
                  feedback === "correct" ? "bg-green-100 text-green-700 border border-green-200" : "bg-orange-100 text-orange-700 border border-orange-200"
                }`}
              >
                {feedback === "correct" ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Great guess! ✨</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="h-5 w-5" />
                    <span className="font-semibold">
                      Almost! The answer was: {
                        currentQuestion.type === "choice" && currentQuestion.choices && currentQuestion.correctChoiceIndex >= 0
                          ? currentQuestion.choices[currentQuestion.correctChoiceIndex]
                          : currentQuestion.creatorAnswer
                      } 💕
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!answer.trim() || feedback !== null}
              size="lg"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 font-lovable"
            >
              {currentIndex === questions.length - 1 ? "Finish ✨" : "Next"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
