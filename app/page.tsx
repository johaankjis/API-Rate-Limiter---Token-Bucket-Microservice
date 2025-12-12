"use client"

import { useCallback } from "react"
import useSWR from "swr"
import { MetricsCards } from "@/components/metrics-cards"
import { ApiTester } from "@/components/api-tester"
import { LogsTable } from "@/components/logs-table"
import { BucketStatus } from "@/components/bucket-status"
import { ApiDocs } from "@/components/api-docs"
import { Shield } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface LogEntry {
  timestamp: string
  clientKey: string
  status: "ALLOWED" | "BLOCKED"
  remainingTokens: number
  requestedTokens: number
}

interface Bucket {
  client_key: string
  tokens: number
  capacity: number
  refill_rate: number
}

interface MetricsData {
  total_requests: number
  total_allowed: number
  total_blocked: number
  success_rate: number
  recent_logs: LogEntry[]
  active_buckets: Bucket[]
}

export default function Dashboard() {
  const { data, mutate } = useSWR<MetricsData>("/api/metrics", fetcher, {
    refreshInterval: 2000,
  })

  const handleRequest = useCallback(() => {
    mutate()
  }, [mutate])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-blue/10">
              <Shield className="h-6 w-6 text-chart-blue" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Rate Limiter API</h1>
              <p className="text-sm text-muted-foreground">Token Bucket Algorithm - 100 requests/minute</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <MetricsCards
            totalRequests={data?.total_requests ?? 0}
            totalAllowed={data?.total_allowed ?? 0}
            totalBlocked={data?.total_blocked ?? 0}
            successRate={data?.success_rate ?? 100}
          />

          <div className="grid lg:grid-cols-2 gap-6">
            <ApiTester onRequest={handleRequest} />
            <BucketStatus buckets={data?.active_buckets ?? []} />
          </div>

          <LogsTable logs={data?.recent_logs ?? []} />

          <ApiDocs />
        </div>
      </main>
    </div>
  )
}
