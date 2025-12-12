"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Zap, RotateCcw } from "lucide-react"

interface ApiTesterProps {
  onRequest: () => void
}

export function ApiTester({ onRequest }: ApiTesterProps) {
  const [clientKey, setClientKey] = useState("user_123")
  const [requestedTokens, setRequestedTokens] = useState(1)
  const [response, setResponse] = useState<object | null>(null)
  const [loading, setLoading] = useState(false)
  const [burstCount, setBurstCount] = useState(10)

  const makeRequest = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_key: clientKey,
          requested_tokens: requestedTokens,
        }),
      })
      const data = await res.json()
      setResponse(data)
      onRequest()
    } catch (error) {
      setResponse({ error: "Request failed" })
    }
    setLoading(false)
  }

  const burstRequests = async () => {
    setLoading(true)
    const results: object[] = []
    for (let i = 0; i < burstCount; i++) {
      try {
        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_key: clientKey,
            requested_tokens: requestedTokens,
          }),
        })
        const data = await res.json()
        results.push(data)
      } catch {
        results.push({ error: "Failed" })
      }
    }
    const allowed = results.filter((r: object) => (r as { allowed?: boolean }).allowed).length
    const blocked = results.length - allowed
    setResponse({
      burst_results: {
        total: results.length,
        allowed,
        blocked,
        last_response: results[results.length - 1],
      },
    })
    onRequest()
    setLoading(false)
  }

  const resetBucket = async () => {
    try {
      await fetch("/api/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_key: clientKey }),
      })
      setResponse({ message: `Bucket for ${clientKey} reset` })
      onRequest()
    } catch {
      setResponse({ error: "Reset failed" })
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-foreground">API Tester</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client-key" className="text-muted-foreground">
              Client Key
            </Label>
            <Input
              id="client-key"
              value={clientKey}
              onChange={(e) => setClientKey(e.target.value)}
              placeholder="user_123"
              className="bg-muted border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tokens" className="text-muted-foreground">
              Tokens
            </Label>
            <Input
              id="tokens"
              type="number"
              value={requestedTokens}
              onChange={(e) => setRequestedTokens(Number(e.target.value))}
              min={1}
              className="bg-muted border-border text-foreground"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={makeRequest} disabled={loading} className="bg-chart-blue hover:bg-chart-blue/90 text-white">
            <Play className="h-4 w-4 mr-2" />
            Single Request
          </Button>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={burstCount}
              onChange={(e) => setBurstCount(Number(e.target.value))}
              min={1}
              max={200}
              className="w-20 bg-muted border-border text-foreground"
            />
            <Button onClick={burstRequests} disabled={loading} variant="secondary">
              <Zap className="h-4 w-4 mr-2" />
              Burst
            </Button>
          </div>
          <Button
            onClick={resetBucket}
            variant="outline"
            className="border-border text-foreground hover:bg-muted bg-transparent"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Bucket
          </Button>
        </div>

        {response && (
          <div className="mt-4 p-4 rounded-lg bg-muted border border-border">
            <p className="text-xs text-muted-foreground mb-2 font-mono">Response</p>
            <pre className="text-sm text-foreground overflow-auto font-mono">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
