"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Activity, CheckCircle, XCircle, Percent } from "lucide-react"

interface MetricsCardsProps {
  totalRequests: number
  totalAllowed: number
  totalBlocked: number
  successRate: number
}

export function MetricsCards({ totalRequests, totalAllowed, totalBlocked, successRate }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-blue/10">
              <Activity className="h-5 w-5 text-chart-blue" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-semibold text-foreground">{totalRequests.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Allowed</p>
              <p className="text-2xl font-semibold text-success">{totalAllowed.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blocked</p>
              <p className="text-2xl font-semibold text-destructive">{totalBlocked.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-yellow/10">
              <Percent className="h-5 w-5 text-chart-yellow" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-semibold text-foreground">{successRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
