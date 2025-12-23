
export interface CardData {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type Difficulty = '2x2' | '4x4' | '6x6';

export interface GameStats {
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  time: number;
}
