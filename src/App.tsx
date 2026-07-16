import { Award, Boxes, Library, UsersRound } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from './components/layout/app-shell'
import { ComponentGalleryPage } from './pages/component-gallery-page'
import { CourseOverviewPage } from './pages/course-overview-page'
import { CoursesPage } from './pages/courses-page'
import { DashboardPage } from './pages/dashboard-page'
import { LessonPlayerPage } from './pages/lesson-player-page'
import { NotFoundPage } from './pages/not-found-page'
import { PlaceholderPage } from './pages/placeholder-page'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate replace to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="components" element={<ComponentGalleryPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/ai-creator-bootcamp" element={<CourseOverviewPage />} />
        <Route path="courses/ai-creator-bootcamp/lessons/:lessonId" element={<LessonPlayerPage />} />
        <Route path="artifacts" element={<PlaceholderPage icon={Boxes} title="Artifacts" description="Artifact creation and publishing are represented by mock components in Milestone 0." />} />
        <Route path="portfolio" element={<PlaceholderPage icon={Library} title="Portfolio" description="Public portfolio publishing is intentionally not connected yet." />} />
        <Route path="certificate" element={<PlaceholderPage icon={Award} title="Certificate" description="Certificate eligibility remains mock progress until course data exists." />} />
        <Route path="community" element={<PlaceholderPage icon={UsersRound} title="Community" description="Community features are outside Milestone 0." />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
