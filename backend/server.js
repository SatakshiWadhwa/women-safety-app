import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import buddyRoutes from "./routes/buddyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://women-safety-app-sepia.vercel.app",
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });

app.get("/", (req, res) => res.send("SafeCampus Backend Running"));
app.use("/api/auth", authRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/buddy", buddyRoutes);
app.use("/api/notifications", notificationRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join", (userId) => { socket.join(userId); });
  socket.on("new_buddy_request", (data) => { socket.broadcast.emit("buddy_request_update", data); });
  socket.on("location_update", (data) => { socket.broadcast.emit("buddy_location", data); });
  socket.on("panic", (data) => { io.emit("buddy_panic", data); });
  socket.on("walk_completed", (data) => { socket.broadcast.emit("buddy_completed", data); });
  socket.on("disconnect", () => { console.log("User disconnected:", socket.id); });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
