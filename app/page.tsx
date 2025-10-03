"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Play, Sparkles, Star, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameCard } from "@/components/game-card";
import { FloatingHearts } from "@/components/floating-hearts";
import { RomanticHearts, FloatingSparkles, PulsingHeart, RomanticStars } from "@/components/romantic-animations";
import { FlyingButterflies } from "@/components/flying-butterflies";
import { useSupabaseGameStore } from "@/lib/supabase-store";
import { createEmptyGame, createStarterGame } from "@/lib/seed-data";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const router = useRouter();
  const { games, loadGames, setCurrentGame, deleteGame } = useSupabaseGameStore();
  const [loveCode, setLoveCode] = useState("");
  const [isCreatingStarter, setIsCreatingStarter] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleCreateNew = async () => {
    if (isCreatingNew) return;
    
    setIsCreatingNew(true);
    try {
      const newGame = createEmptyGame("My Journey");
      setCurrentGame(newGame);
      await useSupabaseGameStore.getState().saveGame();
      
      toast({
        title: "New journey created! ✨",
        description: "Let's start building your love story",
      });
      
      // Add a small delay for smooth transition
      setTimeout(() => {
        console.log("Navigating to editor:", `/editor/${newGame.id}`);
        router.push(`/editor/${newGame.id}`);
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new journey",
        variant: "destructive",
      });
    } finally {
      setIsCreatingNew(false);
    }
  };

  const handleCreateStarter = async () => {
    if (isCreatingStarter || isCreatingNew) return;
    
    setIsCreatingStarter(true);
    try {
      console.log("Creating starter game...");
      const starter = createStarterGame();
      console.log("Starter game created:", starter.id);
      
      setCurrentGame(starter);
      console.log("Current game set");
      
      await useSupabaseGameStore.getState().saveGame();
      console.log("Game saved to database");
      
      toast({
        title: "Starter pack created! 💕",
        description: "Opening editor to customize your journey...",
      });
      
      // Add a small delay for smooth transition and visual feedback
      setTimeout(() => {
        console.log("Navigating to editor:", `/editor/${starter.id}`);
        router.push(`/editor/${starter.id}`);
      }, 1000);
    } catch (error) {
      console.error("Error creating starter pack:", error);
      toast({
        title: "Error",
        description: "Failed to create starter pack. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingStarter(false);
    }
  };

  const handleEditGame = (game: any) => {
    if (!game) return;
    
    // Set current game immediately for faster navigation
    setCurrentGame(game);
    
    // Use router.push with shallow routing for faster navigation
    router.push(`/editor/${game.id}`, { scroll: false });
  };

  const handleDeleteGame = async (game: any) => {
    if (confirm(`Are you sure you want to delete "${game.title}"? This action cannot be undone.`)) {
      try {
        await deleteGame(game.id);
        toast({
          title: "Game deleted",
          description: `"${game.title}" has been deleted successfully`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the game",
          variant: "destructive",
        });
      }
    }
  };

  const handlePlayWithCode = () => {
    if (loveCode.trim()) {
      router.push(`/play/${loveCode}`);
    } else {
      toast({
        title: "Enter love code",
        description: "Please enter a valid love code",
        variant: "destructive",
      });
    }
  };



  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 relative overflow-hidden mobile-romantic">
      {/* Romantic Background Animations */}
      <FlyingButterflies />
      <RomanticHearts />
      <FloatingSparkles count={6} />
      <RomanticStars />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6"
          >
            <PulsingHeart />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent font-poppins tracking-tight">
              Journey of Us
            </h1>
            <PulsingHeart />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-pink-600 max-w-2xl mx-auto font-bold tracking-wide px-2"
          >
            ✨ Create Magical Moments Together ✨
          </motion.p>
        </motion.div>

        {/* Main Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto mb-8 sm:mb-16"
        >
          <div className="bg-gradient-to-br from-pink-50/90 to-rose-50/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl cute-shadow p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 romantic-border">
            {/* Create Section */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-6"
              >
                <Flower2 className="h-4 w-4 sm:h-6 sm:w-6 text-rose-400" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-pink-700 tracking-wide">Start Your Love Story</h2>
                <Flower2 className="h-4 w-4 sm:h-6 sm:w-6 text-rose-400" />
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div
                  whileHover={{ scale: isCreatingNew ? 1 : 1.05, y: isCreatingNew ? 0 : -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    size="lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCreateNew();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isCreatingNew && !isCreatingStarter) {
                        handleCreateNew();
                      }
                    }}
                    disabled={isCreatingNew || isCreatingStarter}
                    className="h-20 sm:h-24 w-full bg-gradient-to-br from-pink-400 via-rose-500 to-pink-600 hover:from-pink-500 hover:via-rose-600 hover:to-pink-700 active:from-pink-600 active:via-rose-700 active:to-pink-800 text-white rounded-xl sm:rounded-2xl cute-shadow hover:romantic-glow transition-all duration-300 border-0 p-4 sm:p-6 mobile-touch disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 w-full">
                      {isCreatingNew ? (
                        <div className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                      )}
                      <span className="text-base sm:text-lg md:text-xl font-bold tracking-wide">
                        {isCreatingNew ? "Creating..." : "Create from Scratch"}
                      </span>
                    </div>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: isCreatingStarter ? 1 : 1.05, y: isCreatingStarter ? 0 : -5 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isCreatingStarter ? { 
                    scale: [1, 1.02],
                    boxShadow: [
                      "0 4px 20px rgba(244, 114, 182, 0.3)",
                      "0 8px 30px rgba(244, 114, 182, 0.5)"
                    ]
                  } : {}}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300,
                    duration: isCreatingStarter ? 1.5 : 0.3,
                    repeat: isCreatingStarter ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCreateStarter();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isCreatingStarter && !isCreatingNew) {
                        handleCreateStarter();
                      }
                    }}
                    disabled={isCreatingNew || isCreatingStarter}
                    className="h-20 sm:h-24 w-full border-3 border-pink-300 bg-gradient-to-br from-pink-50 to-rose-50 text-pink-700 hover:from-pink-100 hover:to-rose-100 hover:border-pink-400 active:from-pink-200 active:to-rose-200 active:border-pink-500 rounded-xl sm:rounded-2xl cute-shadow hover:romantic-glow transition-all duration-300 p-4 sm:p-6 mobile-touch disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 w-full">
                      {isCreatingStarter ? (
                        <motion.div 
                          className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-2 border-pink-400 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <Heart className="h-6 w-6 sm:h-8 sm:w-8 fill-current" />
                      )}
                      <span className="text-base sm:text-lg md:text-xl font-bold tracking-wide">
                        {isCreatingStarter ? "Creating..." : "Use Starter Pack"}
                      </span>
                    </div>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Play Section */}
            <div className="pt-6 sm:pt-8 border-t border-rose-100">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center"
              >
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-pink-700 tracking-wide">Join a Journey</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    placeholder="Enter love code..."
                    value={loveCode}
                    onChange={(e) => setLoveCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePlayWithCode()}
                    className="flex-1 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:ring-pink-400 bg-white/80 h-12 sm:h-auto"
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handlePlayWithCode}
                      className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl px-6 py-3 sm:py-2 cute-shadow hover:romantic-glow transition-all duration-300 font-bold h-12 sm:h-auto mobile-touch"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.div>

        {/* Your Journeys Section */}
        {games.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center mb-6 sm:mb-8"
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Star className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-400 fill-current" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent tracking-wide">
                  Your Love Stories
                </h2>
                <Star className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-400 fill-current" />
              </div>
              <p className="text-sm sm:text-base md:text-lg text-pink-600 font-semibold px-2">Continue your romantic adventures</p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="cursor-pointer"
                >
                  <GameCard 
                    game={game} 
                    onClick={() => handleEditGame(game)} 
                    onDelete={() => handleDeleteGame(game)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

