import { useState } from 'react';
import { ArrowRight, BookHeart, ChevronRight, Film, Moon, Play, Smile, Sparkles } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';
import type { AppRoute } from '../components/Navbar';
import { resolveAssetUrl } from '../lib/videoUrl';
import { CATEGORY_LIST, CATEGORY_MAP, type VideoCategory, type VideoItem } from '../types/video';

interface HomePageProps {
  videos: VideoItem[];
  loading: boolean;
  onNavigate: (next: AppRoute) => void;
}

const CATEGORY_ICONS: Record<VideoCategory, typeof Smile> = {
  'funny-cartoons': Smile,
  'urdu-stories': BookHeart,
  'educational-videos': Sparkles,
  'bedtime-stories': Moon,
};

interface ShelfProps {
  title: string;
  subtitle: string;
  videos: VideoItem[];
  viewAllCategory?: VideoCategory;
  onSelectVideo: (videoId: string) => void;
  onViewCategory?: (cat: VideoCategory) => void;
}

function VideoShelf({
  title,
  subtitle,
  videos,
  viewAllCategory,
  onSelectVideo,
  onViewCategory,
}: ShelfProps) {
  if (videos.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 border-t border-slate-200/70">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
            {title}
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-600">{subtitle}</p>
        </div>

        {viewAllCategory && onViewCategory && (
          <button
            type="button"
            onClick={() => onViewCategory(viewAllCategory)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-800 py-2 min-h-[44px] self-start sm:self-auto whitespace-nowrap shrink-0"
          >
            <span>See all</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onSelect={onSelectVideo} />
        ))}
      </div>
    </section>
  );
}

export function HomePage({ videos, loading, onNavigate }: HomePageProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  if (loading && videos.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-80 rounded-3xl bg-slate-200/70 animate-pulse" />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-200/70 animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  const featuredVideo = videos.find((v) => v.isFeatured) ?? videos[0];
  const latestVideos = [...videos].sort((a, b) => b.createdAtMs - a.createdAtMs).slice(0, 4);
  const popularVideos = videos.filter((v) => v.isPopular).slice(0, 4);
  const funnyAnimalVideos = videos.filter((v) => v.isFunnyAnimal).slice(0, 4);
  const educationalVideos = videos.filter((v) => v.category === 'educational-videos').slice(0, 4);
  const urduStories = videos.filter((v) => v.category === 'urdu-stories').slice(0, 4);

  const openVideo = (videoId: string) => onNavigate({ page: 'video', videoId });
  const openCategory = (category: VideoCategory) => onNavigate({ page: 'category', category });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* 1. Featured Cartoon Hero (Dominant Visual Anchor, balanced 2-col split) */}
      {featuredVideo && (
        <section className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Hero Visual */}
            <div className="lg:col-span-7 relative aspect-video lg:aspect-auto bg-slate-900 overflow-hidden">
              {!heroImgFailed && featuredVideo.thumbnailUrl ? (
                <img
                  src={resolveAssetUrl(featuredVideo.thumbnailUrl)}
                  alt={featuredVideo.title}
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="w-full h-full object-cover lg:h-full"
                />
              ) : (
                <div className="w-full h-full min-h-[240px] flex flex-col items-center justify-center bg-gradient-to-br from-sky-800 to-indigo-950 text-white p-8">
                  <Film className="w-12 h-12 text-amber-300 mb-3" />
                  <span className="font-display text-xl font-bold text-center">
                    {featuredVideo.title}
                  </span>
                </div>
              )}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none"
              />

              <button
                type="button"
                onClick={() => openVideo(featuredVideo.id)}
                aria-label={`Play featured cartoon ${featuredVideo.title}`}
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white/95 text-slate-900 text-sm font-bold shadow-md hover:bg-amber-300 transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Preview · {featuredVideo.duration}</span>
              </button>
            </div>

            {/* Hero Copy */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500">
                <span className="text-amber-700">Featured Cartoon</span>
                <span aria-hidden="true">·</span>
                <span className={CATEGORY_MAP[featuredVideo.category].accentText}>
                  {CATEGORY_MAP[featuredVideo.category].label}
                </span>
                <span aria-hidden="true">·</span>
                <span>{featuredVideo.ageRange}</span>
                {featuredVideo.isDemo && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>Demo Video</span>
                  </>
                )}
              </div>

              <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
                {featuredVideo.title}
              </h1>

              {featuredVideo.urduTitle && (
                <p
                  dir="rtl"
                  lang="ur"
                  className="mt-2 text-base font-semibold text-emerald-800"
                >
                  {featuredVideo.urduTitle}
                </p>
              )}

              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                {featuredVideo.description}
              </p>

              {featuredVideo.moralLesson && (
                <p className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Story takeaway: </span>
                  {featuredVideo.moralLesson}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openVideo(featuredVideo.id)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-xl bg-sky-600 text-white text-sm sm:text-base font-bold hover:bg-sky-700 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => openCategory('urdu-stories')}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-3 min-h-[48px] rounded-xl bg-slate-100 text-slate-800 text-sm sm:text-base font-semibold hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  <span>Explore Urdu Stories</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Four Category Destinations */}
      <section aria-label="Browse by category" className="py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_LIST.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const count = videos.filter((v) => v.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => openCategory(cat.id)}
                className="group text-left p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-11 h-11 rounded-xl ${cat.accentBg} ${cat.accentText} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-semibold text-slate-500 tabular-nums">
                    {count} {count === 1 ? 'video' : 'videos'}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {cat.label}
                </h2>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {cat.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Required Home Page Shelves */}
      <VideoShelf
        title="Latest Videos"
        subtitle="Freshly added cartoons, lessons, and family stories ready to watch."
        videos={latestVideos}
        onSelectVideo={openVideo}
      />

      <VideoShelf
        title="Popular Cartoons"
        subtitle="Beloved favorites watched again and again by children and families."
        videos={popularVideos}
        viewAllCategory="funny-cartoons"
        onSelectVideo={openVideo}
        onViewCategory={openCategory}
      />

      <VideoShelf
        title="Funny Animal Cartoons"
        subtitle="Cheerful foxes, pancake-flipping bears, and playful garden parrots."
        videos={funnyAnimalVideos}
        viewAllCategory="funny-cartoons"
        onSelectVideo={openVideo}
        onViewCategory={openCategory}
      />

      <VideoShelf
        title="Educational Videos"
        subtitle="Gentle early learning covering shapes, counting, weather, and curiosity."
        videos={educationalVideos}
        viewAllCategory="educational-videos"
        onSelectVideo={openVideo}
        onViewCategory={openCategory}
      />

      <VideoShelf
        title="Urdu Moral Stories"
        subtitle="Heartwarming Urdu tales with positive lessons in honesty, patience, and kindness."
        videos={urduStories}
        viewAllCategory="urdu-stories"
        onSelectVideo={openVideo}
        onViewCategory={openCategory}
      />
    </main>
  );
}
