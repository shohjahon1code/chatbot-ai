import { Context } from "hono";
import { OpenAIService } from "../services/openai.service";
import { z } from "zod";
import { chatRequestSchema, imageAnalysisSchema } from "../schemas/chat.schema";

export class ChatController {
  private openAIService: OpenAIService;

  constructor() {
    this.openAIService = OpenAIService.getInstance();
  }

  async chat(c: Context) {
    try {
      const body = await c.req.json();
      const { message } = chatRequestSchema.parse(body);

      const response = await this.openAIService.chat(message);

      return c.json({ success: true, message: response });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to process message" },
        500
      );
    }
  }

  async analyzeImage(c: Context) {
    try {
      const body = await c.req.json();

      const { imageUrl } = imageAnalysisSchema.parse(body);

      const response = await this.openAIService.analyzeImage(imageUrl);

      return c.json({ success: true, message: response });
    } catch (error: any) {
      return c.json(
        {
          success: false,
          error: error.message || "Failed to analyze image",
        },
        500
      );
    }
  }
}
