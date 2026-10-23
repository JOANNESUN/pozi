import Papa from "papaparse";
import { getCategory } from "../constants/categories.js";

export const toCsv = (features) =>
  Papa.unparse(
    features.map(({ geometry, properties }) => ({
      id: properties.id,
      category: getCategory(properties.category).label,
      comment: properties.comment,
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
      created_at: properties.created_at,
    })),
    { escapeFormulae: true, newline: "\r\n" },
  );

