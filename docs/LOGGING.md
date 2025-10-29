# Logging and Error Handling

This project uses a lightweight, structured logger (no external deps) to standardize logs and responses.

## Goals

- Consistent, structured JSON logs
- Request correlation via `requestId`
- Redaction of secrets and PII in logs
- Standard API error payloads with machine-readable `code`

## Logger

- Source: `src/lib/logger.ts`
- Methods: `logger.debug|info|warn|error(message, context, error?)`
- Context keys: `requestId`, `route`, `method`, `ip`, `userId`, plus any custom fields
- Redaction: common secret keys and email addresses are masked

## Request context

- Source: `src/lib/request-context.ts`
- `getRequestId(req)`: uses header `x-request-id` if present, else generates UUID
- `getIp(req)`: uses `x-forwarded-for` first value or `x-real-ip`

## API responses

- Source: `src/lib/api-error.ts`
- `respondOk(req, data, { status?, headers? })`: wraps data and adds `requestId` and header `X-Request-ID`
- `respondError(req, err, { status?, code? })`: standard error `{ error: { code, message }, requestId }`, logs at appropriate level
- `AppError(code, message, status)`: throw for known error flows to control status & code

## Usage pattern (example)

```ts
import { logger } from '@/lib/logger';
import { getRequestId } from '@/lib/request-context';
import { respondError } from '@/lib/api-error';

export async function GET(request: NextRequest) {
  try {
    // ...work
    const res = NextResponse.json(data);
    res.headers.set('X-Request-ID', getRequestId(request));
    return res;
  } catch (err) {
    logger.error('Error fetching things', { requestId: getRequestId(request) }, err);
    return respondError(request, err, { status: 500, code: 'things_fetch_failed' });
  }
}
```

## Stripe webhook policy

- In production, `STRIPE_WEBHOOK_SECRET` must be set; otherwise, we return 503 and log an error.
- In development, signature verification may be disabled for local testing; logs warn accordingly.

## Next steps (optional)

- Add Sentry or Datadog for error monitoring and alerting
- Emit `requestId` to client and propagate across frontend calls
- Add route-level `error.tsx` pages for critical flows (checkout, account)
