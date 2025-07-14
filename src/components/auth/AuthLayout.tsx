import { ReactNode } from "react";
import { Link } from "react-router-dom";
interface AuthLayoutProps {
  children: ReactNode;
}
export const AuthLayout = ({
  children
}: AuthLayoutProps) => {
  return <div className="min-h-screen bg-gradient-to-b from-accent to-accent3 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({
        length: 6
      }).map((_, index) => <div key={index} className="absolute rounded-full bg-white/5 animate-float" style={{
        width: `${Math.random() * 300 + 50}px`,
        height: `${Math.random() * 300 + 50}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${index * 0.5}s`,
        animationDuration: `${Math.random() * 10 + 15}s`
      }} />)}
      </div>
      
      <div className="w-full max-w-md z-10">
        <div className="mb-6 text-center">
          <Link to="/">
            <img src="/lovable-uploads/b2726e08-98dd-472d-b44a-b780d6e1343e.png" alt="AI Exchange Club Logo" className="h-40 mx-auto mb-0 cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          <h1 className="exo-2-heading text-white mt-2 mb-1 my-0 text-lg">Welcome to The AI Exchange Club</h1>
          <p className="text-gray-300 text-sm">Please enter your details to continue</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20 transform transition-all duration-300 hover:shadow-purple-500/20">
          {children}
        </div>
      </div>
    </div>;
};