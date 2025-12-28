import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BankrollProvider } from './context/BankrollContext'; // Import here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CRITICAL FIX: The Provider lives here now. It wraps the whole App. */}
    <BankrollProvider>
      <App />
    </BankrollProvider>
  </React.StrictMode>,
);