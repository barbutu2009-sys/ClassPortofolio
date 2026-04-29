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

export function PhosphorLayout({ projects, error }: LayoutProps) {
  const { variantId, setVariantId } = useVariant();

  return (
    <main className="min-h-screen">
      <nav className="phosphor-nav">
        <div className="phosphor-container flex-between">
          <Link href="/" className="phosphor-logo">&gt; SYS_INDEX</Link>
          <div className="phosphor-controls">
            <Link href="/upload" className="phosphor-cmd">[+ADD]</Link>
            <select value={variantId} onChange={(e) => setVariantId(e.target.value as any)} className="phosphor-select">
              {siteVariants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>
      </nav>

      <div className="phosphor-container py-8">
        {error && <div className="phosphor-error">ERR: {error}</div>}

        <div className="phosphor-stats mb-6">
          <p>TOTAL_FILES: {projects.length}</p>
        </div>

        {projects.length === 0 ? (
          <div className="py-12 text-center text-sm">
            <p>NO_DATA_FOUND</p>
            <Link href="/upload" className="text-primary hover:underline mt-4 inline-block">RUN [+ADD]</Link>
          </div>
        ) : (
          <div className="phosphor-list">
            {projects.map((project) => {
              const Icon = project.mediaType === 'image' ? ImageIcon : project.mediaType === 'video' ? Video : LinkIcon;
              const displayImage = project.thumbnailUrl || project.mediaUrl;

              return (
                <Link key={project.id} href={`/project/${project.id}`} className="phosphor-row">
                  <div className="phosphor-row-thumb">
                    {(project.mediaType === 'image' || project.thumbnailUrl) ? (
                      <img src={displayImage} alt="" />
                    ) : (
                      <Icon size={18} className="text-secondary" />
                    )}
                  </div>
                  <div className="phosphor-row-details">
                    <span className="phosphor-row-title">{project.title}</span>
                    <div className="phosphor-row-meta">
                      <span>TYPE:{project.mediaType.toUpperCase()}</span>
                      <span className="hidden sm:inline"> | DATE:{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
