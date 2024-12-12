import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'


 /*----- preload link for critical CSS -----*/

const preloadCSS = document.createElement('link');
preloadCSS.rel = 'preload';
preloadCSS.as = 'style';
preloadCSS.href = '/src/App.css';
document.head.appendChild(preloadCSS);


/*----- Import CSS with media attribute to make it non-blocking -----*/

const stylesheet = document.createElement('link');
stylesheet.rel = 'stylesheet';
stylesheet.href = '/src/App.css';
stylesheet.media = 'print';
stylesheet.onload = function() {
  this.media = 'all';
};
document.head.appendChild(stylesheet);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
