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

export function EmberLayout({ projects, error }: LayoutProps) {
  const { variantId, setVariantId } = useVariant();

  return (
    <div className="ember-layout">
      {/* Sidebar on desktop, Top nav on mobile */}
      <aside className="ember-sidebar">
        <div className="ember-sidebar-top">
          <Link href="/" className="font-bold text-lg tracking-tight">
            ClassPortfolio
          </Link>
          <div className="ember-nav-links">
            <Link href="/" className="ember-link">Gallery</Link>
            <Link href="/upload" className="ember-link flex items-center gap-2">
              <Plus size={16} /> Upload
            </Link>
          </div>
        </div>
        <div className="ember-sidebar-bottom">
          <select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value as any)}
            className="ember-select"
          >
            {siteVariants.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      </aside>

      <main className="ember-main">
        {error && <div className="bg-accent/10 text-accent p-4 text-sm mb-6 rounded">{error}</div>}

        <header className="mb-8">
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-secondary text-sm">Showing {projects.length} uploaded projects.</p>
        </header>

        {projects.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl font-bold mb-2">No projects yet</p>
            <Link href="/upload" className="btn btn-primary px-6 py-2">
              <Plus size={16} className="mr-2" /> Upload your first
            </Link>
          </div>
        ) : (
          <div className="ember-grid">
            {projects.map((project) => {
              const Icon = project.mediaType === 'image' ? ImageIcon : project.mediaType === 'video' ? Video : LinkIcon;
              const displayImage = project.thumbnailUrl || project.mediaUrl;

              return (
                <Link key={project.id} href={`/project/${project.id}`} className="ember-card">
                  <div className="ember-card-media">
                    {(project.mediaType === 'image' || project.thumbnailUrl) ? (
                      <img src={displayImage} alt={project.title} />
                    ) : (
                      <div className="ember-card-placeholder">
                        <Icon size={32} />
                      </div>
                    )}
                  </div>
                  <div className="ember-card-info">
                    <h3 className="font-bold text-sm truncate">{project.title}</h3>
                    <p className="text-xs text-secondary capitalize">{project.mediaType}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
