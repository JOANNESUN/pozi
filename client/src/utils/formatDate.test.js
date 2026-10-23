import { describe, expect, test } from "@jest/globals";
import { formatDate } from "./formatDate.js";

describe("formatDate", () => {
  test("shows day and short month, Australian style", () => {
    const middayLocalTime = new Date(2026, 9, 23, 12).toISOString();

    expect(formatDate(middayLocalTime)).toBe("23 Oct");
  });
});
