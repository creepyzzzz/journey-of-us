"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

interface LevelIndicatorProps {
  currentLevel: number;
  totalLevels: number;
  levelNames: string[];
}

export function LevelIndicator({ currentLevel, totalLevels, levelNames }: LevelIndicatorProps) {
  const levelName = levelNames[currentLevel] || `Level ${currentLevel + 1}`;
  const progress = ((currentLevel + 1) / totalLevels) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-200/50 shadow-sm"
    >
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
            </motion.div>
            <h2 className="font-romantic text-lg text-pink-700 font-semibold">
              {levelName}
            </h2>
            <Sparkles className="h-4 w-4 text-pink-400" />
          </div>
          <div className="text-sm font-lovable text-pink-600">
            {currentLevel + 1} of {totalLevels}
          </div>
        </div>
        
        <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 h-2 rounded-full relative"
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
      </div>
    </motion.div>
  );
}
