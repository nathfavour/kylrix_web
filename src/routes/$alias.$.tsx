"use client";

import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { getEcosystemUrl } from '@/lib/ecosystem';

const ALIAS_TO_SUBDOMAIN: Record<string, string> = {
  n: 'note',
  note: 'note',
  c: 'connect',
  connect: 'connect',
  v: 'vault',
  vault: 'vault',
  f: 'flow',
  flow: 'flow',
};

export const Route = createFileRoute('/$alias/$')({ component: AliasRedirect });

function AliasRedirect() {
  const target = (() => {
    if (typeof window === 'undefined') return '/';
    const [, alias, ...slug] = window.location.pathname.split('/').filter(Boolean);
    const subdomain = alias ? ALIAS_TO_SUBDOMAIN[alias.toLowerCase()] : undefined;
    if (!subdomain) return '/';
    return `${getEcosystemUrl(subdomain)}${slug.length ? `/${slug.map(encodeURIComponent).join('/')}` : ''}`;
  })();

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return null;
}
