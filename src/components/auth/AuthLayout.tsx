import { ReactNode } from "react";
import { Link } from "react-router-dom";
interface AuthLayoutProps {
  children: ReactNode;
  showWelcome?: boolean;
  showInstructions?: boolean;
}
export const AuthLayout = ({
  children,
  showWelcome = false,
  showInstructions = false
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
            <img src="/lovable-uploads/5678c900-f5a3-4336-93da-062cb1e759c4.png" alt="AI Exchange Club Logo" className="h-20 mx-auto mb-0 cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          {showWelcome && <>
              
              <p className="text-gray-300 text-sm mx-0 my-[34px]">Please enter your details to continue</p>
            </>}
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/20 transform transition-all duration-300 hover:shadow-purple-500/20">
          {showInstructions && <p className="text-gray-300 text-sm text-center mb-6">Please enter your details to continue</p>}
          {children}
        </div>
      </div>
    </div>;
};