'use client';

import React, { useEffect } from 'react';

interface GlobalShortcutsProps {
  onEscape?: () => void;
}

export function GlobalShortcuts({ onEscape }: GlobalShortcutsProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // 1. Cmd+K or Ctrl+K -> Focus Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // 2. Escape -> Close active drawers or modals
      if (e.key === 'Escape') {
        if (onEscape) {
          onEscape();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape]);

  return null;
}
