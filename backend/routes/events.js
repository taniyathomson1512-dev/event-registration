import { Router } from "express";
import mongoose from "mongoose";
import Event from "../models/Event.js";

const router = Router();

const validate = (body) => {
  if (!body.name?.trim() || !body.description?.trim() || !body.date || !body.venue?.trim()) {
    return "Complete all required event fields.";
  }
  if (Number.isNaN(new Date(body.date).getTime())) return "Enter a valid date.";
  const count = Number(body.totalRegistrations ?? 0);
  if (!Number.isInteger(count) || count < 0) return "Registration count must be a non-negative whole number.";
  return null;
};

router.get("/", async (req, res) => {
  try {
    res.json(await Event.find().sort({ date: 1, createdAt: -1 }));
  } catch {
    res.status(500).json({ message: "Events could not be loaded." });
  }
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid event ID." });
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch {
    res.status(500).json({ message: "Event could not be loaded." });
  }
});

router.post("/", async (req, res) => {
  const problem = validate(req.body);
  if (problem) return res.status(400).json({ message: problem });
  try {
    const event = await Event.create({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      venue: req.body.venue,
      totalRegistrations: Number(req.body.totalRegistrations ?? 0)
    });
    res.status(201).json(event);
  } catch {
    res.status(500).json({ message: "Event could not be created." });
  }
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid event ID." });
  const problem = validate(req.body);
  if (problem) return res.status(400).json({ message: problem });
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      venue: req.body.venue,
      totalRegistrations: Number(req.body.totalRegistrations ?? 0)
    }, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json(event);
  } catch {
    res.status(500).json({ message: "Event could not be updated." });
  }
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid event ID." });
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json({ message: "Event removed." });
  } catch {
    res.status(500).json({ message: "Event could not be deleted." });
  }
});

export default router;
