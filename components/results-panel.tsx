"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Users,
  DollarSign,
  Building2,
  MapPin,
  Clock,
  TrendingUp,
  Download,
  Share,
  Loader2,
} from "lucide-react"

interface ResultsPanelProps {
  results: any
  isAnalyzing: boolean
  selectedState: string | null
}

export function ResultsPanel({ results, isAnalyzing, selectedState }: ResultsPanelProps) {
  if (isAnalyzing) {
    return (
      <Card className="p-6 bg-sidebar-accent/50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-accent" />
          <p className="text-sm font-medium mb-2">Analyzing Hazard Scenario</p>
          <p className="text-xs text-muted-foreground">Processing GIS data and environmental parameters...</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Topographical Analysis</span>
              <span className="text-accent">Complete</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Climate Modeling</span>
              <span className="text-accent">Processing...</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Risk Assessment</span>
              <span className="text-muted-foreground">Pending</span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (!results) {
    return (
      <Card className="p-4 bg-sidebar-accent/50">
        <div className="text-center text-sidebar-foreground/60">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Run analysis to view results</p>
        </div>
      </Card>
    )
  }

  const getRiskLevel = (score: number) => {
    if (score >= 85) return { level: "Critical", color: "text-chart-4", variant: "destructive" as const }
    if (score >= 70) return { level: "High", color: "text-chart-4", variant: "destructive" as const }
    if (score >= 50) return { level: "Medium", color: "text-chart-1", variant: "default" as const }
    return { level: "Low", color: "text-chart-2", variant: "secondary" as const }
  }

  const risk = getRiskLevel(results.riskScore)

  return (
    <div className="space-y-4">
      {/* Analysis Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <span className="font-medium text-sm">Risk Assessment</span>
          </div>
          <Badge variant={risk.variant} className="text-xs">
            {risk.level}
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Overall Risk Score</span>
              <span className={`text-lg font-bold ${risk.color}`}>{results.riskScore}/100</span>
            </div>
            <Progress value={results.riskScore} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Hazard Type</span>
              <div className="font-medium capitalize">{results.hazardType}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Analysis Date</span>
              <div className="font-medium">{new Date(results.timestamp).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Impact Metrics */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Impact Assessment</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-chart-4" />
              <span className="text-xs text-muted-foreground">Affected Population</span>
            </div>
            <span className="text-sm font-medium">{results.affectedPopulation.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-chart-1" />
              <span className="text-xs text-muted-foreground">Economic Impact</span>
            </div>
            <span className="text-sm font-medium">₹{results.economicImpact.toLocaleString()}Cr</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3 text-chart-3" />
              <span className="text-xs text-muted-foreground">Infrastructure Risk</span>
            </div>
            <span className="text-sm font-medium">{results.infrastructureRisk}%</span>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <MapPin className="h-3 w-3 text-chart-2" />
                <span className="text-xs text-muted-foreground">Evacuation Zones</span>
              </div>
              <span className="text-sm font-medium">{results.evacuationZones}</span>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-chart-5" />
                <span className="text-xs text-muted-foreground">Response Time</span>
              </div>
              <span className="text-sm font-medium">{results.responseTime}h</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Breakdown */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Risk Breakdown</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Environmental</span>
              <span className="font-medium">85%</span>
            </div>
            <Progress value={85} className="h-1.5" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Socioeconomic</span>
              <span className="font-medium">72%</span>
            </div>
            <Progress value={72} className="h-1.5" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Infrastructure</span>
              <span className="font-medium">{results.infrastructureRisk}%</span>
            </div>
            <Progress value={results.infrastructureRisk} className="h-1.5" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Preparedness</span>
              <span className="font-medium">58%</span>
            </div>
            <Progress value={58} className="h-1.5" />
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Recommendations</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-chart-4 mt-1.5 flex-shrink-0" />
            <span className="text-muted-foreground">
              Immediate evacuation planning for {results.evacuationZones} high-risk zones
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-chart-1 mt-1.5 flex-shrink-0" />
            <span className="text-muted-foreground">
              Strengthen infrastructure in vulnerable areas within {results.responseTime} hours
            </span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-1.5 flex-shrink-0" />
            <span className="text-muted-foreground">Deploy early warning systems for affected population</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-chart-3 mt-1.5 flex-shrink-0" />
            <span className="text-muted-foreground">
              Allocate ₹{Math.floor(results.economicImpact * 0.1).toLocaleString()}Cr for disaster preparedness
            </span>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <Download className="h-3 w-3 mr-1" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <Share className="h-3 w-3 mr-1" />
          Share
        </Button>
      </div>

      {/* Analysis Details */}
      <Card className="p-4">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Model Version</span>
            <span>IHAP-2024.1</span>
          </div>
          <div className="flex justify-between">
            <span>Confidence Level</span>
            <span>94.2%</span>
          </div>
          <div className="flex justify-between">
            <span>Data Sources</span>
            <span>IMD, ISRO, Census</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Time</span>
            <span>2.3s</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
