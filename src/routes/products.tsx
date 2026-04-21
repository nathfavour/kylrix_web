import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/products/page';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/products')({ errorComponent: RouteErrorBoundary, component: Page });
