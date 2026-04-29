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

export function TundraLayout({ projects, error }: LayoutProps) {
  const { variantId, setVariantId } = useVariant();
  const [featured, ...rest] = projects;

  return (
    <main className="min-h-screen">
      <nav className="border-b bg-surface/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold tracking-tight">Class Portfolio</Link>
          <div className="flex items-center gap-4">
            <Link href="/upload" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
              <Plus size={16} /> Upload
            </Link>
            <select value={variantId} onChange={(e) => setVariantId(e.target.value as any)} className="bg-background border rounded px-2 py-1 text-xs outline-none cursor-pointer">
              {siteVariants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && <div className="bg-accent/10 text-accent p-4 mb-8 rounded">{error}</div>}

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-2">Clean slate.</h2>
            <p className="text-secondary mb-6">Upload a project to begin.</p>
            <Link href="/upload" className="btn btn-primary px-6 py-2">
              <Plus size={16} className="mr-2" /> Upload
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Item spans full width on mobile, 2 cols on tablet, 3 on desktop */}
            {featured && (
              <Link href={`/project/${featured.id}`} className="col-span-1 md:col-span-2 lg:col-span-3 group block">
                <div className="aspect-video md:aspect-[21/9] rounded-xl overflow-hidden bg-surface border relative mb-4">
                  {(featured.mediaType === 'image' || featured.thumbnailUrl) ? (
                    <img src={featured.thumbnailUrl || featured.mediaUrl} alt={featured.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary/30">
                      {featured.mediaType === 'video' ? <Video size={48} /> : <LinkIcon size={48} />}
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Featured
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">{featured.title}</h2>
                {featured.description && <p className="text-secondary mt-2 line-clamp-2 max-w-3xl">{featured.description}</p>}
              </Link>
            )}

            {/* Rest of items */}
            {rest.map((project) => {
              const Icon = project.mediaType === 'image' ? ImageIcon : project.mediaType === 'video' ? Video : LinkIcon;
              const displayImage = project.thumbnailUrl || project.mediaUrl;

              return (
                <Link key={project.id} href={`/project/${project.id}`} className="group block mt-8 md:mt-4">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface border relative mb-3">
                    {(project.mediaType === 'image' || project.thumbnailUrl) ? (
                      <img src={displayImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary/30"><Icon size={32} /></div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{project.title}</h3>
                  <p className="text-sm text-secondary mt-1 capitalize">{project.mediaType}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
