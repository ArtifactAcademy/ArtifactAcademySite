import type { AppServiceBootstrap, ProtectedServices } from './types'

export async function createAppServices(): Promise<AppServiceBootstrap> {
  if (import.meta.env.MODE === 'test') {
    const { createInMemoryAppServices } = await import('../testing/in-memory-services')
    const services = createInMemoryAppServices()
    return {
      waitlist: services.waitlist,
      loadProtectedServices: () => Promise.resolve(services),
    }
  }

  const { createSupabaseWaitlistService } = await import('../supabase/waitlist')
  let protectedServicesPromise: Promise<ProtectedServices> | undefined

  return {
    waitlist: createSupabaseWaitlistService(),
    loadProtectedServices() {
      protectedServicesPromise ??= Promise.all([
        import('../supabase/auth'),
        import('../supabase/learning-repository'),
      ]).then(([{ createSupabaseAuthService }, { createSupabaseLearningRepository }]) => ({
        auth: createSupabaseAuthService(),
        learning: createSupabaseLearningRepository(),
      }))
      return protectedServicesPromise
    },
  }
}
