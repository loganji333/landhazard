"use client"

import { useRef, useState } from "react"
import { Card } from "@/components/ui/card"

interface MapContainerProps {
  selectedState: string | null
  onStateSelect: (state: string) => void
  hazardType: "flood" | "drought"
  analysisResults: any
}

// Mock Indian states data with coordinates
const INDIAN_STATES = [
  { name: "Maharashtra", lat: 19.7515, lng: 75.7139, risk: "medium" },
  { name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, risk: "high" },
  { name: "Bihar", lat: 25.0961, lng: 85.3131, risk: "high" },
  { name: "West Bengal", lat: 22.9868, lng: 87.855, risk: "medium" },
  { name: "Madhya Pradesh", lat: 22.9734, lng: 78.6569, risk: "low" },
  { name: "Tamil Nadu", lat: 11.1271, lng: 78.6569, risk: "medium" },
  { name: "Rajasthan", lat: 27.0238, lng: 74.2179, risk: "low" },
  { name: "Karnataka", lat: 15.3173, lng: 75.7139, risk: "medium" },
  { name: "Gujarat", lat: 22.2587, lng: 71.1924, risk: "low" },
  { name: "Andhra Pradesh", lat: 15.9129, lng: 79.74, risk: "high" },
  { name: "Odisha", lat: 20.9517, lng: 85.0985, risk: "high" },
  { name: "Telangana", lat: 18.1124, lng: 79.0193, risk: "medium" },
  { name: "Kerala", lat: 10.8505, lng: 76.2711, risk: "medium" },
  { name: "Jharkhand", lat: 23.6102, lng: 85.2799, risk: "high" },
  { name: "Assam", lat: 26.2006, lng: 92.9376, risk: "high" },
  { name: "Punjab", lat: 31.1471, lng: 75.3412, risk: "low" },
  { name: "Chhattisgarh", lat: 21.2787, lng: 81.8661, risk: "medium" },
  { name: "Haryana", lat: 29.0588, lng: 76.0856, risk: "low" },
  { name: "Jammu and Kashmir", lat: 34.0837, lng: 74.7973, risk: "medium" },
  { name: "Uttarakhand", lat: 30.0668, lng: 79.0193, risk: "high" },
]

export function MapContainer({ selectedState, onStateSelect, hazardType, analysisResults }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [hoveredState, setHoveredState] = useState<string | null>(null)

  const getRiskColor = (risk: string) => {
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

  const getRiskIntensity = (risk: string) => {
    switch (risk) {
      case "low":
        return 0.6
      case "medium":
        return 0.8
      case "high":
        return 1.0
      default:
        return 0.4
    }
  }

  return (
    <div className="relative w-full h-full bg-muted/20">
      {/* SVG Map of India */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full max-h-[80vh]"
            style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
          >
            {/* India outline */}
            <path
              d="M200 100 L600 100 L650 150 L680 200 L650 300 L600 400 L500 450 L400 480 L300 450 L200 400 L150 300 L180 200 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="transition-colors duration-300"
            />

            {/* State markers */}
            {INDIAN_STATES.map((state) => {
              const isSelected = selectedState === state.name
              const isHovered = hoveredState === state.name
              const riskColor = getRiskColor(state.risk)
              const intensity = getRiskIntensity(state.risk)

              return (
                <g key={state.name}>
                  {/* Risk zone circle */}
                  <circle
                    cx={state.lng * 6 + 100}
                    cy={600 - (state.lat * 15 + 50)}
                    r={analysisResults && selectedState === state.name ? 25 : 15}
                    className={`${riskColor} transition-all duration-300 cursor-pointer`}
                    style={{
                      opacity: intensity,
                      filter: isSelected ? "brightness(1.2)" : isHovered ? "brightness(1.1)" : "none",
                    }}
                    onClick={() => onStateSelect(state.name)}
                    onMouseEnter={() => setHoveredState(state.name)}
                    onMouseLeave={() => setHoveredState(null)}
                  />

                  {/* State label */}
                  <text
                    x={state.lng * 6 + 100}
                    y={600 - (state.lat * 15 + 50) + 30}
                    textAnchor="middle"
                    className="text-xs font-medium fill-foreground pointer-events-none"
                    style={{
                      opacity: isSelected || isHovered ? 1 : 0.7,
                      fontSize: isSelected ? "12px" : "10px",
                    }}
                  >
                    {state.name}
                  </text>

                  {/* Selection indicator */}
                  {isSelected && (
                    <circle
                      cx={state.lng * 6 + 100}
                      cy={600 - (state.lat * 15 + 50)}
                      r={20}
                      fill="none"
                      stroke="hsl(var(--accent))"
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Hazard overlay visualization */}
      {analysisResults && selectedState && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-radial from-chart-4/20 via-chart-1/10 to-transparent animate-pulse" />
        </div>
      )}

      {/* Interactive tooltip */}
      {hoveredState && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
          <Card className="p-3 bg-card/95 backdrop-blur-sm">
            <div className="text-sm font-medium">{hoveredState}</div>
            <div className="text-xs text-muted-foreground">
              {hazardType === "flood" ? "Flood" : "Drought"} Risk:{" "}
              {INDIAN_STATES.find((s) => s.name === hoveredState)?.risk || "Unknown"}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
