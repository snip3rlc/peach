
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set up initial authentication and onboarding flags if they don't exist
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('hasSeenOnboarding')) {
    localStorage.setItem('hasSeenOnboarding', 'false');
  }

  // For demonstration purposes, set isAuthenticated to true
  // In a real application, this would be handled by Supabase auth state
  localStorage.setItem('isAuthenticated', 'true');
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found");
}
