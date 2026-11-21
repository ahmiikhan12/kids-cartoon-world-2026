import type { VideoSourceType } from '../types/video';

export interface ParsedEmbedResult {
  valid: boolean;
  embedUrl: string;
  providerLabel: string;
  suggestedThumbnail?: string;
  error?: string;
}

/**
 * Extracts a YouTube video ID from standard watch, short, embed, or youtu.be URLs.
 */
export function extractYouTubeId(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      const vParam = parsed.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (
        parts.length >= 2 &&
        (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') &&
        /^[a-zA-Z0-9_-]{11}$/.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Extracts a Vimeo numeric video ID from vimeo.com or player.vimeo.com URLs.
 */
export function extractVimeoId(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const segments = parsed.pathname.split('/').filter(Boolean);
      const numericId = [...segments].reverse().find((seg) => /^\d{6,12}$/.test(seg));
      return numericId ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Validates and converts authorized owner-supplied video URLs into privacy-enhanced embed URLs.
 */
export function resolveVideoEmbed(
  sourceType: VideoSourceType,
  rawUrl: string
): ParsedEmbedResult {
  if (sourceType === 'demo') {
    return {
      valid: true,
      embedUrl: '',
      providerLabel: 'Interactive Storybook Demo Player',
    };
  }

  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith('https://')) {
    return {
      valid: false,
      embedUrl: '',
      providerLabel: 'Authorized Embed',
      error: 'Please enter a secure HTTPS video link starting with https://',
    };
  }

  if (sourceType === 'youtube') {
    const id = extractYouTubeId(trimmed);
    if (!id) {
      return {
        valid: false,
        embedUrl: '',
        providerLabel: 'YouTube (Privacy-Enhanced)',
        error: 'Could not recognize a valid YouTube link (e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...).',
      };
    }
    return {
      valid: true,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
      providerLabel: 'YouTube (Privacy-Enhanced Mode)',
      suggestedThumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  if (sourceType === 'vimeo') {
    const id = extractVimeoId(trimmed);
    if (!id) {
      return {
        valid: false,
        embedUrl: '',
        providerLabel: 'Vimeo (Do-Not-Track)',
        error: 'Could not recognize a valid Vimeo link (e.g., https://vimeo.com/123456789).',
      };
    }
    return {
      valid: true,
      embedUrl: `https://player.vimeo.com/video/${id}?dnt=1&title=0&byline=0&portrait=0`,
      providerLabel: 'Vimeo (Do-Not-Track Mode)',
    };
  }

  // Direct authorized HTTPS MP4/WebM hosting
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') {
      throw new Error('HTTPS required');
    }
    return {
      valid: true,
      embedUrl: parsed.toString(),
      providerLabel: 'Authorized Direct Video Stream',
    };
  } catch {
    return {
      valid: false,
      embedUrl: '',
      providerLabel: 'Authorized Direct Video',
      error: 'Please provide a valid HTTPS direct video URL (.mp4 or .webm).',
    };
  }
}

export function isValidThumbnailInput(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || trimmed.length > 500) return false;
  return /^(\/src\/assets\/images\/[a-zA-Z0-9_\-.]+|https:\/\/.+)$/.test(trimmed);
}

/**
 * Resolves local sample artwork paths relative to Vite's configured BASE_URL
 * so thumbnails load reliably on GitHub Pages project URLs (/<repo>/) and custom domains.
 */
export function resolveAssetUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('/src/assets/')) {
    const base = import.meta.env.BASE_URL || './';
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    return `${normalizedBase}${url.slice(1)}`;
  }
  return url;
}
