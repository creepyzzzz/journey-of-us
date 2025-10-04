"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Play, Sparkles, Star, Flower2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameCard } from "@/components/game-card";
import { FloatingHearts } from "@/components/floating-hearts";
import { RomanticHearts, FloatingSparkles, PulsingHeart, RomanticStars } from "@/components/romantic-animations";
import { FlyingButterflies } from "@/components/flying-butterflies";
import { useSupabaseGameStore } from "@/lib/supabase-store";
import { createEmptyGame, createStarterGame } from "@/lib/seed-data";
import { useToast } from "@/hooks/use-toast";
import { useTouchPrevention } from "@/hooks/use-touch-prevention";
import { GameCreation, WaitingRoom } from "@/components/multiplayer/game-creation";
import { GameJoining } from "@/components/multiplayer/game-joining";
import { useMultiplayerStore } from "@/lib/multiplayer-store";

export default function Home() {
  const router = useRouter();
  const { games, loadGames, setCurrentGame, deleteGame } = useSupabaseGameStore();
  const [loveCode, setLoveCode] = useState("");
  const [isCreatingStarter, setIsCreatingStarter] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const { toast } = useToast();
  const { handleTouchStart, handleTouchMove, handleTouchEnd, handleClick } = useTouchPrevention();
  
  // Multiplayer state
  const [showMultiplayerMode, setShowMultiplayerMode] = useState(false);
  const [multiplayerStep, setMultiplayerStep] = useState<'selection' | 'create' | 'join' | 'waiting'>('selection');
  const [selectedGameForMultiplayer, setSelectedGameForMultiplayer] = useState<any>(null);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const { currentRoom: multiplayerRoom } = useMultiplayerStore();

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
        variant: "success",
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
        variant: "success",
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
          title: "Journey deleted 💔",
          description: `"${game.title}" has been removed from your collection`,
          variant: "success",
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

  // Multiplayer handlers
  const handlePlayWithPartner = () => {
    setShowMultiplayerMode(true);
    setMultiplayerStep('selection');
  };

  const handleCreateGame = () => {
    if (games.length === 0) {
      toast({
        title: "No games available",
        description: "Please create a game first before starting multiplayer",
        variant: "destructive",
      });
      return;
    }
    setMultiplayerStep('create');
  };

  const handleJoinGame = () => {
    setMultiplayerStep('join');
  };

  const handleGameSelected = (game: any) => {
    setSelectedGameForMultiplayer(game);
    // Don't change step yet - the GameCreation component will handle the flow
  };

  const handleRoomCreated = (room: any) => {
    setCurrentRoom(room);
    setMultiplayerStep('waiting');
  };

  const handleRoomJoined = (room: any) => {
    setCurrentRoom(room);
    setMultiplayerStep('waiting');
  };

  const handleGameStart = () => {
    if (selectedGameForMultiplayer) {
      router.push(`/play/${selectedGameForMultiplayer.slug}?multiplayer=true&room=${currentRoom?.id}`);
    }
  };

  const handleBackToSelection = () => {
    setMultiplayerStep('selection');
    setSelectedGameForMultiplayer(null);
    setCurrentRoom(null);
  };

  const handleBackToHome = () => {
    setShowMultiplayerMode(false);
    setMultiplayerStep('selection');
    setSelectedGameForMultiplayer(null);
    setCurrentRoom(null);
  };



  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 relative overflow-hidden mobile-romantic scroll-container">
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
                    onClick={(e) => handleClick(e, handleCreateNew)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={(e) => handleTouchEnd(e, handleCreateNew)}
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
                    onClick={(e) => handleClick(e, handleCreateStarter)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={(e) => handleTouchEnd(e, handleCreateStarter)}
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
                      onClick={(e) => handleClick(e, handlePlayWithCode)}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={(e) => handleTouchEnd(e, handlePlayWithCode)}
                      className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl px-6 py-3 sm:py-2 cute-shadow hover:romantic-glow transition-all duration-300 font-bold h-12 sm:h-auto mobile-touch"
                      style={{ 
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation'
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Play with Partner Section */}
            <div className="pt-6 sm:pt-8 border-t border-rose-100">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center"
              >
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-pink-700 tracking-wide">Play with Partner</h2>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    size="lg"
                    onClick={(e) => handleClick(e, handlePlayWithPartner)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={(e) => handleTouchEnd(e, handlePlayWithPartner)}
                    className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 hover:from-purple-500 hover:via-pink-600 hover:to-rose-600 text-white rounded-xl sm:rounded-2xl cute-shadow hover:romantic-glow transition-all duration-300 p-6 sm:p-8 mobile-touch min-h-[120px] sm:min-h-[140px]"
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-3 w-full h-full">
                      <Users className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" />
                      <div className="text-center space-y-1">
                        <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide block">
                          Play with Partner
                        </span>
                        <span className="text-sm sm:text-base opacity-90 block leading-tight px-2">
                          Create or join a multiplayer game
                        </span>
                      </div>
                    </div>
                  </Button>
                </motion.div>
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

        {/* Multiplayer Modal */}
        <AnimatePresence>
          {showMultiplayerMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleBackToHome}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {multiplayerStep === 'selection' && (
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          Play with Partner
                        </h3>
                        <p className="text-gray-600">
                          Choose how you want to start your multiplayer journey!
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <Button
                          onClick={handleCreateGame}
                          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-4 sm:py-5 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 min-h-[80px] sm:min-h-[90px]"
                        >
                          <div className="flex items-center space-x-3 w-full px-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <div className="font-semibold text-sm sm:text-base">Create New Game</div>
                              <div className="text-xs sm:text-sm opacity-90 leading-tight mt-1 break-words">
                                Start a new game and invite your partner
                              </div>
                            </div>
                          </div>
                        </Button>

                        <Button
                          onClick={handleJoinGame}
                          variant="outline"
                          className="w-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold py-4 sm:py-5 rounded-lg min-h-[80px] sm:min-h-[90px]"
                        >
                          <div className="flex items-center space-x-3 w-full px-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <div className="font-semibold text-sm sm:text-base">Join Existing Game</div>
                              <div className="text-xs sm:text-sm opacity-75 leading-tight mt-1 break-words">
                                Enter a game code to join your partner&apos;s game
                              </div>
                            </div>
                          </div>
                        </Button>
                      </div>

                      <div className="text-center text-sm text-gray-500 mt-6">
                        <p>Both players will take turns answering questions based on the spin of the wheel!</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {multiplayerStep === 'create' && !selectedGameForMultiplayer && (
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">
                        Select a Game to Play
                      </h3>
                      <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                        {games.map((game) => (
                          <motion.div
                            key={game.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant="outline"
                              className="w-full justify-start p-3 sm:p-4 h-auto min-h-[60px]"
                              onClick={() => handleGameSelected(game)}
                            >
                              <div className="text-left w-full">
                                <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                  {game.title}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                  {game.truths.length + game.dares.length + game.secrets.length + game.memories.length + game.romanticSentences.length + game.guessingQuestions.length} items
                                </div>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex gap-3 mt-4 sm:mt-6">
                        <Button
                          variant="outline"
                          onClick={handleBackToSelection}
                          className="flex-1 text-sm sm:text-base"
                        >
                          Back
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleBackToHome}
                          className="flex-1 text-sm sm:text-base"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {multiplayerStep === 'create' && selectedGameForMultiplayer && (
                  <GameCreation
                    gameId={selectedGameForMultiplayer.id}
                    onRoomCreated={handleRoomCreated}
                  />
                )}
                
                {multiplayerStep === 'join' && (
                  <GameJoining
                    gameId={selectedGameForMultiplayer?.id || ''}
                    onRoomJoined={handleRoomJoined}
                    onBack={handleBackToSelection}
                  />
                )}
                
                {multiplayerStep === 'waiting' && currentRoom && (
                  <WaitingRoom
                    room={currentRoom}
                    onGameStart={handleGameStart}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

