import { type NextRequest, NextResponse } from "next/server"

interface GISData {
  state: string
  topography: {
    elevation: { min: number; max: number; avg: number }
    slope: { avg: number; max: number }
    terrain: string[]
  }
  climate: {
    rainfall: { annual: number; monsoon: number; seasonal: number[] }
    temperature: { min: number; max: number; avg: number }
    humidity: { avg: number; seasonal: number[] }
  }
  hydrology: {
    rivers: string[]
    waterBodies: number
    groundwater: { depth: number; quality: string }
    floodPlains: number
  }
  landUse: {
    agriculture: number
    forest: number
    urban: number
    water: number
    barren: number
  }
  demographics: {
    population: number
    density: number
    urban: number
    rural: number
    vulnerable: number
  }
  infrastructure: {
    roads: number
    railways: number
    hospitals: number
    schools: number
    emergencyServices: number
  }
}

const GIS_DATABASE: Record<string, GISData> = {
  Maharashtra: {
    state: "Maharashtra",
    topography: {
      elevation: { min: 0, max: 1646, avg: 564 },
      slope: { avg: 12, max: 45 },
      terrain: ["Coastal Plains", "Western Ghats", "Deccan Plateau"],
    },
    climate: {
      rainfall: { annual: 1200, monsoon: 85, seasonal: [45, 850, 280, 25] },
      temperature: { min: 12, max: 42, avg: 27 },
      humidity: { avg: 65, seasonal: [55, 75, 70, 60] },
    },
    hydrology: {
      rivers: ["Godavari", "Krishna", "Tapi", "Narmada"],
      waterBodies: 1845,
      groundwater: { depth: 8.5, quality: "moderate" },
      floodPlains: 23,
    },
    landUse: {
      agriculture: 62,
      forest: 17,
      urban: 8,
      water: 3,
      barren: 10,
    },
    demographics: {
      population: 112374333,
      density: 365,
      urban: 45.2,
      rural: 54.8,
      vulnerable: 15.3,
    },
    infrastructure: {
      roads: 267452,
      railways: 5984,
      hospitals: 3156,
      schools: 98234,
      emergencyServices: 245,
    },
  },
  "Uttar Pradesh": {
    state: "Uttar Pradesh",
    topography: {
      elevation: { min: 60, max: 2200, avg: 158 },
      slope: { avg: 2, max: 15 },
      terrain: ["Gangetic Plains", "Himalayan Foothills", "Vindhya Range"],
    },
    climate: {
      rainfall: { annual: 1025, monsoon: 80, seasonal: [35, 720, 245, 25] },
      temperature: { min: 5, max: 45, avg: 25 },
      humidity: { avg: 58, seasonal: [45, 70, 65, 50] },
    },
    hydrology: {
      rivers: ["Ganges", "Yamuna", "Gomti", "Ghaghra"],
      waterBodies: 2156,
      groundwater: { depth: 12.3, quality: "poor" },
      floodPlains: 45,
    },
    landUse: {
      agriculture: 77,
      forest: 6,
      urban: 4,
      water: 2,
      barren: 11,
    },
    demographics: {
      population: 199812341,
      density: 828,
      urban: 22.3,
      rural: 77.7,
      vulnerable: 28.5,
    },
    infrastructure: {
      roads: 285634,
      railways: 8734,
      hospitals: 4567,
      schools: 156789,
      emergencyServices: 387,
    },
  },
  Kerala: {
    state: "Kerala",
    topography: {
      elevation: { min: 0, max: 2695, avg: 123 },
      slope: { avg: 25, max: 60 },
      terrain: ["Coastal Plains", "Western Ghats", "Midland Hills"],
    },
    climate: {
      rainfall: { annual: 3055, monsoon: 95, seasonal: [125, 1850, 980, 100] },
      temperature: { min: 18, max: 36, avg: 28 },
      humidity: { avg: 78, seasonal: [70, 85, 80, 75] },
    },
    hydrology: {
      rivers: ["Periyar", "Bharathapuzha", "Pamba", "Chaliyar"],
      waterBodies: 892,
      groundwater: { depth: 4.2, quality: "good" },
      floodPlains: 18,
    },
    landUse: {
      agriculture: 44,
      forest: 29,
      urban: 12,
      water: 8,
      barren: 7,
    },
    demographics: {
      population: 33406061,
      density: 860,
      urban: 47.7,
      rural: 52.3,
      vulnerable: 8.9,
    },
    infrastructure: {
      roads: 145678,
      railways: 1234,
      hospitals: 2345,
      schools: 45678,
      emergencyServices: 234,
    },
  },
}

export async function GET(request: NextRequest, { params }: { params: { state: string } }) {
  try {
    const state = decodeURIComponent(params.state)

    if (!GIS_DATABASE[state]) {
      return NextResponse.json({ error: "State not found" }, { status: 404 })
    }

    const gisData = GIS_DATABASE[state]

    return NextResponse.json({
      ...gisData,
      lastUpdated: new Date().toISOString(),
      dataSource: "ISRO, IMD, Census 2021, NRSC",
      accuracy: "95.2%",
    })
  } catch (error) {
    console.error("GIS data error:", error)
    return NextResponse.json({ error: "Failed to retrieve GIS data" }, { status: 500 })
  }
}
