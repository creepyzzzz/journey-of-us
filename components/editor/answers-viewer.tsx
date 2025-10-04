"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar, 
  User, 
  Star,
  Filter,
  Download,
  Share2,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabasePlaySessionStore } from "@/lib/supabase-store";
import { PlayerAnswer } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AnswersViewerProps {
  gameId: string;
}

export function AnswersViewer({ gameId }: AnswersViewerProps) {
  const { getGameAnswers } = useSupabasePlaySessionStore();
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);
  const [filteredAnswers, setFilteredAnswers] = useState<PlayerAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "truth" | "dare" | "secret" | "memory" | "romantic" | "guessing">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "player" | "type">("newest");
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnswers();
  }, [gameId]);

  useEffect(() => {
    applyFilters();
  }, [answers, filter, sortBy]);

  const loadAnswers = async () => {
    try {
      setLoading(true);
      const gameAnswers = await getGameAnswers(gameId);
      setAnswers(gameAnswers);
    } catch (error) {
      console.error("Failed to load answers:", error);
      toast({
        title: "Error",
        description: "Failed to load player answers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...answers];

    // Filter by type
    if (filter !== "all") {
      filtered = filtered.filter(answer => answer.questionType === filter);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
      case "player":
        filtered.sort((a, b) => a.playerName.localeCompare(b.playerName));
        break;
      case "type":
        filtered.sort((a, b) => a.questionType.localeCompare(b.questionType));
        break;
    }

    setFilteredAnswers(filtered);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "truth":
        return <MessageCircle className="h-4 w-4" />;
      case "dare":
        return <Star className="h-4 w-4" />;
      case "secret":
        return <Lock className="h-4 w-4" />;
      case "memory":
        return <Heart className="h-4 w-4" />;
      case "romantic":
        return <Heart className="h-4 w-4 fill-current" />;
      case "guessing":
        return <Eye className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case "truth":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "dare":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "secret":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "memory":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "romantic":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "guessing":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const exportAnswers = () => {
    const dataStr = JSON.stringify(filteredAnswers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journey-answers-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported! 📥",
      description: "Player answers have been downloaded",
      variant: "success",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Heart className="h-8 w-8 text-rose-400 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading player answers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      {showPrivacyNotice && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Privacy Notice</h3>
              <p className="text-sm text-blue-800 mb-3">
                Player answers are private and only visible to you as the game creator. 
                Players' personal responses are protected and should be handled with care.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPrivacyNotice(false)}
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                <Unlock className="h-4 w-4 mr-2" />
                I understand
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-pink-700 flex items-center gap-2">
            <Heart className="h-6 w-6 fill-current" />
            Player Answers
          </h2>
          <p className="text-muted-foreground">
            {answers.length} total responses from your players
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportAnswers}
            disabled={filteredAnswers.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnswers}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="truth">Truths</SelectItem>
              <SelectItem value="dare">Dares</SelectItem>
              <SelectItem value="secret">Secrets</SelectItem>
              <SelectItem value="memory">Memories</SelectItem>
              <SelectItem value="romantic">Romantic</SelectItem>
              <SelectItem value="guessing">Guessing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="player">By Player</SelectItem>
            <SelectItem value="type">By Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Answers List */}
      {filteredAnswers.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-rose-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {answers.length === 0 ? "No answers yet" : "No answers match your filter"}
          </h3>
          <p className="text-muted-foreground">
            {answers.length === 0 
              ? "Player answers will appear here once someone plays your game"
              : "Try adjusting your filters to see more answers"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredAnswers.map((answer, index) => (
              <motion.div
                key={answer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getQuestionTypeColor(answer.questionType)}`}>
                          {getQuestionTypeIcon(answer.questionType)}
                        </div>
                        <div>
                          <CardTitle className="text-lg capitalize">
                            {answer.questionType} Question
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {answer.playerName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(answer.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={getQuestionTypeColor(answer.questionType)}>
                        Level {answer.levelId + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Question */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                      <p className="text-gray-700">{answer.questionText}</p>
                    </div>
                    
                    {/* Answer */}
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-200">
                      <h4 className="font-medium text-pink-900 mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 fill-current" />
                        {answer.playerName}'s Answer:
                      </h4>
                      <p className="text-pink-800 leading-relaxed">{answer.answer}</p>
                    </div>

                    {/* Metadata */}
                    {answer.metadata && (
                      <div className="flex flex-wrap gap-2">
                        {answer.metadata.score !== undefined && (
                          <Badge variant="secondary">
                            Score: {answer.metadata.score}
                          </Badge>
                        )}
                        {answer.metadata.isCorrect !== undefined && (
                          <Badge variant={answer.metadata.isCorrect ? "default" : "destructive"}>
                            {answer.metadata.isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        )}
                        {answer.metadata.romanceIntensity && (
                          <Badge variant="outline">
                            Intensity: {answer.metadata.romanceIntensity}/5
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
