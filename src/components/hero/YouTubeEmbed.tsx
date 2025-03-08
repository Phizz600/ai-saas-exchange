
import { motion } from "framer-motion";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

const YouTubeEmbed = ({ videoId, title = "YouTube video player" }: YouTubeEmbedProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl"
      >
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </motion.div>
    </div>
  );
};

export default YouTubeEmbed;
