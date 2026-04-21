import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/pitch/page';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/pitch')({ errorComponent: RouteErrorBoundary, component: Page });
