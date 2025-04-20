
import { Badge } from "@/components/ui/badge";
import { Code2, Link, ShieldCheck } from "lucide-react";
import { hasValue } from "@/utils/productHelpers";

interface TechnicalDetailsProps {
  product: {
    stage?: string;
    llm_type?: string;
    llm_type_other?: string;
    tech_stack?: string[];
    tech_stack_other?: string;
    integrations?: string[];
    integrations_other?: string;
    demo_url?: string;
    has_patents?: boolean;
  };
}

export function TechnicalDetails({ product }: TechnicalDetailsProps) {
  // Check which technical details we have
  const hasStage = hasValue(product.stage);
  const hasLlmType = hasValue(product.llm_type) || hasValue(product.llm_type_other);
  const hasTechStack = hasValue(product.tech_stack) && product.tech_stack.length > 0;
  const hasTechStackOther = hasValue(product.tech_stack_other);
  const hasIntegrations = hasValue(product.integrations) && product.integrations && product.integrations.length > 0;
  const hasIntegrationsOther = hasValue(product.integrations_other);
  const hasDemoUrl = hasValue(product.demo_url);
  
  // Check if we have at least some technical details to display
  const hasTechnicalDetails = hasStage || hasLlmType || hasTechStack || hasTechStackOther || 
                             hasIntegrations || hasIntegrationsOther || hasDemoUrl || product.has_patents;
  
  // If no technical details at all, don't render this component
  if (!hasTechnicalDetails) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Code2 className="h-4 w-4" />
        <span>Technical Stack</span>
      </div>
      <div className="space-y-3">
        {hasStage && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Development Stage</span>
            <span className="font-medium">{product.stage}</span>
          </div>
        )}
        
        {hasLlmType && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">LLM Model</span>
            <span className="font-medium">
              {product.llm_type_other || product.llm_type}
            </span>
          </div>
        )}

        {hasTechStack && (
          <div>
            <span className="text-gray-600 block mb-1">Tech Stack</span>
            <div className="flex flex-wrap gap-2">
              {product.tech_stack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {hasTechStackOther && (
          <div className="text-gray-600 mt-2">
            Additional tech: {product.tech_stack_other}
          </div>
        )}

        {(hasIntegrations || hasIntegrationsOther) && (
          <div className="mt-4">
            <span className="text-gray-600 block mb-1">Integrations</span>
            {hasIntegrations && (
              <div className="flex flex-wrap gap-2 mb-2">
                {product.integrations?.map((integration, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                    {integration}
                  </Badge>
                ))}
              </div>
            )}
            {hasIntegrationsOther && (
              <div className="text-gray-600 mt-2">
                Additional integrations: {product.integrations_other}
              </div>
            )}
          </div>
        )}

        {hasDemoUrl && (
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
            <span className="text-gray-600">Demo URL</span>
            <a 
              href={product.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline flex items-center gap-1"
            >
              Visit <Link className="h-3 w-3" />
            </a>
          </div>
        )}

        {product.has_patents && (
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck className="h-4 w-4" />
            <span>Patents Protected</span>
          </div>
        )}
      </div>
    </div>
  );
}
