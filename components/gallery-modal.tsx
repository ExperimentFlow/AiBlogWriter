"use client";

import { useState, useEffect } from "react";
import { useGallery } from "@/contexts/gallery-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  Image,
  Video,
  File,
  Plus,
  Search,
  Filter,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { MediaItem } from "@/types/media";
import { MediaUploader } from "@/components/media-uploader";

export function GalleryModal() {
  const {
    isOpen,
    closeGallery,
    onImageSelect,
    setSelectedImage,
    selectedImage,
    clearOnImageSelect,
  } = useGallery();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "image" | "video" | "file"
  >("all");
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMediaItems();
    }
  }, [isOpen, onImageSelect]);

  const fetchMediaItems = async () => {
    setLoading(true);
    try {
      console.log("Fetching media items...");
      const response = await fetch("/api/gallery");
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Media data:", data);
        setMediaItems(data.media || []);
      } else {
        const errorData = await response.json();
        console.error("Gallery API error:", errorData);
        // Show error message to user
        alert(`Failed to load gallery: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error fetching media items:", error);
      alert("Failed to load gallery. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newItem: MediaItem) => {
    setMediaItems((prev: MediaItem[]) => [newItem, ...prev]);
    setShowUploader(false);
  };

  const handleImageSelect = (item: MediaItem) => {
    if (onImageSelect) {
      onImageSelect(item);
      clearOnImageSelect();
      closeGallery();
    } else {
      setSelectedImage(item);
    }
  };

  const handleSelectImage = (item: MediaItem) => {
    if (onImageSelect) {
      onImageSelect(item);
      clearOnImageSelect();
    }
    closeGallery();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMediaItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedImage?.id === id) {
          setSelectedImage(null);
        }
      }
    } catch (error) {
      console.error("Error deleting media item:", error);
    }
  };

  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-5 w-5 text-green-600" />;
      case "video":
        return <Video className="h-5 w-5 text-purple-600" />;
      default:
        return <File className="h-5 w-5 text-blue-600" />;
    }
  };

  const getMediaPreview = (item: MediaItem) => {
    if (item.type === "image") {
      return (
        <img
          src={item.url}
          alt={item.alt || item.name}
          className="w-full h-full object-cover rounded"
          loading="lazy"
        />
      );
    } else if (item.type === "video") {
      return (
        <video
          src={item.url}
          className="w-full h-full object-cover rounded"
          preload="metadata"
        />
      );
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
          <File className="h-8 w-8 text-gray-400" />
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Media Gallery
            </h2>
            <p className="text-sm text-gray-600">
              Select an image or upload new media
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploader(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button variant="ghost" size="sm" onClick={closeGallery}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="file">Files</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading gallery...</p>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No media files found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Upload your first image, video, or document to get started."}
              </p>
              <Button onClick={() => setShowUploader(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={`group hover:shadow-md transition-all cursor-pointer ${
                    selectedImage?.id === item.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => {
                    console.log("GalleryModal: Image clicked:", item);
                    handleImageSelect(item);
                  }}
                >
                  <CardContent className="p-0">
                    {/* Media Preview */}
                    <div className="relative aspect-square overflow-hidden">
                      {getMediaPreview(item)}

                      {/* Selection Indicator */}
                      {selectedImage?.id === item.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-5 w-5 text-blue-600 bg-white rounded-full" />
                        </div>
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.type === "image"
                              ? "bg-green-100 text-green-800"
                              : item.type === "video"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-2">
                      <div className="flex items-center gap-1 mb-1">
                        {getFileIcon(item.type)}
                        <h4
                          className="font-medium text-gray-900 text-xs truncate"
                          title={item.name}
                        >
                          {item.name}
                        </h4>
                      </div>

                      {item.alt && (
                        <p
                          className="text-xs text-gray-500 truncate"
                          title={item.alt}
                        >
                          {item.alt}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedImage && !onImageSelect && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12">
                  {getMediaPreview(selectedImage)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedImage.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedImage.width && selectedImage.height
                      ? `${selectedImage.width} × ${selectedImage.height}`
                      : selectedImage.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedImage(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSelectImage(selectedImage)}
                >
                  Select Image
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploader && (
          <MediaUploader
            onClose={() => setShowUploader(false)}
            onSuccess={handleUploadSuccess}
          />
        )}
      </div>
    </div>
  );
}
