import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/downloads/page';

export const Route = createFileRoute('/downloads')({ component: Page });
