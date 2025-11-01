import type { NextRequest } from "next/server";

export function getRequestId(req: NextRequest | Request): string {
  const headers = (req as Request).headers;
  const fromHeader = headers.get("x-request-id") || headers.get("X-Request-ID");
  return (
    fromHeader ||
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
  );
}

export function getIp(req: NextRequest | Request): string | undefined {
  const headers = (req as Request).headers;
  const xfwd = headers.get("x-forwarded-for") || "";
  const realIp = headers.get("x-real-ip") || "";
  return (xfwd.split(",")[0]?.trim() || realIp || undefined) as
    | string
    | undefined;
}

export function getRoute(req: NextRequest): string {
  try {
    return req.nextUrl?.pathname || "";
  } catch {
    return "";
  }
}

export function getMethod(req: NextRequest | Request): string | undefined {
  return (req as Request).method;
}

export function buildRequestContext(req: NextRequest | Request) {
  return {
    requestId: getRequestId(req),
    ip: getIp(req),
    // method/route only when NextRequest is available
  } as { requestId: string; ip?: string };
}
