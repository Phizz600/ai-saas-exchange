
import { useEffect, useRef } from "react";

export default function SenjaTestimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = "https://widget.senja.io/widget/80f2e88d-ee8e-4e7b-b79b-bb5dd406788d/platform.js";
    script.async = true;
    script.type = "text/javascript";
    
    // Add script to document
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <div className="w-full my-8">
      <div 
        ref={containerRef}
        className="senja-embed" 
        data-id="80f2e88d-ee8e-4e7b-b79b-bb5dd406788d" 
        data-mode="shadow" 
        data-lazyload="false" 
        style={{ display: "block", width: "100%" }}
      ></div>
    </div>
  );
}
