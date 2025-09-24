import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PipelineStage, createPipelineStages } from "./PipelineStage";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ExternalLink, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Deal {
  id: string;
  product_id: string;
  product_title: string;
  buyer_id: string;
  seller_id: string;
  buyer_name: string;
  seller_name: string;
  amount: number;
  escrow_status: string | null;
  conversation_id: string;
  nda_signed: boolean;
  created_at: string;
  is_buyer: boolean;
}

interface DealCardProps {
  deal: Deal;
  isExample?: boolean;
}

export const DealCard = ({ deal, isExample = false }: DealCardProps) => {
  const userRole = deal.is_buyer ? 'buyer' : 'seller';
  const stages = createPipelineStages(deal.escrow_status, deal.nda_signed, userRole);
  const completedStages = stages.filter(stage => stage.status === 'completed').length;
  const progressPercentage = (completedStages / stages.length) * 100;
  
  const currentStage = stages.find(stage => stage.status === 'current');
  const nextStage = stages.find(stage => stage.status === 'pending');

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500';
      case 'payment_secured':
        return 'bg-blue-500';
      case 'delivery_in_progress':
        return 'bg-amber-500';
      case 'inspection_period':
        return 'bg-purple-500';
      case 'disputed':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-primary';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTooltipContent = (stageTitle: string) => {
    switch (stageTitle) {
      case 'NDA Signed':
        return 'Non-disclosure agreement has been signed by the buyer';
      case 'Escrow Created':
        return 'Buyer has signed and initiated funds into escrow';
      case 'Payment Secured':
        return 'Buyer payment is secured and held in escrow';
      case 'Delivery':
        return 'Seller is delivering the agreed-upon assets';
      case 'Inspection':
        return 'Buyer is reviewing and inspecting delivered assets';
      case 'Completed':
        return 'Transaction completed successfully and funds released';
      default:
        return stageTitle;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TooltipProvider>
      <Card className="border border-border/50 bg-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-foreground">{deal.product_title}</h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/80">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {formatCurrency(deal.amount)}
              </span>
              <span>Started {format(new Date(deal.created_at), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/70 mt-1">
              <span className="flex items-center gap-2">
                <strong>Buyer:</strong>
                <Avatar className="h-4 w-4">
                  <AvatarImage src="" alt={deal.buyer_name} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {getInitials(deal.buyer_name)}
                  </AvatarFallback>
                </Avatar>
                {isExample ? (
                  <span className="text-primary">{deal.buyer_name}</span>
                ) : (
                  <Link 
                    to={`/profile/${deal.buyer_id}`} 
                    className="text-primary hover:text-primary/80 transition-colors underline"
                  >
                    {deal.buyer_name}
                  </Link>
                )}
              </span>
              <span className="flex items-center gap-2">
                <strong>Seller:</strong>
                <Avatar className="h-4 w-4">
                  <AvatarImage src="" alt={deal.seller_name} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {getInitials(deal.seller_name)}
                  </AvatarFallback>
                </Avatar>
                {isExample ? (
                  <span className="text-primary">{deal.seller_name}</span>
                ) : (
                  <Link 
                    to={`/profile/${deal.seller_id}`} 
                    className="text-primary hover:text-primary/80 transition-colors underline"
                  >
                    {deal.seller_name}
                  </Link>
                )}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`${getStatusColor(deal.escrow_status)} text-white`}
            >
              {currentStage?.title || 'Initial Interest'}
            </Badge>
            {isExample ? (
              <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
                <MessageSquare className="h-3 w-3" />
                Chat
              </Button>
            ) : (
              <Link to={`/chat/${deal.conversation_id}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Chat
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedStages} of {stages.length} stages completed</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Current Stage Info */}
        {currentStage && (
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="bg-primary p-2 rounded-full">
                {currentStage.icon}
              </div>
              <div>
                <h4 className="font-medium text-sm">Current Stage: {currentStage.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentStage.description}
                </p>
                {nextStage && (
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Next:</strong> {nextStage.title}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pipeline Visual - Responsive */}
        <div className="space-y-4">
          {/* Desktop: Horizontal Pipeline */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex flex-col items-center space-y-2 flex-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center w-full cursor-help">
                        <div className={`
                          w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                          ${stage.status === 'completed' 
                            ? 'bg-emerald-500 border-emerald-400' 
                            : stage.status === 'current'
                              ? 'bg-primary border-primary'
                              : 'bg-muted border-muted-foreground/20'
                          }
                        `}>
                          {stage.icon}
                        </div>
                        {index < stages.length - 1 && (
                          <div className={`
                            flex-1 h-px mx-2 transition-colors duration-300
                            ${stage.status === 'completed' ? 'bg-emerald-500' : 'bg-muted-foreground/20'}
                          `} />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getTooltipContent(stage.title)}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className={`
                    text-xs text-center px-1 transition-colors duration-300
                    ${stage.status === 'completed' && 'text-emerald-600'}
                    ${stage.status === 'current' && 'text-primary font-medium'}
                    ${stage.status === 'pending' && 'text-muted-foreground'}
                  `}>
                    {stage.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Pipeline */}
          <div className="md:hidden space-y-0">
            {stages.map((stage, index) => (
              <PipelineStage 
                key={stage.id} 
                stage={stage} 
                isLast={index === stages.length - 1}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};