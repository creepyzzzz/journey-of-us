"use client";

import { motion } from "framer-motion";
import { Heart, Calendar, Lock, Globe, Link as LinkIcon, Trash2, MoreVertical, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { GameContent } from "@/lib/types";
import { format } from "date-fns";
import { generateShareableURL } from "@/lib/slug-generator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface GameCardProps {
  game: GameContent;
  onClick?: () => void;
  onDelete?: () => void;
}

export function GameCard({ game, onClick, onDelete }: GameCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const totalItems =
    game.truths.length +
    game.dares.length +
    game.secrets.length +
    game.memories.length +
    game.romanticSentences.length +
    game.guessingQuestions.length;

  const handleCardClick = () => {
    if (isNavigating || !onClick) return;
    
    setIsNavigating(true);
    onClick();
    
    // Reset navigation state after a delay
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  const visibilityIcon = {
    private: <Lock className="h-3 w-3" />,
    link: <LinkIcon className="h-3 w-3" />,
    public: <Globe className="h-3 w-3" />,
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!game.slug) {
      toast({
        title: "No link available",
        description: "This game doesn't have a shareable link yet",
        variant: "destructive",
      });
      return;
    }

    try {
      const shareableURL = generateShareableURL(game.slug);
      await navigator.clipboard.writeText(shareableURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Link copied to clipboard ❤️",
        description: "Share this link with your partner to let them play your journey!",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-200 touch-manipulation ${
          isNavigating ? 'opacity-70 pointer-events-none scale-95' : 'hover:scale-105'
        }`}
        onClick={handleCardClick}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isNavigating) {
            handleCardClick();
          }
        }}
        style={{
          background: game.coverGradient || "linear-gradient(135deg, #fda4af 0%, #d8b4fe 100%)",
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <CardHeader className="text-white p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl font-semibold truncate">{game.title}</CardTitle>
              {game.description && (
                <CardDescription className="text-white/80 mt-1 text-sm sm:text-base line-clamp-2">
                  {game.description}
                </CardDescription>
              )}
            </div>
            {isNavigating && (
              <div className="flex items-center justify-center ml-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 fill-white text-white flex-shrink-0" />
              {game.published && game.slug && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
                  onClick={handleCopyLink}
                  title="Copy shareable link"
                  aria-label="Copy shareable link to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
              {onDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Game
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white/95 backdrop-blur p-4 sm:p-6">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(game.updatedAt), "MMM d, yyyy")}
              </span>
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                {game.visibility && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    {visibilityIcon[game.visibility]}
                    {game.visibility}
                  </Badge>
                )}
                {game.published && (
                  <Badge variant="default" className="text-xs flex items-center gap-1">
                    Published
                    {game.slug && <LinkIcon className="h-3 w-3" />}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>{totalItems} items</span>
              {game.creatorName && <span className="hidden sm:inline">• by {game.creatorName}</span>}
              {game.creatorName && <span className="sm:hidden">by {game.creatorName}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
