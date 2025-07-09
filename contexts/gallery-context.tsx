'use client';

import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { MediaItem } from '@/types/media';

interface GalleryContextType {
  isOpen: boolean;
  openGallery: () => void;
  closeGallery: () => void;
  selectedImage: MediaItem | null;
  setSelectedImage: (image: MediaItem | null) => void;
  onImageSelect?: (image: MediaItem) => void;
  setOnImageSelect: (callback: ((image: MediaItem) => void) | undefined) => void;
  clearOnImageSelect: () => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const onImageSelectRef = useRef<((image: MediaItem) => void) | undefined>(undefined);

  const openGallery = () => {
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
    setSelectedImage(null);
    onImageSelectRef.current = undefined;
  };

  const setOnImageSelect = (callback: ((image: MediaItem) => void) | undefined) => {
    console.log("GalleryContext: setOnImageSelect", callback);
    onImageSelectRef.current = callback;
  };

  const clearOnImageSelect = () => {
    console.log("GalleryContext: clearOnImageSelect");
    onImageSelectRef.current = undefined;
  };

  return (
    <GalleryContext.Provider
      value={{
        isOpen,
        openGallery,
        closeGallery,
        selectedImage,
        setSelectedImage,
        onImageSelect: onImageSelectRef.current,
        setOnImageSelect,
        clearOnImageSelect,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
} 