const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function verifyText(text) {
  const res = await fetch(`${API_URL}/api/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  return res.text();
}

export async function verifyURL(url) {
  const res = await fetch(`${API_URL}/api/verify-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  return res.text();
}
