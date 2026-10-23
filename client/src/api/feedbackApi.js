// All requests go through the Vite dev proxy (/api -> http://localhost:3000)
const FEEDBACK_URL = "/api/feedback";

const parseResponse = async (response) => {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.error ?? `Request failed with status ${response.status}`,
    );
  }

  return body;
};

export const fetchFeedback = async () => {
  const response = await fetch(FEEDBACK_URL);
  return parseResponse(response);
};

export const createFeedback = async (feedback) => {
  const response = await fetch(FEEDBACK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedback),
  });
  return parseResponse(response);
};

export const importFeedback = async (featureCollection) => {
  const response = await fetch(`${FEEDBACK_URL}/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(featureCollection),
  });
  return parseResponse(response);
};
