import { useNavigate } from 'react-router'
import { CourseCard } from '../components/academy/course-card'
import { currentCourse } from '../lib/mock-data'

export function CoursesPage() {
  const navigate = useNavigate()

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-subtle">Artifact Academy</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">My courses</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Continue an active program or review its curriculum.</p>
      <div className="mt-7 max-w-xl">
        <CourseCard course={currentCourse} onOpen={() => void navigate(`/courses/${currentCourse.id}`)} />
      </div>
    </div>
  )
}
