import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().min(1),
});

export const imageAnalysisSchema = z.object({
  imageUrl: z.string().url(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ImageAnalysisRequest = z.infer<typeof imageAnalysisSchema>;
