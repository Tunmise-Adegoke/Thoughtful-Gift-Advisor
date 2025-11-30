import React, { useState } from 'react';
import { GiftIdea, RecipientProfile } from '../types';
import { ExternalLink, RefreshCw, Heart, Image as ImageIcon, Gift } from 'lucide-react';

interface GiftResultsProps {
  gifts: GiftIdea[];
  onReset: () => void;
  profile: RecipientProfile | null;
}

// Sub-component to handle individual card state (Image Loading, Error & Likes)
const GiftCardItem: React.FC<{ 
    gift: GiftIdea; 
    index: number; 
    isLiked: boolean; 
    toggleLike: () => void; 
}> = ({ gift, index, isLiked, toggleLike }) => {
    const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    const handleImageLoad = () => setImageStatus('loaded');
    const handleImageError = () => setImageStatus('error');

    return (
        <div 
            className="group relative bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_70px_-15px_rgba(255,90,95,0.15)] transition-all duration-500 transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 150}ms` }}
        >
            {/* Image Container */}
            <div className="relative h-72 w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                
                {/* Progressive Loading State (Shimmer) */}
                {imageStatus === 'loading' && (
                    <div className="absolute inset-0 bg-gray-100 overflow-hidden flex items-center justify-center">
                         {/* Shimmer Effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer skew-x-[-20deg]"></div>
                         
                         {/* Subtle Icon Placeholder */}
                         <div className="relative z-10 opacity-20 scale-90">
                            <ImageIcon size={40} className="text-gray-400" />
                         </div>
                    </div>
                )}

                {/* Error State Fallback */}
                {imageStatus === 'error' && (
                    <div className="absolute inset-0 bg-orange-50/50 flex flex-col items-center justify-center text-joy-secondary p-6 text-center">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-2">
                             <Gift size={32} className="opacity-70 text-joy-secondary" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Image Preview Unavailable</span>
                    </div>
                )}

                {gift.imageUrl && imageStatus !== 'error' && (
                    <img 
                        src={gift.imageUrl} 
                        alt={gift.imageKeyword}
                        className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 
                            ${imageStatus === 'loaded' ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-110'}`}
                        loading="lazy"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                )}
                
                {/* Price Tag Overlay */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm font-bold text-joy-text z-10 transition-transform duration-300 group-hover:scale-105">
                    {gift.estimatedPrice}
                </div>

                {/* Like Button Overlay */}
                <button 
                    onClick={toggleLike}
                    className="absolute top-6 right-6 p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm hover:bg-red-50 transition-colors z-10 group-hover:scale-105 duration-300"
                >
                    <Heart 
                        size={20} 
                        className={`transition-colors duration-300 ${isLiked ? 'fill-joy-accent text-joy-accent' : 'text-gray-400'}`} 
                    />
                </button>
            </div>
            
            {/* Content */}
            <div className="p-8">
                <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="font-serif text-2xl font-bold text-joy-text leading-tight group-hover:text-joy-accent transition-colors">
                        {gift.title}
                    </h3>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-6 border-l-2 border-joy-accent/20 pl-4 py-1">
                    {gift.reason}
                </p>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Found at</span>
                        <span className="text-sm font-semibold text-joy-text flex items-center gap-1">
                            {gift.retailer}
                        </span>
                    </div>

                    <div className="flex gap-3">
                         <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(gift.title + " " + gift.retailer + " buy online")}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-joy-text text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-joy-accent transition-all duration-300 shadow-lg shadow-gray-200 group-hover:shadow-joy-accent/30 hover:-translate-y-0.5"
                        >
                            <span>View Item</span>
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const GiftResults: React.FC<GiftResultsProps> = ({ gifts, onReset, profile }) => {
  const [likedGifts, setLikedGifts] = useState<Set<number>>(new Set());

  const toggleLike = (index: number) => {
    const newLiked = new Set(likedGifts);
    if (newLiked.has(index)) {
      newLiked.delete(index);
    } else {
      newLiked.add(index);
    }
    setLikedGifts(newLiked);
  };

  return (
    <div className="w-full animate-fade-in max-w-xl mx-auto pb-12">
      
      {/* Header Section */}
      <div className="text-center space-y-3 mb-12 pt-4">
        <div className="inline-block px-4 py-1.5 rounded-full bg-joy-accent/10 text-joy-accent text-xs font-bold tracking-widest uppercase mb-2">
            7 Perfect Matches Found
        </div>
        <h2 className="font-serif text-4xl text-joy-text leading-tight">
            Curated with <span className="text-joy-accent italic">Love</span>
        </h2>
        {profile ? (
            <p className="text-gray-500 max-w-xs mx-auto">
                Handpicked ideas for your {profile.relation.toLowerCase()} ({profile.occasion}).
            </p>
        ) : (
            <p className="text-gray-500 max-w-xs mx-auto">
                We've handpicked these items based on the unique profile you shared.
            </p>
        )}
      </div>

      {/* Grid of Gifts */}
      <div className="space-y-12">
        {gifts.map((gift, index) => (
          <GiftCardItem 
            key={index} 
            gift={gift} 
            index={index} 
            isLiked={likedGifts.has(index)}
            toggleLike={() => toggleLike(index)}
          />
        ))}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="mt-16 text-center pb-8">
         <button 
            onClick={onReset}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-joy-accent bg-white border border-gray-100 hover:bg-orange-50 px-8 py-3 rounded-full transition-all text-sm font-medium shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
        >
            <RefreshCw size={16} />
            <span>Start Over</span>
        </button>
      </div>
    </div>
  );
};