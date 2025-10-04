"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Users, User, UserCheck } from 'lucide-react';

interface SpinWheelProps {
  onSpinComplete: (result: 'player1' | 'player2' | 'both') => void;
  player1Name: string;
  player2Name: string;
  isSpinning?: boolean;
  disabled?: boolean;
}

interface WheelSection {
  id: 'player1' | 'player2' | 'both';
  label: string;
  color: string;
  icon: React.ReactNode;
  startAngle: number;
  endAngle: number;
}

export function SpinWheel({ 
  onSpinComplete, 
  player1Name, 
  player2Name, 
  isSpinning = false,
  disabled = false 
}: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState<'player1' | 'player2' | 'both' | null>(null);

  const sections: WheelSection[] = [
    {
      id: 'player1',
      label: player1Name,
      color: 'from-rose-400 to-pink-500',
      icon: <User className="w-6 h-6" />,
      startAngle: 0,
      endAngle: 120
    },
    {
      id: 'player2',
      label: player2Name,
      color: 'from-purple-400 to-indigo-500',
      icon: <UserCheck className="w-6 h-6" />,
      startAngle: 120,
      endAngle: 240
    },
    {
      id: 'both',
      label: 'Both Players',
      color: 'from-emerald-400 to-teal-500',
      icon: <Users className="w-6 h-6" />,
      startAngle: 240,
      endAngle: 360
    }
  ];

  const spinWheel = () => {
    if (isAnimating || disabled) return;

    setIsAnimating(true);
    setResult(null);

    // Generate random rotation (multiple full rotations + random angle)
    const baseRotation = 360 * 5; // 5 full rotations
    const randomAngle = Math.random() * 360;
    const finalRotation = baseRotation + randomAngle;

    setRotation(prev => prev + finalRotation);

    // Calculate which section the wheel lands on
    const normalizedAngle = (360 - (randomAngle % 360)) % 360;
    const winningSection = sections.find(section => 
      normalizedAngle >= section.startAngle && normalizedAngle < section.endAngle
    );

    // Wait for animation to complete before showing result
    setTimeout(() => {
      if (winningSection) {
        setResult(winningSection.id);
        onSpinComplete(winningSection.id);
      }
      setIsAnimating(false);
    }, 3000); // Match CSS animation duration
  };

  const resetWheel = () => {
    setRotation(0);
    setResult(null);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="relative">
        {/* Wheel Container */}
        <div className="relative w-80 h-80 md:w-96 md:h-96">
          {/* Wheel */}
          <div 
            className="w-full h-full rounded-full border-8 border-white shadow-2xl transition-transform duration-3000 ease-out"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(
                from 0deg,
                #f43f5e 0deg 120deg,
                #8b5cf6 120deg 240deg,
                #10b981 240deg 360deg
              )`
            }}
          >
            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
              <RotateCcw className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-white drop-shadow-lg"></div>
          </div>

          {/* Section Labels */}
          {sections.map((section, index) => {
            const angle = (section.startAngle + section.endAngle) / 2;
            const radians = (angle * Math.PI) / 180;
            const radius = 120; // Distance from center
            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius;

            return (
              <div
                key={section.id}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`
                }}
              >
                <div className="flex flex-col items-center text-white font-semibold text-sm">
                  <div className="mb-1">{section.icon}</div>
                  <div className="text-center leading-tight">
                    {section.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Result Display */}
        {result && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-yellow-400">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {result === 'player1' && player1Name}
                  {result === 'player2' && player2Name}
                  {result === 'both' && 'Both Players'}
                </div>
                <div className="text-sm text-gray-600">
                  {result === 'both' ? 'Both players answer!' : 'Your turn to answer!'}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        <Button
          onClick={spinWheel}
          disabled={isAnimating || disabled}
          size="lg"
          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isAnimating ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Spinning...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-5 h-5" />
              <span>Spin the Wheel</span>
            </div>
          )}
        </Button>

        {result && (
          <Button
            onClick={resetWheel}
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 hover:border-gray-400 font-semibold px-6 py-3 rounded-full"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        <p>
          Spin the wheel to determine who answers the next question. 
          The wheel will randomly select between {player1Name}, {player2Name}, or both players!
        </p>
      </div>
    </div>
  );
}
