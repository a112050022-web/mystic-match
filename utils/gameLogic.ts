
import { CardData, Difficulty } from '../types';

const SYMBOLS = [
  '🌟', '🌙', '☀️', '☁️', '❄️', '🔥', '💧', '⚡️',
  '💎', '🍀', '🍎', '🌈', '🎨', '🎭', '🎸', '🚀',
  '🛸', '🪐', '🍄', '🌵', '🌺', '🍁', '🧿', '🧬'
];

export const getGridSize = (difficulty: Difficulty): { rows: number; cols: number } => {
  switch (difficulty) {
    case '2x2': return { rows: 2, cols: 2 };
    case '6x6': return { rows: 6, cols: 6 };
    case '4x4':
    default: return { rows: 4, cols: 4 };
  }
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const generateCards = (difficulty: Difficulty): CardData[] => {
  const { rows, cols } = getGridSize(difficulty);
  const totalCards = rows * cols;
  const pairCount = totalCards / 2;
  
  const selectedSymbols = SYMBOLS.slice(0, pairCount);
  const cardContents = [...selectedSymbols, ...selectedSymbols];
  const shuffledContents = shuffleArray(cardContents);

  return shuffledContents.map((content, index) => ({
    id: index,
    content,
    isFlipped: false,
    isMatched: false,
  }));
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
