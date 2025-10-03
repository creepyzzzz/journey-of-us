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
      title: "Saved!",
      description: "Your journey has been saved",
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
      className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 mobile-romantic"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.header 
        className="bg-white border-b sticky top-0 z-10 cute-shadow"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-4">
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
                className="h-7 w-7 sm:h-10 sm:w-10 touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                title="Back to Home (Esc or Alt+←)"
              >
                {isNavigating ? (
                  <div className="animate-spin h-3 w-3 sm:h-5 sm:w-5 border-2 border-gray-300 border-t-blue-500 rounded-full" />
                ) : (
                  <ArrowLeft className="h-3 w-3 sm:h-5 sm:w-5" />
                )}
              </Button>
              <div className="flex items-center gap-1 sm:gap-2">
                <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-rose-400 fill-rose-400" />
                <h1 className="text-sm sm:text-xl font-bold truncate">Journey Editor</h1>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="outline" size="sm" onClick={handlePreview} className="h-7 px-2 sm:px-3 text-xs sm:text-sm touch-manipulation">
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} className="h-7 px-2 sm:px-3 text-xs sm:text-sm touch-manipulation">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button size="sm" onClick={() => setShowPublishDialog(true)} className="h-7 px-2 sm:px-3 text-xs sm:text-sm touch-manipulation">
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Publish</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.main 
        className="container mx-auto px-2 sm:px-4 py-2 sm:py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-2xl cute-shadow p-3 sm:p-6 md:p-8 mb-3 sm:mb-6"
          >
            <div className="space-y-2 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Game Title</label>
                <Input
                  value={currentGame.title}
                  onChange={(e) => updateGame({ title: e.target.value })}
                  placeholder="My Journey of Love"
                  className="text-sm sm:text-xl md:text-2xl font-bold h-8 sm:h-auto"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Description</label>
                <Textarea
                  value={currentGame.description || ""}
                  onChange={(e) => updateGame({ description: e.target.value })}
                  placeholder="A beautiful journey to deepen our connection..."
                  rows={2}
                  className="text-xs sm:text-base h-16 sm:h-auto"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Your Name</label>
                  <Input
                    value={currentGame.creatorName || ""}
                    onChange={(e) => updateGame({ creatorName: e.target.value })}
                    placeholder="Creator"
                    className="h-8 sm:h-auto text-xs sm:text-base"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Partner's Name</label>
                  <Input
                    value={currentGame.partnerNameHint || ""}
                    onChange={(e) => updateGame({ partnerNameHint: e.target.value })}
                    placeholder="Partner"
                    className="h-8 sm:h-auto text-xs sm:text-base"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Custom Love Code (Optional)</label>
                <div className="relative">
                  <Input
                    value={currentGame.loveCode || ""}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      updateGame({ loveCode: value });
                    }}
                    placeholder="Enter a custom code (e.g., LOVEYOU, HEARTS, etc.)"
                    className="h-8 sm:h-auto font-mono text-center pr-16 sm:pr-20 text-xs sm:text-base"
                    maxLength={20}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    {currentGame.loveCode && currentGame.loveCode.length >= 3 && (
                      <>
                        {loveCodeStatus === 'checking' && (
                          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full" />
                        )}
                        {loveCodeStatus === 'available' && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {loveCodeStatus === 'taken' && (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopyLoveCode}
                                className="h-6 w-6 text-gray-500 hover:text-pink-600 hover:bg-pink-50"
                                title="Copy love code"
                              >
                                {loveCodeCopied ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{loveCodeCopied ? "Copied!" : "Copy love code"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-1">
                  {loveCodeStatus === 'available' && currentGame.loveCode && (
                    <p className="text-xs text-green-600">✓ Love code is available!</p>
                  )}
                  {loveCodeStatus === 'taken' && (
                    <p className="text-xs text-red-600">✗ Love code is already in use</p>
                  )}
                  {loveCodeStatus === 'idle' && (
                    <p className="text-xs text-muted-foreground">
                      Leave empty to auto-generate when publishing. Use letters and numbers only.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg sm:rounded-2xl cute-shadow overflow-hidden"
          >
            <Tabs defaultValue="truths" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 overflow-x-auto scrollbar-hide">
                <TabsTrigger value="truths" className="rounded-none text-xs sm:text-sm px-1 sm:px-4 py-2 min-w-0 flex-shrink-0">
                  Truths
                </TabsTrigger>
                <TabsTrigger value="dares" className="rounded-none text-xs sm:text-sm px-1 sm:px-4 py-2 min-w-0 flex-shrink-0">
                  Dares
                </TabsTrigger>
                <TabsTrigger value="secrets" className="rounded-none text-xs sm:text-sm px-1 sm:px-4 py-2 min-w-0 flex-shrink-0">
                  Secrets
                </TabsTrigger>
                <TabsTrigger value="memories" className="rounded-none text-xs sm:text-sm px-1 sm:px-4 py-2 min-w-0 flex-shrink-0">
                  Memories
                </TabsTrigger>
                <TabsTrigger value="romantic" className="rounded-none text-xs sm:text-sm px-1 sm:px-4 py-2 min-w-0 flex-shrink-0">
                  Romantic
                </TabsTrigger>
                <TabsTrigger value="guessing" className="rounded-none text-xs sm:text-sm px-1 sm:px-4 py-2 min-w-0 flex-shrink-0">
                  Guessing
                </TabsTrigger>
                <TabsTrigger value="answers" className="rounded-none text-xs sm:text-sm px-1 sm:px-4 py-2 min-w-0 flex-shrink-0">
                  Answers
                </TabsTrigger>
              </TabsList>

              <div className="p-2 sm:p-4 md:p-6">
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
