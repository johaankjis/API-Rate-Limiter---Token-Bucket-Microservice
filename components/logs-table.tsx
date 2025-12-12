"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LogEntry {
  timestamp: string
  clientKey: string
  status: "ALLOWED" | "BLOCKED"
  remainingTokens: number
  requestedTokens: number
}

interface LogsTableProps {
  logs: LogEntry[]
}

export function LogsTable({ logs }: LogsTableProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-foreground">Recent Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No requests yet. Use the API Tester to make requests.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground font-mono w-20">{formatTime(log.timestamp)}</span>
                    <span className="text-sm text-foreground font-mono">{log.clientKey}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{log.remainingTokens.toFixed(0)} tokens</span>
                    <Badge
                      variant={log.status === "ALLOWED" ? "default" : "destructive"}
                      className={
                        log.status === "ALLOWED"
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-destructive/20 text-destructive border-destructive/30"
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
