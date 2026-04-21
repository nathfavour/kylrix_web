import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/docs/page';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/docs')({ errorComponent: RouteErrorBoundary, component: Page });
