import { useState } from 'react';
import { VideoCard } from '../components/VideoCard';
import type { AppRoute } from '../components/Navbar';
import {
  CATEGORY_LIST,
  CATEGORY_MAP,
  type VideoCategory,
  type VideoItem,
  type VideoLanguage,
} from '../types/video';

interface CategoryPageProps {
  category: VideoCategory;
  videos: VideoItem[];
  onNavigate: (next: AppRoute) => void;
}

export function CategoryPage({ category, videos, onNavigate }: CategoryPageProps) {
  const [languageFilter, setLanguageFilter] = useState<'all' | VideoLanguage>('all');
  const meta = CATEGORY_MAP[category];

  const categoryVideos = videos.filter((v) => {
    if (v.category !== category) return false;
    if (languageFilter !== 'all' && v.language !== languageFilter) return false;
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Interactive Category Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORY_LIST.map((item) => {
          const active = item.id === category;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setLanguageFilter('all');
                onNavigate({ page: 'category', category: item.id });
              }}
              className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-sky-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Category Header */}
      <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className={`text-xs font-semibold ${meta.accentText}`}>
            Category · <span className="tabular-nums">{categoryVideos.length}</span>{' '}
            {categoryVideos.length === 1 ? 'video' : 'videos'}
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            {meta.label}
          </h1>
          <p className="mt-2 text-base text-slate-600 max-w-2xl">{meta.subtitle}</p>
        </div>

        {/* Language filter segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
          {(['all', 'English', 'Urdu & English', 'Urdu'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguageFilter(lang)}
              className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                languageFilter === lang
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'all' ? 'All Languages' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {categoryVideos.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categoryVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={(videoId) => onNavigate({ page: 'video', videoId })}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="font-display text-lg font-bold text-slate-900">
            No videos match this filter yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Try switching back to All Languages or explore another story category.
          </p>
          <button
            type="button"
            onClick={() => setLanguageFilter('all')}
            className="mt-4 px-5 py-2.5 min-h-[44px] rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
          >
            Show All in {meta.label}
          </button>
        </div>
      )}
    </main>
  );
}
