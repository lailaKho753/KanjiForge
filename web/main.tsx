import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../kanji_forge_web_app';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
