export const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
