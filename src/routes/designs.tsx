import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/designs/page';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/designs')({ errorComponent: RouteErrorBoundary, component: Page });
