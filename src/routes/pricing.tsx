import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/pricing/page';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/pricing')({ errorComponent: RouteErrorBoundary, component: Page });
