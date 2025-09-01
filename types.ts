export interface Challenge {
  id: number;
  text: string;
  correctAnswer: string;
}

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  timeTaken: number; // in seconds
}
