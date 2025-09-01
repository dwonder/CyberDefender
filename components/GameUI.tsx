import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import CyberScene from './CyberScene';
import DraggableWord from './DraggableWord';
import DroppableBlank from './DroppableBlank';
import { WORD_BANK } from '../constants';
import type { Challenge } from '../types';

interface GameUIProps {
  challenges: Challenge[];
  onGameFinish: (score: number, userAnswers: Record<number, string>, timeTaken: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

type AnswerStatus = 'idle' | 'correct' | 'incorrect';
const GAME_DURATION = 300; // 5 minutes in seconds

const GameUI: React.FC<GameUIProps> = ({ challenges, onGameFinish, isMuted, toggleMute }) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [droppedWord, setDroppedWord] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('idle');
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const sounds = useMemo(() => ({
    correct: new Audio('https://storage.googleapis.com/pedagogical-bucket/user-m/YjUxM2ZkZj.mp3'),
    incorrect: new Audio('https://storage.googleapis.com/pedagogical-bucket/user-m/YmExM2Q0OD.mp3'),
    tick: new Audio('https://storage.googleapis.com/pedagogical-bucket/user-m/YTc1M2M1OT.mp3'),
    victory: new Audio('https://storage.googleapis.com/pedagogical-bucket/user-m/NmVjNzYwMj.mp3'),
    gameOver: new Audio('https://storage.googleapis.com/pedagogical-bucket/user-m/NmYyY2FiYm.mp3'),
  }), []);

  useEffect(() => {
    Object.values(sounds).forEach(sound => {
      sound.muted = isMuted;
    });
  }, [isMuted, sounds]);

  const onGameFinishRef = useRef(onGameFinish);
  onGameFinishRef.current = onGameFinish;

  const scoreRef = useRef(score);
  scoreRef.current = score;

  const userAnswersRef = useRef(userAnswers);
  userAnswersRef.current = userAnswers;

  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  
  if (!challenges || challenges.length === 0) {
    return null; // Or a loading state
  }
  
  const currentChallenge: Challenge = challenges[currentChallengeIndex];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 10 && newTime > 0) {
            sounds.tick.play().catch(e => console.error("Error playing tick sound:", e));
        }
        if (newTime <= 0) {
          clearInterval(timer);
          sounds.gameOver.play().catch(e => console.error("Error playing game over sound:", e));
          onGameFinishRef.current(scoreRef.current, userAnswersRef.current, GAME_DURATION);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sounds.gameOver, sounds.tick]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const availableWords = useMemo(() => WORD_BANK, []);

  // Next question / game finish effect
  useEffect(() => {
    if (answerStatus !== 'correct') return;
    
    const finishGame = () => {
      sounds.victory.play().catch(e => console.error("Error playing victory sound:", e));
      const timeTaken = GAME_DURATION - timeLeftRef.current;
      onGameFinishRef.current(scoreRef.current, userAnswersRef.current, timeTaken);
    };

    const timer = setTimeout(() => {
      if (currentChallengeIndex < challenges.length - 1) {
        setCurrentChallengeIndex(prev => prev + 1);
        setDroppedWord(null);
        setAnswerStatus('idle');
      } else {
        finishGame();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [answerStatus, currentChallengeIndex, challenges.length, sounds.victory]);

  // Reset after incorrect answer effect
  useEffect(() => {
    if (answerStatus !== 'incorrect') return;
    const timer = setTimeout(() => {
        setDroppedWord(null);
        setAnswerStatus('idle');
    }, 1500);
    return () => clearTimeout(timer);
  }, [answerStatus]);


  const handleDragEnd = (event: DragEndEvent) => {
    if (answerStatus !== 'idle') return;
    const { over, active } = event;
    if (over && over.id === 'droppable-blank') {
      const word = active.id as string;
      setDroppedWord(word);
      const newAnswers = { ...userAnswers, [currentChallenge.id]: word };
      setUserAnswers(newAnswers);

      if (word === currentChallenge.correctAnswer) {
        sounds.correct.play().catch(e => console.error("Error playing correct sound:", e));
        setAnswerStatus('correct');
        setScore(prev => prev + 1);
      } else {
        sounds.incorrect.play().catch(e => console.error("Error playing incorrect sound:", e));
        setAnswerStatus('incorrect');
      }
    }
  };
  
  const [challengePart1, challengePart2] = currentChallenge.text.split('[_______]');
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CyberScene />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-60 p-4">
        
        <header className="w-full max-w-4xl mb-8 text-center bg-[#1a1a1a]/70 p-4 rounded-lg">
            <h1 className="text-3xl font-bold text-[#D40511]">Challenge {currentChallengeIndex + 1} / {challenges.length}</h1>
            <div className="flex justify-around items-center text-lg text-gray-300 mt-2">
              <p>Current Score: <span className="font-bold text-[#FFCC00]">{score}</span></p>
              <p>Time Left: <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-[#FFCC00]'}`}>{minutes}:{seconds < 10 ? '0' : ''}{seconds}</span></p>
              <button onClick={toggleMute} className="text-gray-300 hover:text-white transition-colors" aria-label="Mute sound">
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            </div>
        </header>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <main className="w-full max-w-4xl bg-[#2a2a2a]/80 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-[#D40511]">
                <div className="text-2xl text-center leading-relaxed mb-8 min-h-[100px]">
                    {challengePart1}
                    <DroppableBlank droppedWord={droppedWord} status={answerStatus} />
                    {challengePart2}
                </div>
            </main>

            <footer className="w-full max-w-5xl mt-8 p-4 bg-[#1a1a1a]/70 rounded-lg">
                <h2 className="text-xl font-semibold text-center mb-4 text-[#FFCC00]">Guardian's Armory</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                    {availableWords.map((word) => (
                        <DraggableWord key={word} id={word}>
                            {word}
                        </DraggableWord>
                    ))}
                </div>
            </footer>
        </DndContext>
      </div>
    </div>
  );
};

export default GameUI;