import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { firestore } from './firebase'
// import { enableNetwork } from 'firebase/firestore'

// enableNetwork(firestore).catch(console.error); // Removed manual network control

ReactDOM.createRoot(document.getElementById('root')).render(
    // Removing StrictMode to prevent double-mounting which causes Firestore connection aborted/spam
    // in development environments with HMR enabled.
    <App />
)
