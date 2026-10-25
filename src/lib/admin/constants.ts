export const ADMIN_COOKIE = "evia_admin";

export function adminEmail() {
  return (process.env.EVIA_ADMIN_EMAIL || "admin@evia.com").toLowerCase();
}

export function adminPassword() {
  return process.env.EVIA_ADMIN_PASSWORD || "EviaAdmin2026";
}
