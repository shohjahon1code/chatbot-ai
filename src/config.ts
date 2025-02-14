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
  MINIO_USE_SSL: z.string().default('true'),
  MINIO_ACCESS_KEY: z.string().default('bi9PoWQzPZaKUY0Mnt1I'),
  MINIO_SECRET_KEY: z.string().default('qYtmSaRA5wd9GO3lylp9HpthzPnLjULE3ImTTc9D'),
  MINIO_BUCKET_NAME: z.string().default('uway-storage'),
});

export const config = configSchema.parse(process.env);
