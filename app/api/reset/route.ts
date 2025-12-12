import { type NextRequest, NextResponse } from "next/server"
import { resetBucket, resetMetrics } from "@/lib/rate-limiter"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { client_key, reset_all } = body

    if (reset_all) {
      resetMetrics()
      return NextResponse.json({ message: "All metrics reset successfully" })
    }

    if (client_key) {
      resetBucket(client_key)
      return NextResponse.json({ message: `Bucket for ${client_key} reset successfully` })
    }

    return NextResponse.json({ error: "Provide client_key or reset_all" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
