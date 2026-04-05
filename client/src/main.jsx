import React from 'react';
import ReactDOM from 'react-dom/client';
import { io } from 'socket.io-client';
import App from './App.jsx';
import './styles/index.css';

// Initialize Socket.io connection
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

// Make socket available globally
window.jobPortalSocket = socket;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>
);
