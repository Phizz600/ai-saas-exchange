
import React from "react";

interface ConfidentialWatermarkProps {
  text?: string;
  opacity?: number;
  rotation?: number;
  className?: string;
}

export function ConfidentialWatermark({
  text = "CONFIDENTIAL",
  opacity = 0.08,
  rotation = 45,
  className = ""
}: ConfidentialWatermarkProps) {
  return (
    <div 
      className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <div 
        className="transform text-gray-500 text-3xl md:text-4xl font-bold flex whitespace-nowrap"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  );
}
