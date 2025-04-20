
import { Info, MessageSquareMore } from "lucide-react";

interface DescriptionNotesProps {
  special_notes?: string;
  description?: string;
}

export function DescriptionNotes({ special_notes, description }: DescriptionNotesProps) {
  if (!special_notes && !description) return null;

  return (
    <>
      {special_notes && (
        <div className="col-span-full">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Info className="h-4 w-4" />
            <span>Special Notes</span>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap p-3 bg-gray-50 rounded-md">{special_notes}</p>
        </div>
      )}
      
      {description && (
        <div className="col-span-full">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MessageSquareMore className="h-4 w-4" />
            <span>Full Description</span>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap p-3 bg-gray-50 rounded-md">{description}</p>
        </div>
      )}
    </>
  );
}
