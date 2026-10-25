import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against browser extension injection errors (e.g. MetaMask, Web3 wallet errors)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || event.reason?.toString() || '';
    if (
      reason.includes('MetaMask') ||
      reason.includes('ethereum') ||
      reason.includes('wallet') ||
      reason.includes('chrome-extension')
    ) {
      // Prevent browser extension connection failure from bubbling
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.includes('MetaMask') ||
      msg.includes('ethereum') ||
      msg.includes('wallet') ||
      msg.includes('chrome-extension')
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

