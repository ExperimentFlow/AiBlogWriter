# Gallery Integration System

This document explains how to use the global gallery modal system that can be opened from anywhere in your application.

## Overview

The gallery system consists of:
- **GalleryProvider**: Context provider that manages the global gallery state
- **GalleryModal**: The main modal component that displays media items
- **useGallery**: Hook to access gallery context
- **useGallerySelect**: Hook for easy image selection
- **GalleryImagePicker**: Reusable component for image selection in forms

## Setup

The gallery system is already set up in your app. The `GalleryProvider` is wrapped around your entire application in `app/layout.tsx`, and the `GalleryModal` is rendered globally.

## Usage Examples

### 1. Simple Gallery Button (Navbar)

The navbar already includes a gallery button that opens the modal:

```tsx
import { useGallery } from '@/contexts/gallery-context';

function MyComponent() {
  const { openGallery } = useGallery();
  
  return (
    <button onClick={openGallery}>
      Open Gallery
    </button>
  );
}
```

### 2. Image Selection with Callback

Use the `useGallerySelect` hook for image selection with callbacks:

```tsx
import { useGallerySelect } from '@/hooks/use-gallery-select';
import { MediaItem } from '@/types/media';

function MyComponent() {
  const { selectImage } = useGallerySelect();
  
  const handleSelectImage = (image: MediaItem) => {
    console.log('Selected image:', image);
    // Do something with the selected image
  };
  
  return (
    <button onClick={() => selectImage(handleSelectImage)}>
      Select Image
    </button>
  );
}
```

### 3. Form Image Picker

Use the `GalleryImagePicker` component for form fields:

```tsx
import { GalleryImagePicker } from '@/components/gallery-image-picker';
import { MediaItem } from '@/types/media';

function MyForm() {
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  
  return (
    <form>
      <GalleryImagePicker
        value={selectedImage}
        onChange={setSelectedImage}
        placeholder="Select a hero image"
      />
    </form>
  );
}
```

### 4. Blog Thumbnail Integration

The blog create page now includes a featured image picker:

```tsx
// In app/admin/blog/create/page.tsx
import { GalleryImagePicker } from '@/components/gallery-image-picker';

function CreateBlogPage() {
  const [selectedThumbnail, setSelectedThumbnail] = useState<MediaItem | null>(null);
  
  const handleThumbnailChange = (image: MediaItem | null) => {
    setSelectedThumbnail(image);
    if (image) {
      setValue('thumbnailId', image.id);
    } else {
      setValue('thumbnailId', '');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Image</CardTitle>
      </CardHeader>
      <CardContent>
        <GalleryImagePicker
          value={selectedThumbnail}
          onChange={handleThumbnailChange}
          placeholder="Click to select a featured image"
        />
      </CardContent>
    </Card>
  );
}
```

## Gallery Modal Features

The gallery modal includes:
- Search functionality
- Filtering by media type
- Upload new media
- Image selection with visual feedback
- Delete functionality
- Preview with image details

## Database Schema

The blog posts now include thumbnail fields:
- `thumbnailId`: Reference to the media item
- `thumbnailUrl`: Direct URL to the image
- `thumbnailAlt`: Alt text for accessibility

## How to Use

1. **Navbar Gallery**: Click the gallery button in the navbar to browse all media
2. **Blog Creation**: Use the featured image picker when creating blog posts
3. **Custom Integration**: Use the hooks and components anywhere in your app
4. **Upload**: Upload new images directly from the gallery modal

The gallery system is now fully integrated and can be used throughout your application for image selection and management.

## Demo Page

Visit `/admin/gallery-demo`