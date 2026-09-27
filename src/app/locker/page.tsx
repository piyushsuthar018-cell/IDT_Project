'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { DigitalLockerView } from '@/components/views/DigitalLockerView';

export default function LockerPage() {
  return (
    <AppShell>
      {() => <DigitalLockerView />}
    </AppShell>
  );
}
