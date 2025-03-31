
import { Badge } from "@/components/ui/badge";
import { LockIcon } from "lucide-react";

interface ProductBadgesProps {
  category?: string;
  stage?: string;
  requiresNda?: boolean;
}

export function ProductBadges({ category, stage, requiresNda }: ProductBadgesProps) {
  const getCategoryColor = (category: string = '') => {
    const colors: Record<string, { bg: string; text: string }> = {
      // Updated color scheme for all categories
      'Content Generation': { bg: 'bg-purple-100', text: 'text-purple-700' },
      'Customer Service': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Image Generation': { bg: 'bg-pink-100', text: 'text-pink-700' },
      'Development Tools': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      'Audio Processing': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
      'Video Processing': { bg: 'bg-rose-100', text: 'text-rose-700' },
      'Finance': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      'Automation': { bg: 'bg-sky-100', text: 'text-sky-700' },
      'Natural Language Processing': { bg: 'bg-violet-100', text: 'text-violet-700' },
      'Machine Learning': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Computer Vision': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      'Voice & Speech': { bg: 'bg-orange-100', text: 'text-orange-700' },
      'Data Analytics': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
      'Recommendation Systems': { bg: 'bg-amber-100', text: 'text-amber-700' },
      'AI Applications': { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
      'AI Tools': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      'LLM': { bg: 'bg-purple-100', text: 'text-purple-700' },
      'Chatbots': { bg: 'bg-pink-100', text: 'text-pink-700' },
      'Training Data': { bg: 'bg-teal-100', text: 'text-teal-700' },
      'Revenue Generating': { bg: 'bg-green-100', text: 'text-green-700' },
      'Other': { bg: 'bg-gray-100', text: 'text-gray-700' }
    };
    return colors[category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  const getStageColor = (stage: string = '') => {
    const colors: Record<string, { bg: string; text: string }> = {
      'MVP': { bg: 'bg-green-100', text: 'text-green-700' },
      'Revenue': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Beta': { bg: 'bg-purple-100', text: 'text-purple-700' },
      'Production Ready': { bg: 'bg-teal-100', text: 'text-teal-700' },
      'Revenue Generating': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      'Scaling': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      'Prototype': { bg: 'bg-amber-100', text: 'text-amber-700' },
      'Idea': { bg: 'bg-orange-100', text: 'text-orange-700' }
    };
    return colors[stage] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {requiresNda && (
        <Badge 
          variant="outline" 
          className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 border-0 font-medium text-xs shadow-sm flex items-center"
        >
          <LockIcon className="h-3 w-3 mr-1" />
          NDA Required
        </Badge>
      )}
      {category && (
        <Badge 
          variant="outline" 
          className={`px-3 py-1 rounded-full ${getCategoryColor(category).bg} ${getCategoryColor(category).text} border-0 font-medium text-xs shadow-sm`}
        >
          {category}
        </Badge>
      )}
      {stage && (
        <Badge 
          variant="outline" 
          className={`px-3 py-1 rounded-full ${getStageColor(stage).bg} ${getStageColor(stage).text} border-0 font-medium text-xs shadow-sm`}
        >
          {stage}
        </Badge>
      )}
    </div>
  );
}
