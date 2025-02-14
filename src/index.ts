import { serve } from "@hono/node-server";
import app from "./app";
import { config } from "./config";
import mongoose from "mongoose";

const init = async () => {
  await mongoose.connect(config.MONGODB_URI);

  console.log(`Server is running on port ${config.PORT}`);
  serve({
    fetch: app.fetch,
    port: Number(config.PORT),
  });
};

init();
