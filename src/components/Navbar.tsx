import { BookOpen, Compass, Home, Search } from 'lucide-react';
import type { VideoCategory } from '../types/video';

export type AppRoute =
  | { page: 'home' }
  | { page: 'category'; category: VideoCategory }
  | { page: 'video'; videoId: string }
  | { page: 'search'; query: string }
  | { page: 'about' }
  | { page: 'contact' }
  | { page: 'privacy' }
  | { page: 'terms' }
  | { page: 'admin' };

interface NavbarProps {
  route: AppRoute;
  onNavigate: (next: AppRoute) => void;
}

const NAV_ITEMS: { label: string; route: AppRoute; isActive: (r: AppRoute) => boolean }[] = [
  {
    label: 'Home',
    route: { page: 'home' },
    isActive: (r) => r.page === 'home',
  },
  {
    label: 'Funny',
    route: { page: 'category', category: 'funny-cartoons' },
    isActive: (r) => r.page === 'category' && r.category === 'funny-cartoons',
  },
  {
    label: 'Urdu Stories',
    route: { page: 'category', category: 'urdu-stories' },
    isActive: (r) => r.page === 'category' && r.category === 'urdu-stories',
  },
  {
    label: 'Educational',
    route: { page: 'category', category: 'educational-videos' },
    isActive: (r) => r.page === 'category' && r.category === 'educational-videos',
  },
  {
    label: 'Bedtime',
    route: { page: 'category', category: 'bedtime-stories' },
    isActive: (r) => r.page === 'category' && r.category === 'bedtime-stories',
  },
];

export function Navbar({ route, onNavigate }: NavbarProps) {
  return (
    <>
      {/* Desktop & Mobile Top Navigation Bar (Strict 3-Zone Contract, compact 56px height) */}
      <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 rounded-md min-h-[44px] flex items-center"
          >
            Kids Cartoon World
          </button>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {NAV_ITEMS.map((item) => {
              const active = item.isActive(route);
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onNavigate(item.route)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 rounded-sm ${
                    active
                      ? 'text-sky-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 bg-sky-600 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action (Search) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() =>
                onNavigate({
                  page: 'search',
                  query: route.page === 'search' ? route.query : '',
                })
              }
              aria-label="Search cartoons and stories"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] min-w-[44px] rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Natural Thumb Zone, compact 56px height, <15% total sticky budget) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe"
      >
        <div className="grid grid-cols-4 items-center h-14 max-w-lg mx-auto px-2">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className={`flex flex-col items-center justify-center min-h-[44px] rounded-lg transition-colors ${
              route.page === 'home' ? 'text-sky-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] mt-0.5 leading-none whitespace-nowrap">Home</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'category', category: 'funny-cartoons' })}
            className={`flex flex-col items-center justify-center min-h-[44px] rounded-lg transition-colors ${
              route.page === 'category' ? 'text-sky-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[11px] mt-0.5 leading-none whitespace-nowrap">Categories</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'search', query: '' })}
            className={`flex flex-col items-center justify-center min-h-[44px] rounded-lg transition-colors ${
              route.page === 'search' ? 'text-sky-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[11px] mt-0.5 leading-none whitespace-nowrap">Search</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'about' })}
            className={`flex flex-col items-center justify-center min-h-[44px] rounded-lg transition-colors ${
              route.page === 'about' ||
              route.page === 'contact' ||
              route.page === 'privacy' ||
              route.page === 'terms'
                ? 'text-sky-700 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[11px] mt-0.5 leading-none whitespace-nowrap">Family Info</span>
          </button>
        </div>
      </nav>
    </>
  );
}
