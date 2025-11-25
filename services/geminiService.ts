import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeReceipt = async (base64Image: string): Promise<ReceiptAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, can be dynamic
              data: base64Image,
            },
          },
          {
            text: `Analyze this image. Is it a valid payment receipt or bank transfer confirmation? 
                   Extract the total amount if visible.
                   Return a JSON object with:
                   - isValid (boolean): true if it looks like a payment receipt.
                   - detectedAmount (string): The amount found, or "Unknown".
                   - summary (string): A very brief 1-sentence description of what you see.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            detectedAmount: { type: Type.STRING },
            summary: { type: Type.STRING },
          },
          required: ["isValid", "summary"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as ReceiptAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback if AI fails, effectively manual review needed
    return {
      isValid: true, // Optimistically allow submission for manual review
      summary: "Could not automatically verify. Submitted for manual review.",
      detectedAmount: "Unknown"
    };
  }
};