"use client";
import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  onUpload,
  multiple = false,
  disabled = false,
  className = "",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadToCloudinary(file);
        onUpload(url);
      }
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        className="w-full"
        type="button"
        onClick={handleClick}
        disabled={isUploading || disabled}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload Images"}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading || disabled}
      />
    </div>
  );
}
