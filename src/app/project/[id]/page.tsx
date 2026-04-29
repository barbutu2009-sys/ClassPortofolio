import { Navbar } from '@/components/Navbar';
import { ArrowLeft, ExternalLink, Calendar, Tag, Share2, Play, FileText, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { getProjectById } from '@/lib/project-store';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const Icon = project.mediaType === 'image' ? Tag : project.mediaType === 'video' ? Play : LinkIcon;

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="container mx-auto px-4 py-8 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Back to Gallery
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div className="overflow-hidden rounded-lg border bg-surface variant-transition shadow-sm">
            {project.mediaType === 'image' ? (
              <img
                src={project.mediaUrl}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            ) : project.mediaType === 'video' ? (
              <div className="aspect-video w-full bg-black flex items-center justify-center">
                <video 
                  src={project.mediaUrl} 
                  controls 
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-foreground/5">
                <LinkIcon size={64} className="text-secondary/20" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-[calc(var(--radius)*0.5)] bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold text-primary">
                <Icon size={12} />
                {project.mediaType.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-secondary font-medium">
                <Calendar size={14} />
                {new Date(project.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-8 text-foreground">
              {project.title}
            </h1>
            
            <div className="max-w-none mb-12">
              <p className="text-lg text-secondary leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-8 border-t">
              <a
                href={project.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-10 py-4 text-base font-bold shadow-md"
              >
                View Project
                <ExternalLink size={18} className="ml-2" />
              </a>
              <button className="btn border bg-surface px-10 py-4 text-base font-bold hover:bg-foreground/5">
                Share
                <Share2 size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
