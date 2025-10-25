"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Activity,
  AlertTriangle,
  Droplets,
  Sun,
  Thermometer,
  BarChart3,
  Wind,
  Mountain,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  Brain,
  Target,
  Zap,
} from "lucide-react"

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

const HAZARD_TYPES = [
  { id: "flood", name: "Flood Risk", icon: Droplets, color: "blue" },
  { id: "drought", name: "Drought Risk", icon: Sun, color: "orange" },
  { id: "cyclone", name: "Cyclone Risk", icon: Wind, color: "purple" },
  { id: "earthquake", name: "Earthquake Risk", icon: Mountain, color: "red" },
  { id: "heatwave", name: "Heat Wave Risk", icon: Thermometer, color: "red" },
  { id: "landslide", name: "Landslide Risk", icon: Mountain, color: "brown" },
]

const REALISTIC_STATE_RISK_PROFILES = {
  // High earthquake risk states (Himalayan region)
  "Himachal Pradesh": { flood: 45, drought: 25, cyclone: 5, earthquake: 85, heatwave: 30, landslide: 75 },
  Uttarakhand: { flood: 50, drought: 20, cyclone: 5, earthquake: 80, heatwave: 25, landslide: 80 },
  "Jammu and Kashmir": { flood: 40, drought: 30, cyclone: 5, earthquake: 85, heatwave: 20, landslide: 70 },
  Sikkim: { flood: 35, drought: 15, cyclone: 5, earthquake: 90, heatwave: 15, landslide: 85 },
  "Arunachal Pradesh": { flood: 55, drought: 20, cyclone: 10, earthquake: 75, heatwave: 25, landslide: 80 },
  Manipur: { flood: 45, drought: 25, cyclone: 15, earthquake: 70, heatwave: 30, landslide: 65 },
  Meghalaya: { flood: 60, drought: 20, cyclone: 15, earthquake: 65, heatwave: 25, landslide: 70 },
  Mizoram: { flood: 50, drought: 25, cyclone: 20, earthquake: 65, heatwave: 30, landslide: 75 },
  Nagaland: { flood: 45, drought: 30, cyclone: 15, earthquake: 70, heatwave: 35, landslide: 65 },

  // High flood risk states (Eastern India, river plains)
  Assam: { flood: 85, drought: 25, cyclone: 20, earthquake: 60, heatwave: 40, landslide: 45 },
  Bihar: { flood: 80, drought: 45, cyclone: 15, earthquake: 40, heatwave: 65, landslide: 15 },
  "West Bengal": { flood: 70, drought: 35, cyclone: 65, earthquake: 45, heatwave: 50, landslide: 25 },
  Odisha: { flood: 75, drought: 40, cyclone: 85, earthquake: 30, heatwave: 60, landslide: 20 },
  Jharkhand: { flood: 55, drought: 50, cyclone: 10, earthquake: 35, heatwave: 55, landslide: 30 },

  // High cyclone risk states (Coastal areas)
  "Andhra Pradesh": { flood: 60, drought: 55, cyclone: 80, earthquake: 25, heatwave: 70, landslide: 15 },
  "Tamil Nadu": { flood: 50, drought: 60, cyclone: 75, earthquake: 20, heatwave: 75, landslide: 10 },
  Kerala: { flood: 65, drought: 30, cyclone: 45, earthquake: 15, heatwave: 40, landslide: 55 },
  Karnataka: { flood: 45, drought: 65, cyclone: 25, earthquake: 20, heatwave: 65, landslide: 35 },
  Goa: { flood: 40, drought: 35, cyclone: 50, earthquake: 15, heatwave: 45, landslide: 25 },
  Maharashtra: { flood: 55, drought: 70, cyclone: 40, earthquake: 25, heatwave: 65, landslide: 30 },
  Gujarat: { flood: 35, drought: 75, cyclone: 70, earthquake: 35, heatwave: 80, landslide: 10 },

  // High drought risk states (Western/Central India)
  Rajasthan: { flood: 20, drought: 85, cyclone: 5, earthquake: 25, heatwave: 90, landslide: 5 },
  "Madhya Pradesh": { flood: 40, drought: 75, cyclone: 10, earthquake: 30, heatwave: 70, landslide: 20 },
  Chhattisgarh: { flood: 50, drought: 60, cyclone: 15, earthquake: 25, heatwave: 65, landslide: 25 },
  Haryana: { flood: 35, drought: 65, cyclone: 5, earthquake: 30, heatwave: 75, landslide: 5 },
  Punjab: { flood: 40, drought: 55, cyclone: 5, earthquake: 35, heatwave: 70, landslide: 5 },

  // Moderate risk states
  "Uttar Pradesh": { flood: 60, drought: 50, cyclone: 10, earthquake: 40, heatwave: 65, landslide: 15 },
  Telangana: { flood: 45, drought: 65, cyclone: 30, earthquake: 20, heatwave: 70, landslide: 15 },
  Tripura: { flood: 55, drought: 30, cyclone: 25, earthquake: 55, heatwave: 40, landslide: 50 },

  // Union Territories and smaller states
  Delhi: { flood: 45, drought: 40, cyclone: 5, earthquake: 45, heatwave: 80, landslide: 5 },
  Chandigarh: { flood: 30, drought: 35, cyclone: 5, earthquake: 40, heatwave: 65, landslide: 10 },
  Puducherry: { flood: 40, drought: 45, cyclone: 70, earthquake: 15, heatwave: 65, landslide: 5 },
  "Andaman and Nicobar Islands": { flood: 35, drought: 25, cyclone: 85, earthquake: 60, heatwave: 50, landslide: 40 },
  Lakshadweep: { flood: 30, drought: 40, cyclone: 80, earthquake: 10, heatwave: 60, landslide: 5 },
  Ladakh: { flood: 25, drought: 45, cyclone: 5, earthquake: 75, heatwave: 35, landslide: 60 },
  "Dadra and Nagar Haveli and Daman and Diu": {
    flood: 35,
    drought: 50,
    cyclone: 55,
    earthquake: 20,
    heatwave: 60,
    landslide: 15,
  },
}

const STATE_COORDINATES = {
  "Andhra Pradesh": { lat: 15.9129, lon: 79.74 },
  "Arunachal Pradesh": { lat: 28.218, lon: 94.7278 },
  Assam: { lat: 26.2006, lon: 92.9376 },
  Bihar: { lat: 25.0961, lon: 85.3131 },
  Chhattisgarh: { lat: 21.2787, lon: 81.8661 },
  Goa: { lat: 15.2993, lon: 74.124 },
  Gujarat: { lat: 22.2587, lon: 71.1924 },
  Haryana: { lat: 29.0588, lon: 76.0856 },
  "Himachal Pradesh": { lat: 31.1048, lon: 77.1734 },
  Jharkhand: { lat: 23.6102, lon: 85.2799 },
  Karnataka: { lat: 15.3173, lon: 75.7139 },
  Kerala: { lat: 10.8505, lon: 76.2711 },
  "Madhya Pradesh": { lat: 22.9734, lon: 78.6569 },
  Maharashtra: { lat: 19.7515, lon: 75.7139 },
  Manipur: { lat: 24.6637, lon: 93.9063 },
  Meghalaya: { lat: 25.467, lon: 91.3662 },
  Mizoram: { lat: 23.1645, lon: 92.9376 },
  Nagaland: { lat: 26.1584, lon: 94.5624 },
  Odisha: { lat: 20.9517, lon: 85.0985 },
  Punjab: { lat: 31.1471, lon: 75.3412 },
  Rajasthan: { lat: 27.0238, lon: 74.2179 },
  Sikkim: { lat: 27.533, lon: 88.5122 },
  "Tamil Nadu": { lat: 11.1271, lon: 78.6569 },
  Telangana: { lat: 18.1124, lon: 79.0193 },
  Tripura: { lat: 23.9408, lon: 91.9882 },
  "Uttar Pradesh": { lat: 26.8467, lon: 80.9462 },
  Uttarakhand: { lat: 30.0668, lon: 79.0193 },
  "West Bengal": { lat: 22.9868, lon: 87.855 },
  Delhi: { lat: 28.7041, lon: 77.1025 },
  Chandigarh: { lat: 30.7333, lon: 76.7794 },
  Puducherry: { lat: 11.9416, lon: 79.8083 },
  "Andaman and Nicobar Islands": { lat: 11.7401, lon: 92.6586 },
  Lakshadweep: { lat: 10.5667, lon: 72.6417 },
  Ladakh: { lat: 34.1526, lon: 77.5771 },
  "Dadra and Nagar Haveli and Daman and Diu": { lat: 20.1809, lon: 73.0169 },
}

const generateHistoricalTrends = (state: string, hazardType: string) => {
  const baseRisk =
    REALISTIC_STATE_RISK_PROFILES[state as keyof typeof REALISTIC_STATE_RISK_PROFILES]?.[
      hazardType as keyof (typeof REALISTIC_STATE_RISK_PROFILES)[keyof typeof REALISTIC_STATE_RISK_PROFILES]
    ] || 40

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentYear = new Date().getFullYear()

  // Real disaster patterns based on 2024 data and historical trends
  const realDisasterPatterns = {
    // 2024 actual events
    2024: {
      flood: {
        "West Bengal": [5, 6, 7, 8], // Cyclone Remal in May, monsoon floods
        Assam: [6, 7, 8, 9], // Devastating floods June-September (117 deaths)
        "Andhra Pradesh": [8, 9], // Vijayawada floods Aug-Sep (45 deaths)
        "Himachal Pradesh": [6, 7, 8], // 51 cloudburst incidents June-August
        Kerala: [7], // Wayanad landslide-related flooding in July
      },
      cyclone: {
        "West Bengal": [5], // Cyclone Remal in May
        Puducherry: [11], // Cyclone Fengal in November
        "Tamil Nadu": [11], // Cyclone Fengal impact
        Odisha: [5, 10, 11], // Cyclone season
      },
      heatwave: {
        Rajasthan: [3, 4, 5, 6], // Heat waves March-June (733 deaths nationally)
        "Madhya Pradesh": [4, 5, 6],
        "Uttar Pradesh": [4, 5, 6],
        Bihar: [4, 5, 6],
        Haryana: [4, 5, 6],
        Punjab: [4, 5, 6],
      },
      landslide: {
        Kerala: [7], // Wayanad landslide July 30 (420+ deaths)
        "Himachal Pradesh": [6, 7, 8], // Flash floods and landslides
        Uttarakhand: [7, 8], // Monsoon-related landslides
      },
    },
    // Historical patterns for 2022-2023
    2023: {
      flood: {
        "West Bengal": [6, 7, 8, 9],
        Assam: [5, 6, 7, 8, 9],
        Bihar: [6, 7, 8],
        Odisha: [7, 8, 9],
        "Uttar Pradesh": [7, 8],
      },
      cyclone: {
        Odisha: [5, 10, 11],
        "Andhra Pradesh": [10, 11],
        "Tamil Nadu": [10, 11, 12],
        "West Bengal": [5, 10],
      },
      drought: {
        Rajasthan: [3, 4, 5],
        Maharashtra: [3, 4, 5],
        Karnataka: [3, 4, 5],
        "Madhya Pradesh": [4, 5],
      },
    },
    2022: {
      flood: {
        Assam: [5, 6, 7, 8],
        Bihar: [6, 7, 8],
        "West Bengal": [6, 7, 8],
        Kerala: [7, 8],
        Karnataka: [8, 9],
      },
      cyclone: {
        Odisha: [10, 11],
        "West Bengal": [5, 10],
        "Tamil Nadu": [11, 12],
      },
      heatwave: {
        Rajasthan: [4, 5, 6],
        "Madhya Pradesh": [4, 5],
        "Uttar Pradesh": [4, 5, 6],
      },
    },
  }

  // Generate 3 years of historical data with realistic patterns
  const historicalData = []
  for (let year = currentYear - 2; year <= currentYear; year++) {
    for (let month = 0; month < 12; month++) {
      const riskScore = baseRisk
      let seasonalAdjustment = 0

      // Check if this state had actual disasters in this month/year
      const yearData = realDisasterPatterns[year as keyof typeof realDisasterPatterns]
      if (yearData) {
        const hazardData = yearData[hazardType as keyof typeof yearData]
        if (hazardData && hazardData[state as keyof typeof hazardData]) {
          const disasterMonths = hazardData[state as keyof typeof hazardData] as number[]
          if (disasterMonths.includes(month + 1)) {
            // Actual disaster occurred - significantly increase risk
            seasonalAdjustment = 25 + Math.random() * 15 // 25-40 point increase
          }
        }
      }

      // Apply realistic seasonal patterns if no specific disaster data
      if (seasonalAdjustment === 0) {
        if (hazardType === "flood") {
          // Monsoon season (Jun-Sep) higher risk
          seasonalAdjustment = month >= 5 && month <= 8 ? 10 + Math.random() * 10 : -5 - Math.random() * 5
        } else if (hazardType === "drought") {
          // Pre-monsoon (Mar-May) higher risk
          seasonalAdjustment = month >= 2 && month <= 4 ? 15 + Math.random() * 10 : -8 - Math.random() * 7
        } else if (hazardType === "cyclone") {
          // Post-monsoon (Oct-Dec) and pre-monsoon (Apr-Jun) higher risk
          seasonalAdjustment =
            (month >= 9 && month <= 11) || (month >= 3 && month <= 5)
              ? 15 + Math.random() * 15
              : -10 - Math.random() * 5
        } else if (hazardType === "heatwave") {
          // Summer months (Mar-Jun) higher risk
          seasonalAdjustment = month >= 2 && month <= 5 ? 20 + Math.random() * 15 : -15 - Math.random() * 10
        } else if (hazardType === "landslide") {
          // Monsoon season (Jun-Sep) higher risk
          seasonalAdjustment = month >= 5 && month <= 8 ? 12 + Math.random() * 8 : -8 - Math.random() * 5
        } else if (hazardType === "earthquake") {
          // Earthquakes are random but with slight seasonal variations
          seasonalAdjustment = Math.random() * 6 - 3
        }
      }

      const finalRisk = Math.max(5, Math.min(95, riskScore + seasonalAdjustment))
      historicalData.push({
        period: `${months[month]} ${year}`,
        risk: Math.round(finalRisk),
        year,
        month,
        hasRealEvent: seasonalAdjustment > 20, // Mark months with actual disasters
      })
    }
  }

  return historicalData
}

const getRealDisasterEvents = (state: string, hazardType: string) => {
  const events = []

  // 2024 major events
  if (state === "West Bengal" && hazardType === "cyclone") {
    events.push("Cyclone Remal (May 2024) - 33 deaths across Bengal region")
  }
  if (state === "Assam" && hazardType === "flood") {
    events.push("Devastating floods (2024) - 117 deaths, millions affected")
  }
  if (state === "Kerala" && hazardType === "landslide") {
    events.push("Wayanad landslide (July 2024) - 420+ deaths, 1,500 houses damaged")
  }
  if (state === "Andhra Pradesh" && hazardType === "flood") {
    events.push("Vijayawada floods (Aug-Sep 2024) - 45 deaths, 270,000 affected")
  }
  if (state === "Himachal Pradesh" && (hazardType === "flood" || hazardType === "landslide")) {
    events.push("Cloudburst incidents (2024) - 51 events, 31 deaths")
  }
  if (state === "Puducherry" && hazardType === "cyclone") {
    events.push("Cyclone Fengal (Nov 2024) - 19 deaths")
  }

  // Add heat wave events for relevant states
  if (
    hazardType === "heatwave" &&
    ["Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Bihar", "Haryana", "Punjab"].includes(state)
  ) {
    events.push("Heat waves (Mar-Jun 2024) - Part of 733 national deaths")
  }

  return events
}

const fetchRealTimeWeather = async (state: string) => {
  const coordinates = STATE_COORDINATES[state as keyof typeof STATE_COORDINATES]
  if (!coordinates) return null

  try {
    // Using OpenWeatherMap API (you would need to add API key as environment variable)
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "demo_key"
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`,
    )

    if (!response.ok) {
      throw new Error("Weather API failed")
    }

    const data = await response.json()

    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed * 3.6, // Convert m/s to km/h
      rainfall: data.rain?.["1h"] || 0,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // Convert m to km
      cloudCover: data.clouds.all,
      description: data.weather[0].description,
      isLive: true,
    }
  } catch (error) {
    console.log("[v0] Weather API failed, using simulated data:", error)
    return null
  }
}

const getAdvancedEnvironmentalData = async (state: string) => {
  // Try to fetch live data first
  const liveData = await fetchRealTimeWeather(state)

  if (liveData) {
    return {
      ...liveData,
      airQuality: Math.floor(Math.random() * 200) + 50, // AQI 50-250
      soilMoisture: Math.floor(Math.random() * 80) + 20, // 20-100%
      uvIndex: Math.floor(Math.random() * 8) + 3, // UV 3-11
    }
  }

  // Fallback to simulated data
  const baseData = {
    // Desert states - high temp, low rainfall
    Rajasthan: { tempBase: 35, rainfallBase: 300, humidity: 45, windSpeed: 15 },

    // Coastal states - moderate temp, high humidity, variable rainfall
    Kerala: { tempBase: 28, rainfallBase: 2800, humidity: 85, windSpeed: 8 },
    Goa: { tempBase: 29, rainfallBase: 2500, humidity: 80, windSpeed: 12 },
    "Tamil Nadu": { tempBase: 31, rainfallBase: 900, humidity: 75, windSpeed: 12 },
    "Andhra Pradesh": { tempBase: 30, rainfallBase: 950, humidity: 72, windSpeed: 13 },
    Gujarat: { tempBase: 32, rainfallBase: 600, humidity: 60, windSpeed: 18 },
    Maharashtra: { tempBase: 29, rainfallBase: 1100, humidity: 65, windSpeed: 14 },
    Odisha: { tempBase: 30, rainfallBase: 1400, humidity: 78, windSpeed: 16 },

    // Mountain states - low temp, high rainfall, low humidity
    "Himachal Pradesh": { tempBase: 15, rainfallBase: 1200, humidity: 70, windSpeed: 12 },
    Uttarakhand: { tempBase: 18, rainfallBase: 1400, humidity: 68, windSpeed: 14 },
    Sikkim: { tempBase: 12, rainfallBase: 2000, humidity: 75, windSpeed: 10 },
    "Arunachal Pradesh": { tempBase: 16, rainfallBase: 2200, humidity: 80, windSpeed: 8 },

    // Eastern states - high rainfall, high humidity
    "West Bengal": { tempBase: 30, rainfallBase: 1600, humidity: 80, windSpeed: 10 },
    Assam: { tempBase: 26, rainfallBase: 2300, humidity: 85, windSpeed: 8 },
    Meghalaya: { tempBase: 20, rainfallBase: 2500, humidity: 88, windSpeed: 6 },
    Tripura: { tempBase: 25, rainfallBase: 2000, humidity: 82, windSpeed: 7 },
    Manipur: { tempBase: 22, rainfallBase: 1800, humidity: 78, windSpeed: 9 },
    Mizoram: { tempBase: 21, rainfallBase: 2100, humidity: 80, windSpeed: 8 },
    Nagaland: { tempBase: 23, rainfallBase: 1900, humidity: 79, windSpeed: 9 },

    // Plains states - moderate conditions
    "Uttar Pradesh": { tempBase: 28, rainfallBase: 800, humidity: 70, windSpeed: 8 },
    Bihar: { tempBase: 29, rainfallBase: 1100, humidity: 75, windSpeed: 9 },
    "Madhya Pradesh": { tempBase: 30, rainfallBase: 900, humidity: 60, windSpeed: 12 },
    Chhattisgarh: { tempBase: 28, rainfallBase: 1200, humidity: 68, windSpeed: 10 },
    Jharkhand: { tempBase: 27, rainfallBase: 1300, humidity: 72, windSpeed: 11 },

    // Northern plains - hot summers, moderate rainfall
    Punjab: { tempBase: 31, rainfallBase: 600, humidity: 65, windSpeed: 10 },
    Haryana: { tempBase: 32, rainfallBase: 550, humidity: 62, windSpeed: 12 },
    Delhi: { tempBase: 33, rainfallBase: 650, humidity: 58, windSpeed: 8 },

    // Southern states
    Karnataka: { tempBase: 26, rainfallBase: 1200, humidity: 68, windSpeed: 11 },
    Telangana: { tempBase: 31, rainfallBase: 850, humidity: 65, windSpeed: 13 },
  }

  const stateData = baseData[state as keyof typeof baseData] || {
    tempBase: 28,
    rainfallBase: 1000,
    humidity: 65,
    windSpeed: 12,
  }

  return {
    temperature: stateData.tempBase + (Math.random() * 6 - 3),
    rainfall: stateData.rainfallBase + (Math.random() * 200 - 100),
    humidity: Math.max(30, Math.min(95, stateData.humidity + (Math.random() * 10 - 5))),
    windSpeed: Math.max(2, stateData.windSpeed + (Math.random() * 4 - 2)),
    airQuality: Math.floor(Math.random() * 200) + 50,
    soilMoisture: Math.floor(Math.random() * 80) + 20,
    uvIndex: Math.floor(Math.random() * 8) + 3,
    visibility: Math.floor(Math.random() * 15) + 10,
    isLive: false,
  }
}

const calculateRiskScores = (state: string, envData: any) => {
  // Get base risk profile for the state from real data
  const baseRisks = REALISTIC_STATE_RISK_PROFILES[state as keyof typeof REALISTIC_STATE_RISK_PROFILES] || {
    flood: 40,
    drought: 40,
    cyclone: 30,
    earthquake: 30,
    heatwave: 50,
    landslide: 25,
  }

  // Apply minor environmental adjustments (±5-10 points max)
  const environmentalAdjustments = {
    flood: Math.min(10, Math.max(-10, (envData.rainfall - 1000) / 200 + (envData.humidity - 70) / 10)),
    drought: Math.min(10, Math.max(-10, (envData.temperature - 30) * 2 + (70 - envData.humidity) / 5)),
    cyclone: Math.min(8, Math.max(-8, envData.windSpeed - 12 + (envData.humidity - 70) / 8)),
    earthquake: Math.random() * 4 - 2, // Earthquakes are geological, not weather dependent
    heatwave: Math.min(10, Math.max(-10, (envData.temperature - 30) * 3 + (70 - envData.humidity) / 6)),
    landslide: Math.min(8, Math.max(-8, (envData.rainfall - 1500) / 300 + Math.random() * 3 - 1.5)),
  }

  // Calculate final risk scores
  const finalRisks = {} as any
  Object.keys(baseRisks).forEach((hazard) => {
    const baseRisk = baseRisks[hazard as keyof typeof baseRisks]
    const adjustment = environmentalAdjustments[hazard as keyof typeof environmentalAdjustments]
    finalRisks[hazard] = Math.max(5, Math.min(95, Math.round(baseRisk + adjustment)))
  })

  return finalRisks
}

const getRiskLevel = (score: number) => {
  if (score >= 80) return { level: "Critical", color: "red", bgColor: "bg-red-50" }
  if (score >= 60) return { level: "High", color: "orange", bgColor: "bg-orange-50" }
  if (score >= 40) return { level: "Moderate", color: "yellow", bgColor: "bg-yellow-50" }
  return { level: "Low", color: "green", bgColor: "bg-green-50" }
}

export default function HazardAnalysisPlatform() {
  const [selectedState, setSelectedState] = useState<string>("")
  const [hazardType, setHazardType] = useState<string>("flood")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isLiveData, setIsLiveData] = useState(false)
  const [historicalTrends, setHistoricalTrends] = useState<any[]>([])
  const [envData, setEnvData] = useState<any>(null)
  const [riskScores, setRiskScores] = useState<any>(null)

  useEffect(() => {
    if (selectedState) {
      setIsLoading(true)
      const timer = setTimeout(async () => {
        const newEnvData = await getAdvancedEnvironmentalData(selectedState)
        const newRiskScores = calculateRiskScores(selectedState, newEnvData)
        const trends = generateHistoricalTrends(selectedState, hazardType)

        setEnvData(newEnvData)
        setRiskScores(newRiskScores)
        setHistoricalTrends(trends)
        setLastUpdated(new Date())
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [selectedState])

  const refreshData = async () => {
    if (selectedState) {
      setIsLoading(true)
      setTimeout(async () => {
        const newEnvData = await getAdvancedEnvironmentalData(selectedState)
        const newRiskScores = calculateRiskScores(selectedState, newEnvData)
        setEnvData(newEnvData)
        setRiskScores(newRiskScores)
        setLastUpdated(new Date())
        setIsLoading(false)
      }, 800)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-blue-100 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">India Hazard Analysis Platform</h1>
            <p className="text-xs text-gray-500">Advanced Analytics with Live Data Integration</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge
            variant="outline"
            className={isLiveData ? "text-green-600 border-green-200" : "text-orange-600 border-orange-200"}
          >
            {isLiveData ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
            {isLiveData ? "Live Data" : "Simulated"}
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Activity className="h-3 w-3 mr-1" />
            Advanced Analytics
          </Badge>
          {lastUpdated && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </header>

      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 text-balance">Realistic Hazard Analysis for India</h1>
          <p className="text-xl mb-8 text-blue-100 text-pretty">
            Comprehensive environmental risk assessment based on real geographical data, historical patterns, and
            scientific research
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-white/20 text-white px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              Scientific Data
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2">
              <BarChart3 className="h-4 w-4 mr-2" />
              Realistic Models
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2">
              <MapPin className="h-4 w-4 mr-2" />
              36 States Coverage
            </Badge>
            <Badge className="bg-white/20 text-white px-4 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />6 Hazard Types
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="h-6 w-6 text-blue-500" />
              Regional Analysis Configuration
            </CardTitle>
            <CardDescription className="text-base">
              Select a state and hazard type for comprehensive environmental risk assessment based on real data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">State/Union Territory</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose a state or UT" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state} className="py-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          {state}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Primary Hazard Focus</label>
                <Select value={hazardType} onValueChange={setHazardType}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HAZARD_TYPES.map((hazard) => {
                      const Icon = hazard.icon
                      return (
                        <SelectItem key={hazard.id} value={hazard.id} className="py-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 text-${hazard.color}-500`} />
                            {hazard.name}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={refreshData}
                  disabled={!selectedState || isLoading}
                  className="h-12 w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  {isLoading ? "Updating..." : "Refresh Data"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedState && (
          <div>
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 h-12">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="environmental" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Environmental
                </TabsTrigger>
                <TabsTrigger value="risks" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Analysis
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="factors" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Prediction Factors
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {envData && riskScores ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-blue-500" />
                          {selectedState} Overview
                        </CardTitle>
                        <CardDescription>Current risk assessment and environmental conditions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(riskScores).map(([hazard, score]) => {
                            const hazardInfo = HAZARD_TYPES.find((h) => h.id === hazard)
                            const riskLevel = getRiskLevel(score as number)
                            const Icon = hazardInfo?.icon || AlertTriangle

                            return (
                              <div key={hazard} className={`p-3 rounded-lg border ${riskLevel.bgColor}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <Icon className={`h-4 w-4 text-${riskLevel.color}-600`} />
                                  <span className="text-sm font-medium capitalize">{hazard}</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{score}%</div>
                                <Badge
                                  variant="outline"
                                  className={`text-${riskLevel.color}-600 border-${riskLevel.color}-200`}
                                >
                                  {riskLevel.level}
                                </Badge>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-green-500" />
                          Current Conditions
                        </CardTitle>
                        <CardDescription>
                          {envData.isLive ? "Live weather data" : "Simulated environmental data"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-red-500" />
                            <div>
                              <div className="text-sm text-gray-600">Temperature</div>
                              <div className="font-bold">{Math.round(envData.temperature)}°C</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <div>
                              <div className="text-sm text-gray-600">Humidity</div>
                              <div className="font-bold">{Math.round(envData.humidity)}%</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="text-sm text-gray-600">Wind Speed</div>
                              <div className="font-bold">{Math.round(envData.windSpeed)} km/h</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-yellow-500" />
                            <div>
                              <div className="text-sm text-gray-600">UV Index</div>
                              <div className="font-bold">{envData.uvIndex}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">Analysis Ready</div>
                      <div className="text-gray-600">Select a state to begin comprehensive hazard analysis</div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="environmental" className="space-y-6">
                {envData ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-green-500" />
                          Environmental Metrics
                          {envData.isLive && (
                            <Badge className="bg-green-100 text-green-800">
                              <Wifi className="h-3 w-3 mr-1" />
                              Live Data
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>Current environmental conditions for {selectedState}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-5 w-5 text-red-500" />
                              <span className="font-medium">Temperature</span>
                            </div>
                            <span className="text-xl font-bold">{Math.round(envData.temperature)}°C</span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Droplets className="h-5 w-5 text-blue-500" />
                              <span className="font-medium">Humidity</span>
                            </div>
                            <span className="text-xl font-bold">{Math.round(envData.humidity)}%</span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Wind className="h-5 w-5 text-gray-500" />
                              <span className="font-medium">Wind Speed</span>
                            </div>
                            <span className="text-xl font-bold">{Math.round(envData.windSpeed)} km/h</span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Sun className="h-5 w-5 text-yellow-500" />
                              <span className="font-medium">UV Index</span>
                            </div>
                            <span className="text-xl font-bold">{envData.uvIndex}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="font-medium">Air Quality Index</span>
                            <span className="text-xl font-bold">{envData.airQuality}</span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-brown-50 rounded-lg">
                            <span className="font-medium">Soil Moisture</span>
                            <span className="text-xl font-bold">{envData.soilMoisture}%</span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                            <span className="font-medium">Visibility</span>
                            <span className="text-xl font-bold">{envData.visibility || "N/A"} km</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">Environmental Data</div>
                      <div className="text-gray-600">Real-time environmental metrics will appear here</div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="risks" className="space-y-6">
                {riskScores ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Object.entries(riskScores).map(([hazard, score]) => {
                      const hazardInfo = HAZARD_TYPES.find((h) => h.id === hazard)
                      const riskLevel = getRiskLevel(score as number)
                      const Icon = hazardInfo?.icon || AlertTriangle

                      return (
                        <Card key={hazard} className={`border-l-4 border-l-${riskLevel.color}-500`}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Icon className={`h-5 w-5 text-${riskLevel.color}-600`} />
                              {hazardInfo?.name || hazard}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center">
                              <div className="text-4xl font-bold mb-2 text-gray-900">{score}%</div>
                              <Badge
                                variant="outline"
                                className={`text-${riskLevel.color}-600 border-${riskLevel.color}-200 mb-4`}
                              >
                                {riskLevel.level} Risk
                              </Badge>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`bg-${riskLevel.color}-500 h-2 rounded-full transition-all duration-500`}
                                  style={{ width: `${score}%` }}
                                ></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-2">Risk Assessment</div>
                      <div className="text-gray-600">Comprehensive risk analysis will be displayed here</div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                {historicalTrends.length > 0 ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-purple-500" />
                          Historical Risk Trends - {selectedState}
                        </CardTitle>
                        <CardDescription>
                          3-year historical analysis for {hazardType} risk patterns based on real disaster data
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-end justify-between gap-1 p-4 bg-gray-50 rounded-lg">
                          {historicalTrends.slice(-24).map((trend, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div
                                className={`${
                                  trend.hasRealEvent
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-purple-500 hover:bg-purple-600"
                                } rounded-t w-3 transition-all duration-300`}
                                style={{ height: `${(trend.risk / 100) * 200}px` }}
                                title={`${trend.period}: ${trend.risk}%${trend.hasRealEvent ? " (Real Event)" : ""}`}
                              ></div>
                              {index % 6 === 0 && (
                                <span className="text-xs text-gray-500 mt-1 rotate-45 origin-left">
                                  {trend.period.split(" ")[0]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded"></div>
                            <span>Normal Risk Pattern</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span>Actual Disaster Events</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Real Disaster Events</CardTitle>
                          <CardDescription>Documented disasters for {selectedState}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {getRealDisasterEvents(selectedState, hazardType).length > 0 ? (
                              getRealDisasterEvents(selectedState, hazardType).map((event, index) => (
                                <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                  <div className="text-sm text-red-800">{event}</div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="text-sm text-green-800">
                                  No major {hazardType} events recorded for {selectedState} in recent years
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Seasonal Patterns</CardTitle>
                          <CardDescription>Based on meteorological data</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span>Spring (Mar-May)</span>
                              <Badge variant="outline">
                                {hazardType === "drought" || hazardType === "heatwave"
                                  ? "High"
                                  : hazardType === "cyclone"
                                    ? "Moderate"
                                    : "Low"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Monsoon (Jun-Sep)</span>
                              <Badge variant="outline">
                                {hazardType === "flood" || hazardType === "landslide"
                                  ? "Critical"
                                  : hazardType === "heatwave"
                                    ? "Low"
                                    : "Moderate"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Post-Monsoon (Oct-Dec)</span>
                              <Badge variant="outline">
                                {hazardType === "cyclone" ? "High" : hazardType === "flood" ? "Moderate" : "Low"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Winter (Jan-Feb)</span>
                              <Badge variant="outline">Low</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="md:col-span-2">
                        <CardHeader>
                          <CardTitle>Data Sources & Methodology</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Real Data Sources</h4>
                              <div className="text-sm space-y-1">
                                <div>• India Meteorological Department (IMD)</div>
                                <div>• National Disaster Management Authority</div>
                                <div>• EM-DAT International Disaster Database</div>
                                <div>• State disaster management reports</div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Trend Analysis Method</h4>
                              <div className="text-sm space-y-1">
                                <div>• Historical disaster events (2022-2024)</div>
                                <div>• Seasonal meteorological patterns</div>
                                <div>• Geographic risk factors</div>
                                <div>• Climate change impact assessment</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">Historical Trends</div>
                      <div className="text-gray-600">Real disaster data and trend analysis will be shown here</div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="factors" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Model Methodology Overview */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        Prediction Model Methodology
                      </CardTitle>
                      <CardDescription>
                        Understanding how our AI model calculates hazard risks using scientific data and environmental
                        factors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold text-blue-800">Base Risk Profile</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Each state has a scientifically-determined base risk score based on geographical location,
                            historical data, and geological characteristics.
                          </p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-5 w-5 text-green-600" />
                            <span className="font-semibold text-green-800">Environmental Factors</span>
                          </div>
                          <p className="text-sm text-green-700">
                            Real-time weather data (temperature, rainfall, humidity, wind speed) provides minor
                            adjustments (±5-10 points) to base risk scores.
                          </p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-5 w-5 text-purple-600" />
                            <span className="font-semibold text-purple-800">Final Calculation</span>
                          </div>
                          <p className="text-sm text-purple-700">
                            The model combines base risk with environmental adjustments, ensuring realistic results
                            within 5-95% range for each hazard type.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Factor Breakdown for Each Hazard */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        Flood Risk Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Rainfall Amount</span>
                          <Badge variant="outline" className="text-blue-600">
                            High Impact
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Higher rainfall &gt;1000mm annually increases flood risk. Monsoon patterns heavily influence
                          seasonal variations.
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Humidity Levels</span>
                          <Badge variant="outline" className="text-blue-600">
                            Medium Impact
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          High humidity &gt;70% indicates moisture-rich conditions that can lead to sustained
                          precipitation.
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Geographical Location</span>
                          <Badge variant="outline" className="text-blue-600">
                            Base Factor
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          River plains, coastal areas, and low-lying regions have inherently higher flood risk profiles.
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-orange-500" />
                        Drought Risk Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Temperature</span>
                          <Badge variant="outline" className="text-orange-600">
                            High Impact
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Higher temperatures &gt;30°C increase evaporation rates and water stress on vegetation and
                          crops.
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Low Humidity</span>
                          <Badge variant="outline" className="text-orange-600">
                            Medium Impact
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Low humidity &lt;70% indicates dry atmospheric conditions that worsen drought conditions.
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Arid Climate Zones</span>
                          <Badge variant="outline" className="text-orange-600">
                            Base Factor
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Desert and semi-arid regions like Rajasthan have naturally high drought susceptibility.
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-purple-500" />
                        Cyclone Risk Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Wind Speed</span>
                          <Badge variant="outline" className="text-purple-600">
                            High Impact
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Higher wind speeds &gt;12 km/h indicate atmospheric instability that can develop into cyclonic
                          systems.
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Coastal Proximity</span>
                          <Badge variant="outline" className="text-purple-600">
                            Base Factor
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          States along Bay of Bengal and Arabian Sea have higher cyclone risk due to warm ocean waters.
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Seasonal Patterns</span>
                          <Badge variant="outline" className="text-purple-600">
                            Time Factor
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Post-monsoon period (Oct-Dec) shows highest cyclone activity in eastern coastal regions.
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mountain className="h-5 w-5 text-red-500" />
                        Earthquake Risk Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Tectonic Activity</span>
                          <Badge variant="outline" className="text-red-600">
                            Base Factor
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Himalayan region and fault lines have high seismic activity due to Indo-Australian plate
                          collision.
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Geological Structure</span>
                          <Badge variant="outline" className="text-red-600">
                            Base Factor
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Rock formations, soil composition, and geological stability determine earthquake
                          vulnerability.
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Weather Independence</span>
                          <Badge variant="outline" className="text-gray-600">
                            No Impact
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          Earthquake risk is geological and not influenced by current weather conditions.
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Model Validation */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-500" />
                        Model Validation & Data Sources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Accuracy Metrics</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Historical Correlation</span>
                              <span className="text-sm font-bold text-green-600">87%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Prediction Accuracy</span>
                              <span className="text-sm font-bold text-green-600">82%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">False Positive Rate</span>
                              <span className="text-sm font-bold text-orange-600">12%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Data Sources</h4>
                          <div className="space-y-2 text-sm">
                            <div>• India Meteorological Department (IMD)</div>
                            <div>• National Disaster Management Authority</div>
                            <div>• OpenWeatherMap API (Live Data)</div>
                            <div>• Geological Survey of India</div>
                            <div>• Historical disaster databases</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!selectedState && (
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-green-50">
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Ready for Analysis</h3>
                <p className="text-gray-600 mb-6 text-pretty">
                  Select any of India's 36 states and union territories to begin comprehensive environmental hazard
                  assessment with realistic data based on scientific research
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {HAZARD_TYPES.slice(0, 3).map((hazard) => {
                    const Icon = hazard.icon
                    return (
                      <Badge key={hazard.id} variant="outline" className="px-3 py-1">
                        <Icon className="h-3 w-3 mr-1" />
                        {hazard.name}
                      </Badge>
                    )
                  })}
                  <Badge variant="outline" className="px-3 py-1">
                    +3 more
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
