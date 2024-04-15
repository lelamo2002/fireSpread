import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from './Router.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <AuthProvider>
      <Router/>
    </AuthProvider>
  </React.StrictMode>
)
