"use client";

import React from 'react';
import { DataNexusProvider } from '@/context/DataNexusContext';
import { AuthProvider } from '@/context/auth/AuthContext';
import { DocsProvider } from '@/context/DocsContext';
import { SubscriptionProvider } from '@/context/subscription/SubscriptionContext';
import ThemeRegistry from '@/theme/ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      <DataNexusProvider>
        <AuthProvider>
          <DocsProvider>
            <SubscriptionProvider>
              <div className="bg-mesh" />
              {children}
            </SubscriptionProvider>
          </DocsProvider>
        </AuthProvider>
      </DataNexusProvider>
    </ThemeRegistry>
  );
}
