// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  async function handleLogin(e){
    e.preventDefault()
    setErr('')
    if(!email.trim() || !password.trim()){
      setErr('Please enter valid email and password')
      return
    }
    setLoading(true)
    try{
      const res = await fetch(`${BASE}/api/auth/login`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      })
      const data = await res.json()
      if(!res.ok){
        setErr(data.message || 'Login failed')
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch(e){
      setErr('Network error — try again')
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="auth-card">
        <h3 className="auth-title">Welcome back</h3>
        <p className="auth-sub">Login to continue to your dashboard.</p>

        {err && <div className="error">{err}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-row">
            <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" />
          </div>
          <div className="form-row">
            <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
          </div>

          <div className="form-row">
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
          </div>
        </form>

        <div className="link-row">
          New here? <span className="link-button" onClick={()=>navigate('/')}>Create account</span>
        </div>
      </div>
    </div>
  )
}
