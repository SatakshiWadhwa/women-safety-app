import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const SAFETY_SYSTEM_PROMPT = `You are SafeGuard AI, a specialized women safety assistant for college and hostel students in India.

Your role:
- Provide immediate safety guidance in emergencies
- Give self defense tips and awareness advice
- Offer mental health support and calm reassurance
- Explain legal rights of women in India
- Help with harassment situations
- Guide on SOS and Night Walk Buddy features

Rules:
- ALWAYS respond in English only
- Keep responses short and clear
- If user seems in danger, always say: Press the SOS button immediately
- Never judge the user
- Be calm and supportive`;

const FREE_MODELS = [
  "liquid/lfm-2.5-1.2b-instruct:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
];

const callOpenRouter = async (message, modelIndex = 0) => {
  if (modelIndex >= FREE_MODELS.length) {
    throw new Error("All models unavailable");
  }

  const model = FREE_MODELS[modelIndex];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "SafeCampus AI",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SAFETY_SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 300,
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.log("Model " + model + " failed, trying next...");
    return callOpenRouter(message, modelIndex + 1);
  }

  return data.choices?.[0]?.message?.content || "I am here to help. Please tell me more.";
};

router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    const reply = await callOpenRouter(message);
    res.json({ reply });
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({ message: "AI service error" });
  }
});

export default router;
