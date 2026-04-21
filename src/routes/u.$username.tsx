"use client";

import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { getEcosystemUrl } from '@/lib/ecosystem';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/u/$username')({ errorComponent: RouteErrorBoundary, component: UserRedirect });

function UserRedirect() {
  const params = Route.useParams() as { username?: string };
  const target = `${getEcosystemUrl('connect')}/u/${encodeURIComponent(params.username || '')}`;

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return null;
}
