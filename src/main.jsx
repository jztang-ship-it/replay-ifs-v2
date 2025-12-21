import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // This will resolve to App.jsx automatically
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);