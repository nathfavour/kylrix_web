import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/designs/page';

export const Route = createFileRoute('/designs')({ component: Page });
