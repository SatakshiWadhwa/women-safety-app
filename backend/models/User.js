import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },
    hostelDetails: { type: String, default: "" },
    collegeDetails: { type: String, default: "" },
    medicalInfo: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    emergencyContacts: [
      {
        name: String,
        phone: String,
        relation: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
