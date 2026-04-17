import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/products/page';

export const Route = createFileRoute('/products')({ component: Page });
