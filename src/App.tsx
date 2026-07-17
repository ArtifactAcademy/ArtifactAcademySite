import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { LearningShell } from './components/layout/learning-shell'
import { LearningIndexPage } from './pages/learning-index-page'
import { LearningWorkspacePage } from './pages/learning-workspace-page'
import { NotFoundPage } from './pages/not-found-page'
import { PublicEntryPage } from './pages/public-entry-page'
import { LoginPage } from './pages/login-page'

const DevelopmentComponentGallery = import.meta.env.DEV
  ? lazy(() => import('./pages/component-gallery-page').then((module) => ({ default: module.ComponentGalleryPage })))
  : null

function App() {
  return (
    <Routes>
      <Route index element={<PublicEntryPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route element={<LearningShell />} path="learn">
        <Route index element={<LearningIndexPage />} />
        <Route path=":lessonId" element={<LearningWorkspacePage />} />
      </Route>
      {DevelopmentComponentGallery && (
        <Route
          path="components"
          element={<Suspense fallback={null}><DevelopmentComponentGallery /></Suspense>}
        />
      )}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
