"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseGameStore } from "@/lib/supabase-store";
import { useToast } from "@/hooks/use-toast";
import { generateSlug, generateLoveCode, generateShareableURL } from "@/lib/slug-generator";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PublishDialog({ open, onOpenChange }: PublishDialogProps) {
  const { currentGame, publishGame } = useSupabaseGameStore();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handlePublish = async () => {
    if (!currentGame) return;

    try {
      const result = await publishGame(currentGame.id, "link", {
        generateAccessCode: true,
      });

      toast({
        title: "Published!",
        description: "Your journey is now shareable",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish journey",
        variant: "destructive",
      });
    }
  };

  const shareURL = currentGame?.slug
    ? generateShareableURL(currentGame.slug)
    : "Publish to get your link";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish Your Journey</DialogTitle>
          <DialogDescription>
            Make your journey playable and share it with your partner
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!currentGame?.published ? (
            <>
              <p className="text-sm text-muted-foreground">
                Publishing will generate a unique link{currentGame.loveCode ? ' and use your custom love code' : ' and love code'} that you can share.
              </p>
              <Button onClick={handlePublish} className="w-full">
                Publish Journey
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input value={shareURL} readOnly className="flex-1" />
                  <Button size="icon" onClick={handleCopy} variant="outline">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {currentGame.loveCode && (
                <div className="space-y-2">
                  <Label>Love Code</Label>
                  <Input value={currentGame.loveCode} readOnly className="text-center text-2xl font-bold" />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Share this link or code with your partner to let them play your journey!
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
