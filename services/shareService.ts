import { GiftIdea, RecipientProfile } from '../types';
import { generateImageUrl } from './geminiService';

// Generates a URL containing the compressed state of the gift list
export const generateShareUrl = (profile: RecipientProfile, gifts: GiftIdea[]): string => {
  // We only store essential data to keep the URL length manageable.
  // We map long keys to short characters.
  const minimalGifts = gifts.map(g => ({
    t: g.title,
    r: g.reason,
    ret: g.retailer,
    p: g.estimatedPrice,
    k: g.imageKeyword
    // Note: We do NOT store imageUrl. It takes too much space. We regenerate it from 'k'.
  }));

  const payload = JSON.stringify({ p: profile, g: minimalGifts });
  
  // Safe Base64 Encoding for UTF-8 strings
  const encoded = btoa(encodeURIComponent(payload).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
          return String.fromCharCode(parseInt(p1, 16));
  }));

  return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
};

// Parses the current URL to retrieve shared gift lists
export const loadSharedState = (): { profile: RecipientProfile, gifts: GiftIdea[] } | null => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('share');
  
  if (!encoded) return null;

  try {
      // Safe Base64 Decoding
      const decoded = decodeURIComponent(atob(encoded).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const data = JSON.parse(decoded);
      
      if (!data.g || !Array.isArray(data.g)) return null;

      // Reconstruct full GiftIdea objects
      const gifts: GiftIdea[] = data.g.map((g: any) => ({
          title: g.t,
          reason: g.r,
          retailer: g.ret,
          estimatedPrice: g.p,
          imageKeyword: g.k,
          imageUrl: generateImageUrl(g.k) // Regenerate the image URL
      }));

      return { profile: data.p, gifts };
  } catch (e) {
      console.error("Failed to decode shared link", e);
      return null;
  }
}