import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Settings, HelpCircle } from "lucide-react"

export function Header() {
  return (
    <header className="h-16 bg-sidebar border-b border-sidebar-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <MapPin className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground text-balance">India Hazard Analysis Platform</h1>
            <p className="text-xs text-sidebar-foreground/70">State-Level Natural Disaster Risk Assessment</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          v2.1.0
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
