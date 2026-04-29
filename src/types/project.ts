export const MEDIA_TYPES = ["image", "video", "link"] as const;

export type MediaType = (typeof MEDIA_TYPES)[number];

export interface Project {
  id: string;
  title: string;
  description: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string | null;
  createdAt: string;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  mediaType: MediaType;
  linkUrl?: string;
  file?: File | null;
}
