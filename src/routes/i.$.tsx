"use client";

import { createFileRoute } from '@tanstack/react-router';
import Page from '@/app/i/[...slug]/page';

export const Route = createFileRoute('/i/$')({ component: Page });
