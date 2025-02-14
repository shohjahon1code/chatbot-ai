import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import { ChatController } from "./controllers/chat.controller";
import { UploadController } from "./controllers/upload.controller";
import Home from "./views/Home";

const app = new Hono();
const chatController = new ChatController();
const uploadController = new UploadController();

// Middleware
app.use("*", logger());
app.use("*", cors());
app.use("/uploads/*", serveStatic({ root: "./" }));

// Chat routes
app.post("/api/chat", (c) => chatController.chat(c));
app.post("/api/chat/analyze-image", (c) => chatController.analyzeImage(c));

// Upload route
app.post("/api/upload", (c) => uploadController.uploadImage(c));

// Home route
app.get("/", (c) => {
  return c.html(Home());
});

// Serve static files for frontend
app.get("/*", serveStatic({ root: "./public" }));

export default app;
