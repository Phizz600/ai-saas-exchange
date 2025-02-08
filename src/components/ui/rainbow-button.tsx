
import * as React from "react"
import { Button } from "@/components/ui/button"

export function RainbowButton({ children }: { children: React.ReactNode }) {
  return (
    <Button 
      className="relative inline-flex overflow-hidden rounded-lg p-[2px] hover:scale-105 transition-transform duration-300"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#D946EF_0%,#8B5CF6_50%,#0EA5E9_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black/90 px-6 py-2 text-sm font-medium text-white backdrop-blur-3xl">
        {children}
      </span>
    </Button>
  )
}
