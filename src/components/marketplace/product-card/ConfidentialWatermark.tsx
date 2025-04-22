
import React from "react";

interface ConfidentialWatermarkProps {
  opacity?: number;
}

export function ConfidentialWatermark({ opacity = 0.1 }: ConfidentialWatermarkProps) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
      style={{ opacity }}
    >
      <div className="transform rotate-45 text-[#8B5CF6] text-4xl font-exo-2 whitespace-nowrap flex">
        <span className="mx-4">CONFIDENTIAL</span>
        <span className="mx-4">CONFIDENTIAL</span>
        <span className="mx-4">CONFIDENTIAL</span>
      </div>
    </div>
  );
}
