import React, { useState, useEffect } from 'react';
import { Gift, Watch, Smartphone, Shirt, Book, Coffee, Music, Camera, Palette } from 'lucide-react';

const LOADING_MESSAGES = [
  "Analyzing recipient profile...",
  "Scanning interest categories...",
  "Filtering by budget...",
  "Identifying local retailers...",
  "Selecting the perfect items...",
  "Wrapping up recommendations..."
];

export const Loading: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] w-full max-w-lg mx-auto overflow-hidden">
      
      {/* Animation Container */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        
        {/* Central Gift Box */}
        <div className="relative z-10 bg-black p-4 rounded-full border border-gray-800 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
            <Gift size={48} className="text-white animate-pulse" strokeWidth={1.5} />
        </div>

        {/* Falling Items - Using absolute positioning and custom delays */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Item 1: Top Left */}
            <div className="absolute top-0 left-10 animate-drop-in" style={{ animationDelay: '0s' }}>
                <Watch size={24} className="text-gray-600" />
            </div>
            
            {/* Item 2: Top Right */}
            <div className="absolute top-4 right-12 animate-drop-in" style={{ animationDelay: '0.6s' }}>
                <Smartphone size={24} className="text-gray-600" />
            </div>

            {/* Item 3: Top Center-Left */}
            <div className="absolute top-2 left-24 animate-drop-in" style={{ animationDelay: '1.2s' }}>
                <Palette size={24} className="text-gray-600" />
            </div>

             {/* Item 4: Top Center-Right */}
             <div className="absolute top-0 right-20 animate-drop-in" style={{ animationDelay: '1.8s' }}>
                <Book size={24} className="text-gray-600" />
            </div>

            {/* Item 5: High Center */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-drop-in" style={{ animationDelay: '0.9s' }}>
                <Shirt size={24} className="text-gray-600" />
            </div>
        </div>
        
        {/* Subtle glow effect behind */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent rounded-full blur-3xl -z-10"></div>
      </div>

      {/* Text Updates */}
      <div className="text-center space-y-3 h-20 px-4">
        <h3 className="text-2xl font-serif text-white animate-fade-in key-{msgIndex}">
          {LOADING_MESSAGES[msgIndex]}
        </h3>
        <p className="text-gray-500 text-xs tracking-[0.2em] uppercase">
          AI Curation in Progress
        </p>
      </div>

      {/* Progress Bar (Visual only) */}
      <div className="w-48 h-1 bg-gray-900 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-white/50 w-full animate-[slideUp_2s_ease-in-out_infinite] origin-left transform -translate-x-full"></div>
      </div>

    </div>
  );
};