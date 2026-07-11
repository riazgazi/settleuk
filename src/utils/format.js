// Formatting helpers (currency, month display) — extracted from App.js

export const fmtGBP = (v) => "£" + parseFloat(v || 0).toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
export const gbp2bdt = (v, rate) => "৳ " + Math.round((v || 0) * rate).toLocaleString("en-IN");
export const formatMonth = (mmyyyy) => {
  const parts = mmyyyy.split("/");
  if (parts.length !== 2) return mmyyyy;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[parseInt(parts[0]) - 1] + " " + parts[1];
};
