/**
 * In-memory sliding window rate limiter.
 * Max 5 requests per IP per 60 seconds. No external dependencies.
 */

const store = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;

export function rateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = (store.get(ip) || []).filter((t) => t > windowStart);
  timestamps.push(now);
  store.set(ip, timestamps);

  if (timestamps.length > MAX_REQUESTS) {
    const oldest = timestamps[0];
    const retryAfter = Math.ceil((oldest + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true, retryAfter: 0 };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
