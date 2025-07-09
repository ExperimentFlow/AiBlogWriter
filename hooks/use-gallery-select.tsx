'use client';

import { useCallback } from 'react';
import { useGallery } from '@/contexts/gallery-context';
import { MediaItem } from '@/types/media';

export function useGallerySelect() {
  const { openGallery, setOnImageSelect } = useGallery();

  const selectImage = useCallback((onSelect: (image: MediaItem) => void) => {
    console.log("useGallerySelect: Setting onImageSelect callback", onSelect);
    setOnImageSelect(onSelect);
    openGallery();
  }, [openGallery, setOnImageSelect]);

  return { selectImage };
} 