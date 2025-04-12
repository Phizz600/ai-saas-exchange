
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImagePlus, X, AlertCircle } from "lucide-react";
import { PRODUCT_IMAGES_BUCKET } from "@/integrations/supabase/client";
import { logError } from "@/integrations/supabase/products";

interface ImageUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load preview if we already have a file
  useEffect(() => {
    if (value instanceof File) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.onerror = (e) => {
          console.error("Error reading file:", e);
          logError("ImageUpload-FileReader", e, { fileName: value.name });
          setUploadError("Error previewing image. Please try again.");
        };
        reader.readAsDataURL(value);
      } catch (error) {
        console.error("Error creating preview:", error);
        logError("ImageUpload-Preview", error, { fileName: value?.name });
        setUploadError("Failed to create image preview. Please try a different image.");
      }
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    
    if (!file) {
      return;
    }
    
    try {
      // Validate file type and size
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        setUploadError("Please select a valid image file (JPG, PNG, GIF, or WebP)");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError("Image is too large. Maximum size is 5MB");
        return;
      }
      
      console.log("File selected:", file.name, file.type, file.size);
      console.log("Upload will use bucket:", PRODUCT_IMAGES_BUCKET);
      
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
        logError("ImageUpload-FileReader", e, { fileName: file.name });
        setUploadError("Error reading image. Please try again.");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing file:", error);
      logError("ImageUpload-FileProcess", error, { fileName: file?.name });
      setUploadError("Failed to process image. Please try again.");
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
        {preview ? (
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
            <span className="mt-2 text-sm text-gray-500">
              Click to upload your logo
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
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
