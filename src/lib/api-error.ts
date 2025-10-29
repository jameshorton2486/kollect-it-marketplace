import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from './logger';
import { getRequestId, getIp } from './request-context';

export class AppError extends Error {
  code: string;
  status: number;
  details?: unknown;
  constructor(code: string, message: string, status = 500, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function respondOk<T>(req: NextRequest | Request, data: T, init?: { status?: number; headers?: HeadersInit }) {
  const requestId = getRequestId(req);
  const res = NextResponse.json({ data, requestId }, { status: init?.status ?? 200, headers: init?.headers });
  res.headers.set('X-Request-ID', requestId);
  return res;
}

export function respondError(req: NextRequest | Request, err: unknown, init?: { code?: string; status?: number }) {
  const requestId = getRequestId(req);
  const ip = getIp(req);

  let status = init?.status ?? 500;
  let code = init?.code ?? 'internal_error';
  let message = 'An unexpected error occurred';

  if (err instanceof AppError) {
    status = err.status;
    code = err.code;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  const payload = { error: { code, message }, requestId };

  if (status >= 500) {
    logger.error('API error', { requestId, ip, status, code }, err);
  } else if (status >= 400) {
    logger.warn('API client error', { requestId, ip, status, code, message });
  }

  const res = NextResponse.json(payload, { status });
  res.headers.set('X-Request-ID', requestId);
  return res;
}
