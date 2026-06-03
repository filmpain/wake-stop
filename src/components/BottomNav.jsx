import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Settings } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-lg border-t border-border">
      <div className="max-w-md mx-auto flex items-stretch h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? '' : ''}`} />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}