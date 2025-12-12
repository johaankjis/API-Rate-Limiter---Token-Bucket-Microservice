import { NextResponse } from "next/server"
import { getMetrics, getLogs, getAllBuckets } from "@/lib/rate-limiter"

export async function GET() {
  const metrics = getMetrics()
  const logs = getLogs()
  const buckets = getAllBuckets()

  // Convert buckets map to array for JSON
  const bucketsArray = Array.from(buckets.entries()).map(([key, bucket]) => ({
    client_key: key,
    tokens: Math.round(bucket.tokens * 100) / 100,
    capacity: bucket.capacity,
    refill_rate: Math.round(bucket.refillRate * 100) / 100,
  }))

  return NextResponse.json({
    total_requests: metrics.totalRequests,
    total_allowed: metrics.totalAllowed,
    total_blocked: metrics.totalBlocked,
    success_rate: metrics.totalRequests > 0 ? Math.round((metrics.totalAllowed / metrics.totalRequests) * 100) : 100,
    recent_logs: logs.slice(0, 20),
    active_buckets: bucketsArray,
  })
}
