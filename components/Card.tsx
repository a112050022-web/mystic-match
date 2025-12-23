
import React from 'react';
import { CardData } from '../types';

interface CardProps {
  data: CardData;
  onClick: () => void;
  disabled: boolean;
}

const Card: React.FC<CardProps> = ({ data, onClick, disabled }) => {
  return (
    <div 
      className={`relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 perspective-1000 cursor-pointer transition-transform duration-300 ${disabled ? 'cursor-not-allowed opacity-90' : 'hover:scale-105 active:scale-95'}`}
      onClick={() => !disabled && onClick()}
    >
      <div className={`relative w-full h-full duration-500 preserve-3d transition-all ${data.isFlipped || data.isMatched ? 'rotate-y-180' : ''}`}>
        
        {/* Card Back (Hidden initially) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl backface-hidden flex items-center justify-center border-2 border-amber-400/30"
          style={{
            background: 'conic-gradient(from 180deg at 50% 50%, #B8860B 0deg, #FFD700 120deg, #DAA520 240deg, #B8860B 360deg)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3), 0 4px 6px rgba(0,0,0,0.5)'
          }}
        >
          {/* Conical center highlight detail */}
          <div className="w-1 h-1 bg-white/20 rounded-full blur-[1px]"></div>
          <div className="absolute inset-2 border border-white/10 rounded-lg"></div>
        </div>

        {/* Card Front (Showing Symbol) */}
        <div 
          className="absolute inset-0 w-full h-full rounded-xl backface-hidden rotate-y-180 flex items-center justify-center border-2 border-white/50"
          style={{
            background: data.isMatched 
              ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' 
              : 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
          }}
        >
          <span className={`text-4xl md:text-5xl select-none ${data.isMatched ? 'opacity-40 grayscale-[0.5]' : ''}`}>
            {data.content}
          </span>
          {data.isMatched && (
            <div className="absolute inset-0 flex items-center justify-center">
               <svg className="w-12 h-12 text-green-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Card;
