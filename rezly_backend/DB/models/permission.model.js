import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export const Permission = mongoose.model("Permission", permissionSchema);

