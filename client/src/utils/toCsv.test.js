import { describe, expect, test } from "@jest/globals";
import Papa from "papaparse";
import { toCsv } from "./toCsv.js";

const feature = (properties, coordinates = [144.9631, -37.8136]) => ({
  type: "Feature",
  geometry: { type: "Point", coordinates },
  properties: {
    id: "abc-123",
    category: "pothole",
    comment: "Deep hole",
    created_at: "2026-10-23T09:00:00.000Z",
    ...properties,
  },
});

const parseRows = (csv) => Papa.parse(csv, { header: true }).data;

describe("toCsv", () => {
  test("writes a header row and one row per feature", () => {
    const csv = toCsv([feature(), feature({ id: "def-456" })]);
    const [header] = csv.split("\r\n");

    expect(header).toBe("id,category,comment,latitude,longitude,created_at");
    expect(parseRows(csv)).toHaveLength(2);
  });

  test("puts latitude before longitude, swapping GeoJSON's [lng, lat]", () => {
    const [row] = parseRows(toCsv([feature()]));

    expect(row.latitude).toBe("-37.8136");
    expect(row.longitude).toBe("144.9631");
  });

  test("uses the readable category label", () => {
    const [row] = parseRows(toCsv([feature({ category: "tree_down" })]));

    expect(row.category).toBe("Tree down");
  });

  test("keeps commas, quotes and line breaks inside one cell", () => {
    const comment = 'Big hole, near the "tram" stop\nsecond line';
    const [row] = parseRows(toCsv([feature({ comment })]));

    expect(row.comment).toBe(comment);
  });

  test("stops spreadsheet apps running comments as formulas", () => {
    const [row] = parseRows(toCsv([feature({ comment: "=HYPERLINK(\"http://bad.site\")" })]));

    expect(row.comment).toBe("'=HYPERLINK(\"http://bad.site\")");
  });
});
