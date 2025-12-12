import { type NextRequest, NextResponse } from "next/server"
import { getStatus, DEFAULT_CONFIG } from "@/lib/rate-limiter"

export async function GET(request: NextRequest, { params }: { params: Promise<{ clientKey: string }> }) {
  const { clientKey } = await params
  const bucket = getStatus(clientKey)

  if (!bucket) {
    return NextResponse.json({
      client_key: clientKey,
      tokens: DEFAULT_CONFIG.capacity,
      capacity: DEFAULT_CONFIG.capacity,
      refill_rate: DEFAULT_CONFIG.refillRate,
      last_refill_ts: Date.now() / 1000,
      message: "No bucket exists for this key yet. Will be created on first request.",
    })
  }

  return NextResponse.json({
    client_key: clientKey,
    tokens: Math.round(bucket.tokens * 100) / 100,
    capacity: bucket.capacity,
    refill_rate: Math.round(bucket.refillRate * 100) / 100,
    last_refill_ts: bucket.lastRefillTs,
  })
}
