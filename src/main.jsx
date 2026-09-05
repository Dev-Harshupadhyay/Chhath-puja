import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PlayerProvider } from './context/PlayerContext';
import { UIProvider } from './context/UIContext';
import { NameProvider } from './context/NameContext';
import { LanguageProvider } from './context/LanguageContext';

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/player.css';
import './styles/premium.css';
import './styles/cinematic.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <PlayerProvider>
          <UIProvider>
            <NameProvider>
              <App />
            </NameProvider>
          </UIProvider>
        </PlayerProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
