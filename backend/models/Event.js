import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true, trim: true },
  totalRegistrations: { type: Number, min: 0, default: 0 }
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
