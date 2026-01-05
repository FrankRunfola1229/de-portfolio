// assets/js/utils.js
"use strict";

// ---------- DOM helpers ----------
export function byId(id) {
  return document.getElementById(id);
}

export function setText(id, value) {
  const el = byId(id);
  if (el) el.textContent = value;
}

// ---------- Formatting ----------
export function formatUpdatedDate(date) {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

// ---------- Safety / escaping ----------
export function safeText(v) {
  return v == null ? "" : String(v);
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function escapeAttr(s) {
  return escapeHtml(safeText(s)).replaceAll("`", "&#096;");
}

export function safeHtml(v) {
  return escapeHtml(safeText(v));
}

export function safeAttr(v) {
  return escapeAttr(safeText(v));
}

export function getErrorMessage(err) {
  if (typeof err === "string") return err;
  return err?.message ? String(err.message) : String(err);
}
