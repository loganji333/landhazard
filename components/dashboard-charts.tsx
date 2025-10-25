"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, BarChart3, PieChartIcon, Activity } from "lucide-react"

interface DashboardChartsProps {
  stateData: any
  selectedState: string
  hazardType: "flood" | "drought"
}

export function DashboardCharts({ stateData, selectedState, hazardType }: DashboardChartsProps) {
  // Generate historical trend data
  const historicalData = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    risk: Math.floor(Math.random() * 40) + (hazardType === "flood" ? 30 : 20),
    rainfall: Math.floor(Math.random() * 200) + 50,
    temperature: Math.floor(Math.random() * 10) + (hazardType === "flood" ? 25 : 30),
  }))

  // Risk distribution data
  const riskDistribution = [
    { name: "Low Risk", value: 100 - stateData.floodRisk - stateData.droughtRisk, fill: "hsl(var(--chart-2))" },
    { name: "Flood Risk", value: stateData.floodRisk, fill: "hsl(var(--chart-1))" },
    { name: "Drought Risk", value: stateData.droughtRisk, fill: "hsl(var(--chart-4))" },
  ]

  // Comparative data with neighboring states
  const comparativeData = [
    { state: selectedState, floodRisk: stateData.floodRisk, droughtRisk: stateData.droughtRisk },
    { state: "National Avg", floodRisk: 45, droughtRisk: 35 },
    {
      state: "Region Avg",
      floodRisk: Math.floor(Math.random() * 20) + 40,
      droughtRisk: Math.floor(Math.random() * 20) + 30,
    },
  ]

  // Environmental factors data
  const environmentalFactors = [
    { factor: "Rainfall", value: stateData.rainfall, max: 3000 },
    { factor: "Temperature", value: stateData.temperature, max: 50 },
    { factor: "Elevation", value: stateData.elevation, max: 4000 },
    { factor: "Population Density", value: stateData.population / 100000, max: 1000 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Historical Risk Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Historical Risk Trend
          </CardTitle>
          <CardDescription>
            Monthly {hazardType} risk levels for {selectedState}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              risk: {
                label: "Risk Level",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="var(--color-risk)"
                  fill="var(--color-risk)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-accent" />
            Risk Distribution
          </CardTitle>
          <CardDescription>Overall hazard risk breakdown for {selectedState}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              risk: {
                label: "Risk Distribution",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center gap-4 mt-4">
            {riskDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.fill }}></div>
                <span className="text-sm">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparative Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Comparative Analysis
          </CardTitle>
          <CardDescription>Risk comparison with regional and national averages</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              floodRisk: {
                label: "Flood Risk",
                color: "hsl(var(--chart-1))",
              },
              droughtRisk: {
                label: "Drought Risk",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="floodRisk" fill="var(--color-floodRisk)" />
                <Bar dataKey="droughtRisk" fill="var(--color-droughtRisk)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Environmental Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Environmental Factors
          </CardTitle>
          <CardDescription>Key environmental parameters affecting hazard risk</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Value",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={environmentalFactors} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="factor" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
