import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/developers/page';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/developers')({ errorComponent: RouteErrorBoundary, component: Page });
