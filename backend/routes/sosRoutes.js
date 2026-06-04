import express from "express";
import SOS from "../models/SOS.js";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// TRIGGER SOS
router.post("/trigger", protect, async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    const sos = await SOS.create({
      user: req.user.id,
      location: {
        latitude: latitude || 0,
        longitude: longitude || 0,
        address: address || "Unknown",
      },
      status: "active",
      message: "Emergency SOS triggered",
    });

    // Get emergency contacts
    const user = await User.findById(req.user.id);
    const emergencyContacts = user?.emergencyContacts || [];

    res.status(201).json({
      message: "SOS triggered successfully",
      sos,
      emergencyContacts,
      userName: user?.name,
    });
  } catch (error) {
    console.error("SOS error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET MY SOS HISTORY
router.get("/history", protect, async (req, res) => {
  try {
    const history = await SOS.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// RESOLVE SOS
router.put("/resolve/:id", protect, async (req, res) => {
  try {
    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );
    res.json({ message: "SOS resolved", sos });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE LIVE LOCATION
router.put("/update-location/:id", protect, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const sos = await SOS.findByIdAndUpdate(
      req.params.id,
      {
        "location.latitude": latitude,
        "location.longitude": longitude,
        "location.address": latitude.toFixed(4) + ", " + longitude.toFixed(4),
      },
      { new: true }
    );
    res.json({ message: "Location updated", sos });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
