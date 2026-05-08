import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HelmetProvider habilita el manejo del <head> via react-helmet-async en toda la app */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
