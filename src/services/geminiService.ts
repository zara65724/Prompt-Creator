import { GoogleGenAI, Type } from "@google/genai";
import { CreatorPrompts } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateCreatorPrompts(topic: string): Promise<CreatorPrompts> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate creative, ready-to-use prompts and ideas for content creators based on the topic: "${topic}".
    
    You must provide:
    1. 5 ChatGPT writing prompts
    2. 5 Midjourney AI image prompts
    3. 5 YouTube / TikTok video ideas
    4. 5 Blog post ideas with catchy titles
    5. 5 Social media post ideas (Instagram, LinkedIn, Twitter)
    
    Make the outputs creative, specific, and high-quality.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          chatGPT: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5 creative ChatGPT writing prompts"
          },
          midjourney: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5 detailed Midjourney AI image prompts"
          },
          videoContent: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5 YouTube/TikTok video ideas"
          },
          blogPosts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5 blog post ideas with catchy titles"
          },
          socialMedia: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5 social media post ideas"
          }
        },
        required: ["topic", "chatGPT", "midjourney", "videoContent", "blogPosts", "socialMedia"]
      }
    }
  });

  try {
    return JSON.parse(response.text) as CreatorPrompts;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate prompts. Please try again.");
  }
}
