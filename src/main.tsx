
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

// Add global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // You could add additional error reporting logic here
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // You could add additional error reporting logic here
});

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Root element not found. The app cannot be initialized.")
}

const root = createRoot(rootElement)

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Use hydration for SSR in production
if (import.meta.env.PROD) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
