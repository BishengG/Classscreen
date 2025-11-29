import { GoogleGenAI } from "@google/genai";

export const generateClassroomBackground = async (prompt: string, size: '1K' | '2K' | '4K' = '2K'): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please select a key.");
  }

  // Initialize client dynamically
  const ai = new GoogleGenAI({ apiKey });

  const extractContentImage = (response: any): string => {
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data returned from Gemini.");
  };

  // 1. Attempt High Quality (Nano Banana Pro / gemini-3-pro-image-preview)
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: prompt + ", high quality, 4k, suitable for a classroom background, subtle wallpaper style" }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: size
        }
      }
    });
    return extractContentImage(response);
  } catch (proError: any) {
    console.warn("Gemini Pro Image failed, attempting fallback to Flash.", proError);

    // 2. Fallback to Standard (Gemini 2.5 Flash Image)
    // Note: Flash Image usually doesn't support explicit imageSize config in the same way, or defaults to 1024x1024 (1:1) or similar.
    // We keep 16:9 aspect ratio.
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: prompt + ", suitable for a classroom background, wallpaper style" }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });
      return extractContentImage(response);
    } catch (flashError: any) {
      console.warn("Gemini Flash Image failed, attempting fallback to Imagen.", flashError);

      // 3. Fallback to Imagen 3 (imagen-3.0-generate-001)
      try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-001',
            prompt: prompt + ", suitable for a classroom background, wallpaper style",
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });
        
        const base64 = response.generatedImages?.[0]?.image?.imageBytes;
        if (base64) {
            return `data:image/jpeg;base64,${base64}`;
        }
        throw new Error("No image data returned from Imagen.");
      } catch (imagenError: any) {
        console.error("All image generation models failed.", imagenError);
        
        // Throw a specific error if it's a quota issue to show a nice message
        if (
             imagenError.status === 429 || 
             imagenError.message?.includes("429") ||
             imagenError.message?.includes("RESOURCE_EXHAUSTED") ||
             flashError.message?.includes("RESOURCE_EXHAUSTED")
        ) {
            throw new Error("Daily generation quota exceeded for all models. Please try again later.");
        }
        
        throw imagenError;
      }
    }
  }
};