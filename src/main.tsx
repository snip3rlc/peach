
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set up initial authentication and onboarding flags if they don't exist
if (!localStorage.getItem('hasSeenOnboarding')) {
  localStorage.setItem('hasSeenOnboarding', 'false');
}

if (!localStorage.getItem('isAuthenticated')) {
  localStorage.setItem('isAuthenticated', 'false');
}

createRoot(document.getElementById("root")!).render(<App />);
