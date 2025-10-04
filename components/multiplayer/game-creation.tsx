"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2, Users, Gamepad2 } from "lucide-react";
import { useMultiplayerStore } from "@/lib/multiplayer-store";
import { toast } from "sonner";

interface GameCreationProps {
  gameId: string;
  onRoomCreated: (room: any) => void;
}

export function GameCreation({ gameId, onRoomCreated }: GameCreationProps) {
  const [hostName, setHostName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { createRoom } = useMultiplayerStore();

  const handleCreateRoom = async () => {
    if (!hostName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsCreating(true);
    try {
      const room = await createRoom(gameId, hostName.trim());
      onRoomCreated(room);
      toast.success("Game room created successfully!");
    } catch (error) {
      toast.error(
        `Failed to create room: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create Multiplayer Game
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Start a new game and invite your partner to join!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="hostName"
              className="text-sm font-medium text-gray-700"
            >
              Your Name
            </Label>
            <Input
              id="hostName"
              type="text"
              placeholder="Enter your name"
              value={hostName}
              onChange={e => setHostName(e.target.value)}
              className="w-full"
              maxLength={50}
            />
          </div>

          <Button
            onClick={handleCreateRoom}
            disabled={isCreating || !hostName.trim()}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Room...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Create Game Room</span>
              </div>
            )}
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>
              After creating the room, you&apos;ll get a game code to share with
              your partner.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface WaitingRoomProps {
  room: any;
  onGameStart: () => void;
}

export function WaitingRoom({ room, onGameStart }: WaitingRoomProps) {
  const [copied, setCopied] = useState(false);
  const { isHost, playerId, currentRoom } = useMultiplayerStore();

  // Use currentRoom from store for real-time updates, fallback to prop
  const roomData = currentRoom || room;

  const copyGameCode = async () => {
    try {
      await navigator.clipboard.writeText(roomData.gameCode);
      setCopied(true);
      toast.success("Game code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy game code");
    }
  };

  const shareGameLink = async () => {
    const gameLink = `${window.location.origin}/play/${roomData.gameId}?join=${roomData.gameCode}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join my game!",
          text: `Join my Journey of Us game! Use code: ${roomData.gameCode}`,
          url: gameLink,
        });
      } else {
        await navigator.clipboard.writeText(gameLink);
        toast.success("Game link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share game link");
    }
  };

  const canStartGame = roomData.joinedPlayers.length === 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Waiting for Players
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Share the game code with your partner to start playing!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Code */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Game Code
            </Label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-center">
                <span className="text-2xl font-mono font-bold text-gray-800 tracking-wider">
                  {roomData.gameCode}
                </span>
              </div>
              <Button
                onClick={copyGameCode}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Share Button */}
          <Button
            onClick={shareGameLink}
            variant="outline"
            className="w-full border-2 border-rose-300 text-rose-600 hover:bg-rose-50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Game Link
          </Button>

          {/* Players List */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Players ({roomData.joinedPlayers.length}/2)
            </Label>
            <div className="space-y-2">
              {roomData.joinedPlayers.map((player: any, index: number) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                    player.isHost
                      ? "border-rose-300 bg-rose-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                        player.isHost
                          ? "bg-gradient-to-r from-rose-500 to-pink-600"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        {player.name}
                        {player.isHost && (
                          <span className="ml-2 text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full">
                            Host
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">Joined</div>
                    </div>
                  </div>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Game Button */}
          {canStartGame && (
            <Button
              onClick={onGameStart}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg"
            >
              Start Game!
            </Button>
          )}

          {!canStartGame && (
            <div className="text-center text-sm text-gray-500">
              Waiting for another player to join...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
