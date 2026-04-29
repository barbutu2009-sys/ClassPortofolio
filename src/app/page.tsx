import { listProjects } from '@/lib/project-store';
import { HomeContent } from '@/components/HomeContent';

export const revalidate = 0; // Disable cache for demo purposes to see new uploads immediately

export default async function Home() {
  let projects: Awaited<ReturnType<typeof listProjects>> = [];
  let error: string | null = null;

  try {
    projects = await listProjects();
  } catch (e) {
    console.error('Failed to list projects:', e);
    error = 'Could not load projects. Please try again later.';
  }

  return <HomeContent projects={projects} error={error} />;
}
