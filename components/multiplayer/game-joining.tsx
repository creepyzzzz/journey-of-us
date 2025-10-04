"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Gamepad2, ArrowLeft } from 'lucide-react';
import { useMultiplayerStore } from '@/lib/multiplayer-store';
import { toast } from 'sonner';

interface GameJoiningProps {
  gameId: string;
  onRoomJoined: (room: any) => void;
  onBack: () => void;
}

export function GameJoining({ gameId, onRoomJoined, onBack }: GameJoiningProps) {
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { joinRoom } = useMultiplayerStore();

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!gameCode.trim()) {
      toast.error('Please enter the game code');
      return;
    }

    setIsJoining(true);
    try {
      const room = await joinRoom(gameCode.trim().toUpperCase(), playerName.trim());
      onRoomJoined(room);
      toast.success('Successfully joined the game!');
    } catch (error) {
      toast.error(`Failed to join room: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Join Multiplayer Game
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Enter the game code shared by your partner to join their game!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-sm font-medium text-gray-700">
              Your Name
            </Label>
            <Input
              id="playerName"
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gameCode" className="text-sm font-medium text-gray-700">
              Game Code
            </Label>
            <Input
              id="gameCode"
              type="text"
              placeholder="Enter 6-character game code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              className="w-full text-center text-lg font-mono tracking-wider"
              maxLength={6}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 border-2 border-gray-300 hover:border-gray-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleJoinRoom}
              disabled={isJoining || !playerName.trim() || !gameCode.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isJoining ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Joining...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Gamepad2 className="w-5 h-5" />
                  <span>Join Game</span>
                </div>
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Ask your partner for the 6-character game code to join their game.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface GameModeSelectionProps {
  onCreateGame: () => void;
  onJoinGame: () => void;
}

export function GameModeSelection({ onCreateGame, onJoinGame }: GameModeSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Multiplayer Mode
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Choose how you want to start your multiplayer journey!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onCreateGame}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold py-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Create New Game</div>
                <div className="text-sm opacity-90">Start a new game and invite your partner</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={onJoinGame}
            variant="outline"
            className="w-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-semibold py-4 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Join Existing Game</div>
                <div className="text-sm opacity-75">Enter a game code to join your partner&apos;s game</div>
              </div>
            </div>
          </Button>

          <div className="text-center text-sm text-gray-500 pt-4">
            <p>Both players will take turns answering questions based on the spin of the wheel!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
