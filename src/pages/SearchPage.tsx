import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';
import type { AppRoute } from '../components/Navbar';
import { CATEGORY_LIST, type VideoCategory, type VideoItem } from '../types/video';

interface SearchPageProps {
  initialQuery: string;
  videos: VideoItem[];
  onNavigate: (next: AppRoute) => void;
}

const QUICK_TERMS = ['Fox', 'Bear', 'Urdu', 'Honest', 'Shapes', 'Rainbow', 'Bedtime'];

export function SearchPage({ initialQuery, videos, onNavigate }: SearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<'all' | VideoCategory>('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return videos.filter((v) => {
      if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        v.title.toLowerCase().includes(q) ||
        v.urduTitle.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.moralLesson.toLowerCase().includes(q) ||
        v.language.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
      );
    });
  }, [query, selectedCategory, videos]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Search Cartoons & Stories
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Find funny animal cartoons, Urdu moral stories, educational videos, or bedtime tales.
        </p>

        {/* Search Input */}
        <div className="mt-5 relative">
          <Search
            aria-hidden="true"
            className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, animal, Urdu story, or lesson..."
            aria-label="Search cartoons and stories"
            className="w-full h-13 pl-12 pr-12 rounded-2xl bg-white border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Suggestions */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Try:</span>
          {QUICK_TERMS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="px-3 py-1.5 min-h-[36px] rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-sky-500 hover:text-sky-700 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Row */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
            selectedCategory === 'all'
              ? 'bg-sky-600 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {CATEGORY_LIST.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="mt-6 mb-4 text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900 tabular-nums">{results.length}</span>{' '}
        {results.length === 1 ? 'result' : 'results'}
        {query.trim() ? ` for "${query.trim()}"` : ''}
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {results.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={(videoId) => onNavigate({ page: 'video', videoId })}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="font-display text-lg font-bold text-slate-900">No matching cartoons found</h2>
          <p className="mt-2 text-sm text-slate-600">
            Try a simpler word like "Fox", "Urdu", "Shapes", or reset the filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-5 py-2.5 min-h-[44px] rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
          >
            Reset Search
          </button>
        </div>
      )}
    </main>
  );
}
