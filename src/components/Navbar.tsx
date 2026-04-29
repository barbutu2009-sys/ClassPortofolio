'use client';

import Link from 'next/link';
import { useVariant } from './VariantProvider';
import { Plus, Layout } from 'lucide-react';
import { siteVariants } from '@/lib/variants';

export function Navbar() {
  const { variantId, setVariantId } = useVariant();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white">
            <Layout size={20} />
          </div>
          <span>Class<span className="text-primary">Portfolio</span></span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors">Gallery</Link>
            <Link href="/upload" className="hover:text-primary transition-colors flex items-center gap-1">
              <Plus size={16} />
              Upload
            </Link>
          </div>

          <div className="flex items-center gap-2 border-l pl-4 ml-2">
            <select
              value={variantId}
              onChange={(e) => setVariantId(e.target.value as any)}
              className="bg-surface border rounded px-2 py-1 text-xs font-medium outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {siteVariants.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
