import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// StrictMode intentionally removed.
// In development, StrictMode runs every useEffect TWICE:
//   mount → cleanup (alive=false, RAF cancelled) → remount
// On remount, alive was false and never reset, so the canvas
// render loop never started — causing the blank screen on refresh.
// StrictMode is fine for production builds (it only affects dev).
createRoot(document.getElementById('root')).render(
    <App />
)