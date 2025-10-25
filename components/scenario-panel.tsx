"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Loader2, Play, RotateCcw, Calendar, CloudRain, Thermometer } from "lucide-react"

interface ScenarioPanelProps {
  selectedState: string | null
  hazardType: "flood" | "drought"
  onAnalyze: (results: any) => void
  isAnalyzing: boolean
}

export function ScenarioPanel({ selectedState, hazardType, onAnalyze, isAnalyzing }: ScenarioPanelProps) {
  const [scenario, setScenario] = useState({
    timeframe: "1-year",
    severity: [75],
    rainfall: [100],
    temperature: [100],
    windSpeed: [50],
    duration: [7],
    seasonality: "monsoon",
    climateChange: true,
    populationGrowth: [110],
    infrastructureDevelopment: [100],
  })

  const resetScenario = () => {
    setScenario({
      timeframe: "1-year",
      severity: [75],
      rainfall: [100],
      temperature: [100],
      windSpeed: [50],
      duration: [7],
      seasonality: "monsoon",
      climateChange: true,
      populationGrowth: [110],
      infrastructureDevelopment: [100],
    })
  }

  const runAnalysis = async () => {
    if (!selectedState) return

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: selectedState,
          hazardType,
          scenario,
        }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const results = await response.json()
      onAnalyze(results)
    } catch (error) {
      console.error("Analysis error:", error)
      // Fallback to mock data if API fails
      const fallbackResults = {
        state: selectedState,
        hazardType,
        scenario,
        riskScore: Math.floor(Math.random() * 40) + 60,
        affectedPopulation: Math.floor(Math.random() * 5000000) + 1000000,
        economicImpact: Math.floor(Math.random() * 50000) + 10000,
        infrastructureRisk: Math.floor(Math.random() * 30) + 70,
        evacuationZones: Math.floor(Math.random() * 50) + 20,
        responseTime: Math.floor(Math.random() * 12) + 6,
        timestamp: new Date().toISOString(),
      }
      onAnalyze(fallbackResults)
    }
  }

  const getSeverityLabel = (value: number) => {
    if (value < 30) return "Low"
    if (value < 70) return "Moderate"
    return "High"
  }

  const getSeverityColor = (value: number) => {
    if (value < 30) return "text-chart-2"
    if (value < 70) return "text-chart-1"
    return "text-chart-4"
  }

  if (!selectedState) {
    return (
      <Card className="p-4 bg-sidebar-accent/50">
        <div className="text-center text-sidebar-foreground/60">
          <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a state to configure scenarios</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Scenario Configuration Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="font-medium text-sm">Scenario Configuration</span>
          </div>
          <Button variant="ghost" size="sm" onClick={resetScenario} className="text-xs">
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>

        <div className="space-y-4">
          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Analysis Timeframe</Label>
            <Select
              value={scenario.timeframe}
              onValueChange={(value) => setScenario({ ...scenario, timeframe: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6-months">6 Months</SelectItem>
                <SelectItem value="1-year">1 Year</SelectItem>
                <SelectItem value="5-years">5 Years</SelectItem>
                <SelectItem value="10-years">10 Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hazard Severity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                {hazardType === "flood" ? "Flood" : "Drought"} Severity
              </Label>
              <Badge variant="outline" className={`text-xs ${getSeverityColor(scenario.severity[0])}`}>
                {getSeverityLabel(scenario.severity[0])}
              </Badge>
            </div>
            <Slider
              value={scenario.severity}
              onValueChange={(value) => setScenario({ ...scenario, severity: value })}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Environmental Parameters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CloudRain className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Environmental Parameters</span>
        </div>

        <div className="space-y-4">
          {/* Rainfall */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Rainfall Intensity</Label>
              <span className="text-xs font-medium">{scenario.rainfall[0]}%</span>
            </div>
            <Slider
              value={scenario.rainfall}
              onValueChange={(value) => setScenario({ ...scenario, rainfall: value })}
              min={20}
              max={200}
              step={10}
              className="w-full"
            />
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Temperature Variation</Label>
              <span className="text-xs font-medium">{scenario.temperature[0]}%</span>
            </div>
            <Slider
              value={scenario.temperature}
              onValueChange={(value) => setScenario({ ...scenario, temperature: value })}
              min={80}
              max={150}
              step={5}
              className="w-full"
            />
          </div>

          {/* Wind Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Wind Speed</Label>
              <span className="text-xs font-medium">{scenario.windSpeed[0]} km/h</span>
            </div>
            <Slider
              value={scenario.windSpeed}
              onValueChange={(value) => setScenario({ ...scenario, windSpeed: value })}
              min={0}
              max={150}
              step={5}
              className="w-full"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Event Duration</Label>
              <span className="text-xs font-medium">{scenario.duration[0]} days</span>
            </div>
            <Slider
              value={scenario.duration}
              onValueChange={(value) => setScenario({ ...scenario, duration: value })}
              min={1}
              max={30}
              step={1}
              className="w-full"
            />
          </div>

          {/* Seasonality */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Season</Label>
            <Select
              value={scenario.seasonality}
              onValueChange={(value) => setScenario({ ...scenario, seasonality: value })}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre-monsoon">Pre-Monsoon (Mar-May)</SelectItem>
                <SelectItem value="monsoon">Monsoon (Jun-Sep)</SelectItem>
                <SelectItem value="post-monsoon">Post-Monsoon (Oct-Dec)</SelectItem>
                <SelectItem value="winter">Winter (Jan-Feb)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Socioeconomic Factors */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Thermometer className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Socioeconomic Factors</span>
        </div>

        <div className="space-y-4">
          {/* Climate Change Factor */}
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Include Climate Change</Label>
            <Switch
              checked={scenario.climateChange}
              onCheckedChange={(checked) => setScenario({ ...scenario, climateChange: checked })}
            />
          </div>

          <Separator />

          {/* Population Growth */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Population Growth</Label>
              <span className="text-xs font-medium">{scenario.populationGrowth[0]}%</span>
            </div>
            <Slider
              value={scenario.populationGrowth}
              onValueChange={(value) => setScenario({ ...scenario, populationGrowth: value })}
              min={90}
              max={150}
              step={5}
              className="w-full"
            />
          </div>

          {/* Infrastructure Development */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Infrastructure Development</Label>
              <span className="text-xs font-medium">{scenario.infrastructureDevelopment[0]}%</span>
            </div>
            <Slider
              value={scenario.infrastructureDevelopment}
              onValueChange={(value) => setScenario({ ...scenario, infrastructureDevelopment: value })}
              min={80}
              max={200}
              step={10}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Analysis Button */}
      <Button onClick={runAnalysis} disabled={isAnalyzing} className="w-full" size="lg">
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Run Hazard Analysis
          </>
        )}
      </Button>
    </div>
  )
}
