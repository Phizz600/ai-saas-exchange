
import { useEffect, useRef } from "react";

export default function SenjaTestimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create iframe resizer script
    const iframeResizerScript = document.createElement('script');
    iframeResizerScript.src = "https://widget.senja.io/js/iframeResizer.min.js";
    iframeResizerScript.async = true;
    iframeResizerScript.type = "text/javascript";
    
    // Add iframe resizer script to document
    document.body.appendChild(iframeResizerScript);

    // Wait for iframe resizer to load before creating the iframe
    iframeResizerScript.onload = () => {
      if (containerRef.current) {
        // Create iframe element
        const iframe = document.createElement('iframe');
        iframe.id = "senja-collector-iframe";
        iframe.src = "https://senja.io/p/ai-exchange/r/evQRRY?mode=embed&nostyle=true";
        iframe.allow = "camera;microphone";
        iframe.title = "Senja form";
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        iframe.width = "100%";
        iframe.height = "700";
        
        // Add iframe to container
        containerRef.current.appendChild(iframe);
        
        // Initialize iframe resizer
        if (window.iFrameResize) {
          window.iFrameResize({log: false, checkOrigin: false}, "#senja-collector-iframe");
        }
      }
    };

    // Cleanup function
    return () => {
      document.body.removeChild(iframeResizerScript);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full mb-8 rounded-lg overflow-hidden"></div>
  );
}
