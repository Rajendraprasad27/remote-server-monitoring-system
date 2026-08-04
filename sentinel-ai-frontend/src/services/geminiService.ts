
import { GoogleGenAI } from "@google/genai";
import { Server, Metric } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async generateHealthSummary(servers: Server[], metrics: Metric[]): Promise<string> {
    try {
      const dataStr = servers.map(s => {
        const m = metrics.find(met => met.serverId === s.id);
        return `Server ${s.name}: Status ${s.status}, CPU ${m?.cpu}%, RAM ${m?.ram}%, Temp ${m?.temperature}°C`;
      }).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following server telemetry data and provide a professional, concise health summary with predictive insights about potential failures in the next 24 hours:\n\n${dataStr}`,
        config: {
          temperature: 0.7,
          systemInstruction: "You are an AI SRE expert. Provide actionable insights based on server metrics."
        }
      });

      return response.text || "Unable to generate summary at this time.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "AI analysis failed. Please check your system connectivity.";
    }
  }
};
