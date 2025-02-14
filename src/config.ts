import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

dotenvConfig();

const configSchema = z.object({
  PORT: z.string().default('3000'),
  HOST: z.string().default('localhost'),
  OPENAI_API_KEY: z.string(),
  MONGODB_URI: z.string(),
  MAX_FILE_SIZE: z.string().transform(Number).default('5242880'),
  UPLOAD_DIR: z.string().default('uploads'),
  MINIO_ENDPOINT: z.string().default('s3.glmv.dev'),
  MINIO_PORT: z.string().default('443'),
  MINIO_USE_SSL: z.string(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_BUCKET_NAME: z.string(),
});

export const config = configSchema.parse(process.env);
