import React from 'react';
import { Sparkles, History } from 'lucide-react';

interface HeaderProps {
    onOpenHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHistory }) => {
  return (
    <header className="flex items-center justify-between py-8 px-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-joy-accent text-white rounded-full flex items-center justify-center shadow-md">
            <Sparkles size={14} fill="currentColor" />
        </div>
        <span className="text-sm font-bold tracking-widest uppercase text-joy-text">Thoughtful</span>
      </div>

      {onOpenHistory && (
          <button 
            onClick={onOpenHistory}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-joy-accent transition-colors bg-white px-3 py-2 rounded-full shadow-sm border border-transparent hover:border-joy-accent/20"
          >
            <History size={14} />
            <span className="hidden sm:inline">Recent</span>
          </button>
      )}
    </header>
  );
};
