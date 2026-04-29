'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useVariant } from '@/components/VariantProvider';
import { siteVariants } from '@/lib/variants';
import type { Project } from '@/types/project';
import { Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react';

interface LayoutProps {
  projects: Project[];
  error: string | null;
}

export function ChalkLayout({ projects, error }: LayoutProps) {
  const { variantId, setVariantId } = useVariant();

  return (
    <main className="min-h-screen">
      <header className="chalk-header">
        <div className="chalk-container flex-between">
          <Link href="/" className="chalk-logo">Class Portfolio</Link>
          <div className="chalk-nav">
            <Link href="/upload" className="chalk-link">Add Entry</Link>
            <select value={variantId} onChange={(e) => setVariantId(e.target.value as any)} className="chalk-select">
              {siteVariants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>
      </header>

      <div className="chalk-container py-12">
        {error && <div className="bg-accent/10 text-accent p-4 text-sm mb-6 rounded">{error}</div>}

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold mb-4">The journal is empty.</p>
            <Link href="/upload" className="btn btn-primary px-8 py-3">
              <Plus size={18} className="mr-2" /> Write first entry
            </Link>
          </div>
        ) : (
          <div className="chalk-feed">
            {projects.map((project) => {
              const Icon = project.mediaType === 'image' ? ImageIcon : project.mediaType === 'video' ? Video : LinkIcon;
              const displayImage = project.thumbnailUrl || project.mediaUrl;

              return (
                <article key={project.id} className="chalk-entry">
                  <div className="chalk-entry-media">
                    {(project.mediaType === 'image' || project.thumbnailUrl) ? (
                      <img src={displayImage} alt={project.title} />
                    ) : (
                      <div className="chalk-entry-placeholder"><Icon size={48} /></div>
                    )}
                  </div>
                  <div className="chalk-entry-content">
                    <span className="chalk-entry-date">
                      {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h2 className="chalk-entry-title">
                      <Link href={`/project/${project.id}`}>{project.title}</Link>
                    </h2>
                    {project.description && <p className="chalk-entry-desc">{project.description}</p>}
                    <Link href={`/project/${project.id}`} className="chalk-entry-read">Read more</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
