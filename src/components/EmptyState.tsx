'use client';

import { Plus, Layout } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center bg-surface/30"
    >
      <div className="mb-6 rounded-[calc(var(--radius)*0.75)] bg-primary/10 p-5 text-primary">
        <Layout size={48} />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground">Gallery is empty</h2>
      <p className="mt-4 max-w-sm text-lg text-secondary leading-relaxed">
        Be the first one to showcase your work. Upload an image, video, or link to get started.
      </p>
      <Link
        href="/upload"
        className="btn btn-primary mt-10 px-10 py-3.5 font-bold shadow-md"
      >
        <Plus size={20} className="mr-2" />
        Upload Project
      </Link>
    </motion.div>
  );
}
