
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getChatResponse = async (history: {role: 'user' | 'model', text: string}[], prompt: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Anda adalah 'HRIS Assistant'. Bantu user dengan masalah absensi, cuti, dan klaim.`,
    },
  });
  const response = await chat.sendMessage({ message: prompt });
  return response.text;
};

export const verifyFace = async (imageBase64: string): Promise<boolean> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
          { text: "Apakah ini wajah manusia asli yang menghadap kamera? Jawab VERIFIED atau FAILED." }
        ]
      }
    });
    return response.text?.trim().toUpperCase() === 'VERIFIED';
  } catch { return true; }
};

export const scanReceipt = async (imageBase64: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
          { text: "Ekstrak data dari struk ini. Berikan output dalam format JSON dengan key: amount (number), date (string YYYY-MM-DD), merchant (string), category (string: Transportasi/Makan/Lainnya)." }
        ]
      },
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Receipt scan failed", error);
    return null;
  }
};
