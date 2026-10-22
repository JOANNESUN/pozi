import express from "express";
import cors from "cors";
import { feedbackSchema } from "./feedbackSchema.js";

const app = express();
const PORT = 3000;

const feedback = [];

app.use(cors());
app.use(express.json());

app.post("/api/feedback", (req, res) => {
  const result = feedbackSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ error: "Invalid feedback" });
  }

  const { lat, lng, category, comment } = result.data;

  // GeoJSON Point coordinates are [lng, lat], the reverse of Leaflet's [lat, lng]
  const newFeedback = {
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: {
      id: crypto.randomUUID(),
      category,
      comment,
      created_at: new Date().toISOString(),
    },
  };

  feedback.push(newFeedback);
  res.status(201).json(newFeedback);
});

app.get("/api/feedback", (_req, res) => {
  res.json({
    type: "FeatureCollection",
    features: feedback,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
