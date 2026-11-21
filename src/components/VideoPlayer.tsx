import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { DEMO_SCENES_BY_ID } from '../data/sampleVideos';
import { resolveAssetUrl, resolveVideoEmbed } from '../lib/videoUrl';
import type { StoryScene, VideoItem } from '../types/video';

interface VideoPlayerProps {
  video: VideoItem;
}

const SCENE_DURATION_MS = 6500;

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [readAloud, setReadAloud] = useState(false);

  const embed = useMemo(
    () => resolveVideoEmbed(video.videoSourceType, video.videoUrl),
    [video.videoSourceType, video.videoUrl]
  );

  const scenes: StoryScene[] = useMemo(() => {
    if (video.demoScenes && video.demoScenes.length > 0) {
      return video.demoScenes;
    }
    if (DEMO_SCENES_BY_ID[video.id]) {
      return DEMO_SCENES_BY_ID[video.id];
    }
    return [
      {
        heading: 'Scene 1 · Welcome',
        caption: video.description,
        urduCaption: video.urduTitle || undefined,
      },
      {
        heading: 'Scene 2 · Story Takeaway',
        caption:
          video.moralLesson ||
          'This clearly labeled demo video preview shows how your own cartoons and stories will appear once added in the Owner Admin Dashboard.',
      },
    ];
  }, [video]);

  // Reset demo theater when switching videos
  useEffect(() => {
    setIsPlaying(false);
    setSceneIndex(0);
    setImgFailed(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [video.id]);

  // Auto-advance interactive demo scenes while playing
  useEffect(() => {
    if (!isPlaying || video.videoSourceType !== 'demo') return;

    const timer = window.setTimeout(() => {
      if (sceneIndex < scenes.length - 1) {
        setSceneIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, SCENE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [isPlaying, sceneIndex, scenes.length, video.videoSourceType]);

  // Optional gentle browser voice narration when user explicitly enables Read Aloud
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (!readAloud || !isPlaying || video.videoSourceType !== 'demo') return;

    const current = scenes[sceneIndex];
    if (!current) return;
    const utterance = new SpeechSynthesisUtterance(current.caption);
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [readAloud, isPlaying, sceneIndex, scenes, video.videoSourceType]);

  // Render authorized YouTube / Vimeo privacy-enhanced iframe
  if (
    (video.videoSourceType === 'youtube' || video.videoSourceType === 'vimeo') &&
    embed.valid &&
    embed.embedUrl
  ) {
    return (
      <div className="w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-200">
        <div className="relative aspect-video w-full">
          <iframe
            src={embed.embedUrl}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="px-4 py-2.5 bg-slate-900 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <span>{embed.providerLabel}</span>
          <span>Family-safe embed · No personal tracking</span>
        </div>
      </div>
    );
  }

  // Render authorized direct HTTPS video stream (.mp4 / .webm)
  if (video.videoSourceType === 'direct' && embed.valid && embed.embedUrl) {
    return (
      <div className="w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-200">
        <div className="relative aspect-video w-full">
          <video
            src={embed.embedUrl}
            poster={resolveAssetUrl(video.thumbnailUrl)}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-contain bg-slate-950"
          />
        </div>
        <div className="px-4 py-2.5 bg-slate-900 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
          <span>{embed.providerLabel}</span>
          <span>Duration: {video.duration}</span>
        </div>
      </div>
    );
  }

  // Interactive Storybook Theater for clearly labeled Demo Videos
  const activeScene = scenes[sceneIndex] ?? scenes[0];
  const progressPercent = Math.round(((sceneIndex + 1) / scenes.length) * 100);
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-200">
      {/* Main 16:9 Stage */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        {!imgFailed && video.thumbnailUrl ? (
          <img
            src={resolveAssetUrl(video.thumbnailUrl)}
            alt={video.title}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
              isPlaying ? 'scale-105' : 'scale-100'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-sky-900 to-indigo-950 text-white p-6">
            <Film className="w-10 h-10 mb-3 text-amber-300" />
            <p className="font-display text-lg font-bold">{video.title}</p>
          </div>
        )}

        {/* Measured scrim for crisp WCAG AA caption readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/20 pointer-events-none"
        />

        {/* Top quiet label identifying Demo Video clearly */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 text-xs text-white/95">
          <span className="px-2.5 py-1 rounded-md bg-slate-950/75 font-medium tracking-wide">
            Sample Demo Video · Interactive Storybook Preview
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-950/75 font-semibold tabular-nums">
            Scene {sceneIndex + 1} / {scenes.length}
          </span>
        </div>

        {/* Center Play Trigger when paused */}
        {!isPlaying && (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${video.title}`}
            className="absolute inset-0 flex items-center justify-center group focus-visible:outline-2 focus-visible:outline-sky-400"
          >
            <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-105">
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
            </span>
          </button>
        )}

        {/* Bottom Storybook Caption Area */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white">
          <p className="text-xs font-semibold text-amber-300 tracking-wide">
            {activeScene.heading}
          </p>
          <p className="mt-1 text-sm sm:text-base font-medium leading-relaxed text-white max-w-3xl">
            {activeScene.caption}
          </p>
          {activeScene.urduCaption && (
            <p
              dir="rtl"
              lang="ur"
              className="mt-1.5 text-sm sm:text-base text-amber-100 leading-relaxed"
            >
              {activeScene.urduCaption}
            </p>
          )}
        </div>
      </div>

      {/* Player Control Strip (44px accessible touch targets) */}
      <div className="bg-slate-900 px-3 sm:px-4 py-2.5 text-white">
        {/* Progress Track */}
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-amber-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold hover:bg-amber-300 transition-colors whitespace-nowrap"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Demo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSceneIndex((i) => Math.max(0, i - 1))}
              disabled={sceneIndex === 0}
              aria-label="Previous scene"
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setSceneIndex((i) => Math.min(scenes.length - 1, i + 1))}
              disabled={sceneIndex === scenes.length - 1}
              aria-label="Next scene"
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setSceneIndex(0);
                setIsPlaying(true);
              }}
              aria-label="Replay story"
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {canSpeak && (
              <button
                type="button"
                onClick={() => setReadAloud((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                  readAloud
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {readAloud ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span>{readAloud ? 'Voice On' : 'Read Aloud'}</span>
              </button>
            )}
            <span className="text-xs text-slate-400 tabular-nums hidden sm:inline">
              {video.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
