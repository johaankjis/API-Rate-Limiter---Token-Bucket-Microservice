// Token Bucket Rate Limiter Implementation
// In-memory storage for demonstration (use Redis in production)

export interface BucketState {
  tokens: number
  lastRefillTs: number
  capacity: number
  refillRate: number
}

export interface RateLimitConfig {
  capacity: number // max tokens (e.g., 100)
  refillRate: number // tokens per second (e.g., 100/60 ≈ 1.66 for 100/min)
}

export interface CheckResult {
  allowed: boolean
  remainingTokens: number
  limit: number
  resetInSeconds?: number
  retryAfterSeconds?: number
}

export interface Metrics {
  totalRequests: number
  totalAllowed: number
  totalBlocked: number
}

export interface LogEntry {
  timestamp: string
  clientKey: string
  status: "ALLOWED" | "BLOCKED"
  remainingTokens: number
  requestedTokens: number
}

// Default configuration: 100 requests per minute
export const DEFAULT_CONFIG: RateLimitConfig = {
  capacity: 100,
  refillRate: 100 / 60, // ~1.66 tokens per second
}

// In-memory storage
const buckets = new Map<string, BucketState>()
let metrics: Metrics = {
  totalRequests: 0,
  totalAllowed: 0,
  totalBlocked: 0,
}
const logs: LogEntry[] = []
const MAX_LOGS = 100

export function getBucket(clientKey: string, config: RateLimitConfig = DEFAULT_CONFIG): BucketState {
  const existing = buckets.get(clientKey)
  if (existing) {
    return existing
  }

  // Initialize new bucket
  const newBucket: BucketState = {
    tokens: config.capacity,
    lastRefillTs: Date.now() / 1000,
    capacity: config.capacity,
    refillRate: config.refillRate,
  }
  buckets.set(clientKey, newBucket)
  return newBucket
}

export function refillTokens(bucket: BucketState): void {
  const now = Date.now() / 1000
  const elapsed = now - bucket.lastRefillTs
  const tokensToAdd = elapsed * bucket.refillRate
  bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd)
  bucket.lastRefillTs = now
}

export function checkRateLimit(
  clientKey: string,
  requestedTokens = 1,
  config: RateLimitConfig = DEFAULT_CONFIG,
): CheckResult {
  const bucket = getBucket(clientKey, config)

  // Refill tokens based on elapsed time
  refillTokens(bucket)

  metrics.totalRequests++

  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    clientKey,
    status: "ALLOWED",
    remainingTokens: bucket.tokens,
    requestedTokens,
  }

  if (bucket.tokens >= requestedTokens) {
    // Allow request
    bucket.tokens -= requestedTokens
    metrics.totalAllowed++
    logEntry.status = "ALLOWED"
    logEntry.remainingTokens = bucket.tokens

    addLog(logEntry)

    return {
      allowed: true,
      remainingTokens: Math.floor(bucket.tokens),
      limit: bucket.capacity,
      resetInSeconds: Math.round(((bucket.capacity - bucket.tokens) / bucket.refillRate) * 10) / 10,
    }
  } else {
    // Block request
    metrics.totalBlocked++
    logEntry.status = "BLOCKED"
    logEntry.remainingTokens = bucket.tokens

    addLog(logEntry)

    const tokensNeeded = requestedTokens - bucket.tokens
    const retryAfter = tokensNeeded / bucket.refillRate

    return {
      allowed: false,
      remainingTokens: Math.floor(bucket.tokens),
      limit: bucket.capacity,
      retryAfterSeconds: Math.round(retryAfter * 10) / 10,
    }
  }
}

export function getStatus(clientKey: string, config: RateLimitConfig = DEFAULT_CONFIG): BucketState | null {
  const bucket = buckets.get(clientKey)
  if (!bucket) {
    return null
  }
  // Refill before returning status
  refillTokens(bucket)
  return { ...bucket }
}

export function getMetrics(): Metrics {
  return { ...metrics }
}

export function getLogs(): LogEntry[] {
  return [...logs].reverse()
}

function addLog(entry: LogEntry): void {
  logs.push(entry)
  if (logs.length > MAX_LOGS) {
    logs.shift()
  }
}

export function resetMetrics(): void {
  metrics = {
    totalRequests: 0,
    totalAllowed: 0,
    totalBlocked: 0,
  }
}

export function resetBucket(clientKey: string): void {
  buckets.delete(clientKey)
}

export function getAllBuckets(): Map<string, BucketState> {
  // Refill all buckets before returning
  buckets.forEach((bucket) => refillTokens(bucket))
  return new Map(buckets)
}
