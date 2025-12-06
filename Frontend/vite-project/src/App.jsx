import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
     <BrowserRouter>
        <Routes>
          {/* Default page = Signup */}
           <Route path="/" element={<Signup />} />

          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard (protected in component itself) */}
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
     </BrowserRouter>
 )
}

