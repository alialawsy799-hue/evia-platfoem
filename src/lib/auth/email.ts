export function normalizeEmail(email: string) {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at <= 0) return trimmed;

  let local = trimmed.slice(0, at);
  let domain = trimmed.slice(at + 1);
  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") {
    local = local.split("+")[0].replace(/\./g, "");
  }
  return `${local}@${domain}`;
}

export function emailsMatch(left: string, right: string) {
  return normalizeEmail(left) === normalizeEmail(right);
}

export function findByEmail<T extends { email: string }>(
  items: T[] | undefined,
  email: string,
) {
  const normalized = normalizeEmail(email);
  if (!normalized) return undefined;
  return (items ?? []).find((item) => normalizeEmail(item.email) === normalized);
}
