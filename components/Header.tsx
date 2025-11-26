import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-8 px-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold tracking-widest uppercase text-white">Thoughtful</span>
      </div>
    </header>
  );
};