import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/downloads/page';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/downloads')({ errorComponent: RouteErrorBoundary, component: Page });
