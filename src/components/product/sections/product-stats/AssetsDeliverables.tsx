
import { Card } from "@/components/ui/card";
import { Code, Link, Mail, Image, Database, FileLock, FileText, Briefcase, Wrench } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DELIVERABLE_ICONS: Record<string, any> = {
  source_code: { icon: Code, label: "Source Code & Repository", description: "Complete source code and repository access" },
  ip_rights: { icon: FileLock, label: "Intellectual Property Rights", description: "All intellectual property rights will be transferred" },
  social_media: { icon: Link, label: "Social Media Accounts", description: "Access to all social media accounts and followers" },
  email_lists: { icon: Mail, label: "Email Lists & Subscribers", description: "Customer and prospect email lists" },
  brand_assets: { icon: Image, label: "Brand Assets & Marketing", description: "Logos, designs, and marketing materials" },
  customer_data: { icon: Database, label: "Customer Database", description: "Complete customer database and history" },
  tech_docs: { icon: FileText, label: "Technical Documentation", description: "Complete technical documentation" },
  business_ops: { icon: Briefcase, label: "Business Operations & SOPs", description: "Standard operating procedures and business processes" },
  api_keys: { icon: Wrench, label: "API Keys & Integrations", description: "All API keys and third-party integrations" },
  hosting: { icon: Link, label: "Domain Names & Hosting", description: "Domain names and hosting credentials" }
};

interface AssetsDeliverablesProps {
  deliverables?: string[];
}

export function AssetsDeliverables({ deliverables = [] }: AssetsDeliverablesProps) {
  if (!deliverables.length) return null;

  return (
    <Card className="p-6 bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-4 exo-2-heading bg-gradient-to-r from-[#8B5CF6] to-[#D946EE] bg-clip-text text-transparent">
        Assets & Deliverables
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TooltipProvider>
          {deliverables.map((deliverable, index) => {
            const isCustom = deliverable.startsWith('custom:');
            const deliverableKey = isCustom ? 'custom' : deliverable;
            const IconComponent = isCustom ? Briefcase : DELIVERABLE_ICONS[deliverableKey]?.icon || Briefcase;
            const label = isCustom ? deliverable.replace('custom:', '') : DELIVERABLE_ICONS[deliverableKey]?.label || deliverable;
            const description = isCustom ? "Custom deliverable" : DELIVERABLE_ICONS[deliverableKey]?.description || "";
            
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-100 hover:border-[#8B5CF6]/30 hover:bg-gray-50/80 transition-all cursor-help">
                    <div className="bg-[#8B5CF6]/10 p-2 rounded-full">
                      <IconComponent className="h-4 w-4 text-[#8B5CF6]" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-500 italic">
          All assets and deliverables listed above are included in the purchase price and will be transferred upon completion of the transaction.
        </p>
      </div>
    </Card>
  );
}
