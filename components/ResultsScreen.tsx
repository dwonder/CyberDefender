import React from 'react';
import { CHALLENGES } from '../constants';
import type { Challenge, LeaderboardEntry } from '../types';

interface ResultsScreenProps {
  score: number;
  total: number;
  userAnswers: Record<number, string>;
  onRestart: () => void;
  leaderboard: LeaderboardEntry[];
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, total, userAnswers, onRestart, leaderboard }) => {

  const handleExport = () => {
    let csvContent = "Challenge ID,Question,Your Answer,Correct Answer\n";
    CHALLENGES.forEach((challenge: Challenge) => {
        const userAnswer = userAnswers[challenge.id] || "No Answer";
        const questionText = challenge.text.replace(/"/g, '""').replace('[_______]', `(${challenge.correctAnswer})`);
        csvContent += `${challenge.id},"${questionText}","${userAnswer}","${challenge.correctAnswer}"\n`;
    });

    navigator.clipboard.writeText(csvContent).then(() => {
        alert('Results copied to clipboard as CSV! You can now paste it into any spreadsheet program.');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy results. Please try again.');
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white p-4 sm:p-8 bg-cover bg-center"
      style={{ backgroundImage: "url('background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70" />
      <div className="relative w-full max-w-5xl bg-[#2a2a2a]/80 backdrop-blur-sm rounded-lg shadow-2xl p-8 border border-[#D40511]">
        <h1 className="text-4xl font-bold text-[#D40511] mb-4 text-center">Quest Complete!</h1>
        <p className="text-2xl text-center mb-8">
          Your Final Score: <span className="font-bold text-[#FFCC00]">{score}</span> / <span className="font-bold">{total}</span>
        </p>

        <div className="flex justify-center gap-4 mb-8">
            <button
            onClick={onRestart}
            className="px-6 py-3 bg-[#FFCC00] text-black font-bold rounded-lg shadow-lg hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300 text-lg"
            >
            Train Again
            </button>
            <button
            onClick={handleExport}
            className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-500 transform hover:scale-105 transition-all duration-300 text-lg"
            >
            Export Results
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 overflow-y-auto pr-4 border-t border-gray-700 pt-4">
            <h2 className="text-2xl font-semibold text-center mb-4 text-[#FFCC00]">Victory Scroll (Answer Key)</h2>
            <ul className="space-y-4">
              {CHALLENGES.map((challenge) => {
                const userAnswer = userAnswers[challenge.id];
                const isCorrect = userAnswer === challenge.correctAnswer;
                return (
                  <li key={challenge.id} className="p-3 bg-[#4a4a4a] rounded-md">
                    <p className="font-semibold text-gray-300 mb-1 text-sm">{challenge.id}. {challenge.text.replace('[_______]', `[${challenge.correctAnswer}]`)}</p>
                    <div className="flex items-center text-xs">
                      <p className="mr-4">Your Answer: <span className={isCorrect ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{userAnswer || 'N/A'}</span></p>
                      {!isCorrect && <p>Correct: <span className="text-green-400 font-bold">{challenge.correctAnswer}</span></p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="h-96 overflow-y-auto pr-4 border-t border-gray-700 pt-4">
            <h2 className="text-2xl font-semibold text-center mb-4 text-[#FFCC00]">Leaderboard</h2>
            <table className="w-full text-left">
                <thead className="text-gray-300 border-b border-gray-600">
                    <tr>
                        <th className="p-2">Rank</th>
                        <th className="p-2">Guardian</th>
                        <th className="p-2">Score</th>
                        <th className="p-2">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.length > 0 ? leaderboard.map((entry, index) => (
                        <tr key={index} className="border-b border-gray-700">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2 font-semibold">{entry.nickname}</td>
                            <td className="p-2">{entry.score}</td>
                            <td className="p-2">{formatTime(entry.timeTaken)}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="text-center p-4 text-gray-400">No entries yet. Be the first!</td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;