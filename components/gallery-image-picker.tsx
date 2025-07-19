"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Image, Plus, X } from "lucide-react";
import { useGallerySelect } from "@/hooks/use-gallery-select";
import { MediaItem } from "@/types/media";

interface GalleryImagePickerProps {
  value?: MediaItem | null;
  onChange?: (image: MediaItem | null) => void;
  placeholder?: string;
  className?: string;
}

export function GalleryImagePicker({
  value,
  onChange,
  placeholder = "Select an image",
  className = "",
}: GalleryImagePickerProps) {
  const { selectImage } = useGallerySelect();

  const handleSelectImage = (image: MediaItem) => {
    console.log("GalleryImagePicker: Image selected:", image);
    if (image && onChange) {
      console.log("GalleryImagePicker: Calling onChange with image:", image);
      onChange(image);
    } else {
      console.log("GalleryImagePicker: No onChange callback or no image");
    }
  };

  const handleRemoveImage = () => {
    if (onChange) {
      onChange(null);
    }
  };

  const handleOpenGallery = () => {
    selectImage(handleSelectImage);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {value ? (
        <div className="relative group">
          <img
            src={value.url}
            alt={value.alt || value.name}
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleOpenGallery}>
                <Image className="h-4 w-4 mr-2" />
                Change
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              {value.width} × {value.height}
            </span>
          </div>
        </div>
      ) : (
        <div
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={handleOpenGallery}
        >
          <div className="text-center">
            <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">{placeholder}</p>
          </div>
        </div>
      )}

      {value && (
        <div className="text-sm text-gray-600">
          <p>
            <strong>Name:</strong> {value.name}
          </p>
          {value.alt && (
            <p>
              <strong>Alt Text:</strong> {value.alt}
            </p>
          )}
          {value.description && (
            <p>
              <strong>Description:</strong> {value.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
