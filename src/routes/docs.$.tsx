"use client";

import { useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import DocsArticlePage from '@/components/docs/DocsArticlePage';

export const Route = createFileRoute('/docs/$')({
  component: DocsSlugRoute,
});

function DocsSlugRoute() {
  const slug = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return window.location.pathname.split('/').slice(2).filter(Boolean);
  }, []);
  return <DocsArticlePage slug={slug} />;
}
