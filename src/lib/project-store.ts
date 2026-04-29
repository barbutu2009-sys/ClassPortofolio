import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { createSupabaseServerClient, isSupabaseConfigured, SUPABASE_BUCKET } from "@/lib/supabase";
import { MEDIA_TYPES, type CreateProjectInput, type MediaType, type Project } from "@/types/project";

type ProjectRow = {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: MediaType;
  thumbnail_url: string | null;
  created_at: string;
};

const dataFilePath = path.join(process.cwd(), "data", "projects.json");
const uploadsDirectory = path.join(process.cwd(), "public", "uploads");

const imageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const videoMimeTypes = new Set(["video/mp4", "video/webm"]);

function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    mediaType: row.media_type,
    mediaUrl: row.media_url,
    thumbnailUrl: row.thumbnail_url,
    createdAt: row.created_at
  };
}

function normalizeMediaType(value: string): MediaType {
  if (!MEDIA_TYPES.includes(value as MediaType)) {
    throw new Error("Select a valid content type.");
  }

  return value as MediaType;
}

function validateText(title: string, description: string) {
  const cleanTitle = title.trim();
  const cleanDescription = description.trim();

  if (cleanTitle.length < 3) {
    throw new Error("Title must be at least 3 characters long.");
  }

  if (cleanTitle.length > 120) {
    throw new Error("Title must stay under 120 characters.");
  }

  if (cleanDescription.length > 600) {
    throw new Error("Description must stay under 600 characters.");
  }

  return {
    title: cleanTitle,
    description: cleanDescription
  };
}

function normalizeLink(linkUrl: string | undefined) {
  if (!linkUrl) {
    throw new Error("Add a valid project link.");
  }

  try {
    return new URL(linkUrl.trim()).toString();
  } catch {
    throw new Error("Add a valid project link.");
  }
}

function validateFile(mediaType: MediaType, file: File | null | undefined) {
  if (!file || file.size === 0) {
    throw new Error("Add a file before submitting.");
  }

  if (mediaType === "image" && !imageMimeTypes.has(file.type)) {
    throw new Error("Images must be JPG, PNG, WEBP, or SVG.");
  }

  if (mediaType === "video" && !videoMimeTypes.has(file.type)) {
    throw new Error("Videos must be MP4 or WEBM.");
  }

  const maxSizeInBytes = mediaType === "video" ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error(mediaType === "video" ? "Videos must stay under 25 MB." : "Images must stay under 10 MB.");
  }

  return file;
}

async function readLocalProjects() {
  const raw = await readFile(dataFilePath, "utf8");
  const parsed = JSON.parse(raw) as Project[];

  return parsed.sort((left, right) => {
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

async function writeLocalProjects(projects: Project[]) {
  await writeFile(dataFilePath, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
}

async function saveFileLocally(file: File) {
  await mkdir(uploadsDirectory, { recursive: true });

  const extension = path.extname(file.name) || ".bin";
  const fileName = `${Date.now()}-${randomUUID()}${extension.toLowerCase()}`;
  const outputPath = path.join(uploadsDirectory, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(outputPath, bytes);

  return `/uploads/${fileName}`;
}

async function createLocalProject(input: CreateProjectInput) {
  const { title, description } = validateText(input.title, input.description);
  const mediaType = normalizeMediaType(input.mediaType);

  let mediaUrl = "";
  let thumbnailUrl: string | null = null;

  if (mediaType === "link") {
    mediaUrl = normalizeLink(input.linkUrl);
    thumbnailUrl = "/placeholders/prototype.svg";
  } else {
    const file = validateFile(mediaType, input.file);
    mediaUrl = await saveFileLocally(file);
    thumbnailUrl = mediaType === "video" ? "/placeholders/motion.svg" : mediaUrl;
  }

  const project: Project = {
    id: randomUUID(),
    title,
    description,
    mediaType,
    mediaUrl,
    thumbnailUrl,
    createdAt: new Date().toISOString()
  };

  const projects = await readLocalProjects();
  projects.unshift(project);
  await writeLocalProjects(projects);

  return project;
}

async function createSupabaseProject(input: CreateProjectInput) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { title, description } = validateText(input.title, input.description);
  const mediaType = normalizeMediaType(input.mediaType);

  let mediaUrl = "";
  let thumbnailUrl: string | null = null;

  if (mediaType === "link") {
    mediaUrl = normalizeLink(input.linkUrl);
    thumbnailUrl = "/placeholders/prototype.svg";
  } else {
    const file = validateFile(mediaType, input.file);
    const extension = path.extname(file.name) || ".bin";
    const objectPath = `${Date.now()}-${randomUUID()}${extension.toLowerCase()}`;

    const uploadResponse = await supabase.storage.from(SUPABASE_BUCKET).upload(objectPath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false
    });

    if (uploadResponse.error) {
      throw new Error(uploadResponse.error.message);
    }

    const publicUrl = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
    mediaUrl = publicUrl;
    thumbnailUrl = mediaType === "video" ? "/placeholders/motion.svg" : publicUrl;
  }

  const insertResponse = await supabase
    .from("projects")
    .insert({
      title,
      description,
      media_url: mediaUrl,
      media_type: mediaType,
      thumbnail_url: thumbnailUrl
    })
    .select("id, title, description, media_url, media_type, thumbnail_url, created_at")
    .single<ProjectRow>();

  if (insertResponse.error) {
    throw new Error(insertResponse.error.message);
  }

  return mapProjectRow(insertResponse.data);
}

export async function listProjects() {
  if (!isSupabaseConfigured) {
    return readLocalProjects();
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return readLocalProjects();
  }

  const response = await supabase
    .from("projects")
    .select("id, title, description, media_url, media_type, thumbnail_url, created_at")
    .order("created_at", { ascending: false });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data.map(mapProjectRow);
}

export async function getProjectById(projectId: string) {
  if (!isSupabaseConfigured) {
    const projects = await readLocalProjects();
    return projects.find((project) => project.id === projectId) ?? null;
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const response = await supabase
    .from("projects")
    .select("id, title, description, media_url, media_type, thumbnail_url, created_at")
    .eq("id", projectId)
    .maybeSingle<ProjectRow>();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data ? mapProjectRow(response.data) : null;
}

export async function createProject(input: CreateProjectInput) {
  if (!isSupabaseConfigured) {
    return createLocalProject(input);
  }

  return createSupabaseProject(input);
}
