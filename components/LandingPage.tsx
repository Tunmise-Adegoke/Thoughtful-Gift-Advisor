import React from 'react';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-fade-in text-center space-y-10 py-8">
      
      {/* Hero Icon */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-1000"></div>
        <div className="relative bg-[#111] p-8 rounded-[32px] border border-gray-800 shadow-2xl transform transition-transform duration-500 hover:scale-105 hover:rotate-3">
           <Gift size={64} className="text-white" strokeWidth={1} />
        </div>
        <div className="absolute -top-2 -right-2 bg-white text-black p-2 rounded-full animate-bounce">
            <Sparkles size={16} />
        </div>
      </div>

      {/* Hero Text */}
      <div className="space-y-6 max-w-md mx-auto px-4">
        <h1 className="font-serif text-5xl md:text-6xl text-white leading-[1.1] tracking-tight">
          The Art of <br/>
          <span className="text-gray-500 italic">Thoughtful</span> Gifting.
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed font-light">
          No more generic gifts. Our AI concierge curates personalized ideas based on their unique personality, taste, and your specific budget.
        </p>
      </div>

      {/* CTA Section */}
      <div className="pt-4 w-full max-w-xs px-4">
        <button
          onClick={onStart}
          className="group w-full flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <span>Find the Perfect Gift</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <div className="mt-8 flex items-center justify-center gap-6 text-gray-600 text-xs uppercase tracking-widest font-medium">
            <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                Instant
            </span>
            <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                Personalized
            </span>
            <span className="flex items-center gap-1">
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                Free
            </span>
        </div>
      </div>
    </div>
  );
};
