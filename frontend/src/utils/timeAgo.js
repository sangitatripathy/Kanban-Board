export const timeAgo = (date) => {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);

  const diff = Math.floor((now - past) / 1000);
  const days = Math.floor(diff / 86400);
  const months = Math.floor(diff / (86400 * 30));
  const years = Math.floor(diff / (86400 * 365));

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;

  return "Recently";
};

export const priorityColor = {
  Low: "bg-green-100 border-green-400 text-green-500",
  Medium: "bg-yellow-100 border-yellow-400 text-yellow-500",
  High: "bg-red-100 border-red-400 text-red-500",
};
