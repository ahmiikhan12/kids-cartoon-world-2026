import { useCallback, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Navbar, type AppRoute } from './components/Navbar';
import { AppProvider, useAppContext } from './context/AppContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CategoryPage } from './pages/CategoryPage';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage, ContactPage, PrivacyPolicyPage, TermsPage } from './pages/StaticPages';
import { VideoDetailPage } from './pages/VideoDetailPage';
import type { VideoCategory } from './types/video';

const VALID_CATEGORIES: VideoCategory[] = [
  'funny-cartoons',
  'urdu-stories',
  'educational-videos',
  'bedtime-stories',
];

function parseHashToRoute(hash: string): AppRoute {
  const cleaned = hash.replace(/^#\/?/, '').trim();
  if (!cleaned) return { page: 'home' };

  const [segment, ...rest] = cleaned.split('/');
  const param = decodeURIComponent(rest.join('/'));

  if (segment === 'category' && VALID_CATEGORIES.includes(param as VideoCategory)) {
    return { page: 'category', category: param as VideoCategory };
  }
  if (segment === 'watch' && param) {
    return { page: 'video', videoId: param };
  }
  if (segment === 'search') {
    return { page: 'search', query: param || '' };
  }
  if (segment === 'about') return { page: 'about' };
  if (segment === 'contact') return { page: 'contact' };
  if (segment === 'privacy') return { page: 'privacy' };
  if (segment === 'terms') return { page: 'terms' };
  if (segment === 'owner-studio' || segment === 'admin') return { page: 'admin' };

  return { page: 'home' };
}

function routeToHash(route: AppRoute): string {
  switch (route.page) {
    case 'home':
      return '#/';
    case 'category':
      return `#/category/${route.category}`;
    case 'video':
      return `#/watch/${encodeURIComponent(route.videoId)}`;
    case 'search':
      return route.query ? `#/search/${encodeURIComponent(route.query)}` : '#/search';
    case 'about':
      return '#/about';
    case 'contact':
      return '#/contact';
    case 'privacy':
      return '#/privacy';
    case 'terms':
      return '#/terms';
    case 'admin':
      return '#/owner-studio';
  }
}

function KidsCartoonWorldApp() {
  const { publicVideos, loadingVideos } = useAppContext();
  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? parseHashToRoute(window.location.hash) : { page: 'home' }
  );

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashToRoute(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = useCallback((next: AppRoute) => {
    setRoute(next);
    const nextHash = routeToHash(next);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#162032]">
      <Navbar route={route} onNavigate={handleNavigate} />

      <div className="flex-1">
        {route.page === 'home' && (
          <HomePage
            videos={publicVideos}
            loading={loadingVideos}
            onNavigate={handleNavigate}
          />
        )}
        {route.page === 'category' && (
          <CategoryPage
            category={route.category}
            videos={publicVideos}
            onNavigate={handleNavigate}
          />
        )}
        {route.page === 'video' && (
          <VideoDetailPage
            videoId={route.videoId}
            videos={publicVideos}
            onNavigate={handleNavigate}
          />
        )}
        {route.page === 'search' && (
          <SearchPage
            initialQuery={route.query}
            videos={publicVideos}
            onNavigate={handleNavigate}
          />
        )}
        {route.page === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {route.page === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        {route.page === 'privacy' && <PrivacyPolicyPage onNavigate={handleNavigate} />}
        {route.page === 'terms' && <TermsPage onNavigate={handleNavigate} />}
        {route.page === 'admin' && <AdminDashboardPage onNavigate={handleNavigate} />}
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <KidsCartoonWorldApp />
    </AppProvider>
  );
}
