import * as mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    phone_number: String,
    code: Number,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export type OTP = mongoose.InferSchemaType<typeof schema>;
export const OTP = mongoose.model("otp", schema);
