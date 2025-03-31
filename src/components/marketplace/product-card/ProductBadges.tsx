
import { Badge } from "@/components/ui/badge";

interface ProductBadgesProps {
  category?: string;
  stage?: string;
}

export function ProductBadges({ category, stage }: ProductBadgesProps) {
  const getCategoryColor = (category: string = '') => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Content Generation': { bg: 'bg-purple-500', text: 'text-white' },
      'Customer Service': { bg: 'bg-blue-500', text: 'text-white' },
      'Image Generation': { bg: 'bg-pink-500', text: 'text-white' },
      'Development Tools': { bg: 'bg-indigo-500', text: 'text-white' },
      'Audio Processing': { bg: 'bg-cyan-500', text: 'text-white' },
      'Video Processing': { bg: 'bg-rose-500', text: 'text-white' },
      'Finance': { bg: 'bg-emerald-500', text: 'text-white' },
      'Automation': { bg: 'bg-sky-500', text: 'text-white' },
      'Natural Language Processing': { bg: 'bg-violet-500', text: 'text-white' },
      'Other': { bg: 'bg-gray-500', text: 'text-white' },
      'Revenue Generating': { bg: 'bg-green-500', text: 'text-white' }
    };
    return colors[category] || { bg: 'bg-gray-500', text: 'text-white' };
  };

  const getStageColor = (stage: string = '') => {
    const colors: Record<string, { bg: string; text: string }> = {
      'MVP': { bg: 'bg-green-500', text: 'text-white' },
      'Revenue': { bg: 'bg-blue-500', text: 'text-white' },
      'Beta': { bg: 'bg-purple-500', text: 'text-white' },
      'Production Ready': { bg: 'bg-teal-500', text: 'text-white' },
      'Revenue Generating': { bg: 'bg-emerald-500', text: 'text-white' },
      'Scaling': { bg: 'bg-indigo-500', text: 'text-white' },
      'Prototype': { bg: 'bg-amber-500', text: 'text-white' },
      'Idea': { bg: 'bg-orange-500', text: 'text-white' }
    };
    return colors[stage] || { bg: 'bg-gray-500', text: 'text-white' };
  };

  return (
    <div className="flex flex-wrap gap-2">
      {category && (
        <Badge 
          variant="outline" 
          className={`rounded-full px-4 py-1 ${getCategoryColor(category).bg} ${getCategoryColor(category).text} border-0`}
        >
          {category}
        </Badge>
      )}
      {stage && (
        <Badge 
          variant="outline" 
          className={`rounded-full px-4 py-1 ${getStageColor(stage).bg} ${getStageColor(stage).text} border-0`}
        >
          {stage}
        </Badge>
      )}
    </div>
  );
}
