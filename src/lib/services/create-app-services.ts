import type { AppServices } from './types'

export async function createAppServices(): Promise<AppServices> {
  if (import.meta.env.MODE === 'test') {
    const { createInMemoryAppServices } = await import('../testing/in-memory-services')
    return createInMemoryAppServices()
  }

  const [{ createSupabaseAuthService }, { createSupabaseLearningRepository }] = await Promise.all([
    import('../supabase/auth'),
    import('../supabase/learning-repository'),
  ])

  return {
    auth: createSupabaseAuthService(),
    learning: createSupabaseLearningRepository(),
  }
}
