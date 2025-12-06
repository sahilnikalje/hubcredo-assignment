// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){ navigate('/login'); return }

    async function fetchProfile(){
      try{
        const res = await fetch(`${BASE}/api/auth/profile`, {
          headers: { Authorization: 'Bearer ' + token }
        })
        if(!res.ok){
          localStorage.removeItem('token'); localStorage.removeItem('user')
          navigate('/login'); return
        }
        const data = await res.json()
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      } catch(e){
        setErr('Network error')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [navigate])

  function handleLogout(){
    localStorage.removeItem('token'); localStorage.removeItem('user')
    navigate('/login')
  }

  if(loading) return <div className="app-shell"><div className="auth-card"><p>Loading...</p></div></div>

  return (
    <div className="app-shell">
      <div className="dashboard">
        <h2>Welcome{user ? `, ${user.name}` : ''}!</h2>
        {err && <p style={{color:'#e53935'}}>{err}</p>}
        <p>This is Dashboard</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}
