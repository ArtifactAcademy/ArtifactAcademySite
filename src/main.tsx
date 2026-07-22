import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import { createAppServices } from './lib/services/create-app-services.ts'
import { WaitlistProvider } from './lib/services/waitlist-context.tsx'
import './styles/global.css'

async function bootstrap() {
  const services = await createAppServices()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <WaitlistProvider service={services.waitlist}>
        <BrowserRouter>
          <App loadProtectedServices={services.loadProtectedServices} />
        </BrowserRouter>
      </WaitlistProvider>
    </StrictMode>,
  )
}

void bootstrap()
