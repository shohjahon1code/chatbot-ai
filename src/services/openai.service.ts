import OpenAI from "openai";
import { config } from "../config";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import axios from "axios";

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an experienced antique dealer with deep knowledge of various antiques, their history, and market values. 
You help customers learn about antiques, negotiate prices, and make informed purchasing decisions.
Always maintain a professional yet friendly tone. If a customer uploads an image, analyze it and provide relevant information about the antique.
When negotiating prices:
- Start with a reasonable market price
- Be willing to negotiate within a 10-20% range
- Consider the item's condition, rarity, and historical significance
- Explain your pricing rationale`;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | any[];
}

export class OpenAIService {
  private static instance: OpenAIService;
  private context: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];

  private constructor() {}

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private async getBase64FromUrl(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer",
      });
      const contentType = response.headers["content-type"];
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      throw new Error(`Failed to fetch image: ${error}`);
    }
  }

  async chat(message: string): Promise<string> {
    this.context.push({ role: "user", content: message });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: this.context as ChatCompletionMessageParam[],
        temperature: 0.7,
        max_tokens: 500,
      });

      const reply =
        response.choices[0]?.message?.content ||
        "Sorry, I could not process your request.";
      this.context.push({ role: "assistant", content: reply });

      if (this.context.length > 10) {
        this.context = [this.context[0], ...this.context.slice(-9)];
      }

      return reply;
    } catch (error) {
      throw new Error("Failed to get response from AI");
    }
  }

  async analyzeImage(imageUrl: string): Promise<string> {
    try {
      console.log("Starting image analysis for URL:", imageUrl);

      const base64Image = await this.getBase64FromUrl(imageUrl);

      const messages: ChatCompletionMessageParam[] = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this antique item in detail. Describe its style, estimated age, origin, potential value, and any notable features or characteristics.",
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
                detail: "high",
              },
            },
          ],
        } as ChatCompletionMessageParam,
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 1000,
      });

      if (!response.choices[0]?.message?.content) {
        throw new Error("No content in OpenAI response");
      }

      const analysis = response.choices[0].message.content;

      this.context.push(
        { role: "user", content: "Please analyze this antique item." },
        { role: "assistant", content: analysis }
      );

      return analysis;
    } catch (error: any) {
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
  }
}
