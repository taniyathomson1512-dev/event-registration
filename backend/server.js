import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import eventRoutes from "./routes/events.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/events", eventRoutes);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(port, () => console.log(`Gatherwell API listening on ${port}`)))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
