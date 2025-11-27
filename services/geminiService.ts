
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GiftIdea, RecipientProfile } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

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
        description: "A specific brand name, website, or type of store to buy it from (e.g., 'Jumia', 'Konga', 'Instagram Vendors', 'Amazon' if widely available, or generic store types like 'Local Art Gallery')."
      },
      estimatedPrice: {
        type: Type.STRING,
        description: "The approximate price range in Nigerian Naira (₦) (e.g., '₦15,000 - ₦20,000')."
      }
    },
    required: ["title", "reason", "retailer", "estimatedPrice"]
  }
};

export const generateGiftIdeas = async (profile: RecipientProfile): Promise<GiftIdea[]> => {
  if (!apiKey) {
    throw new Error("API_KEY_MISSING: The API Key is not configured in the environment.");
  }

  // Determine the relationship string to use
  const finalRelation = profile.relation === 'Other' && profile.customRelation
    ? profile.customRelation
    : profile.relation;

  const prompt = `
    I need 7 specific, personalized, and purchasable gift ideas for the following person:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Relationship to giver: ${finalRelation}
    - Occasion: ${profile.occasion}
    - Taste/Style: ${profile.taste}
    - Target Budget: ${profile.budget} (Currency is Nigerian Naira)
    - Key Interests/Hobbies: ${profile.interests}
    - Exclusions (DO NOT SUGGEST THESE): ${profile.exclusions || 'None'}

    Be creative. Avoid generic gift cards unless specifically relevant to a hobby. 
    Focus on items that feel personal and thoughtful.
    
    Budget Note: The user has provided a target budget. Please suggest items that are approximately around this price point. Slightly cheaper is fine. Slightly more expensive (up to 20%) is okay if the gift is perfect.
    
    The budget is in Nigerian Naira (NGN). Please suggest items available to purchase in or ship to Nigeria if possible, or generally available items.
    The 'reason' should be a single, compelling sentence connecting the gift to their specific interests and taste.
    
    CRITICAL: Strictly adhere to the 'Exclusions'. Do not suggest any items that fall into the excluded categories.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: giftSchema,
        systemInstruction: "You are a world-class gift concierge familiar with the Nigerian market and global gift trends. Your goal is to find gifts that make people say 'Wow, you really know me!'. Provide 7 distinct ideas."
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("EMPTY_RESPONSE: The AI returned an empty response. It might have been blocked by safety filters.");
    }

    // Clean potential markdown code blocks (```json ... ```) which can cause JSON.parse to fail
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
        const ideas: GiftIdea[] = JSON.parse(cleanText);
        return ideas;
    } catch (parseError) {
        console.error("Failed to parse JSON:", cleanText);
        throw new Error(`PARSING_ERROR: The AI response could not be read. Raw text: ${cleanText.substring(0, 50)}...`);
    }

  } catch (error: any) {
    console.error("Error generating gifts:", error);
    
    // Categorize errors for better UI feedback
    const msg = error.message || '';
    
    if (msg.includes('403') || msg.includes('API key')) {
        throw new Error("Access Denied: The API Key is invalid or expired.");
    }
    if (msg.includes('429')) {
        throw new Error("System Busy: Too many requests. Please wait a moment and try again.");
    }
    if (msg.includes('safety') || msg.includes('blocked')) {
        throw new Error("Safety Block: The request was flagged by safety filters. Please try modifying the request.");
    }
    if (msg.includes('API_KEY_MISSING')) {
        throw new Error("Configuration Error: API Key is missing.");
    }
    
    // Pass through the original error if it's already specific, otherwise generic
    throw error;
  }
};
