/* Lightweight structured logger with redaction and request context support. */
export type LogLevel = "debug" | "info" | "warn" | "error";

const REDACT_KEYS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "password",
  "token",
  "secret",
  "apiKey",
  "apikey",
  "accessToken",
  "refreshToken",
  "session",
  "stripeSignature",
]);

function isObject(val: unknown): val is Record<string, unknown> {
  return !!val && typeof val === "object" && !Array.isArray(val);
}

function redactValue(value: unknown): unknown {
  if (typeof value === "string") {
    // redact emails
    const emailRegex = /([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g;
    return value.replace(
      emailRegex,
      (_m, user, domain) => `${String(user).slice(0, 1)}***@${domain}`,
    );
  }
  return value;
}

export function redact(input: unknown): unknown {
  if (Array.isArray(input)) return input.map(redact);
  if (!isObject(input)) return redactValue(input);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (REDACT_KEYS.has(k.toLowerCase())) {
      out[k] = "[REDACTED]";
    } else if (isObject(v) || Array.isArray(v)) {
      out[k] = redact(v);
    } else {
      out[k] = redactValue(v);
    }
  }
  return out;
}

export interface LogContext {
  requestId?: string;
  route?: string;
  method?: string;
  ip?: string;
  userId?: string | null;
  [key: string]: unknown;
}

function write(
  level: LogLevel,
  message: string,
  ctx?: LogContext,
  err?: unknown,
) {
  const entry: Record<string, unknown> = {
    level,
    msg: message,
    time: new Date().toISOString(),
    ...ctx,
  };
  if (err) {
    const e = err as
      | { message?: string; name?: string; stack?: string }
      | undefined;
    entry.error = redact({
      message: e?.message,
      name: e?.name,
      stack: process.env.NODE_ENV === "development" ? e?.stack : undefined,
    });
  }
  const line = JSON.stringify(redact(entry));
  // Use console methods for level-appropriate sinks
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else if (level === "info") console.info(line);
  else console.debug(line);
}

export const logger = {
  debug: (message: string, ctx?: LogContext) => write("debug", message, ctx),
  info: (message: string, ctx?: LogContext) => write("info", message, ctx),
  warn: (message: string, ctx?: LogContext) => write("warn", message, ctx),
  error: (message: string, ctx?: LogContext, err?: unknown) =>
    write("error", message, ctx, err),
};
