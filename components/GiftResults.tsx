import React from 'react';
import { GiftIdea } from '../types';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface GiftResultsProps {
  gifts: GiftIdea[];
  onReset: () => void;
}

export const GiftResults: React.FC<GiftResultsProps> = ({ gifts, onReset }) => {
  return (
    <div className="w-full animate-fade-in max-w-lg mx-auto">
      <div className="mb-10 text-center space-y-2">
        <h2 className="font-serif text-3xl text-white">Curated for you</h2>
        <p className="text-gray-500 text-sm">Based on the profile you provided</p>
      </div>

      <div className="space-y-6">
        {gifts.map((gift, index) => (
          <div 
            key={index} 
            className="bg-[#111] rounded-[24px] p-6 border border-gray-900 hover:border-gray-700 transition-all duration-300 group"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white leading-tight group-hover:text-gray-200">
                    {gift.title}
                </h3>
                <span className="shrink-0 ml-4 px-3 py-1 rounded-full bg-gray-900 text-[10px] font-bold text-gray-400 border border-gray-800 uppercase tracking-wide">
                    {gift.estimatedPrice}
                </span>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6 border-l border-gray-800 pl-3">
              {gift.reason}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-900/50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-1">Available at</span>
                    <span className="text-sm font-medium text-gray-300">{gift.retailer}</span>
                </div>
                
                <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(gift.title + " " + gift.retailer)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-200 transition-colors transform hover:-translate-y-1 hover:shadow-lg"
                >
                    <ExternalLink size={18} />
                </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button 
            onClick={onReset}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-gray-900"
        >
            <RefreshCw size={16} />
            <span className="text-sm font-medium">Start Over</span>
        </button>
      </div>
    </div>
  );
};