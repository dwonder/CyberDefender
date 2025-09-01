import React, { useState, useCallback, useEffect, useMemo } from 'react';
import GameUI from './components/GameUI';
import ResultsScreen from './components/ResultsScreen';
import CyberScene from './components/CyberScene';
import { CHALLENGES } from './constants';
import type { LeaderboardEntry, Challenge } from './types';

type GameState = 'start' | 'playing' | 'finished';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [nickname, setNickname] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffledChallenges, setShuffledChallenges] = useState<Challenge[]>([]);

  const backgroundMusic = useMemo(() => new Audio('https://storage.googleapis.com/pedagogical-bucket/user-m/NzI1NzYwZDM.mp3'), []);

  useEffect(() => {
    try {
      const savedLeaderboard = localStorage.getItem('cyberGuardianLeaderboard');
      if (savedLeaderboard) {
        setLeaderboard(JSON.parse(savedLeaderboard));
      }
    } catch (error) {
      console.error("Failed to load leaderboard from localStorage", error);
      setLeaderboard([]);
    }
  }, []);

  useEffect(() => {
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
  }, [backgroundMusic]);
  
  useEffect(() => {
    if (gameState === 'playing' && !isMuted) {
      backgroundMusic.play().catch(e => console.error("Error playing background music:", e));
    } else {
      backgroundMusic.pause();
    }
  }, [gameState, isMuted, backgroundMusic]);

  useEffect(() => {
    backgroundMusic.muted = isMuted;
  }, [isMuted, backgroundMusic]);

  const handleGameFinish = useCallback((finalScore: number, finalAnswers: Record<number, string>, timeTaken: number) => {
    setScore(finalScore);
    setUserAnswers(finalAnswers);
    setGameState('finished');
    
    const newEntry: LeaderboardEntry = { nickname, score: finalScore, timeTaken };
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // Higher score first
        }
        return a.timeTaken - b.timeTaken; // Lower time is better
      })
      .slice(0, 10); // Keep top 10

    setLeaderboard(updatedLeaderboard);
    try {
      localStorage.setItem('cyberGuardianLeaderboard', JSON.stringify(updatedLeaderboard));
    } catch (error) {
      console.error("Failed to save leaderboard to localStorage", error);
    }
  }, [nickname, leaderboard]);

  const handleRestart = useCallback(() => {
    setScore(0);
    setUserAnswers({});
    setNickname('');
    setGameState('start');
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);
  
  const handleStart = useCallback(() => {
    if (nickname.trim()) {
      try {
        // Play a short sound on user interaction to enable audio playback
        // in browsers with strict autoplay policies.
        const uiSound = new Audio('https://storage.googleapis.com/pedagogical-bucket/user-m/Njc4OTY1MzY.mp3');
        uiSound.volume = 0.5;
        uiSound.play().catch(() => {});
      } catch (e) {
        console.error("Audio playback failed", e);
      }
      setShuffledChallenges(shuffleArray(CHALLENGES));
      setGameState('playing');
    } else {
      alert('Please enter a nickname to start.');
    }
  }, [nickname]);

  const renderGameState = () => {
    switch (gameState) {
      case 'playing':
        return <GameUI challenges={shuffledChallenges} onGameFinish={handleGameFinish} isMuted={isMuted} toggleMute={toggleMute} />;
      case 'finished':
        return <ResultsScreen score={score} total={CHALLENGES.length} userAnswers={userAnswers} onRestart={handleRestart} leaderboard={leaderboard} />;
      case 'start':
      default:
        return (
          <div
            className="relative w-full h-screen overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: "url('background.jpg')" }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-70 p-4">
              <div className="text-center bg-[#1a1a1a]/80 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-[#D40511] max-w-2xl">
                <h1 className="text-5xl font-bold text-[#FFCC00] mb-2">Cyber Guardian</h1>
                <h2 className="text-3xl font-bold text-[#D40511] mb-4">The Ultimate Quest 🛡️</h2>
                <p className="text-lg text-gray-300 mb-6">
                  Welcome back, Guardian! Face 20 unique challenges to keep our digital kingdom safe. Choose the correct tool from the Guardian's Armory to neutralize the threat.
                </p>
                <div className="flex flex-col items-center gap-4">
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your Guardian Nickname"
                    className="w-full max-w-xs px-4 py-2 text-lg bg-gray-800 border-2 border-gray-600 rounded-md focus:outline-none focus:border-[#FFCC00] text-white"
                    aria-label="Guardian Nickname"
                  />
                  <button
                    onClick={handleStart}
                    disabled={!nickname.trim()}
                    className="px-8 py-3 bg-[#FFCC00] text-black font-bold rounded-lg shadow-lg hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300 text-xl disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    Begin Your Quest
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return <div className="bg-[#1a1a1a]">{renderGameState()}</div>;
};

export default App;