
import { Badge } from "@/components/ui/badge";
import { Code2, Link, ShieldCheck } from "lucide-react";

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
  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Code2 className="h-4 w-4" />
        <span>Technical Stack</span>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">Development Stage</span>
          <span className="font-medium">{product.stage || "Not specified"}</span>
        </div>
        
        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
          <span className="text-gray-600">LLM Model</span>
          <span className="font-medium">
            {product.llm_type_other || product.llm_type || "Not specified"}
          </span>
        </div>

        {product.tech_stack && product.tech_stack.length > 0 && (
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
        
        {product.tech_stack_other && (
          <div className="text-gray-600 mt-2">
            Additional tech: {product.tech_stack_other}
          </div>
        )}

        {(product.integrations?.length > 0 || product.integrations_other) && (
          <div className="mt-4">
            <span className="text-gray-600 block mb-1">Integrations</span>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.integrations?.map((integration, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                  {integration}
                </Badge>
              ))}
            </div>
            {product.integrations_other && (
              <div className="text-gray-600 mt-2">
                Additional integrations: {product.integrations_other}
              </div>
            )}
          </div>
        )}

        {product.demo_url && (
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
