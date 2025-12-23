
import React from 'react';
import { GameStats } from '../types';
import { formatTime } from '../utils/gameLogic';

interface StatusBarProps {
  stats: GameStats;
}

const StatusBar: React.FC<StatusBarProps> = ({ stats }) => {
  return (
    <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Moves</span>
        <span className="text-2xl font-bold text-amber-400">{stats.moves}</span>
      </div>
      
      <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Timer</span>
        <span className="text-2xl font-bold text-amber-400">{formatTime(stats.time)}</span>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Matched</span>
        <span className="text-2xl font-bold text-amber-400">{stats.matchedPairs} / {stats.totalPairs}</span>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Progress</span>
        <div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-amber-500 transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
            style={{ width: `${(stats.matchedPairs / stats.totalPairs) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
