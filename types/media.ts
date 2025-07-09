export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'file';
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  alt?: string;
  description?: string;
  tags?: string;
  tenantId: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
} 