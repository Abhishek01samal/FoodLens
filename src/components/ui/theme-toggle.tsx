"use client"

import { useState, useEffect } from "react"
import { Leaf, Moon, Sun, Sparkles, Flame, Snowflake, Waves } from "lucide-react"
import { cn } from "@/lib/utils"

type Theme = "matrix" | "midnight" | "sunrise" | "neon-purple" | "ocean" | "ember" | "arctic"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("matrix")

  useEffect(() => {
    const root = document.documentElement
    
    switch (theme) {
      case "matrix": // Original dark green
        root.style.setProperty('--background', '0 0% 0%')
        root.style.setProperty('--foreground', '120 100% 90%')
        root.style.setProperty('--primary', '120 100% 40%')
        root.style.setProperty('--primary-foreground', '0 0% 0%')
        root.style.setProperty('--accent', '120 100% 50%')
        root.style.setProperty('--accent-foreground', '0 0% 0%')
        root.style.setProperty('--border', '120 20% 20%')
        root.style.setProperty('--muted', '0 0% 15%')
        root.style.setProperty('--muted-foreground', '120 20% 60%')
        root.style.setProperty('--card', '0 0% 5%')
        root.style.setProperty('--card-foreground', '120 100% 90%')
        root.style.setProperty('--secondary', '120 60% 25%')
        root.style.setProperty('--secondary-foreground', '120 100% 90%')
        break
      case "midnight": // Deep blue dark
        root.style.setProperty('--background', '230 25% 5%')
        root.style.setProperty('--foreground', '210 100% 95%')
        root.style.setProperty('--primary', '210 100% 55%')
        root.style.setProperty('--primary-foreground', '0 0% 0%')
        root.style.setProperty('--accent', '200 100% 60%')
        root.style.setProperty('--accent-foreground', '0 0% 0%')
        root.style.setProperty('--border', '220 30% 20%')
        root.style.setProperty('--muted', '220 20% 12%')
        root.style.setProperty('--muted-foreground', '210 30% 60%')
        root.style.setProperty('--card', '225 25% 8%')
        root.style.setProperty('--card-foreground', '210 100% 95%')
        root.style.setProperty('--secondary', '220 40% 20%')
        root.style.setProperty('--secondary-foreground', '210 100% 95%')
        break
      case "sunrise": // Warm light theme
        root.style.setProperty('--background', '40 50% 97%')
        root.style.setProperty('--foreground', '25 30% 15%')
        root.style.setProperty('--primary', '25 90% 50%')
        root.style.setProperty('--primary-foreground', '0 0% 100%')
        root.style.setProperty('--accent', '35 100% 55%')
        root.style.setProperty('--accent-foreground', '0 0% 0%')
        root.style.setProperty('--border', '35 30% 85%')
        root.style.setProperty('--muted', '40 30% 92%')
        root.style.setProperty('--muted-foreground', '25 20% 45%')
        root.style.setProperty('--card', '40 40% 99%')
        root.style.setProperty('--card-foreground', '25 30% 15%')
        root.style.setProperty('--secondary', '35 40% 90%')
        root.style.setProperty('--secondary-foreground', '25 30% 15%')
        break
      case "neon-purple": // Cyberpunk dark
        root.style.setProperty('--background', '280 30% 3%')
        root.style.setProperty('--foreground', '280 100% 95%')
        root.style.setProperty('--primary', '280 100% 60%')
        root.style.setProperty('--primary-foreground', '0 0% 0%')
        root.style.setProperty('--accent', '300 100% 70%')
        root.style.setProperty('--accent-foreground', '0 0% 0%')
        root.style.setProperty('--border', '280 30% 20%')
        root.style.setProperty('--muted', '280 20% 12%')
        root.style.setProperty('--muted-foreground', '280 30% 60%')
        root.style.setProperty('--card', '280 25% 6%')
        root.style.setProperty('--card-foreground', '280 100% 95%')
        root.style.setProperty('--secondary', '290 50% 25%')
        root.style.setProperty('--secondary-foreground', '280 100% 95%')
        break
      case "ocean": // Teal light theme
        root.style.setProperty('--background', '180 30% 97%')
        root.style.setProperty('--foreground', '190 40% 15%')
        root.style.setProperty('--primary', '180 70% 40%')
        root.style.setProperty('--primary-foreground', '0 0% 100%')
        root.style.setProperty('--accent', '175 80% 45%')
        root.style.setProperty('--accent-foreground', '0 0% 0%')
        root.style.setProperty('--border', '180 25% 85%')
        root.style.setProperty('--muted', '180 20% 92%')
        root.style.setProperty('--muted-foreground', '185 25% 40%')
        root.style.setProperty('--card', '180 30% 99%')
        root.style.setProperty('--card-foreground', '190 40% 15%')
        root.style.setProperty('--secondary', '175 35% 88%')
        root.style.setProperty('--secondary-foreground', '190 40% 15%')
        break
      case "ember": // Red/orange dark
        root.style.setProperty('--background', '0 30% 4%')
        root.style.setProperty('--foreground', '20 100% 95%')
        root.style.setProperty('--primary', '15 90% 55%')
        root.style.setProperty('--primary-foreground', '0 0% 0%')
        root.style.setProperty('--accent', '25 100% 60%')
        root.style.setProperty('--accent-foreground', '0 0% 0%')
        root.style.setProperty('--border', '10 30% 20%')
        root.style.setProperty('--muted', '5 20% 12%')
        root.style.setProperty('--muted-foreground', '15 30% 60%')
        root.style.setProperty('--card', '0 25% 7%')
        root.style.setProperty('--card-foreground', '20 100% 95%')
        root.style.setProperty('--secondary', '10 50% 22%')
        root.style.setProperty('--secondary-foreground', '20 100% 95%')
        break
      case "arctic": // Cool light theme
        root.style.setProperty('--background', '200 30% 98%')
        root.style.setProperty('--foreground', '210 30% 15%')
        root.style.setProperty('--primary', '200 80% 50%')
        root.style.setProperty('--primary-foreground', '0 0% 100%')
        root.style.setProperty('--accent', '195 90% 55%')
        root.style.setProperty('--accent-foreground', '0 0% 0%')
        root.style.setProperty('--border', '200 25% 88%')
        root.style.setProperty('--muted', '200 20% 94%')
        root.style.setProperty('--muted-foreground', '200 20% 45%')
        root.style.setProperty('--card', '200 30% 99%')
        root.style.setProperty('--card-foreground', '210 30% 15%')
        root.style.setProperty('--secondary', '195 30% 90%')
        root.style.setProperty('--secondary-foreground', '210 30% 15%')
        break
    }
  }, [theme])

  const cycleTheme = () => {
    const themes: Theme[] = ["matrix", "midnight", "sunrise", "neon-purple", "ocean", "ember", "arctic"]
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getThemeColor = () => {
    switch (theme) {
      case "matrix": return "hsl(120 100% 40%)"
      case "midnight": return "hsl(210 100% 55%)"
      case "sunrise": return "hsl(25 90% 50%)"
      case "neon-purple": return "hsl(280 100% 60%)"
      case "ocean": return "hsl(180 70% 40%)"
      case "ember": return "hsl(15 90% 55%)"
      case "arctic": return "hsl(200 80% 50%)"
    }
  }

  const getThemeIcon = () => {
    const iconProps = { className: "w-3.5 h-3.5", strokeWidth: 2 }
    
    switch (theme) {
      case "matrix": return <Leaf {...iconProps} />
      case "midnight": return <Moon {...iconProps} />
      case "sunrise": return <Sun {...iconProps} />
      case "neon-purple": return <Sparkles {...iconProps} />
      case "ocean": return <Waves {...iconProps} />
      case "ember": return <Flame {...iconProps} />
      case "arctic": return <Snowflake {...iconProps} />
    }
  }

  const isLightTheme = theme === "sunrise" || theme === "ocean" || theme === "arctic"

  return (
    <div
      className={cn(
        "relative w-8 h-8 rounded-full cursor-pointer transition-all duration-300 shadow-md hover:scale-110",
        className
      )}
      onClick={cycleTheme}
      role="button"
      tabIndex={0}
      aria-label="Toggle theme"
      style={{
        background: `conic-gradient(from 0deg, ${getThemeColor()}, transparent 60%, ${getThemeColor()})`,
        border: `2px solid ${getThemeColor()}`
      }}
    >
      <div
        className="absolute inset-0.5 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: isLightTheme ? 'hsl(0 0% 100%)' : 'hsl(0 0% 0%)',
          color: getThemeColor()
        }}
      >
        {getThemeIcon()}
      </div>
    </div>
  )
}
