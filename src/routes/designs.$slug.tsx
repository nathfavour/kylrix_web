"use client";

import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/designs/$slug')({ errorComponent: RouteErrorBoundary, component: DesignRedirect });

function DesignRedirect() {
  const navigate = useNavigate();
  const params = Route.useParams() as { slug?: string };

  useEffect(() => {
    navigate({ to: `/designs?design=${encodeURIComponent(params.slug || '')}`, replace: true });
  }, [navigate, params.slug]);

  return null;
}
