import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTrackDescription = async (
  title: string,
  artist: string,
  genre: string,
  mood: string
): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `Write a professional, catchy, and engaging press release description (max 150 words) for a new music track.
    
    Track Details:
    - Title: ${title}
    - Artist: ${artist}
    - Genre: ${genre}
    - Mood: ${mood}
    
    The tone should be suitable for Spotify editorial pitching and Apple Music descriptions. Focus on the sonic qualities and the artist's vibe.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error generating description. Please try again or write manually.";
  }
};

export const analyzeReleaseStrategy = async (genre: string): Promise<string> => {
   try {
    const ai = getClient();
    const prompt = `Provide a bulleted list of 3 key marketing strategies for releasing a ${genre} song in 2025. Keep it concise.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate strategy.";
  } catch (error) {
    console.error("Error generating strategy:", error);
    return "Focus on TikTok trends, playlist pitching, and consistent social media engagement.";
  }
}