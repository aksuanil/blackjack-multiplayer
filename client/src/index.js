import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/css/output.css';
import { SocketProvider } from './context/SocketProvider';
import reportWebVitals from './reportWebVitals';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SocketProvider>
    <App />
  </SocketProvider>
);
reportWebVitals();
