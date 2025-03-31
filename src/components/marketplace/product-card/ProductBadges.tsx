
import { Badge } from "@/components/ui/badge";

interface ProductBadgesProps {
  category?: string;
  stage?: string;
}

export function ProductBadges({ category, stage }: ProductBadgesProps) {
  const getCategoryColor = (category: string = '') => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Content Generation': { bg: 'bg-purple-100', text: 'text-purple-700' },
      'Customer Service': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Image Generation': { bg: 'bg-pink-100', text: 'text-pink-700' },
      'Development Tools': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      'Audio Processing': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
      'Video Processing': { bg: 'bg-rose-100', text: 'text-rose-700' },
      'Finance': { bg: 'bg-emerald-100', text: 'text-emerald-700' }
    };
    return colors[category] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  const getStageColor = (stage: string = '') => {
    const colors: Record<string, { bg: string; text: string }> = {
      'Revenue': { bg: 'bg-blue-100', text: 'text-blue-700' },
      'MVP': { bg: 'bg-green-100', text: 'text-green-700' },
      'Prototype': { bg: 'bg-amber-100', text: 'text-amber-700' },
      'Idea': { bg: 'bg-orange-100', text: 'text-orange-700' }
    };
    return colors[stage] || { bg: 'bg-gray-100', text: 'text-gray-700' };
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
