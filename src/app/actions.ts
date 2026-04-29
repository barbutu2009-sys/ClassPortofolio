'use server';

import { createProject } from '@/lib/project-store';
import { MediaType } from '@/types/project';
import { revalidatePath } from 'next/cache';

export async function submitProject(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const mediaType = formData.get('mediaType') as MediaType;
    const linkUrl = formData.get('linkUrl') as string | undefined;
    const file = formData.get('file') as File | null;

    await createProject({
      title,
      description,
      mediaType,
      linkUrl,
      file,
    });

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Submission error:', error);
    return { success: false, error: error.message || 'Something went wrong' };
  }
}
