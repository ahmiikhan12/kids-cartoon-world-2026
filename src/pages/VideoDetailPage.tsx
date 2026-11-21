import { ArrowLeft, HeartHandshake } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';
import { VideoPlayer } from '../components/VideoPlayer';
import type { AppRoute } from '../components/Navbar';
import { CATEGORY_MAP, type VideoItem } from '../types/video';

interface VideoDetailPageProps {
  videoId: string;
  videos: VideoItem[];
  onNavigate: (next: AppRoute) => void;
}

export function VideoDetailPage({ videoId, videos, onNavigate }: VideoDetailPageProps) {
  const video = videos.find((v) => v.id === videoId);

  if (!video) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900">Video not found</h1>
        <p className="mt-2 text-slate-600">
          This cartoon may have been moved or removed by the website owner.
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'home' })}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </main>
    );
  }

  const category = CATEGORY_MAP[video.category];

  // Related videos: prioritize same category, then popular, excluding current video
  const relatedVideos = [
    ...videos.filter((v) => v.id !== video.id && v.category === video.category),
    ...videos.filter((v) => v.id !== video.id && v.category !== video.category && v.isPopular),
    ...videos.filter((v) => v.id !== video.id && v.category !== video.category && !v.isPopular),
  ].slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-5">
        <button
          type="button"
          onClick={() => onNavigate({ page: 'home' })}
          className="inline-flex items-center gap-1.5 text-slate-700 hover:text-sky-700 font-medium py-1.5 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'category', category: video.category })}
          className={`font-medium hover:underline py-1.5 min-h-[44px] ${category.accentText}`}
        >
          {category.label}
        </button>
      </div>

      {/* Main Theater + Related Videos Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Top: Player + Details */}
        <div className="lg:col-span-8">
          <VideoPlayer video={video} />

          <div className="mt-6 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-500">
              <span className={category.accentText}>{category.label}</span>
              <span aria-hidden="true">·</span>
              <span>{video.ageRange}</span>
              <span aria-hidden="true">·</span>
              <span>{video.language}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{video.duration}</span>
              {video.isDemo && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-700">Sample Demo Video</span>
                </>
              )}
            </div>

            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
              {video.title}
            </h1>

            {video.urduTitle && (
              <p
                dir="rtl"
                lang="ur"
                className="mt-2 text-lg font-semibold text-emerald-800"
              >
                {video.urduTitle}
              </p>
            )}

            <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              {video.description}
            </p>

            {video.moralLesson && (
              <div className="mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-display text-sm font-bold text-slate-900">
                    Moral & Learning Takeaway
                  </h2>
                  <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                    {video.moralLesson}
                  </p>
                </div>
              </div>
            )}

            {video.isDemo && (
              <p className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                Note: This is an original sample demo storybook preview included with Kids Cartoon
                World until the website owner publishes their own authorized YouTube or hosted videos.
              </p>
            )}
          </div>
        </div>

        {/* Right/Bottom: Related Videos Section */}
        <aside className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-slate-900">Related Videos</h2>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'category', category: video.category })}
              className="text-xs font-semibold text-sky-700 hover:underline py-1"
            >
              More in {category.shortLabel}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {relatedVideos.map((rel) => (
              <VideoCard
                key={rel.id}
                video={rel}
                compact
                onSelect={(nextId) => onNavigate({ page: 'video', videoId: nextId })}
              />
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
