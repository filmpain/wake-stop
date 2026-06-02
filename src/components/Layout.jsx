import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from './BottomNav';
import PermissionPrompt from './PermissionPrompt';
import AppBackground from './AppBackground';
import Home from '@/pages/Home';
import SearchPage from '@/pages/SearchPage';
import SettingsPage from '@/pages/SettingsPage';

// Tab routes — these stay mounted to preserve state + scroll position.
const TABS = [
  { path: '/', Component: Home },
  { path: '/search', Component: SearchPage },
  { path: '/settings', Component: SettingsPage },
];

export default function Layout() {
  const { pathname } = useLocation();
  const scrollPositions = useRef({});
  const prevPath = useRef(pathname);

  // Save scroll position whenever we leave a tab, restore when we re-enter.
  useEffect(() => {
    // Save scroll for the tab we're leaving
    scrollPositions.current[prevPath.current] = window.scrollY;
    // Restore scroll for the tab we're entering (default to 0)
    const restoreY = scrollPositions.current[pathname] ?? 0;
    window.scrollTo(0, restoreY);
    prevPath.current = pathname;
  }, [pathname]);

  return (
    <div className="min-h-screen text-foreground">
      <AppBackground />
      <div className="max-w-md mx-auto pb-20 relative">
        {TABS.map(({ path, Component }) => {
          const active = pathname === path;
          return (
            <div
              key={path}
              // Keep all tabs mounted to preserve state; hide inactive ones.
              style={{ display: active ? 'block' : 'none' }}
              aria-hidden={!active}
            >
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key={path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <Component />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <BottomNav />
      <PermissionPrompt />
    </div>
  );
}