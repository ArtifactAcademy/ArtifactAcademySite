import { Navigate, useOutletContext } from 'react-router'
import type { LearningShellContext } from '../components/layout/learning-shell'

export function LearningIndexPage() {
  const { currentItemId } = useOutletContext<LearningShellContext>()
  return <Navigate replace to={`/learn/${currentItemId}`} />
}
