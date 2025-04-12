
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImagePlus, X, AlertCircle, Info } from "lucide-react";
import { PRODUCT_IMAGES_BUCKET } from "@/integrations/supabase/client";
import { logError } from "@/integrations/supabase/products";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load preview if we already have a file
  useEffect(() => {
    if (value instanceof File) {
      try {
        setIsLoading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          setIsLoading(false);
        };
        reader.onerror = (e) => {
          console.error("Error reading file:", e);
          logError("ImageUpload-FileReader", e, { fileName: value.name });
          setUploadError("Error previewing image. Please try again.");
          setIsLoading(false);
        };
        reader.readAsDataURL(value);
      } catch (error) {
        console.error("Error creating preview:", error);
        logError("ImageUpload-Preview", error, { fileName: value?.name });
        setUploadError("Failed to create image preview. Please try a different image.");
        setIsLoading(false);
      }
    } else {
      setPreview(null);
    }
  }, [value]);

  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      return { valid: false, error: "Please select a valid image file (JPG, PNG, GIF, or WebP)" };
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: "Image is too large. Maximum size is 5MB" };
    }
    
    return { valid: true };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    
    if (!file) {
      return;
    }
    
    try {
      // Validate file type and size
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setUploadError(validation.error);
        return;
      }
      
      console.log("File selected:", file.name, file.type, file.size);
      console.log("Upload will use bucket:", PRODUCT_IMAGES_BUCKET);
      
      setIsLoading(true);
      onChange(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsLoading(false);
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
        logError("ImageUpload-FileReader", e, { fileName: file.name });
        setUploadError("Error reading image. Please try again.");
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing file:", error);
      logError("ImageUpload-FileProcess", error, { fileName: file?.name });
      setUploadError("Failed to process image. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    console.log("Removing image");
    onChange(null);
    setPreview(null);
    setUploadError(null);
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors",
          preview ? "border-primary" : uploadError ? "border-red-500" : "border-gray-200"
        )}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-2 text-sm text-gray-500">Processing image...</span>
          </div>
        ) : preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Logo Preview"
              className="w-32 h-32 object-contain mx-auto"
              onError={(e) => {
                console.error("Error displaying image preview");
                logError("ImageUpload-ImgDisplay", new Error("Image preview display failed"), {});
                setUploadError("Error displaying image preview. Please try a different image.");
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
            <ImagePlus className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500 flex items-center gap-1">
              Click to upload your logo
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Best image specifications:</p>
                    <ul className="list-disc ml-4 text-xs">
                      <li>Square aspect ratio (1:1)</li>
                      <li>JPG, PNG or WebP format</li>
                      <li>Max size: 5MB</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <span className="text-xs text-gray-400">
              (JPG, PNG, GIF or WebP, max 5MB)
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
      
      {uploadError && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-2 rounded">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
