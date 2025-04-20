
import { Card } from "@/components/ui/card";
import { Code, Link, Mail, Image, Database, FileLock, FileText, Briefcase, Wrench } from "lucide-react";

const DELIVERABLE_ICONS: Record<string, any> = {
  source_code: { icon: Code, label: "Source Code & Repository" },
  ip_rights: { icon: FileLock, label: "Intellectual Property Rights" },
  social_media: { icon: Link, label: "Social Media Accounts" },
  email_lists: { icon: Mail, label: "Email Lists & Subscribers" },
  brand_assets: { icon: Image, label: "Brand Assets & Marketing" },
  customer_data: { icon: Database, label: "Customer Database" },
  tech_docs: { icon: FileText, label: "Technical Documentation" },
  business_ops: { icon: Briefcase, label: "Business Operations & SOPs" },
  api_keys: { icon: Wrench, label: "API Keys & Integrations" },
  hosting: { icon: Link, label: "Domain Names & Hosting" }
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {deliverables.map((deliverable, index) => {
          const isCustom = deliverable.startsWith('custom:');
          const deliverableKey = isCustom ? 'custom' : deliverable;
          const IconComponent = isCustom ? Briefcase : DELIVERABLE_ICONS[deliverableKey]?.icon || Briefcase;
          const label = isCustom ? deliverable.replace('custom:', '') : DELIVERABLE_ICONS[deliverableKey]?.label || deliverable;
          
          return (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-100"
            >
              <IconComponent className="h-4 w-4 text-[#8B5CF6]" />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
