// Vite-friendly API helper
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function postVerify(text, userId = null) {
  const payload = { text };
  if (userId) payload.user_id = userId;
  const res = await fetch(`${API_URL}/api/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Verify failed: ${res.status} ${txt}`);
  }
  return res.json();
}

export { postVerify, API_URL };
