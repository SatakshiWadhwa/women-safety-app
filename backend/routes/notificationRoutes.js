import express from "express";
import webpush from "web-push";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
const subscriptions = [];

const setupVapid = () => {
  webpush.setVapidDetails(
    "mailto:safecampus@gmail.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
};

router.post("/subscribe", protect, async (req, res) => {
  try {
    setupVapid();
    const subscription = req.body;
    const exists = subscriptions.find(s => s.endpoint === subscription.endpoint);
    if (!exists) {
      subscriptions.push({ ...subscription, userId: req.user.id });
    }
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscribe error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/send", protect, async (req, res) => {
  try {
    setupVapid();
    const { title, body } = req.body;
    const payload = JSON.stringify({ title, body });
    const results = await Promise.allSettled(
      subscriptions.map(sub => webpush.sendNotification(sub, payload))
    );
    res.json({ message: "Notifications sent", results: results.length });
  } catch (error) {
    console.error("Send error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/vapid-key", (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

export { subscriptions };
export default router;
