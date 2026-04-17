import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/developers/page';

export const Route = createFileRoute('/developers')({ component: Page });
