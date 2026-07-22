import type { LearningSubmission } from '../../content/types'

export interface AuthUser {
  id: string
  email: string
}

export interface AuthService {
  handleCallback: () => Promise<void>
  getCurrentUser: () => Promise<AuthUser | null>
  onAuthStateChange: (listener: (user: AuthUser | null) => void) => () => void
  sendMagicLink: (email: string, redirectTo: string) => Promise<void>
  signOut: () => Promise<void>
}

export interface StudentProfile {
  id: string
  fullName: string
  role: 'student' | 'instructor'
}

export interface StudentCourseState {
  profile: StudentProfile
  enrollmentStatus: 'active' | 'inactive' | null
  completedItemIds: string[]
  completedLabIds: string[]
  submissions: Record<string, LearningSubmission | undefined>
}

export interface SubmissionInput {
  liveUrl: string
  sourceUrl: string
  note: string
}

export interface LearningRepository {
  loadCourseState: (courseId: string) => Promise<StudentCourseState>
  completeLab: (courseId: string, itemId: string, labId: string) => Promise<void>
  completeLesson: (courseId: string, itemId: string) => Promise<void>
  submitArtifact: (
    courseId: string,
    assignmentId: string,
    submission: SubmissionInput,
  ) => Promise<LearningSubmission>
}

export interface WaitlistSignupInput {
  email: string
  source?: 'landing-hero' | 'landing-footer'
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  website?: string
}

export interface WaitlistService {
  join: (signup: WaitlistSignupInput) => Promise<void>
}

export interface AppServices {
  auth: AuthService
  learning: LearningRepository
  waitlist: WaitlistService
}

export type ProtectedServices = Pick<AppServices, 'auth' | 'learning'>

export interface AppServiceBootstrap {
  waitlist: WaitlistService
  loadProtectedServices: () => Promise<ProtectedServices>
}
