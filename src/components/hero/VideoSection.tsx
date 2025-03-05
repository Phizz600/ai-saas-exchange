
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoSectionProps {
  videoSrc?: string;
}

const VideoSection = ({ videoSrc = "https://examples.noodl.cloud/video/pexels-anthony-shkraba-8064146.mp4" }: VideoSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-20 mb-16"
    >
      <h2 className="text-3xl font-bold text-white text-center mb-10 exo-2-heading">See How It Works</h2>
      
      <div className="relative max-w-5xl mx-auto rounded-xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)]">
        <div className="relative bg-gradient-to-r from-[#13293D]/70 via-[#16324F]/70 to-[#18435A]/70 backdrop-blur-sm rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover rounded-xl"
            src={videoSrc}
            onEnded={() => setIsPlaying(false)}
            loop
            muted
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white/20 backdrop-blur-md p-5 rounded-full cursor-pointer hover:bg-white/30 transition-colors"
                onClick={togglePlay}
              >
                <Play className="h-12 w-12 text-white" fill="white" />
              </motion.div>
            )}
          </div>
          
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white rounded-full h-10 w-10"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-black/20 backdrop-blur-sm hover:bg-black/30 text-white rounded-full h-10 w-10"
              onClick={handleFullscreen}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-300 max-w-2xl mx-auto">
          Watch our detailed walkthrough on how AI Exchange Club connects innovative AI product creators with qualified buyers through our transparent auction marketplace.
        </p>
      </div>
    </motion.div>
  );
};

export default VideoSection;
