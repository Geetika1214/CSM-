import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter from react-router-dom
import { AuthProvider } from '../src/context/AuthProvider';// Import the AuthProvider


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* Wrap the entire app in BrowserRouter */}
      <AuthProvider> 
         {/* Wrap App with AuthProvider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);

