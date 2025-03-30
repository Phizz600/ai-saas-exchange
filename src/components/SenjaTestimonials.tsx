
import { useEffect, useRef } from "react";

export default function SenjaTestimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create script element for Senja testimonial widget
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
    <div ref={containerRef} className="w-full my-8 rounded-lg overflow-hidden">
      {/* Senja will auto-inject the testimonials widget here */}
    </div>
  );
}
