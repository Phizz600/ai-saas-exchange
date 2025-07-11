
import { ShieldCheck, Users, MessageSquare } from "lucide-react";

const SecurityFeatures = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 mb-8">
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <ShieldCheck className="w-5 h-5 text-green-400" />
        <span className="text-sm text-gray-200">Verified AI Startups</span>
      </div>
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <Users className="w-5 h-5 text-blue-400" />
        <span className="text-sm text-gray-200">Curated Deal Flow</span>
      </div>
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
        <MessageSquare className="w-5 h-5 text-purple-400" />
<<<<<<< HEAD
<<<<<<< HEAD
        <span className="text-sm text-gray-200">Private Buyer Network</span>
=======
        <span className="text-sm text-gray-200">Private Slack Community</span>
>>>>>>> ccee472 (Refactor: Implement homepage messaging plan)
=======
        <span className="text-sm text-gray-200">Private Buyer Network</span>
>>>>>>> 5c292f4 (Refactor: Replace "Slack" mentions with alternative copy)
      </div>
    </div>
  );
};

export default SecurityFeatures;
