import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiService = {
  generateStream: async (prompt, onChunk, onEnd, onError) => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) onChunk(text);
      }

      onEnd();
    } catch (error) {
      onError(error);
    }
  }
};
