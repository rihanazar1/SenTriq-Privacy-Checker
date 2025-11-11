import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {store} from "./store/"
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

const rootElement = document.getElementById('root')!;

const AppWrapper = (
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  </StrictMode>
);

// Check if the app is being pre-rendered by react-snap
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, AppWrapper);
} else {
  createRoot(rootElement).render(AppWrapper);
}
