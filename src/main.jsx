import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // this is for development purposes only not recommended to add in production
  // <StrictMode>
    <App />
  // </StrictMode>,
)
