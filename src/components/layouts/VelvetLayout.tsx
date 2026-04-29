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

export function VelvetLayout({ projects, error }: LayoutProps) {
  const { variantId, setVariantId } = useVariant();

  return (
    <main className="min-h-screen">
      <nav className="velvet-nav border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-playfair text-xl font-bold">ClassPortfolio</Link>
          <div className="flex items-center gap-6">
            <Link href="/upload" className="text-sm hover:text-foreground/80">Upload</Link>
            <select value={variantId} onChange={(e) => setVariantId(e.target.value as any)} className="bg-transparent border rounded px-2 py-1 text-sm outline-none">
              {siteVariants.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>
      </nav>

      <header className="py-16 md:py-24 text-center px-4">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Curated with intention.</h1>
        <p className="text-secondary max-w-lg mx-auto">A space where creative work is presented with the gravity it deserves.</p>
      </header>

      <div className="max-w-6xl mx-auto px-4 pb-24">
        {error && <div className="bg-accent/10 text-accent p-4 mb-8 rounded">{error}</div>}

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Link href="/upload" className="btn btn-primary px-8 py-3 font-bold">
              Begin Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const Icon = project.mediaType === 'image' ? ImageIcon : project.mediaType === 'video' ? Video : LinkIcon;
              const displayImage = project.thumbnailUrl || project.mediaUrl;

              return (
                <Link key={project.id} href={`/project/${project.id}`} className="velvet-card block group">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface mb-4 border border-foreground/5 relative">
                    {(project.mediaType === 'image' || project.thumbnailUrl) ? (
                      <img src={displayImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary/30"><Icon size={40} /></div>
                    )}
                  </div>
                  <h3 className="font-playfair text-lg font-bold">{project.title}</h3>
                  <p className="text-sm text-secondary capitalize">{project.mediaType}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
