import { useState } from 'react';
import { Film, Play } from 'lucide-react';
import { resolveAssetUrl } from '../lib/videoUrl';
import { CATEGORY_MAP, type VideoItem } from '../types/video';

interface VideoCardProps {
  video: VideoItem;
  onSelect: (videoId: string) => void;
  compact?: boolean;
}

export function VideoCard({ video, onSelect, compact = false }: VideoCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const category = CATEGORY_MAP[video.category];

  return (
    <button
      type="button"
      onClick={() => onSelect(video.id)}
      className={`group text-left w-full flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
        compact ? '' : ''
      }`}
    >
      {/* 16:9 Thumbnail Stage with Zero-Broken-Image Fallback */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        {!imgFailed && video.thumbnailUrl ? (
          <img
            src={resolveAssetUrl(video.thumbnailUrl)}
            alt={video.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-amber-50 to-emerald-100 p-4 text-center">
            <Film className="w-8 h-8 text-sky-700 mb-2" />
            <span className="font-display text-sm font-semibold text-slate-800 line-clamp-2">
              {video.title}
            </span>
          </div>
        )}

        {/* Measured bottom contrast scrim for duration & play affordance */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent pointer-events-none"
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 bg-slate-950/20">
          <span className="w-12 h-12 rounded-full bg-white/95 text-sky-700 flex items-center justify-center shadow-md">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </span>
        </div>

        <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-xs font-semibold tabular-nums">
          {video.duration}
        </span>
      </div>

      {/* Card Copy — Clean unboxed metadata (Zero-Pill Discipline) */}
      <div className={compact ? 'p-3.5 flex-1 flex flex-col' : 'p-4 flex-1 flex flex-col'}>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500">
          <span className={`font-semibold ${category.accentText}`}>{category.label}</span>
          <span aria-hidden="true">·</span>
          <span>{video.ageRange}</span>
          {video.isDemo && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-slate-600 font-medium">Demo Video</span>
            </>
          )}
        </div>

        <h3
          className={`mt-1.5 font-display font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-snug line-clamp-2 ${
            compact ? 'text-sm sm:text-base' : 'text-base sm:text-[17px]'
          }`}
        >
          {video.title}
        </h3>

        {video.urduTitle && (
          <p
            dir="rtl"
            lang="ur"
            className="mt-1 text-sm text-emerald-800 font-medium line-clamp-1"
          >
            {video.urduTitle}
          </p>
        )}

        {!compact && (
          <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </button>
  );
}
