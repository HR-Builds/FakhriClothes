export function formatPKR(n: number) {
  return "PKR " + n.toLocaleString("en-PK");
}
export function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
export function isValidPKPhone(p: string) {
  return /^03\d{9}$/.test(p.replace(/[\s-]/g, ""));
}
export function normalizePhone(p: string) {
  return p.replace(/[\s-]/g, "");
}
export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
export function parseJson<T>(s: string, fallback: T): T {
  try { return JSON.parse(s) as T; } catch { return fallback; }
}