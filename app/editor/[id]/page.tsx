"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  Save,
  Eye,
  Share2,
  ArrowLeft,
  Sparkles,
  Check,
  X,
  Copy,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSupabaseGameStore } from "@/lib/supabase-store";
import { useToast } from "@/hooks/use-toast";
import { TruthsEditor } from "@/components/editor/truths-editor";
import { DaresEditor } from "@/components/editor/dares-editor";
import { SecretsEditor } from "@/components/editor/secrets-editor";
import { MemoriesEditor } from "@/components/editor/memories-editor";
import { RomanticEditor } from "@/components/editor/romantic-editor";
import { GuessingEditor } from "@/components/editor/guessing-editor";
import { AnswersViewer } from "@/components/editor/answers-viewer";
import { PublishDialog } from "@/components/editor/publish-dialog";

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.id as string;
  const { currentGame, setCurrentGame, updateGame, saveGame, loadGames, loadGameById, checkLoveCodeAvailability } = useSupabaseGameStore();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [loveCodeStatus, setLoveCodeStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [isNavigating, setIsNavigating] = useState(false);
  const [loveCodeCopied, setLoveCodeCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadGame = async () => {
      try {
        console.log("Loading game with ID:", gameId);
        
        // First check if we already have the current game loaded
        const store = useSupabaseGameStore.getState();
        if (store.currentGame?.id === gameId) {
          console.log("Game already loaded, skipping fetch");
          setIsLoading(false);
          return;
        }
        
        // Check if game exists in our games array
        const existingGame = store.games.find((g) => g.id === gameId);
        if (existingGame) {
          console.log("Found game in cache, setting as current");
          setCurrentGame(existingGame);
          setIsLoading(false);
          return;
        }
        
        // Only load the specific game if we don't have it in cache
        console.log("Game not in cache, loading specific game from database");
        const game = await loadGameById(gameId);
        console.log("Found game:", game ? game.title : "Not found");
        
        if (game) {
          setCurrentGame(game);
          console.log("Current game set successfully");
        } else {
          console.error("Game not found with ID:", gameId);
          toast({
            title: "Game not found",
            description: "The journey you're looking for doesn't exist. Redirecting to home.",
            variant: "destructive",
          });
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      } catch (error) {
        console.error("Error loading game:", error);
        toast({
          title: "Error loading journey",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (gameId) {
      loadGame();
    } else {
      console.error("No game ID provided");
      router.push("/");
    }
  }, [gameId, loadGameById, setCurrentGame, router, toast]);

  const handleSave = async () => {
    await saveGame();
    toast({
      title: "Saved! 💾",
      description: "Your journey has been saved",
      variant: "success",
    });
  };

  const handleCopyLoveCode = async () => {
    if (!currentGame?.loveCode) {
      toast({
        title: "No love code",
        description: "Please enter a love code first",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(currentGame.loveCode);
      setLoveCodeCopied(true);
      setTimeout(() => setLoveCodeCopied(false), 2000);
      
      toast({
        title: "Love code copied! 💕",
        description: `"${currentGame.loveCode}" copied to clipboard`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the love code to clipboard",
        variant: "destructive",
      });
    }
  };


  const handlePreview = () => {
    if (currentGame) {
      router.push(`/play/${currentGame.slug || currentGame.id}?preview=true`);
    }
  };

  const handleBack = useCallback(async () => {
    console.log("handleBack called, isNavigating:", isNavigating);
    
    if (isNavigating) {
      console.log("Already navigating, returning early");
      return; // Prevent multiple clicks
    }
    
    console.log("Setting isNavigating to true");
    setIsNavigating(true);
    
    try {
      // Check if there are unsaved changes
      const store = useSupabaseGameStore.getState();
      console.log("Editor state isDirty:", store.editorState.isDirty);
      
      if (store.editorState.isDirty) {
        const shouldSave = confirm("You have unsaved changes. Do you want to save before leaving?");
        console.log("User chose to save:", shouldSave);
        
        if (shouldSave) {
          console.log("Saving game...");
          await saveGame();
          console.log("Game saved successfully");
        }
      }
      
      // Navigate back to home
      console.log("Navigating to home page");
      router.push("/");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation
      console.log("Using fallback navigation");
      window.location.href = "/";
    } finally {
      // Reset navigation state
      console.log("Resetting navigation state");
      setTimeout(() => {
        setIsNavigating(false);
      }, 500);
    }
  }, [isNavigating, router, saveGame]);

  // Validate love code availability
  useEffect(() => {
    const validateLoveCode = async () => {
      if (!currentGame?.loveCode || currentGame.loveCode.length < 3) {
        setLoveCodeStatus('idle');
        return;
      }

      setLoveCodeStatus('checking');
      try {
        const isAvailable = await checkLoveCodeAvailability(currentGame.loveCode, currentGame.id);
        setLoveCodeStatus(isAvailable ? 'available' : 'taken');
      } catch (error) {
        setLoveCodeStatus('idle');
      }
    };

    const timeoutId = setTimeout(validateLoveCode, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [currentGame?.loveCode, currentGame?.id, checkLoveCodeAvailability]);

  // Add keyboard shortcut for back navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key or Alt+Left arrow for back navigation
      if (event.key === 'Escape' || (event.altKey && event.key === 'ArrowLeft')) {
        event.preventDefault();
        handleBack();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleBack]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // Check if there are unsaved changes
      const store = useSupabaseGameStore.getState();
      if (store.editorState.isDirty) {
        const shouldSave = confirm("You have unsaved changes. Do you want to save before leaving?");
        if (shouldSave) {
          saveGame();
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [saveGame]);

  if (isLoading || !currentGame) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="h-16 w-16 text-rose-400 fill-rose-400 mx-auto mb-6" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-lovable text-rose-800 mb-2">Loading Your Journey</h2>
            <p className="text-lg text-rose-600 font-lovable">Preparing your love story editor...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 mobile-romantic"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-pink-200"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="h-8 w-8 fill-current" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-rose-200"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -15, 15, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Heart className="h-6 w-6 fill-current" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 left-20 text-purple-200"
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 20, -20, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Heart className="h-10 w-10 fill-current" />
        </motion.div>
      </div>

      <motion.header 
        className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-10 cute-shadow"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Back button clicked");
                  handleBack();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isNavigating) {
                    console.log("Back button touched");
                    handleBack();
                  }
                }}
                disabled={isNavigating}
                className="h-8 w-8 sm:h-10 sm:w-10 touch-manipulation hover:bg-pink-50 rounded-full"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                title="Back to Home (Esc or Alt+←)"
              >
                {isNavigating ? (
                  <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-pink-300 border-t-pink-500 rounded-full" />
                ) : (
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                )}
              </Button>
              <div className="flex items-center gap-2 sm:gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="h-5 w-5 sm:h-7 sm:w-7 text-pink-500 fill-pink-500" />
                </motion.div>
                <div>
                  <h1 className="text-base sm:text-2xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    Journey Editor
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreview} 
                className="h-8 px-3 sm:px-4 text-xs sm:text-sm touch-manipulation border-pink-200 hover:bg-pink-50 hover:border-pink-300 rounded-full"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 text-pink-600" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave} 
                className="h-8 px-3 sm:px-4 text-xs sm:text-sm touch-manipulation border-green-200 hover:bg-green-50 hover:border-green-300 rounded-full"
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 text-green-600" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button 
                size="sm" 
                onClick={() => setShowPublishDialog(true)} 
                className="h-8 px-3 sm:px-4 text-xs sm:text-sm touch-manipulation bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full cute-shadow"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Publish</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.main 
        className="container mx-auto px-3 sm:px-6 py-4 sm:py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Journey Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white via-pink-50/50 to-rose-50/50 rounded-2xl sm:rounded-3xl cute-shadow p-4 sm:p-8 mb-6 sm:mb-8 border border-pink-100"
          >
            <div className="space-y-4 sm:space-y-6">

              <div className="space-y-6 sm:space-y-8">
                {/* Journey Title */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 justify-center">
                    <Edit2 className="h-4 w-4 text-pink-500" />
                    <label className="text-sm font-semibold text-pink-600 uppercase tracking-wide">Journey Title</label>
                  </div>
                  <Input
                    value={currentGame.title}
                    onChange={(e) => updateGame({ title: e.target.value })}
                    placeholder="✨ Our Love Story ✨"
                    className="text-lg sm:text-2xl md:text-3xl font-bold h-14 sm:h-18 border-2 border-pink-200 bg-white/80 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-center placeholder:text-pink-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>

                {/* Names Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center">
                    <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                    <label className="text-sm font-semibold text-pink-600 uppercase tracking-wide">Love Names</label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-pink-500 uppercase tracking-wide ml-2">Your Name</label>
                      <Input
                        value={currentGame.creatorName || ""}
                        onChange={(e) => updateGame({ creatorName: e.target.value })}
                        placeholder="💕 Your Name"
                        className="h-12 sm:h-14 text-base sm:text-lg font-semibold border-2 border-pink-200 bg-white/80 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl text-center placeholder:text-pink-400 shadow-sm hover:shadow-md transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-pink-500 uppercase tracking-wide ml-2">Partner's Name</label>
                      <Input
                        value={currentGame.partnerNameHint || ""}
                        onChange={(e) => updateGame({ partnerNameHint: e.target.value })}
                        placeholder="💖 Partner's Name"
                        className="h-12 sm:h-14 text-base sm:text-lg font-semibold border-2 border-pink-200 bg-white/80 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl text-center placeholder:text-pink-400 shadow-sm hover:shadow-md transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Love Code Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 justify-center">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    <label className="text-sm font-semibold text-pink-600 uppercase tracking-wide">Love Code</label>
                    <span className="text-xs text-pink-400 bg-pink-100 px-2 py-1 rounded-full">Optional</span>
                  </div>
                  <div className="relative">
                    <Input
                      value={currentGame.loveCode || ""}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        updateGame({ loveCode: value });
                      }}
                      placeholder="💝 LOVE123"
                      className="h-12 sm:h-14 font-mono font-bold text-center pr-16 sm:pr-20 text-base sm:text-lg border-2 border-pink-200 bg-white/80 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-2xl placeholder:text-pink-400 shadow-sm hover:shadow-md transition-all duration-200"
                      maxLength={20}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {currentGame.loveCode && currentGame.loveCode.length >= 3 && (
                        <>
                          {loveCodeStatus === 'checking' && (
                            <div className="animate-spin h-4 w-4 border-2 border-pink-300 border-t-pink-500 rounded-full" />
                          )}
                          {loveCodeStatus === 'available' && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          {loveCodeStatus === 'taken' && (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopyLoveCode}
                            className="h-7 w-7 text-pink-500 hover:text-pink-600 hover:bg-pink-50 rounded-full"
                          >
                            {loveCodeCopied ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Editor Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-white via-pink-50/30 to-rose-50/30 rounded-2xl sm:rounded-3xl cute-shadow overflow-hidden border border-pink-100"
          >
            <Tabs defaultValue="truths" className="w-full">
              {/* Custom Tabs Header */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
                <TabsList className="w-full justify-start border-none rounded-none h-auto p-0 overflow-x-auto scrollbar-hide bg-transparent">
                  <TabsTrigger 
                    value="truths" 
                    className="rounded-none text-sm sm:text-base px-3 sm:px-6 py-4 min-w-0 flex-shrink-0 border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 hover:bg-pink-50/50 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="text-lg">❤️</span>
                    <span className="font-semibold">Truth</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="dares" 
                    className="rounded-none text-sm sm:text-base px-3 sm:px-6 py-4 min-w-0 flex-shrink-0 border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 hover:bg-pink-50/50 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="text-lg">⭐</span>
                    <span className="font-semibold">Dare</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="secrets" 
                    className="rounded-none text-sm sm:text-base px-3 sm:px-6 py-4 min-w-0 flex-shrink-0 border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 hover:bg-pink-50/50 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="text-lg">🤫</span>
                    <span className="font-semibold">Secret</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="memories" 
                    className="rounded-none text-sm sm:text-base px-3 sm:px-6 py-4 min-w-0 flex-shrink-0 border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 hover:bg-pink-50/50 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="text-lg">💭</span>
                    <span className="font-semibold">Memory</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="romantic" 
                    className="rounded-none text-sm sm:text-base px-3 sm:px-6 py-4 min-w-0 flex-shrink-0 border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 hover:bg-pink-50/50 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="text-lg">💕</span>
                    <span className="font-semibold">Romance</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="guessing" 
                    className="rounded-none text-sm sm:text-base px-3 sm:px-6 py-4 min-w-0 flex-shrink-0 border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 hover:bg-pink-50/50 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="text-lg">🎯</span>
                    <span className="font-semibold">Guessing</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="answers" 
                    className="rounded-none text-sm sm:text-base px-3 sm:px-6 py-4 min-w-0 flex-shrink-0 border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 hover:bg-pink-50/50 transition-all duration-200 flex items-center gap-2"
                  >
                    <span className="text-lg">📊</span>
                    <span className="font-semibold">Answers</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6 md:p-8">
                <TabsContent value="truths" className="mt-0">
                  <TruthsEditor />
                </TabsContent>
                <TabsContent value="dares" className="mt-0">
                  <DaresEditor />
                </TabsContent>
                <TabsContent value="secrets" className="mt-0">
                  <SecretsEditor />
                </TabsContent>
                <TabsContent value="memories" className="mt-0">
                  <MemoriesEditor />
                </TabsContent>
                <TabsContent value="romantic" className="mt-0">
                  <RomanticEditor />
                </TabsContent>
                <TabsContent value="guessing" className="mt-0">
                  <GuessingEditor />
                </TabsContent>
                <TabsContent value="answers" className="mt-0">
                  <AnswersViewer gameId={gameId} />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </motion.main>

      <PublishDialog open={showPublishDialog} onOpenChange={setShowPublishDialog} />
    </motion.div>
  );
}
