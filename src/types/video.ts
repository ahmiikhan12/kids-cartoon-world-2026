export type VideoCategory =
  | 'funny-cartoons'
  | 'urdu-stories'
  | 'educational-videos'
  | 'bedtime-stories';

export type VideoSourceType = 'demo' | 'youtube' | 'vimeo' | 'direct';

export type VideoLanguage = 'English' | 'Urdu' | 'Urdu & English';

export interface StoryScene {
  heading: string;
  caption: string;
  urduCaption?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  urduTitle: string;
  description: string;
  category: VideoCategory;
  thumbnailUrl: string;
  videoSourceType: VideoSourceType;
  videoUrl: string;
  duration: string;
  ageRange: string;
  language: VideoLanguage;
  moralLesson: string;
  isFeatured: boolean;
  isPopular: boolean;
  isFunnyAnimal: boolean;
  isDemo: boolean;
  isPublished: boolean;
  rightsConfirmed: boolean;
  ownerUid: string;
  createdAtMs: number;
  updatedAtMs: number;
  /** Optional local storybook scenes used only for built-in clearly labeled Demo Videos */
  demoScenes?: StoryScene[];
  /** Indicates whether this record is loaded live from Firestore or local sample fallback */
  storageOrigin?: 'firestore' | 'sample';
}

export interface VideoFormInput {
  title: string;
  urduTitle: string;
  description: string;
  category: VideoCategory;
  thumbnailUrl: string;
  videoSourceType: VideoSourceType;
  videoUrl: string;
  duration: string;
  ageRange: string;
  language: VideoLanguage;
  moralLesson: string;
  isFeatured: boolean;
  isPopular: boolean;
  isFunnyAnimal: boolean;
  isDemo: boolean;
  isPublished: boolean;
  rightsConfirmed: boolean;
}

export interface ParentInquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  topic: 'General Question' | 'Content Feedback' | 'Rights & Permissions' | 'Privacy Inquiry';
  message: string;
  isAdultConfirmed: boolean;
  status: 'open' | 'resolved';
  ownerUid: string;
  createdAtMs: number;
}

export interface CategoryMeta {
  id: VideoCategory;
  label: string;
  shortLabel: string;
  subtitle: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
}

export const CATEGORY_LIST: CategoryMeta[] = [
  {
    id: 'funny-cartoons',
    label: 'Funny Cartoons',
    shortLabel: 'Funny',
    subtitle: 'Cheerful animal adventures and light-hearted giggles for the whole family.',
    accentText: 'text-amber-700',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
  },
  {
    id: 'urdu-stories',
    label: 'Urdu Stories',
    shortLabel: 'Urdu Stories',
    subtitle: 'Timeless Urdu moral stories celebrating honesty, kindness, patience, and respect.',
    accentText: 'text-emerald-700',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
  },
  {
    id: 'educational-videos',
    label: 'Educational Videos',
    shortLabel: 'Educational',
    subtitle: 'Curiosity-sparking lessons on numbers, shapes, nature, weather, and everyday science.',
    accentText: 'text-sky-700',
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-200',
  },
  {
    id: 'bedtime-stories',
    label: 'Bedtime Stories',
    shortLabel: 'Bedtime',
    subtitle: 'Calm, gentle tales crafted for peaceful evenings and sweet dreams.',
    accentText: 'text-indigo-700',
    accentBg: 'bg-indigo-50',
    accentBorder: 'border-indigo-200',
  },
];

export const CATEGORY_MAP: Record<VideoCategory, CategoryMeta> = {
  'funny-cartoons': CATEGORY_LIST[0],
  'urdu-stories': CATEGORY_LIST[1],
  'educational-videos': CATEGORY_LIST[2],
  'bedtime-stories': CATEGORY_LIST[3],
};

export const OWNER_EMAIL = 'ahmadauto4645@gmail.com';
