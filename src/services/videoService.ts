import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { DEMO_SCENES_BY_ID, SAMPLE_DEMO_VIDEOS } from '../data/sampleVideos';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { isValidThumbnailInput, resolveVideoEmbed } from '../lib/videoUrl';
import type { VideoFormInput, VideoItem } from '../types/video';

const VIDEOS_COLLECTION = 'videos';

function toMillis(ts: unknown): number {
  if (ts && typeof ts === 'object' && 'toMillis' in ts && typeof (ts as Timestamp).toMillis === 'function') {
    return (ts as Timestamp).toMillis();
  }
  return Date.now();
}

function mapDocToVideo(id: string, data: Record<string, unknown>): VideoItem {
  return {
    id,
    title: String(data.title ?? ''),
    urduTitle: String(data.urduTitle ?? ''),
    description: String(data.description ?? ''),
    category: (data.category as VideoItem['category']) ?? 'funny-cartoons',
    thumbnailUrl: String(data.thumbnailUrl ?? ''),
    videoSourceType: (data.videoSourceType as VideoItem['videoSourceType']) ?? 'demo',
    videoUrl: String(data.videoUrl ?? ''),
    duration: String(data.duration ?? '3:00'),
    ageRange: String(data.ageRange ?? 'Ages 3–8'),
    language: (data.language as VideoItem['language']) ?? 'English',
    moralLesson: String(data.moralLesson ?? ''),
    isFeatured: Boolean(data.isFeatured),
    isPopular: Boolean(data.isPopular),
    isFunnyAnimal: Boolean(data.isFunnyAnimal),
    isDemo: Boolean(data.isDemo),
    isPublished: Boolean(data.isPublished),
    rightsConfirmed: Boolean(data.rightsConfirmed),
    ownerUid: String(data.ownerUid ?? ''),
    createdAtMs: toMillis(data.createdAt),
    updatedAtMs: toMillis(data.updatedAt),
    demoScenes: DEMO_SCENES_BY_ID[id],
    storageOrigin: 'firestore',
  };
}

/**
 * Sanitizes and validates video payloads against firebase-blueprint.json boundaries before writing.
 */
export function validateAndSanitizeVideoInput(input: VideoFormInput): {
  valid: boolean;
  error?: string;
  sanitized?: VideoFormInput;
} {
  const title = input.title.trim().slice(0, 120);
  const urduTitle = input.urduTitle.trim().slice(0, 120);
  const description = input.description.trim().slice(0, 1200);
  const thumbnailUrl = input.thumbnailUrl.trim().slice(0, 500);
  const videoUrl = input.videoSourceType === 'demo' ? '' : input.videoUrl.trim().slice(0, 500);
  const duration = input.duration.trim().slice(0, 20);
  const ageRange = input.ageRange.trim().slice(0, 30);
  const moralLesson = input.moralLesson.trim().slice(0, 240);

  if (title.length < 2) {
    return { valid: false, error: 'Title must be at least 2 characters long.' };
  }
  if (description.length < 10) {
    return { valid: false, error: 'Description must be at least 10 characters long.' };
  }
  if (!isValidThumbnailInput(thumbnailUrl)) {
    return {
      valid: false,
      error: 'Please select a sample thumbnail or enter a valid HTTPS thumbnail URL.',
    };
  }
  if (duration.length < 2) {
    return { valid: false, error: 'Please enter a duration such as 3:45 or 5 min.' };
  }
  if (ageRange.length < 2) {
    return { valid: false, error: 'Please specify an age range such as Ages 3–8.' };
  }
  if (!input.rightsConfirmed) {
    return {
      valid: false,
      error: 'You must confirm that you own this video or have permission to embed it.',
    };
  }

  const embedCheck = resolveVideoEmbed(input.videoSourceType, videoUrl);
  if (!embedCheck.valid) {
    return { valid: false, error: embedCheck.error ?? 'Invalid video URL.' };
  }

  return {
    valid: true,
    sanitized: {
      title,
      urduTitle,
      description,
      category: input.category,
      thumbnailUrl,
      videoSourceType: input.videoSourceType,
      videoUrl,
      duration,
      ageRange,
      language: input.language,
      moralLesson,
      isFeatured: Boolean(input.isFeatured),
      isPopular: Boolean(input.isPopular),
      isFunnyAnimal: Boolean(input.isFunnyAnimal),
      isDemo: input.videoSourceType === 'demo' ? true : Boolean(input.isDemo),
      isPublished: Boolean(input.isPublished),
      rightsConfirmed: true,
    },
  };
}

export function generateVideoDocumentId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${slug || 'cartoon'}-${suffix}`;
}

export function subscribePublicVideos(
  onUpdate: (videos: VideoItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const q = query(collection(db, VIDEOS_COLLECTION), where('isPublished', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs
        .map((d) => mapDocToVideo(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, VIDEOS_COLLECTION);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export function subscribeAllAdminVideos(
  onUpdate: (videos: VideoItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, VIDEOS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items = snapshot.docs
        .map((d) => mapDocToVideo(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
      onUpdate(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, VIDEOS_COLLECTION);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function createVideoRecord(
  input: VideoFormInput,
  ownerUid: string,
  customId?: string
): Promise<string> {
  const check = validateAndSanitizeVideoInput(input);
  if (!check.valid || !check.sanitized) {
    throw new Error(check.error ?? 'Invalid video details.');
  }

  const videoId = customId && /^[a-zA-Z0-9_-]{1,128}$/.test(customId)
    ? customId
    : generateVideoDocumentId(check.sanitized.title);
  const path = `${VIDEOS_COLLECTION}/${videoId}`;

  try {
    await setDoc(doc(db, VIDEOS_COLLECTION, videoId), {
      ...check.sanitized,
      ownerUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return videoId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateVideoRecord(
  videoId: string,
  input: VideoFormInput
): Promise<void> {
  const check = validateAndSanitizeVideoInput(input);
  if (!check.valid || !check.sanitized) {
    throw new Error(check.error ?? 'Invalid video details.');
  }

  const path = `${VIDEOS_COLLECTION}/${videoId}`;
  try {
    await updateDoc(doc(db, VIDEOS_COLLECTION, videoId), {
      ...check.sanitized,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteVideoRecord(videoId: string): Promise<void> {
  const path = `${VIDEOS_COLLECTION}/${videoId}`;
  try {
    await deleteDoc(doc(db, VIDEOS_COLLECTION, videoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedSampleDemoVideosToFirestore(ownerUid: string): Promise<number> {
  let createdCount = 0;
  for (const sample of SAMPLE_DEMO_VIDEOS) {
    const path = `${VIDEOS_COLLECTION}/${sample.id}`;
    try {
      await setDoc(doc(db, VIDEOS_COLLECTION, sample.id), {
        title: sample.title,
        urduTitle: sample.urduTitle,
        description: sample.description,
        category: sample.category,
        thumbnailUrl: sample.thumbnailUrl,
        videoSourceType: sample.videoSourceType,
        videoUrl: sample.videoUrl,
        duration: sample.duration,
        ageRange: sample.ageRange,
        language: sample.language,
        moralLesson: sample.moralLesson,
        isFeatured: sample.isFeatured,
        isPopular: sample.isPopular,
        isFunnyAnimal: sample.isFunnyAnimal,
        isDemo: true,
        isPublished: true,
        rightsConfirmed: true,
        ownerUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      createdCount += 1;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
  return createdCount;
}
