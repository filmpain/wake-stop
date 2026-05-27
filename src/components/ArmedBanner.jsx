import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight } from 'lucide-react';
import RouteBadge from './RouteBadge';

export default function ArmedBanner({ session }) {
  const navigate = useNavigate();
  if (!session) return null;

  return (
    <button
      onClick={() => navigate(`/ride/${encodeURIComponent(session.destination_stop_id)}`)}
      className="w-full bg-green-500/10 border-2 border-green-500/40 rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-green-500/15 transition-colors"
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-green-500" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-green-500 armed-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-widest text-green-600 dark:text-green-500">Armed</div>
        <div className="font-bold truncate">{session.destination_stop_name}</div>
      </div>
      <ChevronRight className="w-5 h-5 text-green-600 dark:text-green-500 shrink-0" />
    </button>
  );
}