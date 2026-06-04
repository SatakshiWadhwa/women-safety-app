import express from "express";
import BuddyRequest from "../models/BuddyRequest.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE BUDDY REQUEST
router.post("/request", protect, async (req, res) => {
  try {
    const { from, to, departureTime, userName } = req.body;

    if (!from || !to || !departureTime) {
      return res.status(400).json({ message: "All fields required" });
    }

    const request = await BuddyRequest.create({
      user: req.user.id,
      userName: userName || "Anonymous",
      from,
      to,
      departureTime,
      status: "open",
    });

    res.status(201).json({ message: "Buddy request created", request });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET ALL OPEN REQUESTS
router.get("/requests", protect, async (req, res) => {
  try {
    const requests = await BuddyRequest.find({
      status: "open",
      user: { $ne: req.user.id },
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET MY REQUESTS
router.get("/my-requests", protect, async (req, res) => {
  try {
    const requests = await BuddyRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// JOIN A BUDDY REQUEST
router.put("/join/:id", protect, async (req, res) => {
  try {
    const request = await BuddyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "open") {
      return res.status(400).json({ message: "Request no longer available" });
    }

    request.status = "matched";
    request.matchedWith = req.user.id;
    await request.save();

    res.json({ message: "Buddy matched successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// COMPLETE A WALK
router.put("/complete/:id", protect, async (req, res) => {
  try {
    const request = await BuddyRequest.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    res.json({ message: "Walk completed safely", request });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// CANCEL A REQUEST
router.put("/cancel/:id", protect, async (req, res) => {
  try {
    const request = await BuddyRequest.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    res.json({ message: "Request cancelled", request });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
