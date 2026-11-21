import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { SAMPLE_DEMO_VIDEOS } from '../data/sampleVideos';
import { auth, db } from '../lib/firebase';
import { subscribeAllAdminVideos, subscribePublicVideos } from '../services/videoService';
import { OWNER_EMAIL, type VideoItem } from '../types/video';

interface AppContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  /** Publicly visible videos (Firestore published videos if present, otherwise clearly labeled demo samples) */
  publicVideos: VideoItem[];
  /** Raw videos saved in Firestore (for Admin Dashboard management) */
  firestoreVideos: VideoItem[];
  /** True when Firestore currently has no saved videos and local demo samples are being displayed */
  usingSampleFallback: boolean;
  loadingVideos: boolean;
  videoLoadError: string | null;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [publicFirestoreVideos, setPublicFirestoreVideos] = useState<VideoItem[]>([]);
  const [adminFirestoreVideos, setAdminFirestoreVideos] = useState<VideoItem[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [videoLoadError, setVideoLoadError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser || !nextUser.emailVerified) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      if (nextUser.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()) {
        setIsAdmin(true);
        setAuthReady(true);
        return;
      }

      try {
        const adminSnap = await getDoc(doc(db, 'admins', nextUser.uid));
        setIsAdmin(adminSnap.exists());
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsub();
  }, []);

  // Subscribe to published public videos for all visitors
  useEffect(() => {
    setLoadingVideos(true);
    const unsub = subscribePublicVideos(
      (items) => {
        setPublicFirestoreVideos(items);
        setVideoLoadError(null);
        setLoadingVideos(false);
      },
      (err) => {
        setVideoLoadError(err.message);
        setLoadingVideos(false);
      }
    );
    return () => unsub();
  }, []);

  // Subscribe to full catalog (including drafts) only when verified admin is signed in
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setAdminFirestoreVideos([]);
      return;
    }
    const unsub = subscribeAllAdminVideos(
      (items) => {
        setAdminFirestoreVideos(items);
      },
      (err) => {
        console.error('Admin video sync error:', err.message);
      }
    );
    return () => unsub();
  }, [authReady, isAdmin]);

  const value = useMemo<AppContextValue>(() => {
    const usingSampleFallback = publicFirestoreVideos.length === 0;
    const publicVideos = usingSampleFallback ? SAMPLE_DEMO_VIDEOS : publicFirestoreVideos;
    return {
      user,
      authReady,
      isAdmin,
      publicVideos,
      firestoreVideos: isAdmin ? adminFirestoreVideos : publicFirestoreVideos,
      usingSampleFallback,
      loadingVideos,
      videoLoadError,
    };
  }, [
    user,
    authReady,
    isAdmin,
    publicFirestoreVideos,
    adminFirestoreVideos,
    loadingVideos,
    videoLoadError,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return ctx;
}
