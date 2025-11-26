import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative mb-8">
        <div className="w-20 h-20 border-2 border-gray-800 border-t-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-serif text-white">Curating ideas...</h3>
        <p className="text-gray-500 text-sm tracking-wide">Analysing taste, budget & interests</p>
      </div>
    </div>
  );
};