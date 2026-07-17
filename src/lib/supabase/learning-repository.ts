import type { LearningSubmission, SubmissionStatus } from '../../content/types'
import type {
  LearningRepository,
  StudentCourseState,
  SubmissionInput,
} from '../services/types'
import { getSupabaseClient } from './client'

interface ProfileRecord {
  id: string
  full_name: string
  role: 'student' | 'instructor'
}

interface EnrollmentRecord {
  status: 'active' | 'inactive'
}

interface ProgressRecord {
  item_id: string
  completed_lab_ids: string[]
  completed_at: string | null
}

interface SubmissionRecord {
  assignment_id: string
  live_url: string
  source_url: string
  note: string
  status: 'submitted' | 'needs_revision' | 'approved'
  feedback: string | null
}

function mapStatus(status: SubmissionRecord['status']): SubmissionStatus {
  return status === 'needs_revision' ? 'needs-revision' : status
}

function mapSubmission(record: SubmissionRecord): LearningSubmission {
  return {
    status: mapStatus(record.status),
    liveUrl: record.live_url,
    sourceUrl: record.source_url,
    note: record.note,
    ...(record.feedback ? { feedback: record.feedback } : {}),
  }
}

async function requireUserId() {
  const client = getSupabaseClient()
  const { data, error } = await client.auth.getUser()
  if (error || !data.user) throw error ?? new Error('You must be signed in.')
  return data.user.id
}

export function createSupabaseLearningRepository(): LearningRepository {
  const client = getSupabaseClient()

  return {
    async loadCourseState(courseId): Promise<StudentCourseState> {
      const userId = await requireUserId()
      const [{ data: profileData, error: profileError }, { data: enrollmentData, error: enrollmentError }] =
        await Promise.all([
          client.from('profiles').select('id, full_name, role').eq('id', userId).maybeSingle(),
          client.from('enrollments').select('status').eq('user_id', userId).eq('course_id', courseId).maybeSingle(),
        ])

      if (profileError) throw profileError
      if (enrollmentError) throw enrollmentError
      if (!profileData) throw new Error('Your student profile is not available.')

      const profile: ProfileRecord = profileData
      const enrollment: EnrollmentRecord | null = enrollmentData

      if (enrollment?.status !== 'active') {
        return {
          profile: { id: profile.id, fullName: profile.full_name, role: profile.role },
          enrollmentStatus: enrollment?.status ?? null,
          completedItemIds: [],
          completedLabIds: [],
          submissions: {},
        }
      }

      const [{ data: progressData, error: progressError }, { data: submissionData, error: submissionError }] =
        await Promise.all([
          client
            .from('lesson_progress')
            .select('item_id, completed_lab_ids, completed_at')
            .eq('user_id', userId)
            .eq('course_id', courseId),
          client
            .from('submissions')
            .select('assignment_id, live_url, source_url, note, status, feedback')
            .eq('user_id', userId)
            .eq('course_id', courseId),
        ])

      if (progressError) throw progressError
      if (submissionError) throw submissionError

      const progress = (progressData ?? []) as ProgressRecord[]
      const submissions = (submissionData ?? []) as SubmissionRecord[]

      return {
        profile: { id: profile.id, fullName: profile.full_name, role: profile.role },
        enrollmentStatus: 'active',
        completedItemIds: progress.filter((record) => record.completed_at).map((record) => record.item_id),
        completedLabIds: [...new Set(progress.flatMap((record) => record.completed_lab_ids))],
        submissions: Object.fromEntries(
          submissions.map((record) => [record.assignment_id, mapSubmission(record)]),
        ),
      }
    },

    async completeLab(courseId, itemId, labId) {
      const { error } = await client.rpc('complete_lab', {
        target_course_id: courseId,
        target_item_id: itemId,
        target_lab_id: labId,
      })
      if (error) throw error
    },

    async completeLesson(courseId, itemId) {
      const { error } = await client.rpc('complete_lesson', {
        target_course_id: courseId,
        target_item_id: itemId,
      })
      if (error) throw error
    },

    async submitArtifact(
      courseId: string,
      assignmentId: string,
      submission: SubmissionInput,
    ) {
      const userId = await requireUserId()
      const payload = {
        live_url: submission.liveUrl,
        source_url: submission.sourceUrl,
        note: submission.note,
        status: 'submitted' as const,
      }

      const { data: existing, error: existingError } = await client
        .from('submissions')
        .select('status')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('assignment_id', assignmentId)
        .maybeSingle()

      if (existingError) throw existingError

      const query = existing
        ? client
            .from('submissions')
            .update(payload)
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .eq('assignment_id', assignmentId)
            .eq('status', 'needs_revision')
        : client.from('submissions').insert({
            ...payload,
            user_id: userId,
            course_id: courseId,
            assignment_id: assignmentId,
          })

      const { data, error } = await query
        .select('assignment_id, live_url, source_url, note, status, feedback')
        .single()

      if (error) throw error
      return mapSubmission(data)
    },
  }
}
