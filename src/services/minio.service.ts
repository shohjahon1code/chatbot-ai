import { Client } from "minio";
import { config } from "../config";

export class MinioService {
  private static instance: MinioService;
  private minioClient: Client;

  private constructor() {
    this.minioClient = new Client({
      endPoint: config.MINIO_ENDPOINT,
      port: Number(config.MINIO_PORT),
      useSSL: config.MINIO_USE_SSL === "true",
      accessKey: config.MINIO_ACCESS_KEY,
      secretKey: config.MINIO_SECRET_KEY,
    });
  }

  public static getInstance(): MinioService {
    if (!MinioService.instance) {
      MinioService.instance = new MinioService();
    }
    return MinioService.instance;
  }

  async uploadImage(file: Buffer, originalName: string): Promise<string> {
    const timestamp = Date.now();
    const extension = originalName.split(".").pop();
    const fileName = `antiques/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    await this.minioClient.putObject(
      config.MINIO_BUCKET_NAME,
      fileName,
      file,
      file.length,
      {
        "Content-Type": `image/${extension}`,
      }
    );

    return `https://${config.MINIO_ENDPOINT}/${config.MINIO_BUCKET_NAME}/${fileName}`;
  }
}
