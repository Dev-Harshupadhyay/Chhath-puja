import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { GridSkeleton } from './components/common/Skeleton';

/* Code splitting: the home bundle stays small, everything else
   arrives the first time a route is opened. */
const Home = lazy(() => import('./pages/Home'));
const Library = lazy(() => import('./pages/Library'));
const Artists = lazy(() => import('./pages/Artists'));
const ArtistDetail = lazy(() => import('./pages/ArtistDetail'));
const Playlists = lazy(() => import('./pages/Playlists'));
const PlaylistDetail = lazy(() => import('./pages/PlaylistDetail'));
const FourDays = lazy(() => import('./pages/FourDays'));
const DayDetail = lazy(() => import('./pages/DayDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Favorites = lazy(() => import('./pages/Favorites'));
const NotFound = lazy(() => import('./pages/NotFound'));

const RouteFallback = () => (
  <div className="shell" style={{ paddingBlock: 'var(--s-10)' }}>
    <GridSkeleton count={8} />
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<RouteFallback />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="library"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Library />
            </Suspense>
          }
        />
        <Route
          path="artists"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Artists />
            </Suspense>
          }
        />
        <Route
          path="artists/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ArtistDetail />
            </Suspense>
          }
        />
        <Route
          path="playlists"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Playlists />
            </Suspense>
          }
        />
        <Route
          path="playlists/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <PlaylistDetail />
            </Suspense>
          }
        />
        <Route
          path="four-days"
          element={
            <Suspense fallback={<RouteFallback />}>
              <FourDays />
            </Suspense>
          }
        />
        <Route
          path="four-days/:key"
          element={
            <Suspense fallback={<RouteFallback />}>
              <DayDetail />
            </Suspense>
          }
        />
        <Route
          path="gallery"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Gallery />
            </Suspense>
          }
        />
        <Route
          path="favorites"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Favorites />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
