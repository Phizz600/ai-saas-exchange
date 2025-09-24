import { Check, Clock, AlertCircle, FileText, DollarSign, Shield, Eye, Handshake, Trophy } from "lucide-react";
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
          stage.status === 'completed' && 'text-emerald-600',
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
  escrowStatus: string | null,
  ndaSigned: boolean,
  userRole: 'buyer' | 'seller'
): Stage[] => {
  const stages = [
    {
      id: 'interest',
      title: 'Initial Interest',
      description: userRole === 'buyer' ? 'You expressed interest' : 'Buyer showed interest',
      icon: <Eye className="h-4 w-4 text-white" />,
    },
    {
      id: 'nda',
      title: 'NDA Signed',
      description: 'Non-disclosure agreement executed',
      icon: <FileText className="h-4 w-4 text-white" />,
    },
    {
      id: 'agreement',
      title: 'Agreement Reached',
      description: 'Initial terms agreed upon',
      icon: <Handshake className="h-4 w-4 text-white" />,
    },
    {
      id: 'escrow',
      title: 'Escrow Created',
      description: 'Payment protection established',
      icon: <Shield className="h-4 w-4 text-white" />,
    },
    {
      id: 'payment',
      title: 'Payment Secured',
      description: 'Funds deposited in escrow',
      icon: <DollarSign className="h-4 w-4 text-white" />,
    },
    {
      id: 'delivery',
      title: 'Asset Transfer',
      description: 'Business assets being transferred',
      icon: <AlertCircle className="h-4 w-4 text-white" />,
    },
    {
      id: 'inspection',
      title: 'Inspection Period',
      description: userRole === 'buyer' ? 'Review delivered assets' : 'Buyer reviewing assets',
      icon: <Eye className="h-4 w-4 text-white" />,
    },
    {
      id: 'completed',
      title: 'Successful Exit',
      description: 'Deal completed successfully',
      icon: <Trophy className="h-4 w-4 text-white" />,
    },
  ];

  // Determine current stage based on escrow status and NDA
  let currentStageIndex = 0;

  // Always mark initial interest as completed
  currentStageIndex = Math.max(currentStageIndex, 0);

  if (ndaSigned) {
    currentStageIndex = Math.max(currentStageIndex, 1);
  }

  switch (escrowStatus) {
    case 'agreement_reached':
      currentStageIndex = Math.max(currentStageIndex, 2);
      break;
    case 'escrow_created':
      currentStageIndex = Math.max(currentStageIndex, 3);
      break;
    case 'payment_secured':
      currentStageIndex = Math.max(currentStageIndex, 4);
      break;
    case 'delivery_in_progress':
      currentStageIndex = Math.max(currentStageIndex, 5);
      break;
    case 'inspection_period':
      currentStageIndex = Math.max(currentStageIndex, 6);
      break;
    case 'completed':
      currentStageIndex = 7;
      break;
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