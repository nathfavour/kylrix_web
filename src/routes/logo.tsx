import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/logo/page';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/logo')({ errorComponent: RouteErrorBoundary, component: Page });
