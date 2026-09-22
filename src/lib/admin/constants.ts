export const ADMIN_COOKIE = "evia_admin";

export function adminEmail() {
  return (process.env.EVIA_ADMIN_EMAIL || (process.env.NODE_ENV === "production" ? "" : "admin@evia.com")).toLowerCase();
}

export function adminPassword() {
  const configured = process.env.EVIA_ADMIN_PASSWORD;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") return "";
  return "EviaAdmin2026";
}
