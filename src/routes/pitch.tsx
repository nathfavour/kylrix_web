import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/pitch/page';

export const Route = createFileRoute('/pitch')({ component: Page });
