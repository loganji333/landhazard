import { type NextRequest, NextResponse } from "next/server"

interface AnalysisRequest {
  state: string
  hazardType: "flood" | "drought"
  scenario: {
    timeframe: string
    severity: number[]
    rainfall: number[]
    temperature: number[]
    windSpeed: number[]
    duration: number[]
    seasonality: string
    climateChange: boolean
    populationGrowth: number[]
    infrastructureDevelopment: number[]
  }
}

interface GISFactors {
  elevation: number
  rainfall: number
  temperature: number
  population: number
  landUse: number
  soilMoisture: number
  riverProximity: number
  infrastructure: number
}

// Advanced hazard calculation algorithms
class HazardCalculator {
  private static calculateFloodRisk(gisFactors: GISFactors, scenario: any): number {
    const elevationFactor = Math.max(0, (500 - gisFactors.elevation) / 500) * 0.25
    const rainfallFactor = (scenario.rainfall[0] / 100) * (gisFactors.rainfall / 1000) * 0.3
    const riverFactor = Math.max(0, (50 - gisFactors.riverProximity) / 50) * 0.2
    const soilFactor = Math.max(0, (100 - gisFactors.soilMoisture) / 100) * 0.15
    const durationFactor = Math.min(1, scenario.duration[0] / 10) * 0.1

    return Math.min(100, (elevationFactor + rainfallFactor + riverFactor + soilFactor + durationFactor) * 100)
  }

  private static calculateDroughtRisk(gisFactors: GISFactors, scenario: any): number {
    const rainfallFactor = Math.max(0, (1000 - gisFactors.rainfall) / 1000) * 0.3
    const temperatureFactor = (scenario.temperature[0] / 100) * 0.25
    const soilFactor = Math.max(0, (60 - gisFactors.soilMoisture) / 60) * 0.2
    const landUseFactor = (gisFactors.landUse / 100) * 0.15
    const durationFactor = Math.min(1, scenario.duration[0] / 30) * 0.1

    return Math.min(100, (rainfallFactor + temperatureFactor + soilFactor + landUseFactor + durationFactor) * 100)
  }

  private static calculatePopulationImpact(baseRisk: number, population: number, scenario: any): number {
    const populationGrowthFactor = scenario.populationGrowth[0] / 100
    const adjustedPopulation = population * populationGrowthFactor
    return Math.floor(adjustedPopulation * (baseRisk / 100) * Math.random() * 0.3 + adjustedPopulation * 0.1)
  }

  private static calculateEconomicImpact(baseRisk: number, infrastructure: number, scenario: any): number {
    const infrastructureFactor = scenario.infrastructureDevelopment[0] / 100
    const baseImpact = (baseRisk / 100) * infrastructure * infrastructureFactor
    return Math.floor(baseImpact * (Math.random() * 50 + 25)) // 25-75 multiplier
  }

  private static calculateInfrastructureRisk(baseRisk: number, scenario: any): number {
    const developmentFactor = scenario.infrastructureDevelopment[0] / 100
    const windFactor = scenario.windSpeed[0] / 150
    return Math.min(100, baseRisk * (1 - developmentFactor * 0.3) + windFactor * 20)
  }

  static analyze(state: string, hazardType: "flood" | "drought", scenario: any): any {
    // Mock GIS data retrieval (in real implementation, this would query actual databases)
    const gisFactors = this.getGISFactors(state)

    // Calculate base risk using appropriate algorithm
    const baseRisk =
      hazardType === "flood"
        ? this.calculateFloodRisk(gisFactors, scenario)
        : this.calculateDroughtRisk(gisFactors, scenario)

    // Apply climate change multiplier
    const climateMultiplier = scenario.climateChange ? 1.15 : 1.0
    const adjustedRisk = Math.min(100, baseRisk * climateMultiplier)

    // Calculate impact metrics
    const affectedPopulation = this.calculatePopulationImpact(adjustedRisk, gisFactors.population, scenario)
    const economicImpact = this.calculateEconomicImpact(adjustedRisk, gisFactors.infrastructure, scenario)
    const infrastructureRisk = this.calculateInfrastructureRisk(adjustedRisk, scenario)

    // Calculate response metrics
    const evacuationZones = Math.floor((adjustedRisk / 100) * 100 + Math.random() * 20)
    const responseTime = Math.max(2, Math.floor(24 - (gisFactors.infrastructure / 1000) * 12 + Math.random() * 6))

    return {
      state,
      hazardType,
      scenario,
      riskScore: Math.floor(adjustedRisk),
      affectedPopulation,
      economicImpact,
      infrastructureRisk: Math.floor(infrastructureRisk),
      evacuationZones,
      responseTime,
      confidence: 85 + Math.random() * 15,
      modelVersion: "IHAP-2024.1",
      dataSources: ["IMD", "ISRO", "Census", "NRSC"],
      timestamp: new Date().toISOString(),
    }
  }

  private static getGISFactors(state: string): GISFactors {
    // Mock GIS data (in real implementation, this would query geospatial databases)
    const stateData: Record<string, GISFactors> = {
      Maharashtra: {
        elevation: 564,
        rainfall: 1200,
        temperature: 27,
        population: 112374333,
        landUse: 62,
        soilMoisture: 45,
        riverProximity: 12,
        infrastructure: 850,
      },
      "Uttar Pradesh": {
        elevation: 158,
        rainfall: 1025,
        temperature: 25,
        population: 199812341,
        landUse: 77,
        soilMoisture: 35,
        riverProximity: 8,
        infrastructure: 1200,
      },
      Kerala: {
        elevation: 123,
        rainfall: 3055,
        temperature: 28,
        population: 33406061,
        landUse: 44,
        soilMoisture: 75,
        riverProximity: 5,
        infrastructure: 650,
      },
    }

    return (
      stateData[state] || {
        elevation: 300,
        rainfall: 1000,
        temperature: 26,
        population: 50000000,
        landUse: 55,
        soilMoisture: 50,
        riverProximity: 15,
        infrastructure: 500,
      }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()

    // Validate request
    if (!body.state || !body.hazardType || !body.scenario) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Simulate processing time for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

    // Perform hazard analysis
    const results = HazardCalculator.analyze(body.state, body.hazardType, body.scenario)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "India Hazard Analysis Platform API",
    version: "2.1.0",
    endpoints: {
      analyze: "POST /api/analyze - Perform hazard analysis",
      states: "GET /api/states - Get available states",
      gis: "GET /api/gis/:state - Get GIS data for state",
    },
  })
}
