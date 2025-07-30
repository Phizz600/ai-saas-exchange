
import { Link } from "react-router-dom";

export const SidebarLogo = () => {
  return (
    <div className="mb-6 px-6 pt-8">
      <Link to="/" className="flex items-center justify-center">
        <img 
          src="/lovable-uploads/5678c900-f5a3-4336-93da-062cb1e759c4.png" 
          alt="AI Exchange Logo" 
          className="h-12 w-12 object-contain"
        />
      </Link>
    </div>
  );
};
