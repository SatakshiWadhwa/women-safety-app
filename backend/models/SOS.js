import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
      address: { type: String, default: "Unknown" },
    },
    status: { type: String, enum: ["active", "resolved"], default: "active" },
    message: { type: String, default: "Emergency SOS triggered" },
  },
  { timestamps: true }
);

const SOS = mongoose.model("SOS", sosSchema);
export default SOS;
