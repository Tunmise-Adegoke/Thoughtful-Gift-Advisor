import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GiftIdea, RecipientProfile } from "../types";

const giftSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "The name of the specific gift product or experience."
      },
      reason: {
        type: Type.STRING,
        description: "A single, persuasive sentence explaining why this fits the user's profile perfectly."
      },
      retailer: {
        type: Type.STRING,
        description: "A specific brand name, website, or type of store to buy it from."
      },
      estimatedPrice: {
        type: Type.STRING,
        description: "The approximate price range in the user's selected currency."
      },
      imageKeyword: {
        type: Type.STRING,
        description: "A precise, specific search query for a high-quality product image. Include brand, model, color, and terms like 'product photography' or 'studio shot'. Example: 'Apple AirPods Max Silver product photography', 'Le Creuset Dutch Oven Orange studio shot'."
      }
    },
    required: ["title", "reason", "retailer", "estimatedPrice", "imageKeyword"]
  }
};

// Helper to generate consistent image URLs
export const generateImageUrl = (keyword: string): string => {
    // Using Bing Thumbnail API with high-res parameters for quality
    // w=1200, h=1200: Increased to high resolution (Square format for flexible cropping)
    // c=7: Smart crop to center the subject
    // rs=1: Resize
    // pid=1.7: Request high quality
    // mkt=en-US: Market
    return `https://tse2.mm.bing.net/th?q=${encodeURIComponent(keyword)}&w=1200&h=1200&c=7&rs=1&pid=1.7&mkt=en-US&adlt=moderate`;
};

export const generateGiftIdeas = async (profile: RecipientProfile): Promise<GiftIdea[]> => {
  // Access API key directly from environment at runtime
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API_KEY_MISSING: The API Key is not configured in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Determine the relationship string to use
  const finalRelation = profile.relation === 'Other' && profile.customRelation
    ? profile.customRelation
    : profile.relation;

  let acquaintanceInstructions = "";
  if (profile.isAcquaintance) {
    acquaintanceInstructions = `
      IMPORTANT: The user explicitly stated they do NOT know the recipient well (Acquaintance Mode).
      
      Strategy for Acquaintance Mode:
      1. IGNORE niche hobbies unless specifically mentioned in 'Key Interests'.
      2. FOCUS ON "Elevated Safe Bets": High-quality consumables (gourmet food/drink), premium office/desk accessories, neutral home decor, or universally useful tech.
      3. AVOID: Clothing with specific sizes, highly specific fandom merchandise, or polarizing art.
      4. The goal is to suggest gifts that are thoughtful and impressive but safe for a colleague, neighbor, or distant relative.
    `;
  }

  const prompt = `
    I need 7 specific, personalized, and purchasable gift ideas for the following person:
    - Age: ${profile.age} (Consider the specific developmental stage or generation for this age)
    - Gender: ${profile.gender}
    - Relationship to giver: ${finalRelation}
    - Occasion: ${profile.occasion}
    - Taste/Style: ${profile.taste}
    - Target Budget: ${profile.budget}
    - Currency: ${profile.currency}
    - Key Interests/Context: ${profile.interests}
    - Exclusions (DO NOT SUGGEST THESE): ${profile.exclusions || 'None'}

    ${acquaintanceInstructions}

    Be creative. Avoid generic gift cards. Focus on items that feel personal and thoughtful.
    
    The budget is in ${profile.currency}. Please suggest items available to purchase in regions using this currency or globally available items with prices converted to ${profile.currency}.
    The 'reason' should be a single, compelling sentence connecting the gift to their specific interests and taste.
    
    For 'imageKeyword', provide a specific product search term that will yield high-quality product photography. 
    - ALWAYS include the brand, model, and color. 
    - Append "product photography" or "white background" to the keyword to ensure high-fidelity results.
    
    CRITICAL: Strictly adhere to the 'Exclusions'. Do not suggest any items that fall into the excluded categories.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: giftSchema,
        systemInstruction: "You are a world-class gift concierge. Your goal is to find gifts that make people say 'Wow, you really know me!'. Provide 7 distinct ideas."
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("EMPTY_RESPONSE: The AI returned an empty response.");
    }

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        const rawIdeas: GiftIdea[] = JSON.parse(cleanText);
        
        // Enhance ideas with real search images
        const ideas = rawIdeas.map(idea => ({
            ...idea,
            // Use the shared helper function
            imageUrl: generateImageUrl(idea.imageKeyword)
        }));

        return ideas;
    } catch (parseError) {
        console.error("Failed to parse JSON:", cleanText);
        throw new Error(`PARSING_ERROR: The AI response could not be read.`);
    }

  } catch (error: any) {
    console.error("Error generating gifts:", error);
    
    const msg = error.message || '';
    
    if (msg.includes('403') || msg.includes('API key')) throw new Error("Access Denied: The API Key is invalid or expired.");
    if (msg.includes('429')) throw new Error("System Busy: Too many requests. Please wait a moment and try again.");
    if (msg.includes('safety') || msg.includes('blocked')) throw new Error("Safety Block: The request was flagged by safety filters.");
    if (msg.includes('API_KEY_MISSING')) throw new Error("API_KEY_MISSING");
    
    throw error;
  }
};