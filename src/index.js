import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // asegurate de que exista o ajustá el nombre

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
