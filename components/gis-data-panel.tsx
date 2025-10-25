"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Droplets, Thermometer, Mountain, TreePine, Users, Building2, Waves, CloudRain } from "lucide-react"

interface GISDataPanelProps {
  selectedState: string | null
  hazardType: "flood" | "drought"
}

// Mock GIS data for different states
const GIS_DATA = {
  Maharashtra: {
    elevation: { avg: 564, min: 0, max: 1646, risk: "medium" },
    rainfall: { annual: 1200, monsoon: 85, risk: "medium" },
    temperature: { avg: 27, max: 42, min: 12, risk: "high" },
    population: { density: 365, urban: 45.2, rural: 54.8, risk: "high" },
    landUse: { agriculture: 62, forest: 17, urban: 8, water: 3, risk: "medium" },
    soilMoisture: { current: 45, optimal: 60, risk: "medium" },
    riverProximity: { distance: 12, floodPlains: 23, risk: "high" },
    infrastructure: { roads: 78, hospitals: 156, schools: 2341, risk: "medium" },
  },
  "Uttar Pradesh": {
    elevation: { avg: 158, min: 60, max: 2200, risk: "high" },
    rainfall: { annual: 1025, monsoon: 80, risk: "high" },
    temperature: { avg: 25, max: 45, min: 5, risk: "high" },
    population: { density: 828, urban: 22.3, rural: 77.7, risk: "high" },
    landUse: { agriculture: 77, forest: 6, urban: 4, water: 2, risk: "high" },
    soilMoisture: { current: 35, optimal: 55, risk: "high" },
    riverProximity: { distance: 8, floodPlains: 45, risk: "high" },
    infrastructure: { roads: 245, hospitals: 387, schools: 8934, risk: "high" },
  },
  Kerala: {
    elevation: { avg: 123, min: 0, max: 2695, risk: "medium" },
    rainfall: { annual: 3055, monsoon: 95, risk: "low" },
    temperature: { avg: 28, max: 36, min: 18, risk: "medium" },
    population: { density: 860, urban: 47.7, rural: 52.3, risk: "high" },
    landUse: { agriculture: 44, forest: 29, urban: 12, water: 8, risk: "low" },
    soilMoisture: { current: 75, optimal: 65, risk: "low" },
    riverProximity: { distance: 5, floodPlains: 18, risk: "medium" },
    infrastructure: { roads: 89, hospitals: 234, schools: 1456, risk: "low" },
  },
}

const DEFAULT_DATA = {
  elevation: { avg: 300, min: 0, max: 1000, risk: "medium" },
  rainfall: { annual: 1000, monsoon: 75, risk: "medium" },
  temperature: { avg: 26, max: 40, min: 10, risk: "medium" },
  population: { density: 400, urban: 35, rural: 65, risk: "medium" },
  landUse: { agriculture: 55, forest: 20, urban: 10, water: 5, risk: "medium" },
  soilMoisture: { current: 50, optimal: 60, risk: "medium" },
  riverProximity: { distance: 15, floodPlains: 20, risk: "medium" },
  infrastructure: { roads: 100, hospitals: 200, schools: 3000, risk: "medium" },
}

export function GISDataPanel({ selectedState, hazardType }: GISDataPanelProps) {
  const data =
    selectedState && GIS_DATA[selectedState as keyof typeof GIS_DATA]
      ? GIS_DATA[selectedState as keyof typeof GIS_DATA]
      : DEFAULT_DATA

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-chart-2"
      case "medium":
        return "text-chart-1"
      case "high":
        return "text-chart-4"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "low":
        return "secondary"
      case "medium":
        return "default"
      case "high":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getProgressColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-chart-2"
      case "medium":
        return "bg-chart-1"
      case "high":
        return "bg-chart-4"
      default:
        return "bg-muted"
    }
  }

  if (!selectedState) {
    return (
      <Card className="p-4 bg-sidebar-accent/50">
        <div className="text-center text-sidebar-foreground/60">
          <Mountain className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a state to view GIS data</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Topographical Data */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Mountain className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Topographical</span>
          <Badge variant={getRiskBadgeVariant(data.elevation.risk)} className="text-xs">
            {data.elevation.risk}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Avg Elevation</span>
            <span className="font-medium">{data.elevation.avg}m</span>
          </div>
          <Progress value={(data.elevation.avg / 2000) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {data.elevation.min}m</span>
            <span>Max: {data.elevation.max}m</span>
          </div>
        </div>
      </Card>

      {/* Climate Data */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CloudRain className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Climate</span>
          <Badge variant={getRiskBadgeVariant(data.rainfall.risk)} className="text-xs">
            {data.rainfall.risk}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3 text-chart-2" />
              <span className="text-xs text-muted-foreground">Rainfall</span>
            </div>
            <div className="text-sm font-medium">{data.rainfall.annual}mm</div>
            <Progress value={data.rainfall.monsoon} className="h-1" />
            <div className="text-xs text-muted-foreground">Monsoon: {data.rainfall.monsoon}%</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Thermometer className="h-3 w-3 text-chart-4" />
              <span className="text-xs text-muted-foreground">Temperature</span>
            </div>
            <div className="text-sm font-medium">{data.temperature.avg}°C</div>
            <div className="text-xs text-muted-foreground">
              {data.temperature.min}° - {data.temperature.max}°C
            </div>
          </div>
        </div>
      </Card>

      {/* Hydrological Data */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Waves className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Hydrological</span>
          <Badge variant={getRiskBadgeVariant(data.riverProximity.risk)} className="text-xs">
            {data.riverProximity.risk}
          </Badge>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Soil Moisture</span>
              <span className="font-medium">{data.soilMoisture.current}%</span>
            </div>
            <Progress value={(data.soilMoisture.current / 100) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">Optimal: {data.soilMoisture.optimal}%</div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">River Distance</span>
              <div className="font-medium">{data.riverProximity.distance}km</div>
            </div>
            <div>
              <span className="text-muted-foreground">Flood Plains</span>
              <div className="font-medium">{data.riverProximity.floodPlains}%</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Land Use */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <TreePine className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Land Use</span>
          <Badge variant={getRiskBadgeVariant(data.landUse.risk)} className="text-xs">
            {data.landUse.risk}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Agriculture</span>
              <span className="font-medium">{data.landUse.agriculture}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Forest</span>
              <span className="font-medium">{data.landUse.forest}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Urban</span>
              <span className="font-medium">{data.landUse.urban}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Water</span>
              <span className="font-medium">{data.landUse.water}%</span>
            </div>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden">
            <div className="bg-chart-2" style={{ width: `${data.landUse.agriculture}%` }} />
            <div className="bg-chart-5" style={{ width: `${data.landUse.forest}%` }} />
            <div className="bg-chart-3" style={{ width: `${data.landUse.urban}%` }} />
            <div className="bg-chart-1" style={{ width: `${data.landUse.water}%` }} />
          </div>
        </div>
      </Card>

      {/* Demographics */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Demographics</span>
          <Badge variant={getRiskBadgeVariant(data.population.risk)} className="text-xs">
            {data.population.risk}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Population Density</span>
            <span className="font-medium">{data.population.density}/km²</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Urban</span>
              <div className="font-medium">{data.population.urban}%</div>
            </div>
            <div>
              <span className="text-muted-foreground">Rural</span>
              <div className="font-medium">{data.population.rural}%</div>
            </div>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden">
            <div className="bg-chart-3" style={{ width: `${data.population.urban}%` }} />
            <div className="bg-chart-2" style={{ width: `${data.population.rural}%` }} />
          </div>
        </div>
      </Card>

      {/* Infrastructure */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">Infrastructure</span>
          <Badge variant={getRiskBadgeVariant(data.infrastructure.risk)} className="text-xs">
            {data.infrastructure.risk}
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Roads (km)</span>
            <span className="font-medium">{data.infrastructure.roads.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hospitals</span>
            <span className="font-medium">{data.infrastructure.hospitals.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Schools</span>
            <span className="font-medium">{data.infrastructure.schools.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
