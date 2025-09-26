import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          // Default styles
          success: {
            style: {
              background: '#4ade80',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#f87171',
              color: '#fff',
            },
          },
        }}
      />
    </>
  </StrictMode>
)
