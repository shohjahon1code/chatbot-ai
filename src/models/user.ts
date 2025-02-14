import * as mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    phone_number: String,
    email: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export type User = mongoose.InferSchemaType<typeof schema>;
export const User = mongoose.model("user", schema);
