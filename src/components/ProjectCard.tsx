'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/types/project';

export function ProjectCard({ project }: { project: Project }) {
  const Icon = project.mediaType === 'image' ? ImageIcon : project.mediaType === 'video' ? Video : LinkIcon;
  const displayImage = project.thumbnailUrl || project.mediaUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group project-card relative overflow-hidden variant-transition"
    >
      <Link href={`/project/${project.id}`}>
        <div className="aspect-video w-full overflow-hidden bg-foreground/5 relative">
          {project.mediaType === 'image' || project.thumbnailUrl ? (
            <img
              src={displayImage}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Icon size={40} className="text-secondary/20" />
            </div>
          )}
          
          <div className="absolute top-3 left-3">
             <span className="inline-flex items-center gap-1.5 rounded-[calc(var(--radius)*0.5)] bg-background/80 backdrop-blur-sm border px-2 py-1 text-[11px] font-medium text-foreground">
              <Icon size={12} />
              {project.mediaType.charAt(0).toUpperCase() + project.mediaType.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] text-secondary">
              {new Date(project.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          <h3 className="line-clamp-1 font-bold text-base leading-tight tracking-tight text-foreground">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-secondary leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-background/20 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
          <div className="rounded-full bg-primary p-2.5 text-white shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <ExternalLink size={18} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
