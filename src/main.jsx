import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PlayerProvider } from './context/PlayerContext';
import { UIProvider } from './context/UIContext';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/player.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </PlayerProvider>
    </BrowserRouter>
  </StrictMode>,
);
