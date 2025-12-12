import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit, DEFAULT_CONFIG, type RateLimitConfig } from "@/lib/rate-limiter"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { client_key, requested_tokens = 1, capacity, refill_rate } = body

    if (!client_key) {
      return NextResponse.json({ error: "client_key is required" }, { status: 400 })
    }

    // Allow custom config or use defaults
    const config: RateLimitConfig = {
      capacity: capacity ?? DEFAULT_CONFIG.capacity,
      refillRate: refill_rate ?? DEFAULT_CONFIG.refillRate,
    }

    const result = checkRateLimit(client_key, requested_tokens, config)

    if (result.allowed) {
      return NextResponse.json({
        allowed: true,
        remaining_tokens: result.remainingTokens,
        limit: result.limit,
        reset_in_seconds: result.resetInSeconds,
      })
    } else {
      return NextResponse.json(
        {
          allowed: false,
          remaining_tokens: result.remainingTokens,
          limit: result.limit,
          retry_after_seconds: result.retryAfterSeconds,
        },
        { status: 429 },
      )
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
