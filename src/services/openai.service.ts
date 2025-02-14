import OpenAI from "openai";
import { config } from "../config";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import axios from "axios";
import { SYSTEM_PROMPT } from "../constants";
import { ChatMessage } from "../interfaces";

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

export class OpenAIService {
  private static instance: OpenAIService;
  private context: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];
  private marketPrices: Record<string, number> = {
    "antique vase": 300,
    "old clock": 450,
    "vintage painting": 700,
    "rare coin": 200,
  };

  private constructor() {}

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private async getBase64FromUrl(url: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const contentType = response.headers["content-type"];
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      throw new Error(`Failed to fetch image: ${error}`);
    }
  }

  private determinePrice(item: string, userOffer: number): number {
    const basePrice = this.marketPrices[item.toLowerCase()] || 500;
    const minAcceptablePrice = basePrice * 0.8;

    if (userOffer >= minAcceptablePrice && userOffer <= basePrice) {
      return userOffer;
    } else if (userOffer < minAcceptablePrice) {
      return minAcceptablePrice;
    }
    return basePrice;
  }

  async chat(message: string): Promise<string> {
    this.context.push({ role: "user", content: message });

    let negotiationMessage = "";
    const priceMatch = message.match(/\$(\d+)/);
    if (priceMatch) {
      const userOffer = parseInt(priceMatch[1], 10);
      const bestPrice = this.determinePrice("antique item", userOffer);

      negotiationMessage = `The user offered $${userOffer}. Counter with a price around $${bestPrice}, and justify the price based on rarity and condition.`;
      this.context.push({ role: "system", content: negotiationMessage });
    }

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
      const base64Image = await this.getBase64FromUrl(imageUrl);

      const messages: ChatCompletionMessageParam[] = [
        {
          role: "user",
          content: [
            { type: "text", text: SYSTEM_PROMPT },
            {
              type: "image_url",
              image_url: { url: base64Image, detail: "high" },
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
