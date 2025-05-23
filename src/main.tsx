
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set up initial authentication and onboarding flags if they don't exist
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('hasSeenOnboarding')) {
    localStorage.setItem('hasSeenOnboarding', 'false');
  }

  if (!localStorage.getItem('isAuthenticated')) {
    localStorage.setItem('isAuthenticated', 'false');
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found");
}
