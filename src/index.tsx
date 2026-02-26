import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/api/*", cors());

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const STATEMENT_BASE =
  "https://na.chargepoint.com/backend.php/report/getMonthlyStatementDetails";
const RECEIPT_BASE = "https://account.chargepoint.com/account/v1/receipt";

function buildCookie(token: string): string {
  return `auth-session=${token}`;
}

function validateToken(token: unknown): token is string {
  if (typeof token !== "string") return false;
  if (token.length < 50 || token.length > 4000) return false;
  // JWT format: header.payload.signature
  const parts = token.split(".");
  return parts.length === 3;
}

async function proxyFetch(
  url: string,
  token: string
): Promise<Response> {
  const resp = await fetch(url, {
    headers: {
      Cookie: buildCookie(token),
      Accept: "application/json",
      "User-Agent": UA,
    },
  });
  const data = await resp.text();
  return new Response(data, {
    status: resp.status,
    headers: { "Content-Type": "application/json" },
  });
}

// Fetch a monthly statement
app.post("/api/statement", async (c) => {
  const body = await c.req.json<{
    token: string;
    month: number;
    year: number;
  }>();

  if (!validateToken(body.token)) {
    return c.json({ error: "Invalid token format" }, 400);
  }
  if (!body.month || !body.year) {
    return c.json({ error: "month and year required" }, 400);
  }

  const url = `${STATEMENT_BASE}/${body.month}/${body.year}`;
  return proxyFetch(url, body.token);
});

// Fetch a detailed receipt
app.post("/api/receipt", async (c) => {
  const body = await c.req.json<{ token: string; sessionId: string }>();

  if (!validateToken(body.token)) {
    return c.json({ error: "Invalid token format" }, 400);
  }
  if (!body.sessionId) {
    return c.json({ error: "sessionId required" }, 400);
  }

  const url = `${RECEIPT_BASE}/${body.sessionId}`;
  return proxyFetch(url, body.token);
});

// Health check
app.get("/api/health", (c) => c.json({ ok: true }));

export default app;
