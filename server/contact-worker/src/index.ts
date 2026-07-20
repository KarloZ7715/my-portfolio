export interface Env {
  RATE_LIMIT_KV: KVNamespace;
  BREVO_API_KEY: string;
  BREVO_SENDER_EMAIL: string;
}

const RECIPIENT = "carlos152924@gmail.com";
const ALLOWED_ORIGINS = new Set([
  "https://karloz.dev",
  "https://www.karloz.dev",
  "http://localhost:5173",
]);

const MAX_FIELD_LENGTH = 2000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  body?: unknown;
  company?: unknown; // honeypot
}

function corsHeaders(origin: string | null): HeadersInit {
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(data: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "method_not_allowed" }, 405, origin);
    }

    if (!origin || !ALLOWED_ORIGINS.has(origin)) {
      return json({ ok: false, error: "forbidden_origin" }, 403, origin);
    }

    let payload: ContactPayload;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400, origin);
    }

    // Honeypot: bots fill hidden fields. Pretend success without sending anything.
    if (typeof payload.company === "string" && payload.company.trim().length > 0) {
      return json({ ok: true }, 200, origin);
    }

    const { name, email, subject, body } = payload;
    if (
      !isNonEmptyString(name, 200) ||
      !isNonEmptyString(email, 200) ||
      !isNonEmptyString(subject, 200) ||
      !isNonEmptyString(body, MAX_FIELD_LENGTH) ||
      !EMAIL_RE.test((email as string).trim())
    ) {
      return json({ ok: false, error: "invalid_fields" }, 400, origin);
    }

    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const rateLimitKey = `contact:${ip}`;
    const currentCountRaw = await env.RATE_LIMIT_KV.get(rateLimitKey);
    const currentCount = currentCountRaw ? parseInt(currentCountRaw, 10) : 0;

    if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
      return json({ ok: false, error: "rate_limited" }, 429, origin);
    }

    await env.RATE_LIMIT_KV.put(rateLimitKey, String(currentCount + 1), {
      expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
    });

    const safeName = escapeHtml((name as string).trim());
    const safeEmail = (email as string).trim();
    const safeSubject = escapeHtml((subject as string).trim());
    const safeBody = escapeHtml((body as string).trim()).replace(/\n/g, "<br>");

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: env.BREVO_SENDER_EMAIL, name: "Portfolio Contact" },
        to: [{ email: RECIPIENT }],
        replyTo: { email: safeEmail, name: safeName },
        subject: `[Portfolio] ${safeSubject}`,
        htmlContent: `<p><strong>${safeName}</strong> &lt;${safeEmail}&gt;</p><p>${safeBody}</p>`,
      }),
    });

    if (!brevoResponse.ok) {
      return json({ ok: false, error: "email_provider_error" }, 502, origin);
    }

    return json({ ok: true }, 200, origin);
  },
};
