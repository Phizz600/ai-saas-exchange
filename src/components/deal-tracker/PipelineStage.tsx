import { Check, Clock, Eye, Bookmark, UserPlus, Handshake, Phone, FileSearch, FileSignature, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Stage {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'pending';
}

interface PipelineStageProps {
  stage: Stage;
  isLast?: boolean;
}

export const PipelineStage = ({ stage, isLast }: PipelineStageProps) => {
  const getStageIcon = () => {
    switch (stage.status) {
      case 'completed':
        return <Check className="h-4 w-4 text-white" />;
      case 'current':
        return stage.icon;
      case 'pending':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return stage.icon;
    }
  };

  const getStageColors = () => {
    switch (stage.status) {
      case 'completed':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400';
      case 'current':
        return 'bg-gradient-to-r from-[#D946EE] to-[#8B5CF6] border-[#D946EE]';
      case 'pending':
        return 'bg-muted border-muted-foreground/20';
      default:
        return 'bg-muted border-muted-foreground/20';
    }
  };

  return (
    <div className="flex items-start space-x-4">
      {/* Stage Circle */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          getStageColors()
        )}>
          {getStageIcon()}
        </div>
        {!isLast && (
          <div className={cn(
            "w-px h-12 mt-2 transition-colors duration-300",
            stage.status === 'completed' 
              ? 'bg-gradient-to-b from-emerald-500 to-emerald-300' 
              : 'bg-muted-foreground/20'
          )} />
        )}
      </div>
      
      {/* Stage Content */}
      <div className="flex-1 pb-8">
        <h3 className={cn(
          "font-semibold text-sm transition-colors duration-300",
          stage.status === 'completed' && 'text-[#17bd75]',
          stage.status === 'current' && 'text-primary',
          stage.status === 'pending' && 'text-foreground/80'
        )}>
          {stage.title}
        </h3>
        <p className="text-xs text-foreground/70 mt-1">
          {stage.description}
        </p>
      </div>
    </div>
  );
};

export const createPipelineStages = (
  dealStatus: string | null,
  userRole: 'buyer' | 'seller'
): Stage[] => {
  const stages = [
    {
      id: 'viewed',
      title: 'Viewed',
      description: userRole === 'buyer' ? 'You viewed this listing' : 'Buyer viewed your listing',
      icon: <Eye className="h-4 w-4 text-white" />,
    },
    {
      id: 'saved',
      title: 'Saved',
      description: userRole === 'buyer' ? 'You saved this listing' : 'Buyer saved your listing',
      icon: <Bookmark className="h-4 w-4 text-white" />,
    },
    {
      id: 'intro_requested',
      title: 'Intro Requested',
      description: userRole === 'buyer' ? 'You requested an introduction' : 'Buyer requested introduction',
      icon: <UserPlus className="h-4 w-4 text-white" />,
    },
    {
      id: 'intro_completed',
      title: 'Intro Completed',
      description: 'Contact details exchanged',
      icon: <Handshake className="h-4 w-4 text-white" />,
    },
    {
      id: 'call_scheduled',
      title: 'Call Scheduled',
      description: 'First call confirmed between parties',
      icon: <Phone className="h-4 w-4 text-white" />,
    },
    {
      id: 'due_diligence',
      title: 'Due Diligence Started',
      description: userRole === 'buyer' ? 'Reviewing business data' : 'Buyer reviewing data',
      icon: <FileSearch className="h-4 w-4 text-white" />,
    },
    {
      id: 'loi_sent',
      title: 'LOI Sent',
      description: 'Letter of Intent submitted',
      icon: <FileSignature className="h-4 w-4 text-white" />,
    },
    {
      id: 'deal_closed',
      title: 'Deal Reported Closed',
      description: 'Successful acquisition reported',
      icon: <Trophy className="h-4 w-4 text-white" />,
    },
  ];

  // Determine current stage based on deal status
  let currentStageIndex = 0;

  switch (dealStatus) {
    case 'viewed':
      currentStageIndex = 0;
      break;
    case 'saved':
      currentStageIndex = 1;
      break;
    case 'intro_requested':
      currentStageIndex = 2;
      break;
    case 'intro_completed':
      currentStageIndex = 3;
      break;
    case 'call_scheduled':
      currentStageIndex = 4;
      break;
    case 'due_diligence':
      currentStageIndex = 5;
      break;
    case 'loi_sent':
      currentStageIndex = 6;
      break;
    case 'deal_closed':
      currentStageIndex = 7;
      break;
    default:
      currentStageIndex = 0;
  }

  return stages.map((stage, index) => ({
    ...stage,
    status: index < currentStageIndex 
      ? 'completed' 
      : index === currentStageIndex 
        ? 'current' 
        : 'pending'
  }));
};