
import { Link } from "react-router-dom";

export const SidebarLogo = () => {
  return (
    <div className="mb-6 px-6 pt-8">
      <Link to="/" className="flex items-center justify-center">
        <img 
          src="/lovable-uploads/47eac7ab-ce1a-4bb8-800b-19f2bfcdd765.png" 
          alt="AI Exchange Logo" 
          className="h-12 w-12 object-contain"
        />
      </Link>
    </div>
  );
};
