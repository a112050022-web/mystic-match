
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CardData, Difficulty, GameStats } from './types';
import { generateCards, getGridSize } from './utils/gameLogic';
import Card from './components/Card';
import StatusBar from './components/StatusBar';

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('4x4');
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Changed from NodeJS.Timeout to ReturnType<typeof setInterval> to avoid namespace error in browser environment
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initGame = useCallback((diff: Difficulty) => {
    const newCards = generateCards(diff);
    setCards(newCards);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedCount(0);
    setTime(0);
    setIsActive(false);
    setIsLocked(false);
    setIsGameOver(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty, initGame]);

  useEffect(() => {
    if (isActive && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isGameOver]);

  const handleCardClick = (index: number) => {
    if (isLocked || isGameOver || cards[index].isMatched || flippedIndices.includes(index)) return;

    if (!isActive) setIsActive(true);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (newFlippedIndices.length === 2) {
      setIsLocked(true);
      setMoves(prev => prev + 1);
      
      const [idx1, idx2] = newFlippedIndices;
      if (cards[idx1].content === cards[idx2].content) {
        // Match Success
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[idx1].isMatched = true;
            updated[idx2].isMatched = true;
            return updated;
          });
          setMatchedCount(prev => prev + 1);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 300);
      } else {
        // Match Failure
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[idx1].isFlipped = false;
            updated[idx2].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const totalPairs = (getGridSize(difficulty).rows * getGridSize(difficulty).cols) / 2;

  useEffect(() => {
    if (matchedCount === totalPairs && totalPairs > 0) {
      setIsGameOver(true);
    }
  }, [matchedCount, totalPairs]);

  const { rows, cols } = getGridSize(difficulty);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-8 px-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black overflow-y-auto">
      
      {/* Mystic Eye Background Graphic (Inspired by screenshot) */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-10 z-0">
         <div className="relative w-[500px] h-[500px] border-8 border-amber-400 rounded-full flex items-center justify-center">
            <div className="w-[450px] h-[450px] border-4 border-amber-400/50 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-64 h-64 bg-amber-400 rounded-full relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-24 bg-slate-900 rounded-[100%]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-amber-400 rounded-full border-4 border-slate-900 shadow-inner"></div>
                </div>
            </div>
            <div className="absolute top-0 w-full flex justify-center -translate-y-1/2">
                <div className="w-16 h-16 bg-amber-400 rounded-full"></div>
            </div>
         </div>
      </div>

      <header className="relative z-10 w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
          MYSTIC MATCH
        </h1>
        <p className="text-slate-400 font-light tracking-widest text-sm uppercase">Unveil the golden secrets</p>
      </header>

      <div className="relative z-10 w-full max-w-4xl">
        <StatusBar stats={{ moves, matchedPairs: matchedCount, totalPairs, time }} />

        {/* Difficulty Selectors */}
        <div className="flex justify-center gap-2 mb-6">
          {(['2x2', '4x4', '6x6'] as Difficulty[]).map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${difficulty === d ? 'bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Game Board */}
        <div 
          className="grid gap-4 mx-auto w-fit"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            perspective: '1000px'
          }}
        >
          {cards.map((card, idx) => (
            <Card 
              key={card.id} 
              data={card} 
              onClick={() => handleCardClick(idx)} 
              disabled={isLocked || isGameOver}
            />
          ))}
        </div>

        {/* Control Panel */}
        <div className="flex justify-center mt-12 gap-4">
          <button 
            onClick={() => initGame(difficulty)}
            className="group relative px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
          >
            <span className="relative z-10">RESTART MISSION</span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
          </button>
        </div>
      </div>

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-slate-800 border-2 border-amber-500 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] transform scale-in duration-300">
            <div className="w-20 h-20 bg-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
               <svg className="w-12 h-12 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <h2 className="text-3xl font-black text-amber-400 mb-2">GOLDEN VICTORY!</h2>
            <p className="text-slate-400 mb-6">You've unlocked the mysteries of the grid.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Total Moves</div>
                <div className="text-2xl font-black text-white">{moves}</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Time Taken</div>
                <div className="text-2xl font-black text-white">{(Math.floor(time / 60))}:{(time % 60).toString().padStart(2, '0')}</div>
              </div>
            </div>

            <button 
              onClick={() => initGame(difficulty)}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-2xl font-black text-lg transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:translate-y-0"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      <footer className="mt-auto pt-12 text-slate-500 text-xs tracking-widest font-medium relative z-10">
        &copy; 2024 MYSTIC GOLD LABS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default App;
