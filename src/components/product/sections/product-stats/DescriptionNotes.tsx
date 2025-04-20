
import { FileText } from "lucide-react";
import { hasValue } from "@/utils/productHelpers";

interface DescriptionNotesProps {
  description?: string;
  special_notes?: string;
}

export function DescriptionNotes({ description, special_notes }: DescriptionNotesProps) {
  // Check if we have any description or notes to display
  const hasDescription = hasValue(description);
  const hasNotes = hasValue(special_notes);
  
  // If neither description nor notes, don't render this component
  if (!hasDescription && !hasNotes) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <FileText className="h-4 w-4" />
        <span>Description & Notes</span>
      </div>
      
      {hasDescription && (
        <div className="mb-6">
          <h3 className="text-base font-medium mb-2 text-gray-700">Product Description</h3>
          <div className="border-l-4 border-l-blue-400 pl-4 py-2 text-gray-600 whitespace-pre-wrap">
            {description}
          </div>
        </div>
      )}
      
      {hasNotes && (
        <div>
          <h3 className="text-base font-medium mb-2 text-gray-700">Special Notes</h3>
          <div className="border-l-4 border-l-amber-400 pl-4 py-2 text-gray-600 whitespace-pre-wrap">
            {special_notes}
          </div>
        </div>
      )}
    </div>
  );
}
