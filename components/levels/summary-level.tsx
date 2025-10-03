"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Flower2, Star, Home, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FloatingHearts } from "@/components/floating-hearts";

export function SummaryLevel({ gameContent, session }: any) {
  const router = useRouter();

  const romanticQuotes = [
    "Love is not about how many days, months, or years you have been together. It's about how much you love each other every single day.",
    "The best love is the kind that awakens the soul and makes us reach for more, that plants a fire in our hearts and brings peace to our minds.",
    "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
    "You are my today and all of my tomorrows.",
    "I have found the one whom my soul loves.",
  ];

  const randomQuote = romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Enhanced floating hearts */}
      <FloatingHearts count={15} duration={4} />
      
      {/* Dreamy background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating sparkles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-300/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Floating flowers */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`flower-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <Flower2 className="h-6 w-6 text-pink-300/50" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl relative z-10"
      >
        {/* Main Certificate */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-0 overflow-hidden"
        >
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 p-8 sm:p-12 text-center relative">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-16 h-16 border-2 border-white/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-4 -left-4 w-12 h-12 border-2 border-white/20 rounded-full"
              />
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="relative z-10"
            >
              <div className="flex justify-center items-center gap-3 mb-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Heart className="h-12 w-12 text-white fill-white" />
                </motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Star className="h-10 w-10 text-white fill-white" />
                </motion.div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 font-lovable">
                Journey Complete ✨
              </h1>
              <p className="text-xl text-white/90 font-lovable">
                Your Love Story Awaits
              </p>
            </motion.div>
          </div>

          {/* Certificate Content */}
          <div className="p-8 sm:p-12 text-center space-y-8">
            {/* Game Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-3xl sm:text-4xl font-lovable text-rose-800 mb-4">
                {gameContent.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto rounded-full"></div>
            </motion.div>

            {/* Romantic Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-rose-200/50"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-4"
              >
                <Heart className="h-8 w-8 mx-auto text-rose-400 fill-rose-400" />
              </motion.div>
              <blockquote className="text-lg sm:text-xl text-rose-700 font-lovable italic leading-relaxed">
                "{randomQuote}"
              </blockquote>
            </motion.div>

            {/* Certificate Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-lovable text-rose-800">
                Certificate of Love 💕
              </h3>
              <p className="text-lg text-rose-600 font-lovable leading-relaxed max-w-2xl mx-auto">
                Through every question, every secret shared, and every memory cherished, 
                your bond has grown stronger. This journey has been a beautiful testament 
                to the love you share.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{ pointerEvents: 'auto' }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Home Sweet Home motion div clicked");
                  try {
                    router.push("/");
                  } catch (error) {
                    console.error("Router navigation failed, using window.location:", error);
                    window.location.href = "/";
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Home Sweet Home motion div touched");
                  try {
                    router.push("/");
                  } catch (error) {
                    console.error("Router navigation failed, using window.location:", error);
                    window.location.href = "/";
                  }
                }}
              >
                <Button
                  className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white px-8 py-4 rounded-full font-lovable text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer w-full"
                  style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}
                >
                  <Home className="h-5 w-5 mr-2" />
                  Home Sweet Home
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-2 border-rose-300 text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-full font-lovable text-lg transition-all duration-300"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Relive the Magic
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom decorative hearts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center mt-8 space-x-4"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            >
              <Heart className="h-6 w-6 text-rose-300 fill-rose-300" />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
