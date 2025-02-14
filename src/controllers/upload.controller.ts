import { Context } from "hono";
import { MinioService } from "../services/minio.service";

export class UploadController {
  private minioService: MinioService;

  constructor() {
    this.minioService = MinioService.getInstance();
  }

  async uploadImage(c: Context) {
    try {
      const formData = await c.req.formData();
      const file = formData.get("image") as File;

      if (!file) {
        return c.json({ success: false, error: "No image file provided" }, 400);
      }

      if (!file.type.startsWith("image/")) {
        return c.json({ success: false, error: "File must be an image" }, 400);
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const imageUrl = await this.minioService.uploadImage(buffer, file.name);

      return c.json({ success: true, imageUrl });
    } catch (error) {
      return c.json({ success: false, error: "Failed to upload image" }, 500);
    }
  }
}
