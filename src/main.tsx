import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
// import AppServer from './AppServer.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <AppServer /> */}
  </StrictMode>
);