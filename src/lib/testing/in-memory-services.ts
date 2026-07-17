import type { LearningSubmission } from '../../content/types'
import type {
  AppServices,
  AuthUser,
  StudentCourseState,
} from '../services/types'

type TestUserKey = 'enrolled' | 'unenrolled' | 'student-b'

interface TestProgress {
  completedItemIds: string[]
  completedLabIds: string[]
}

interface TestStudent {
  user: AuthUser
  profile: StudentCourseState['profile']
  enrollmentStatus: StudentCourseState['enrollmentStatus']
  progress: TestProgress
  submissions: Record<string, LearningSubmission | undefined>
}

interface TestStore {
  currentUserKey: TestUserKey | null
  magicLinkEmail: string | null
  students: Record<TestUserKey, TestStudent>
}

export interface ArtifactAcademyTestHarness {
  reset: () => void
  signInAs: (user: TestUserKey) => void
  signOut: () => void
  seedProgress: (
    user: TestUserKey,
    progress: Partial<TestProgress>,
  ) => void
  seedSubmission: (
    user: TestUserKey,
    assignmentId: string,
    submission: LearningSubmission,
  ) => void
  snapshot: (user: TestUserKey) => TestStudent
}

declare global {
  interface Window {
    __ARTIFACT_ACADEMY_TEST__?: ArtifactAcademyTestHarness
  }
}

const storageKey = 'artifact-academy-test-repository'

function createInitialStore(): TestStore {
  return {
    currentUserKey: null,
    magicLinkEmail: null,
    students: {
      enrolled: {
        user: { id: '00000000-0000-0000-0000-000000000001', email: 'jordan@example.com' },
        profile: {
          id: '00000000-0000-0000-0000-000000000001',
          fullName: 'Jordan Diaz',
          role: 'student',
        },
        enrollmentStatus: 'active',
        progress: { completedItemIds: [], completedLabIds: [] },
        submissions: {},
      },
      unenrolled: {
        user: { id: '00000000-0000-0000-0000-000000000002', email: 'pending@example.com' },
        profile: {
          id: '00000000-0000-0000-0000-000000000002',
          fullName: 'Pending Student',
          role: 'student',
        },
        enrollmentStatus: null,
        progress: { completedItemIds: [], completedLabIds: [] },
        submissions: {},
      },
      'student-b': {
        user: { id: '00000000-0000-0000-0000-000000000003', email: 'casey@example.com' },
        profile: {
          id: '00000000-0000-0000-0000-000000000003',
          fullName: 'Casey Morgan',
          role: 'student',
        },
        enrollmentStatus: 'active',
        progress: { completedItemIds: [], completedLabIds: [] },
        submissions: {},
      },
    },
  }
}

function readStore() {
  const stored = window.sessionStorage.getItem(storageKey)
  if (!stored) return createInitialStore()

  try {
    return JSON.parse(stored) as TestStore
  } catch {
    return createInitialStore()
  }
}

function cloneStudent(student: TestStudent): TestStudent {
  return structuredClone(student)
}

export function createInMemoryAppServices(): AppServices {
  let store = readStore()
  const authListeners = new Set<(user: AuthUser | null) => void>()

  function persist() {
    window.sessionStorage.setItem(storageKey, JSON.stringify(store))
  }

  function currentStudent() {
    if (!store.currentUserKey) throw new Error('You must be signed in.')
    return store.students[store.currentUserKey]
  }

  function emitAuthChange() {
    const user = store.currentUserKey ? store.students[store.currentUserKey].user : null
    authListeners.forEach((listener) => listener(user))
  }

  const services: AppServices = {
    auth: {
      handleCallback() {
        return Promise.resolve()
      },
      getCurrentUser() {
        return Promise.resolve(
          store.currentUserKey ? store.students[store.currentUserKey].user : null,
        )
      },
      onAuthStateChange(listener) {
        authListeners.add(listener)
        return () => authListeners.delete(listener)
      },
      sendMagicLink(email) {
        store.magicLinkEmail = email
        persist()
        return Promise.resolve()
      },
      signOut() {
        store.currentUserKey = null
        persist()
        emitAuthChange()
        return Promise.resolve()
      },
    },
    learning: {
      loadCourseState() {
        const student = currentStudent()
        return Promise.resolve({
          profile: structuredClone(student.profile),
          enrollmentStatus: student.enrollmentStatus,
          completedItemIds: [...student.progress.completedItemIds],
          completedLabIds: [...student.progress.completedLabIds],
          submissions: structuredClone(student.submissions),
        })
      },
      completeLab(_courseId, _itemId, labId) {
        const student = currentStudent()
        if (student.enrollmentStatus !== 'active') throw new Error('Active enrollment required.')
        if (!student.progress.completedLabIds.includes(labId)) {
          student.progress.completedLabIds.push(labId)
          persist()
        }
        return Promise.resolve()
      },
      completeLesson(_courseId, itemId) {
        const student = currentStudent()
        if (student.enrollmentStatus !== 'active') throw new Error('Active enrollment required.')
        if (!student.progress.completedItemIds.includes(itemId)) {
          student.progress.completedItemIds.push(itemId)
          persist()
        }
        return Promise.resolve()
      },
      submitArtifact(_courseId, assignmentId, submission) {
        const student = currentStudent()
        if (student.enrollmentStatus !== 'active') throw new Error('Active enrollment required.')
        const existing = student.submissions[assignmentId]
        if (existing && existing.status !== 'needs-revision') {
          throw new Error('This artifact cannot be revised in its current state.')
        }

        const nextSubmission: LearningSubmission = {
          ...submission,
          status: 'submitted',
        }
        student.submissions[assignmentId] = nextSubmission
        persist()
        return Promise.resolve(structuredClone(nextSubmission))
      },
    },
  }

  window.__ARTIFACT_ACADEMY_TEST__ = {
    reset() {
      store = createInitialStore()
      persist()
      emitAuthChange()
    },
    signInAs(user) {
      store.currentUserKey = user
      persist()
      emitAuthChange()
    },
    signOut() {
      store.currentUserKey = null
      persist()
      emitAuthChange()
    },
    seedProgress(user, progress) {
      const current = store.students[user].progress
      store.students[user].progress = {
        completedItemIds: progress.completedItemIds
          ? [...progress.completedItemIds]
          : current.completedItemIds,
        completedLabIds: progress.completedLabIds
          ? [...progress.completedLabIds]
          : current.completedLabIds,
      }
      persist()
    },
    seedSubmission(user, assignmentId, submission) {
      store.students[user].submissions[assignmentId] = structuredClone(submission)
      persist()
    },
    snapshot(user) {
      return cloneStudent(store.students[user])
    },
  }

  return services
}
