import 'server-only'

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export interface RateLimitOptions {
  windowMs: number
  max: number
}

export interface RateLimitResult {
  success: boolean
  retryAfterSeconds: number
  remaining: number
}

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs })
    return { success: true, retryAfterSeconds: 0, remaining: opts.max - 1 }
  }

  if (bucket.count >= opts.max) {
    return {
      success: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
      remaining: 0,
    }
  }

  bucket.count += 1
  return {
    success: true,
    retryAfterSeconds: 0,
    remaining: opts.max - bucket.count,
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}
