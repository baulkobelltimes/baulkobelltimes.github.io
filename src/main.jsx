import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// GitHub Pages SPA redirect handler
if (typeof window !== 'undefined') {
  const redirect = sessionStorage.redirect;
  if (redirect) {
    delete sessionStorage.redirect;
    // Navigate to the stored path
    window.history.replaceState(null, null, redirect);
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

