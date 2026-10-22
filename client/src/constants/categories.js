// Values must match CATEGORY_VALUES in backend/feedbackSchema.js
export const CATEGORIES = [
  { value: "pothole", label: "Pothole", color: "#e8590c" },
  { value: "tree_down", label: "Tree down", color: "#2f9e44" },
  { value: "dead_animal", label: "Dead animal", color: "#5f3dc4" },
  { value: "injured_animal", label: "Injured animal", color: "#e03131" },
  { value: "other", label: "Other", color: "#1971c2" },
];

export const getCategory = (value) =>
  CATEGORIES.find((category) => category.value === value) ?? CATEGORIES.at(-1);
