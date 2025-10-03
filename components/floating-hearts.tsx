"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface FloatingHeartsProps {
  count?: number;
  duration?: number;
}

export function FloatingHearts({ count = 5, duration = 2 }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number }>>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
    }));
    setHearts(newHearts);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0 text-rose-400"
          style={{ left: `${heart.x}%` }}
          initial={{ y: 0, opacity: 1, scale: 0 }}
          animate={{
            y: -window.innerHeight,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.8],
          }}
          transition={{
            duration,
            delay: heart.id * 0.2,
            ease: "easeOut",
          }}
        >
          <Heart className="h-6 w-6 fill-current" />
        </motion.div>
      ))}
    </div>
  );
}
