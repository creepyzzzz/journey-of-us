"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Butterfly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  direction: number;
  color: string;
}

const butterflyColors = [
  "#FFB6C1", // Light Pink
  "#FFC0CB", // Pink
  "#FF69B4", // Hot Pink
  "#FF1493", // Deep Pink
  "#FFB6C1", // Light Pink
  "#FFC0CB", // Pink
  "#DDA0DD", // Plum
  "#DA70D6", // Orchid
];

const butterflyShapes = [
  // Butterfly 1 - Simple
  "M12 2C8 2 6 4 6 8C6 12 8 14 12 16C16 14 18 12 18 8C18 4 16 2 12 2ZM10 6C10 5 11 4 12 4C13 4 14 5 14 6C14 7 13 8 12 8C11 8 10 7 10 6ZM12 10C11 10 10 9 10 8C10 7 11 6 12 6C13 6 14 7 14 8C14 9 13 10 12 10Z",
  
  // Butterfly 2 - More detailed
  "M12 1C7 1 4 3 4 7C4 11 7 13 12 15C17 13 20 11 20 7C20 3 17 1 12 1ZM9 5C9 4 10 3 11 3C12 3 13 4 13 5C13 6 12 7 11 7C10 7 9 6 9 5ZM11 9C10 9 9 8 9 7C9 6 10 5 11 5C12 5 13 6 13 7C13 8 12 9 11 9ZM13 5C13 4 14 3 15 3C16 3 17 4 17 5C17 6 16 7 15 7C14 7 13 6 13 5ZM15 9C14 9 13 8 13 7C13 6 14 5 15 5C16 5 17 6 17 7C17 8 16 9 15 9Z",
  
  // Butterfly 3 - Elegant
  "M12 0C6 0 2 2 2 6C2 10 6 12 12 14C18 12 22 10 22 6C22 2 18 0 12 0ZM8 4C8 3 9 2 10 2C11 2 12 3 12 4C12 5 11 6 10 6C9 6 8 5 8 4ZM10 8C9 8 8 7 8 6C8 5 9 4 10 4C11 4 12 5 12 6C12 7 11 8 10 8ZM14 4C14 3 15 2 16 2C17 2 18 3 18 4C18 5 17 6 16 6C15 6 14 5 14 4ZM16 8C15 8 14 7 14 6C14 5 15 4 16 4C17 4 18 5 18 6C18 7 17 8 16 8Z"
];

export function FlyingButterflies() {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);

  useEffect(() => {
    const generateButterflies = () => {
      const newButterflies: Butterfly[] = [];
      
      for (let i = 0; i < 8; i++) {
        newButterflies.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 0.8 + Math.random() * 0.4, // 0.8 to 1.2
          duration: 15 + Math.random() * 20, // 15 to 35 seconds
          delay: Math.random() * 5, // 0 to 5 seconds delay
          direction: Math.random() * 360, // Random direction
          color: butterflyColors[Math.floor(Math.random() * butterflyColors.length)],
        });
      }
      
      setButterflies(newButterflies);
    };

    generateButterflies();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {butterflies.map((butterfly) => (
        <motion.div
          key={butterfly.id}
          className="absolute"
          style={{
            left: `${butterfly.x}%`,
            top: `${butterfly.y}%`,
            transform: `scale(${butterfly.size})`,
          }}
          initial={{ 
            opacity: 0,
            x: 0,
            y: 0,
            rotate: butterfly.direction
          }}
          animate={{
            opacity: [0, 0.7, 0.3, 0.8, 0.2, 0.6, 0],
            x: [
              Math.cos(butterfly.direction * Math.PI / 180) * 100,
              Math.cos((butterfly.direction + 45) * Math.PI / 180) * 150,
              Math.cos((butterfly.direction + 90) * Math.PI / 180) * 200,
              Math.cos((butterfly.direction + 135) * Math.PI / 180) * 250,
              Math.cos((butterfly.direction + 180) * Math.PI / 180) * 300,
            ],
            y: [
              Math.sin(butterfly.direction * Math.PI / 180) * 50,
              Math.sin((butterfly.direction + 45) * Math.PI / 180) * 75,
              Math.sin((butterfly.direction + 90) * Math.PI / 180) * 100,
              Math.sin((butterfly.direction + 135) * Math.PI / 180) * 125,
              Math.sin((butterfly.direction + 180) * Math.PI / 180) * 150,
            ],
            rotate: [
              butterfly.direction,
              butterfly.direction + 45,
              butterfly.direction + 90,
              butterfly.direction + 135,
              butterfly.direction + 180,
            ],
          }}
          transition={{
            duration: butterfly.duration,
            delay: butterfly.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="drop-shadow-sm"
          >
            <path
              d={butterflyShapes[butterfly.id % butterflyShapes.length]}
              fill={butterfly.color}
              opacity="0.8"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// Alternative simpler butterfly component
export function SimpleButterflies() {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);

  useEffect(() => {
    const generateButterflies = () => {
      const newButterflies: Butterfly[] = [];
      
      for (let i = 0; i < 6; i++) {
        newButterflies.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 0.6 + Math.random() * 0.6, // 0.6 to 1.2
          duration: 20 + Math.random() * 15, // 20 to 35 seconds
          delay: Math.random() * 3, // 0 to 3 seconds delay
          direction: Math.random() * 360,
          color: butterflyColors[Math.floor(Math.random() * butterflyColors.length)],
        });
      }
      
      setButterflies(newButterflies);
    };

    generateButterflies();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {butterflies.map((butterfly) => (
        <motion.div
          key={butterfly.id}
          className="absolute"
          style={{
            left: `${butterfly.x}%`,
            top: `${butterfly.y}%`,
            transform: `scale(${butterfly.size})`,
          }}
          initial={{ 
            opacity: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 0.6, 0.3, 0.7, 0.2, 0.5, 0],
            x: [
              Math.cos(butterfly.direction * Math.PI / 180) * 200,
              Math.cos((butterfly.direction + 60) * Math.PI / 180) * 300,
              Math.cos((butterfly.direction + 120) * Math.PI / 180) * 400,
              Math.cos((butterfly.direction + 180) * Math.PI / 180) * 500,
            ],
            y: [
              Math.sin(butterfly.direction * Math.PI / 180) * 100,
              Math.sin((butterfly.direction + 60) * Math.PI / 180) * 150,
              Math.sin((butterfly.direction + 120) * Math.PI / 180) * 200,
              Math.sin((butterfly.direction + 180) * Math.PI / 180) * 250,
            ],
          }}
          transition={{
            duration: butterfly.duration,
            delay: butterfly.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          <div
            className="w-6 h-6 rounded-full"
            style={{
              background: `radial-gradient(circle, ${butterfly.color} 0%, ${butterfly.color}80 50%, transparent 100%)`,
              boxShadow: `0 0 10px ${butterfly.color}40`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
