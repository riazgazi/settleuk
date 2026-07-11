// localStorage load/save helpers — extracted from App.js

export function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
export function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
