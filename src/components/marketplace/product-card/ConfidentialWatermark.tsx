
import React from "react";

interface ConfidentialWatermarkProps {
  opacity?: number;
  text?: string;
  rotation?: number;
}

export function ConfidentialWatermark({ 
  opacity = 0.1, 
  text = "CONFIDENTIAL",
  rotation = 45 
}: ConfidentialWatermarkProps) {
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center"
      style={{ opacity }}
    >
      <div 
        className="transform text-[#8B5CF6] text-4xl font-exo-2 whitespace-nowrap flex"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  );
}
