// Serverless API Proxy for Vercel (/api/discern)
// Keeps GEMINI_API_KEY hidden on the server and enforces basic fair-use rate limits.

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_IP = 25;
const ipHits = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing GEMINI_API_KEY environment variable." });
  }

  // Basic IP rate limiting for public-interest beta protection
  const clientIp =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  const now = Date.now();
  const record = ipHits.get(clientIp) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  record.count += 1;
  ipHits.set(clientIp, record);

  if (record.count > MAX_REQUESTS_PER_IP) {
    return res.status(429).json({
      error: "Public beta hourly limit reached. Please pause and return shortly."
    });
  }

  try {
    const { payload } = req.body || {};
    if (!payload || !Array.isArray(payload.contents)) {
      return res.status(400).json({ error: "Invalid request payload." });
    }

    const model = "gemini-2.5-flash";
    const upstreamUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const upstreamRes = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await upstreamRes.json();
    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal proxy error" });
  }
}
