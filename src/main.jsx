import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import './i18n.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f1713',
            color: '#f7f1e8',
            borderRadius: '9999px',
            padding: '12px 18px',
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
