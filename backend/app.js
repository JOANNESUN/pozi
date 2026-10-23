import express from "express";
import cors from "cors";
import { feedbackSchema } from "./feedbackSchema.js";

const toFeature = ({ lat, lng, category, comment }, createdAt = new Date().toISOString()) => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [lng, lat] },
  properties: {
    id: crypto.randomUUID(),
    category,
    comment,
    created_at: createdAt,
  },
});

const toIsoDate = (value) => {
  const time = Date.parse(value);
  return Number.isNaN(time) ? undefined : new Date(time).toISOString();
};

// Each app gets its own in-memory store, so tests start empty
export const createApp = () => {
  const app = express();
  const feedback = [];

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.post("/api/feedback", (req, res) => {
    const result = feedbackSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: "Invalid feedback" });
    }

    const newFeedback = toFeature(result.data);

    feedback.push(newFeedback);
    res.status(201).json(newFeedback);
  });

  app.post("/api/feedback/import", (req, res) => {
    const { type, features } = req.body ?? {};

    if (type !== "FeatureCollection" || !Array.isArray(features)) {
      return res.status(400).json({ error: "Expected a GeoJSON FeatureCollection" });
    }

    const imported = [];
    let rejectedCount = 0;

    for (const feature of features) {
      const coordinates = feature?.geometry?.coordinates;
      const [lng, lat] = Array.isArray(coordinates) ? coordinates : [];
      const result = feedbackSchema.safeParse({
        lat,
        lng,
        category: feature?.properties?.category,
        comment: feature?.properties?.comment,
      });

      if (feature?.geometry?.type !== "Point" || !result.success) {
        rejectedCount += 1;
        continue;
      }

      imported.push(toFeature(result.data, toIsoDate(feature.properties.created_at)));
    }

    feedback.push(...imported);
    res.status(201).json({ imported, rejectedCount });
  });

  app.get("/api/feedback", (_req, res) => {
    res.json({
      type: "FeatureCollection",
      features: feedback,
    });
  });

  return app;
};
