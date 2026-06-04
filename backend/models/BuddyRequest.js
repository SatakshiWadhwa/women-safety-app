import mongoose from "mongoose";

const buddyRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: String, required: true },
    status: { type: String, enum: ["open", "matched", "completed", "cancelled"], default: "open" },
    matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    currentLocation: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const BuddyRequest = mongoose.model("BuddyRequest", buddyRequestSchema);
export default BuddyRequest;
