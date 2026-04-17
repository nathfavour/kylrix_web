import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/logo/page';

export const Route = createFileRoute('/logo')({ component: Page });
