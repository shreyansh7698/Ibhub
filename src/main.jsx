import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';

import './styles/global.css';
import './styles/tokens.css';
import './styles/cinematic.css';
import './styles/header.css';
import './styles/footer.css';
import './styles/components.css';
import './styles/home.css';
import './styles/pages.css';
import './styles/animations.css';
import './styles/atmosphere.css';
import './styles/responsive.css';
import './styles/visa.css';
import './styles/admin.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
