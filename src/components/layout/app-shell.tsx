import { Outlet } from 'react-router'
import { AppSidebar } from './app-sidebar'
import { MobileNavigation } from './mobile-navigation'
import { ProductTopBar } from './product-top-bar'

export function AppShell() {
  return (
    <div className="min-h-screen bg-page text-foreground lg:flex">
      <AppSidebar />
      <div className="min-w-0 flex-1 bg-background">
        <ProductTopBar />
        <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-10 lg:pt-8">
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
    </div>
  )
}
