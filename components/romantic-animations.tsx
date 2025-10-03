"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";

// Floating Sparkles Component
export function FloatingSparkles({ count = 8 }: { count?: number }) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute text-yellow-300"
          style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
      ))}
    </div>
  );
}

// Romantic Hearts Background
export function RomanticHearts() {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
      delay: Math.random() * 3,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-pink-200/40"
          style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0, heart.size, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            delay: heart.delay,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <Heart className="h-8 w-8 fill-current" />
        </motion.div>
      ))}
    </div>
  );
}

// Pulsing Heart Component
export function PulsingHeart() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="inline-block"
    >
      <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
    </motion.div>
  );
}

// Romantic Stars
export function RomanticStars() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-pink-300/50"
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: 4,
          }}
        >
          <Star className="h-5 w-5 fill-current" />
        </motion.div>
      ))}
    </div>
  );
}
