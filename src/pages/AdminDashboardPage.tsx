import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  Edit3,
  ExternalLink,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  Plus,
  ShieldAlert,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import type { AppRoute } from '../components/Navbar';
import { useAppContext } from '../context/AppContext';
import { SAMPLE_THUMBNAIL_GALLERY } from '../data/sampleVideos';
import { signInWithGoogle, signOutAccount } from '../lib/firebase';
import { resolveAssetUrl, resolveVideoEmbed } from '../lib/videoUrl';
import {
  deleteInquiry,
  setInquiryStatus,
  subscribeAdminInquiries,
} from '../services/inquiryService';
import {
  createVideoRecord,
  deleteVideoRecord,
  seedSampleDemoVideosToFirestore,
  updateVideoRecord,
} from '../services/videoService';
import {
  CATEGORY_LIST,
  CATEGORY_MAP,
  type ParentInquiry,
  type VideoCategory,
  type VideoFormInput,
  type VideoItem,
  type VideoLanguage,
  type VideoSourceType,
} from '../types/video';

interface AdminDashboardPageProps {
  onNavigate: (next: AppRoute) => void;
}

const EMPTY_FORM: VideoFormInput = {
  title: '',
  urduTitle: '',
  description: '',
  category: 'funny-cartoons',
  thumbnailUrl: SAMPLE_THUMBNAIL_GALLERY[0].url,
  videoSourceType: 'youtube',
  videoUrl: '',
  duration: '3:30',
  ageRange: 'Ages 3–8',
  language: 'English',
  moralLesson: '',
  isFeatured: false,
  isPopular: false,
  isFunnyAnimal: false,
  isDemo: false,
  isPublished: true,
  rightsConfirmed: false,
};

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const { user, authReady, isAdmin, firestoreVideos, usingSampleFallback } = useAppContext();

  const [activeTab, setActiveTab] = useState<'videos' | 'messages' | 'guide'>('videos');
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // Video form modal state
  const [showForm, setShowForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [form, setForm] = useState<VideoFormInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Parent inquiries state
  const [inquiries, setInquiries] = useState<ParentInquiry[]>([]);

  useEffect(() => {
    if (!authReady || !isAdmin) {
      setInquiries([]);
      return;
    }
    const unsub = subscribeAdminInquiries(
      (list) => setInquiries(list),
      (err) => console.error('Inquiries subscription error:', err.message)
    );
    return () => unsub();
  }, [authReady, isAdmin]);

  const handleSignIn = async () => {
    setAuthError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'Google sign-in was cancelled or blocked. Please allow popups and try again.'
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOutAccount();
    setShowForm(false);
    setStatusBanner(null);
  };

  const openAddForm = () => {
    setEditingVideoId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (video: VideoItem) => {
    setEditingVideoId(video.id);
    setForm({
      title: video.title,
      urduTitle: video.urduTitle,
      description: video.description,
      category: video.category,
      thumbnailUrl: video.thumbnailUrl,
      videoSourceType: video.videoSourceType,
      videoUrl: video.videoUrl,
      duration: video.duration,
      ageRange: video.ageRange,
      language: video.language,
      moralLesson: video.moralLesson,
      isFeatured: video.isFeatured,
      isPopular: video.isPopular,
      isFunnyAnimal: video.isFunnyAnimal,
      isDemo: video.isDemo,
      isPublished: video.isPublished,
      rightsConfirmed: video.rightsConfirmed,
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormError(null);
    setSaving(true);
    try {
      if (editingVideoId) {
        await updateVideoRecord(editingVideoId, form);
        setStatusBanner(`Updated "${form.title.trim()}" successfully.`);
      } else {
        await createVideoRecord(form, user.uid);
        setStatusBanner(`Added "${form.title.trim()}" to your live video catalog.`);
      }
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save video. Please review fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (videoId: string, title: string) => {
    try {
      await deleteVideoRecord(videoId);
      setConfirmDeleteId(null);
      setStatusBanner(`Removed "${title}" from Firestore.`);
    } catch (err) {
      setStatusBanner(
        err instanceof Error ? `Delete failed: ${err.message}` : 'Could not delete video.'
      );
    }
  };

  const handleSeedDemos = async () => {
    if (!user) return;
    setSeeding(true);
    setStatusBanner(null);
    try {
      const count = await seedSampleDemoVideosToFirestore(user.uid);
      setStatusBanner(
        `Imported ${count} clearly labeled sample demo videos into Firestore. You can now edit or remove any of them individually.`
      );
    } catch (err) {
      setStatusBanner(
        err instanceof Error ? `Import error: ${err.message}` : 'Could not import sample videos.'
      );
    } finally {
      setSeeding(false);
    }
  };

  const embedPreview = resolveVideoEmbed(form.videoSourceType, form.videoUrl);

  // Loading auth state
  if (!authReady) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center text-slate-600">
        Checking owner credentials...
      </main>
    );
  }

  // Gate 1: Not signed in
  if (!user) {
    return (
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
            Owner Studio Sign In
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            This secure dashboard is restricted strictly to the website owner of Kids Cartoon World.
            Ordinary visitors do not have access to video management tools.
          </p>

          {authError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-left">
              {authError}
            </div>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            disabled={signingIn}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 disabled:opacity-50 transition-colors"
          >
            <span>{signingIn ? 'Signing in...' : 'Sign In with Owner Google Account'}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Kids Cartoon World</span>
          </button>
        </div>
      </main>
    );
  }

  // Gate 2: Signed in, but NOT the authorized owner/admin
  if (!isAdmin) {
    return (
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
            Owner Access Only
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            You are signed in as <span className="font-semibold text-slate-900">{user.email}</span>,
            which is not authorized as an administrator for this website. All write permissions are
            locked server-side in Firestore Security Rules.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'home' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  const openInquiriesCount = inquiries.filter((i) => i.status === 'open').length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Studio Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-emerald-700">
            Verified Owner · {user.email}
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Owner Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Add, edit, publish, or remove authorized videos stored securely in Firebase Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Video</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Status Notice */}
      {statusBanner && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-sm text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            aria-label="Dismiss message"
            className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('videos')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'videos'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video Catalog ({firestoreVideos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'messages'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Parent Messages ({openInquiriesCount} open)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
            activeTab === 'guide'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Beginner Setup & Domain Guide</span>
        </button>
      </div>

      {/* TAB 1: VIDEO CATALOG */}
      {activeTab === 'videos' && (
        <section className="mt-6 space-y-5">
          {usingSampleFallback && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900">
                  Your Firestore catalog is currently empty
                </h2>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                  Visitors currently see the 8 built-in sample demo videos. Click &quot;Add
                  Video&quot; to publish your first real YouTube/authorized video, or import the 8
                  sample demos into Firestore so you can edit or delete them one by one.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSeedDemos}
                disabled={seeding}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-amber-500 text-slate-950 text-sm font-bold hover:bg-amber-400 disabled:opacity-50 whitespace-nowrap shrink-0 transition-colors"
              >
                <Database className="w-4 h-4" />
                <span>{seeding ? 'Importing...' : 'Import 8 Sample Demos to DB'}</span>
              </button>
            </div>
          )}

          {firestoreVideos.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <p className="font-display text-lg font-bold text-slate-900">
                No videos saved in Firestore yet
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Add your own YouTube, Vimeo, or authorized HTTPS video to start building your live
                library.
              </p>
              <button
                type="button"
                onClick={openAddForm}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Video</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {firestoreVideos.map((video) => {
                const cat = CATEGORY_MAP[video.category];
                const isConfirming = confirmDeleteId === video.id;
                return (
                  <div
                    key={video.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <img
                      src={resolveAssetUrl(video.thumbnailUrl)}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full sm:w-40 aspect-video rounded-xl object-cover bg-slate-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                        <span className={`font-semibold ${cat.accentText}`}>{cat.label}</span>
                        <span aria-hidden="true">·</span>
                        <span>{video.videoSourceType.toUpperCase()}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            video.isPublished
                              ? 'text-emerald-700 font-semibold'
                              : 'text-amber-700 font-semibold'
                          }
                        >
                          {video.isPublished ? 'Published' : 'Draft (Hidden)'}
                        </span>
                        {video.isFeatured && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-sky-700 font-semibold">Featured</span>
                          </>
                        )}
                        {video.isDemo && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Demo</span>
                          </>
                        )}
                      </div>

                      <h3 className="mt-1 font-display text-base font-bold text-slate-900 truncate">
                        {video.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-600 line-clamp-1">
                        {video.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onNavigate({ page: 'video', videoId: video.id })}
                        className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditForm(video)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl bg-slate-100 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {isConfirming ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(video.id, video.title)}
                            className="px-3 py-2 min-h-[44px] rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-2 min-h-[44px] rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(video.id)}
                          aria-label={`Delete ${video.title}`}
                          className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: PARENT INQUIRIES */}
      {activeTab === 'messages' && (
        <section className="mt-6 space-y-4">
          {inquiries.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <h2 className="font-display text-lg font-bold text-slate-900">
                No parent messages yet
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Messages submitted by verified parents or rights holders on the Contact Us page will
                appear privately here.
              </p>
            </div>
          ) : (
            inquiries.map((inq) => (
              <div key={inq.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span className="font-bold text-slate-900">{inq.senderName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{inq.senderEmail}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-sky-700 font-semibold">{inq.topic}</span>
                  </div>
                  <span
                    className={
                      inq.status === 'resolved'
                        ? 'text-emerald-700 font-semibold'
                        : 'text-amber-700 font-semibold'
                    }
                  >
                    {inq.status === 'resolved' ? 'Resolved' : 'Open'}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">{inq.message}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setInquiryStatus(inq.id, inq.status === 'open' ? 'resolved' : 'open')
                    }
                    className="px-3.5 py-2 min-h-[44px] rounded-xl bg-slate-100 text-xs font-semibold text-slate-800 hover:bg-slate-200"
                  >
                    {inq.status === 'open' ? 'Mark Resolved' : 'Reopen'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteInquiry(inq.id)}
                    className="px-3.5 py-2 min-h-[44px] rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* TAB 3: BEGINNER SETUP & DOMAIN GUIDE */}
      {activeTab === 'guide' && (
        <section className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Honest Status: What Is Configured Right Now vs. Your Next Steps
            </h2>
            <p className="mt-1 text-slate-600">
              Simple guide written for managing Kids Cartoon World right from an Android phone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <h3 className="font-display text-base font-bold text-slate-900">
                Already Configured & Working
              </h3>
              <ul className="mt-2 space-y-1.5 list-disc list-inside text-slate-700">
                <li>Firebase Firestore database storing your video catalog & parent messages</li>
                <li>Google Sign-In owner-only security rules (only your verified email can edit)</li>
                <li>Privacy-enhanced YouTube & Vimeo embedding + direct HTTPS video playback</li>
                <li>8 clearly labeled original sample demo cartoons with original thumbnails</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h3 className="font-display text-base font-bold text-slate-900">
                Not Configured Yet (Your Choice Later)
              </h3>
              <ul className="mt-2 space-y-1.5 list-disc list-inside text-slate-700">
                <li>Custom domain (e.g., kidscartoonworld.com) — connect after publishing</li>
                <li>Raw video file storage — easiest free method is uploading your own videos to YouTube (&quot;Made for Kids&quot;) and pasting the YouTube link here</li>
                <li>Google AdSense monetization — not active yet; requires Google approval and enabling Child-Directed Treatment (TFCD / non-personalized ads)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="font-display text-base font-bold text-slate-900">
              How to Add Your Own Cartoon from an Android Phone (3 Easy Steps)
            </h3>
            <ol className="space-y-2 list-decimal list-inside">
              <li>
                Upload your original cartoon or Urdu story video to your own YouTube channel (mark
                audience as <strong>Yes, it&apos;s made for kids</strong>) or another authorized
                video host, then tap <strong>Share → Copy Link</strong>.
              </li>
              <li>
                Open this Owner Studio (via the quiet <strong>Owner Sign In</strong> link at the
                bottom of the site) and tap <strong>Add Video</strong>.
              </li>
              <li>
                Paste your link, tap <strong>Use YouTube Thumbnail</strong> (or choose an artwork),
                check the ownership confirmation box, and tap <strong>Save Video</strong>. It goes
                live immediately for all visitors!
              </li>
            </ol>
          </div>
        </section>
      )}

      {/* ADD / EDIT VIDEO MODAL */}
      {showForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingVideoId ? 'Edit video' : 'Add new video'}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h2 className="font-display text-lg font-bold text-slate-900">
                {editingVideoId ? 'Edit Video' : 'Add Authorized Video'}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveVideo} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-800">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={120}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., The Helpful Little Elephant"
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Urdu Title (Optional)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    maxLength={120}
                    value={form.urduTitle}
                    onChange={(e) => setForm({ ...form, urduTitle: e.target.value })}
                    placeholder="اردو عنوان (اختیاری)"
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as VideoCategory })
                    }
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm"
                  >
                    {CATEGORY_LIST.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Language *</label>
                  <select
                    value={form.language}
                    onChange={(e) =>
                      setForm({ ...form, language: e.target.value as VideoLanguage })
                    }
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm"
                  >
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Urdu & English">Urdu & English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Source Type *
                  </label>
                  <select
                    value={form.videoSourceType}
                    onChange={(e) => {
                      const nextSource = e.target.value as VideoSourceType;
                      setForm({
                        ...form,
                        videoSourceType: nextSource,
                        videoUrl: nextSource === 'demo' ? '' : form.videoUrl,
                        isDemo: nextSource === 'demo' ? true : form.isDemo,
                      });
                    }}
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm"
                  >
                    <option value="youtube">YouTube Embed Link</option>
                    <option value="vimeo">Vimeo Embed Link</option>
                    <option value="direct">Authorized Direct Video (HTTPS)</option>
                    <option value="demo">Demo Storybook Preview</option>
                  </select>
                </div>
              </div>

              {form.videoSourceType !== 'demo' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Authorized Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    maxLength={500}
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    placeholder={
                      form.videoSourceType === 'youtube'
                        ? 'https://www.youtube.com/watch?v=... or https://youtu.be/...'
                        : form.videoSourceType === 'vimeo'
                          ? 'https://vimeo.com/123456789'
                          : 'https://your-host.example.com/cartoon.mp4'
                    }
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 text-sm"
                  />
                  {form.videoUrl.trim() && (
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {embedPreview.valid ? (
                        <span className="text-emerald-700 font-medium">
                          Valid {embedPreview.providerLabel}
                        </span>
                      ) : (
                        <span className="text-rose-700">{embedPreview.error}</span>
                      )}

                      {embedPreview.suggestedThumbnail && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              thumbnailUrl: embedPreview.suggestedThumbnail || form.thumbnailUrl,
                            })
                          }
                          className="text-sky-700 font-semibold hover:underline"
                        >
                          Use YouTube Thumbnail
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Thumbnail URL or Sample Artwork *
                </label>
                <input
                  type="text"
                  required
                  maxLength={500}
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  placeholder="https://... or select a sample artwork below"
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 text-sm"
                />
                <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
                  {SAMPLE_THUMBNAIL_GALLERY.map((art) => (
                    <button
                      key={art.url}
                      type="button"
                      onClick={() => setForm({ ...form, thumbnailUrl: art.url })}
                      className={`shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                        form.thumbnailUrl === art.url ? 'border-sky-600' : 'border-transparent'
                      }`}
                      title={art.label}
                    >
                      <img
                        src={resolveAssetUrl(art.url)}
                        alt={art.label}
                        className="w-16 h-10 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Duration *</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={20}
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g., 4:15"
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Age Range *</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={30}
                    value={form.ageRange}
                    onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
                    placeholder="e.g., Ages 3–8"
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Description *</label>
                <textarea
                  required
                  minLength={10}
                  maxLength={1200}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Write a warm, child-friendly summary of this cartoon or story..."
                  className="mt-1 w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Moral / Learning Takeaway (Optional)
                </label>
                <input
                  type="text"
                  maxLength={240}
                  value={form.moralLesson}
                  onChange={(e) => setForm({ ...form, moralLesson: e.target.value })}
                  placeholder="e.g., Kindness and honesty always bring happiness."
                  className="mt-1 w-full h-11 px-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              {/* Placement Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600"
                  />
                  <span>Published (Visible)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600"
                  />
                  <span>Featured Hero</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600"
                  />
                  <span>Popular Cartoons</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={form.isFunnyAnimal}
                    onChange={(e) => setForm({ ...form, isFunnyAnimal: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600"
                  />
                  <span>Funny Animal Shelf</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={form.isDemo}
                    disabled={form.videoSourceType === 'demo'}
                    onChange={(e) => setForm({ ...form, isDemo: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-sky-600"
                  />
                  <span>Label as Demo Video</span>
                </label>
              </div>

              {/* Mandatory Ownership / Rights Attestation */}
              <div className="p-3.5 rounded-xl bg-sky-50/80 border border-sky-200">
                <label className="flex items-start gap-2.5 text-xs text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.rightsConfirmed}
                    onChange={(e) => setForm({ ...form, rightsConfirmed: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-sky-600"
                  />
                  <span>
                    <strong>Rights Confirmation (Required):</strong> I confirm that I own this video
                    or have explicit permission to embed it from authorized hosting, and I am not
                    copying copyrighted cartoons from other creators.
                  </span>
                </label>
              </div>

              {/* Sticky Footer Actions */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 min-h-[44px] rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingVideoId ? 'Save Changes' : 'Publish Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
