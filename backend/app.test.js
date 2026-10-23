import { beforeEach, describe, expect, test } from "@jest/globals";
import request from "supertest";
import { createApp } from "./app.js";

const validFeedback = {
  category: "pothole",
  comment: "Deep hole near the tram stop",
  lat: -37.8136,
  lng: 144.9631,
};

const point = (lng, lat, properties) => ({
  type: "Feature",
  geometry: { type: "Point", coordinates: [lng, lat] },
  properties,
});

let app;

beforeEach(() => {
  app = createApp();
});

describe("GET /api/feedback", () => {
  test("returns an empty FeatureCollection to start with", async () => {
    const response = await request(app).get("/api/feedback");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ type: "FeatureCollection", features: [] });
  });
});

describe("POST /api/feedback", () => {
  test("saves valid feedback as a GeoJSON Feature with [lng, lat]", async () => {
    const response = await request(app).post("/api/feedback").send(validFeedback);

    expect(response.status).toBe(201);
    expect(response.body.geometry).toEqual({ type: "Point", coordinates: [144.9631, -37.8136] });
    expect(response.body.properties).toMatchObject({
      category: "pothole",
      comment: "Deep hole near the tram stop",
    });
    expect(response.body.properties.id).toEqual(expect.any(String));
  });

  test("makes saved feedback available from GET", async () => {
    await request(app).post("/api/feedback").send(validFeedback);
    const response = await request(app).get("/api/feedback");

    expect(response.body.features).toHaveLength(1);
  });

  test.each([
    ["an unknown category", { ...validFeedback, category: "graffiti" }],
    ["a blank comment", { ...validFeedback, comment: "   " }],
    ["a latitude off the globe", { ...validFeedback, lat: 120 }],
    ["a missing longitude", { ...validFeedback, lng: undefined }],
  ])("rejects %s with 400", async (_label, body) => {
    const response = await request(app).post("/api/feedback").send(body);

    expect(response.status).toBe(400);
  });
});

describe("POST /api/feedback/import", () => {
  test("imports valid points, skips invalid ones and keeps original dates", async () => {
    const response = await request(app)
      .post("/api/feedback/import")
      .send({
        type: "FeatureCollection",
        features: [
          point(144.9631, -37.8136, {
            category: "pothole",
            comment: "Flinders Street",
            created_at: "2026-09-14T08:30:00Z",
          }),
          point(144.97, -37.81, { category: "graffiti", comment: "Unknown category" }),
          { type: "Feature", geometry: { type: "Point", coordinates: 5 }, properties: {} },
          {
            type: "Feature",
            geometry: { type: "LineString", coordinates: [[144, -37], [145, -38]] },
            properties: { category: "other", comment: "Not a point" },
          },
          null,
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.imported).toHaveLength(1);
    expect(response.body.rejectedCount).toBe(4);
    expect(response.body.imported[0].properties.created_at).toBe("2026-09-14T08:30:00.000Z");
  });

  test("adds imported feedback to the list", async () => {
    await request(app)
      .post("/api/feedback/import")
      .send({
        type: "FeatureCollection",
        features: [point(144.9631, -37.8136, { category: "other", comment: "Bench" })],
      });
    const response = await request(app).get("/api/feedback");

    expect(response.body.features).toHaveLength(1);
  });

  test("rejects a body that isn't a FeatureCollection with 400", async () => {
    const response = await request(app).post("/api/feedback/import").send({ hello: "world" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Expected a GeoJSON FeatureCollection");
  });
});
