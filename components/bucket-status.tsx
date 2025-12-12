"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Bucket {
  client_key: string
  tokens: number
  capacity: number
  refill_rate: number
}

interface BucketStatusProps {
  buckets: Bucket[]
}

export function BucketStatus({ buckets }: BucketStatusProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-foreground">Active Buckets</CardTitle>
      </CardHeader>
      <CardContent>
        {buckets.length === 0 ? (
          <p className="text-muted-foreground text-sm">No active buckets. Make a request to create one.</p>
        ) : (
          <div className="space-y-4">
            {buckets.map((bucket) => (
              <div key={bucket.client_key} className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-foreground">{bucket.client_key}</span>
                  <span className="text-sm text-muted-foreground">
                    {bucket.tokens.toFixed(1)} / {bucket.capacity}
                  </span>
                </div>
                <Progress value={(bucket.tokens / bucket.capacity) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Refill rate: {bucket.refill_rate.toFixed(2)} tokens/sec
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
