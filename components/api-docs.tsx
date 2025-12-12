"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ApiDocs() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-foreground">API Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="check" className="w-full">
          <TabsList className="bg-muted border-border w-full justify-start">
            <TabsTrigger value="check" className="data-[state=active]:bg-background">
              POST /check
            </TabsTrigger>
            <TabsTrigger value="status" className="data-[state=active]:bg-background">
              GET /status
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-background">
              GET /metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="check" className="mt-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-chart-blue text-white">POST</Badge>
                <code className="text-sm font-mono text-foreground">/api/check</code>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Check and consume tokens for rate limiting.</p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Request Body</p>
                  <pre className="p-3 rounded-lg bg-muted text-sm font-mono text-foreground overflow-auto">
                    {`{
  "client_key": "user_123",
  "requested_tokens": 1
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Response (Allowed)</p>
                  <pre className="p-3 rounded-lg bg-muted text-sm font-mono text-foreground overflow-auto">
                    {`{
  "allowed": true,
  "remaining_tokens": 73,
  "limit": 100,
  "reset_in_seconds": 12.3
}`}
                  </pre>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Response (Blocked - 429)</p>
                  <pre className="p-3 rounded-lg bg-muted text-sm font-mono text-foreground overflow-auto">
                    {`{
  "allowed": false,
  "remaining_tokens": 0,
  "limit": 100,
  "retry_after_seconds": 15.7
}`}
                  </pre>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="status" className="mt-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-success text-white">GET</Badge>
                <code className="text-sm font-mono text-foreground">/api/status/[clientKey]</code>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Get the current bucket status for a client.</p>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Response</p>
                <pre className="p-3 rounded-lg bg-muted text-sm font-mono text-foreground overflow-auto">
                  {`{
  "client_key": "user_123",
  "tokens": 73.5,
  "capacity": 100,
  "refill_rate": 1.66,
  "last_refill_ts": 1733950000.23
}`}
                </pre>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="mt-4 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-success text-white">GET</Badge>
                <code className="text-sm font-mono text-foreground">/api/metrics</code>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Get aggregated metrics and recent logs.</p>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Response</p>
                <pre className="p-3 rounded-lg bg-muted text-sm font-mono text-foreground overflow-auto">
                  {`{
  "total_requests": 12034,
  "total_allowed": 11000,
  "total_blocked": 1034,
  "success_rate": 91,
  "recent_logs": [...],
  "active_buckets": [...]
}`}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
