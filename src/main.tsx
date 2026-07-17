import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import { AuthProvider } from './components/auth/auth-provider.tsx'
import { createAppServices } from './lib/services/create-app-services.ts'
import { ServiceProvider } from './lib/services/service-context.tsx'
import './styles/global.css'

async function bootstrap() {
  const services = await createAppServices()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ServiceProvider services={services}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ServiceProvider>
    </StrictMode>,
  )
}

void bootstrap()
