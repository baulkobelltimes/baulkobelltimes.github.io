import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// GitHub Pages SPA redirect handler
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  const path = params.get('_path');
  if (path) {
    // Restore the original path and remove the query parameter
    window.history.replaceState({}, '', '/' + path);
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

