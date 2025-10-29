import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import orgRoutes from "./routes/orgs.js"; // <-- our new org profile routes

dotenv.config();

console.log(">>> STARTING backend/src/index.js");

const app = express();

// Allow frontend to talk to backend in dev
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Health check route (optional but useful)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Org profile routes
// POST   /api/orgs        -> create org profile
// PATCH  /api/orgs/:id    -> update org profile
// GET    /api/orgs/:id    -> fetch org profile
app.use("/api/orgs", orgRoutes);
console.log(">>> Mounted /api/orgs routes");
// Default 404 for anything unknown
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});
