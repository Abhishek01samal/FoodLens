"use client"

import { useState, memo } from "react"
import { Scale, FileSearch, Apple } from "lucide-react"
import { cn } from "@/lib/utils"

const modes = [
  {
    id: "comparison",
    label: "Compare Products",
    icon: Scale,
    description: "Compare two food products side by side",
  },
  {
    id: "info",
    label: "Product / Food Info",
    icon: FileSearch,
    description: "Get detailed info about any product or dish",
  },
  {
    id: "diet",
    label: "Diet Planner",
    icon: Apple,
    description: "Create your personalized diet plan",
  },
]

interface ModeSelectorProps {
  onSelect: (mode: string) => void
  isLoading?: boolean
}

export const ModeSelector = memo(({ onSelect, isLoading }: ModeSelectorProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (isLoading) return
    setActiveIndex(index)
    onSelect(modes[index].id)
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Quote Container */}
      <div className="relative px-8">
        <span className="absolute -left-2 -top-6 text-7xl font-serif text-foreground/[0.06] select-none pointer-events-none">
          "
        </span>

        <p className="text-xl md:text-2xl font-light text-foreground text-center max-w-lg leading-relaxed">
          {activeIndex !== null 
            ? modes[activeIndex].description 
            : hoveredIndex !== null 
              ? modes[hoveredIndex].description
              : "What would you like to analyze today?"}
        </p>

        <span className="absolute -right-2 -bottom-8 text-7xl font-serif text-foreground/[0.06] select-none pointer-events-none">
          "
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 mt-2">
        {/* Mode text */}
        <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase transition-all duration-500 ease-out">
          {activeIndex !== null 
            ? modes[activeIndex].label 
            : hoveredIndex !== null 
              ? modes[hoveredIndex].label
              : "Select a mode"}
        </p>

        <div className="flex items-center justify-center gap-3">
          {modes.map((mode, index) => {
            const isActive = activeIndex === index
            const isHovered = hoveredIndex === index && !isActive
            const showName = isActive || isHovered
            const Icon = mode.icon

            return (
              <button
                key={mode.id}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                disabled={isLoading}
                className={cn(
                  "relative flex items-center gap-0 rounded-full cursor-pointer",
                  "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive ? "bg-primary shadow-lg shadow-primary/30" : "bg-muted/50 hover:bg-muted/80",
                  showName ? "pr-4 pl-3 py-3" : "p-3",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      isActive ? "bg-primary-foreground/20" : "bg-transparent",
                      !isActive && "hover:scale-105",
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-colors duration-300",
                      isActive ? "text-primary-foreground" : "text-foreground"
                    )} />
                  </div>
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showName ? "grid-cols-[1fr] opacity-100 ml-2" : "grid-cols-[0fr] opacity-0 ml-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <span
                      className={cn(
                        "text-sm font-medium whitespace-nowrap block",
                        "transition-colors duration-300",
                        isActive ? "text-primary-foreground" : "text-foreground",
                      )}
                    >
                      {mode.label}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
})

ModeSelector.displayName = "ModeSelector"
