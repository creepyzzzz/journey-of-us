"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useSwipeGestures } from "@/hooks/use-swipe-gestures";

interface LevelTemplateProps {
  title: string;
  items: Array<{ id: string; text: string }>;
  onComplete: () => void;
  icon?: React.ReactNode;
}

export function LevelTemplate({ title, items, onComplete, icon }: LevelTemplateProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [response, setResponse] = useState("");

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  const handleNext = () => {
    setResponse("");
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setResponse("");
    }
  };

  const { swipeHandlers } = useSwipeGestures({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
    threshold: 50,
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No content available for this level</p>
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
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
        {...swipeHandlers}
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
            {currentIndex + 1} of {items.length}
          </p>
        </div>

        <Card className="cute-shadow romantic-border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 text-white p-4 sm:p-6">
            <CardTitle className="text-center flex items-center justify-center gap-2 text-lg sm:text-xl font-romantic">
              {icon || <Heart className="h-5 w-5 sm:h-6 sm:w-6 fill-white" />}
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-gradient-to-br from-white to-pink-50/30">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-lovable text-pink-800 mb-4 sm:mb-6 leading-relaxed">{currentItem.text}</h2>
            </motion.div>

            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Share your thoughts... 💭"
              rows={3}
              className="resize-none text-sm sm:text-base font-lovable border-pink-200 focus:border-pink-400 focus:ring-pink-200 rounded-xl"
            />

            <div className="flex gap-3">
              {currentIndex > 0 && (
                <Button 
                  onClick={handlePrevious} 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 h-12 sm:h-auto font-lovable border-pink-300 text-pink-700 hover:bg-pink-50"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Previous
                </Button>
              )}
              <Button 
                onClick={handleNext} 
                size="lg" 
                className={`${currentIndex > 0 ? 'flex-1' : 'w-full'} h-12 sm:h-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 font-lovable`}
              >
                {currentIndex === items.length - 1 ? "Complete ✨" : "Next"}
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
            </div>
            
            {/* Mobile swipe hint */}
            <div className="text-center text-xs font-lovable text-pink-500 mt-2 sm:hidden">
              Swipe left for next, right for previous 💕
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
