"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Users, MapPin, Calendar, Shield, TrendingUp, Droplets, Cloud, Thermometer } from "lucide-react"

interface StateAnalysisPanelProps {
  stateData: any
  selectedState: string
  hazardType: "flood" | "drought"
}

export function StateAnalysisPanel({ stateData, selectedState, hazardType }: StateAnalysisPanelProps) {
  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { level: "Low", color: "bg-green-500", variant: "secondary" as const }
    if (risk < 60) return { level: "Medium", color: "bg-yellow-500", variant: "default" as const }
    return { level: "High", color: "bg-red-500", variant: "destructive" as const }
  }

  const currentRisk = hazardType === "flood" ? stateData.floodRisk : stateData.droughtRisk
  const riskInfo = getRiskLevel(currentRisk)

  const vulnerabilityFactors = [
    { name: "Population Density", value: Math.min((stateData.population / 1000000) * 10, 100), impact: "High" },
    { name: "Infrastructure Age", value: Math.floor(Math.random() * 40) + 40, impact: "Medium" },
    { name: "Economic Dependency", value: Math.floor(Math.random() * 30) + 50, impact: "High" },
    { name: "Geographic Exposure", value: Math.floor(Math.random() * 50) + 30, impact: "Medium" },
    { name: "Climate Variability", value: Math.floor(Math.random() * 60) + 20, impact: "High" },
  ]

  const mitigationStrategies =
    hazardType === "flood"
      ? [
          "Construct flood barriers and levees",
          "Improve drainage and sewerage systems",
          "Implement early warning systems",
          "Develop flood-resistant infrastructure",
          "Create emergency evacuation routes",
          "Establish flood insurance programs",
        ]
      : [
          "Implement water conservation measures",
          "Promote drought-resistant crop varieties",
          "Develop groundwater management systems",
          "Build water storage infrastructure",
          "Create drought monitoring networks",
          "Establish agricultural support programs",
        ]

  return (
    <div className="space-y-6">
      {/* Risk Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent" />
            Detailed Risk Assessment - {selectedState}
          </CardTitle>
          <CardDescription>Comprehensive analysis of {hazardType} risk factors and vulnerabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-accent">{currentRisk}%</div>
              <Badge variant={riskInfo.variant}>{riskInfo.level} Risk</Badge>
              <div className="text-sm text-muted-foreground">Overall {hazardType} risk</div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-500">{stateData.affectedArea}%</div>
              <div className="text-sm font-medium">Affected Area</div>
              <div className="text-xs text-muted-foreground">Geographic coverage</div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-500">₹{stateData.economicImpact}Cr</div>
              <div className="text-sm font-medium">Economic Impact</div>
              <div className="text-xs text-muted-foreground">Estimated losses</div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-500">
                {((stateData.population * stateData.affectedArea) / 10000000).toFixed(1)}Cr
              </div>
              <div className="text-sm font-medium">Population at Risk</div>
              <div className="text-xs text-muted-foreground">People affected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-accent" />
              Environmental Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Temperature</span>
                </div>
                <div className="text-2xl font-bold">{stateData.temperature}°C</div>
                <Progress value={(stateData.temperature / 50) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Rainfall</span>
                </div>
                <div className="text-2xl font-bold">{stateData.rainfall}mm</div>
                <Progress value={(stateData.rainfall / 3000) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Elevation</span>
                </div>
                <div className="text-2xl font-bold">{stateData.elevation}m</div>
                <Progress value={(stateData.elevation / 4000) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Population</span>
                </div>
                <div className="text-2xl font-bold">{(stateData.population / 10000000).toFixed(1)}Cr</div>
                <Progress value={Math.min((stateData.population / 200000000) * 100, 100)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vulnerability Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Vulnerability Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vulnerabilityFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{factor.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={factor.impact === "High" ? "destructive" : "secondary"} className="text-xs">
                        {factor.impact}
                      </Badge>
                      <span className="text-sm">{factor.value}%</span>
                    </div>
                  </div>
                  <Progress value={factor.value} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mitigation Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Recommended Mitigation Strategies
          </CardTitle>
          <CardDescription>
            Priority actions to reduce {hazardType} risk in {selectedState}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mitigationStrategies.map((strategy, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="text-sm">{strategy}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historical Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Historical Context & Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-red-500">{Math.floor(Math.random() * 10) + 5}</div>
              <div className="text-sm font-medium">Major Events</div>
              <div className="text-xs text-muted-foreground">Last 20 years</div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-500">{Math.floor(Math.random() * 20) + 10}%</div>
              <div className="text-sm font-medium">Risk Increase</div>
              <div className="text-xs text-muted-foreground">Since 2000</div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-500">₹{Math.floor(Math.random() * 5000) + 2000}Cr</div>
              <div className="text-sm font-medium">Investment Needed</div>
              <div className="text-xs text-muted-foreground">Mitigation measures</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
