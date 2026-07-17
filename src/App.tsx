import { Route, Routes } from 'react-router'
import { LearningShell } from './components/layout/learning-shell'
import { ComponentGalleryPage } from './pages/component-gallery-page'
import { LearningIndexPage } from './pages/learning-index-page'
import { LearningWorkspacePage } from './pages/learning-workspace-page'
import { NotFoundPage } from './pages/not-found-page'
import { PublicEntryPage } from './pages/public-entry-page'

function App() {
  return (
    <Routes>
      <Route index element={<PublicEntryPage />} />
      <Route path="login" element={<PublicEntryPage login />} />
      <Route element={<LearningShell />} path="learn">
        <Route index element={<LearningIndexPage />} />
        <Route path=":lessonId" element={<LearningWorkspacePage />} />
      </Route>
      {import.meta.env.DEV && <Route path="components" element={<ComponentGalleryPage />} />}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
