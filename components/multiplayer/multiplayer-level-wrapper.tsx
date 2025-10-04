"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SpinWheel } from '@/components/spin-wheel';
import { useMultiplayerStore } from '@/lib/multiplayer-store';
import { CheckCircle, Clock, Users, User, UserCheck } from 'lucide-react';
import type { TurnInfo } from '@/lib/types';

interface MultiplayerLevelWrapperProps {
  children: React.ReactNode;
  levelId: number;
  levelName: string;
  onLevelComplete: () => void;
  gameContent: any;
}

export function MultiplayerLevelWrapper({ 
  children, 
  levelId, 
  levelName, 
  onLevelComplete,
  gameContent 
}: MultiplayerLevelWrapperProps) {
  const { currentRoom, spinWheel, completeTurn, playerId } = useMultiplayerStore();
  const [currentTurn, setCurrentTurn] = useState<TurnInfo | null>(null);
  const [isWaitingForTurn, setIsWaitingForTurn] = useState(false);
  const [hasSpunWheel, setHasSpunWheel] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    if (currentRoom?.currentTurn) {
      setCurrentTurn(currentRoom.currentTurn);
      setIsMyTurn(
        currentRoom.currentTurn.playerId === playerId || 
        currentRoom.currentTurn.turnType === 'both'
      );
      setIsWaitingForTurn(!isMyTurn);
    } else {
      setCurrentTurn(null);
      setIsMyTurn(false);
      setIsWaitingForTurn(false);
    }
  }, [currentRoom?.currentTurn, playerId]);

  const handleSpinComplete = async (result: 'player1' | 'player2' | 'both') => {
    try {
      await spinWheel(levelId);
      setHasSpunWheel(true);
    } catch (error) {
      console.error('Failed to spin wheel:', error);
    }
  };

  const handleTurnComplete = async () => {
    if (currentTurn) {
      try {
        await completeTurn(currentTurn.playerId);
        setCurrentTurn(null);
        setHasSpunWheel(false);
        setIsMyTurn(false);
        setIsWaitingForTurn(false);
      } catch (error) {
        console.error('Failed to complete turn:', error);
      }
    }
  };

  const handleLevelComplete = () => {
    handleTurnComplete();
    onLevelComplete();
  };

  const getTurnDisplayInfo = () => {
    if (!currentTurn) return null;

    const isBothPlayers = currentTurn.turnType === 'both';
    const isMyTurnToAnswer = isMyTurn;

    return {
      isBothPlayers,
      isMyTurnToAnswer,
      playerName: currentTurn.playerName,
      turnType: currentTurn.turnType
    };
  };

  const turnInfo = getTurnDisplayInfo();

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg text-gray-600">Loading multiplayer game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50">
      {/* Level Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{levelName}</h1>
              <p className="text-gray-600">Multiplayer Mode</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Room: <span className="font-mono font-bold">{currentRoom.gameCode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!hasSpunWheel ? (
          /* Spin Wheel Phase */
          <div className="text-center">
            <Card className="max-w-2xl mx-auto shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Spin the Wheel!
                  </h2>
                  <p className="text-gray-600">
                    The wheel will determine who answers the next question in this level.
                  </p>
                </div>
                
                <SpinWheel
                  onSpinComplete={handleSpinComplete}
                  player1Name={currentRoom.joinedPlayers[0]?.name || 'Player 1'}
                  player2Name={currentRoom.joinedPlayers[1]?.name || 'Player 2'}
                  disabled={false}
                />
              </CardContent>
            </Card>
          </div>
        ) : turnInfo ? (
          /* Turn Display Phase */
          <div className="space-y-6">
            {/* Turn Status Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      turnInfo.isMyTurnToAnswer 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    }`}>
                      {turnInfo.isBothPlayers ? (
                        <Users className="w-6 h-6 text-white" />
                      ) : turnInfo.turnType === 'player1' ? (
                        <User className="w-6 h-6 text-white" />
                      ) : (
                        <UserCheck className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {turnInfo.isBothPlayers ? 'Both Players' : turnInfo.playerName}'s Turn
                      </h3>
                      <p className="text-gray-600">
                        {turnInfo.isMyTurnToAnswer 
                          ? 'It\'s your turn to answer!' 
                          : 'Waiting for the other player to answer...'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {turnInfo.isMyTurnToAnswer ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Your Turn</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Waiting</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Level Content */}
            {turnInfo.isMyTurnToAnswer && (
              <div className="space-y-6">
                {React.cloneElement(children as React.ReactElement, {
                  onComplete: handleLevelComplete,
                  gameContent,
                  isMultiplayer: true,
                  currentTurn: turnInfo
                })}
              </div>
            )}

            {/* Waiting Message */}
            {!turnInfo.isMyTurnToAnswer && (
              <Card className="shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Waiting for {turnInfo.isBothPlayers ? 'Both Players' : turnInfo.playerName}
                  </h3>
                  <p className="text-gray-600">
                    Please wait while {turnInfo.isBothPlayers ? 'both players' : 'the other player'} completes their turn.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Error State */
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Game State Error
              </h3>
              <p className="text-gray-600 mb-4">
                There was an issue with the game state. Please try refreshing the page.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
