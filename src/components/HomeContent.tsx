'use client';

import { useVariant } from '@/components/VariantProvider';
import { EmberLayout } from '@/components/layouts/EmberLayout';
import { ChalkLayout } from '@/components/layouts/ChalkLayout';
import { PhosphorLayout } from '@/components/layouts/PhosphorLayout';
import { VelvetLayout } from '@/components/layouts/VelvetLayout';
import { TundraLayout } from '@/components/layouts/TundraLayout';
import type { Project } from '@/types/project';

interface HomeContentProps {
  projects: Project[];
  error: string | null;
}

const layoutMap = {
  ember: EmberLayout,
  chalk: ChalkLayout,
  phosphor: PhosphorLayout,
  velvet: VelvetLayout,
  tundra: TundraLayout,
} as const;

export function HomeContent({ projects, error }: HomeContentProps) {
  const { variantId } = useVariant();
  const LayoutComponent = layoutMap[variantId];

  return <LayoutComponent projects={projects} error={error} />;
}
