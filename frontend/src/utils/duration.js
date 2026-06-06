export const parseDuration = (duration) => {
  if (!duration) return 0;
  const parts = duration.split(':');
  if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  return 0;
};