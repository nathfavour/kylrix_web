"use client";

import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/i/[...slug]/page';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

export const Route = createFileRoute('/i/$')({ errorComponent: RouteErrorBoundary, component: Page });
