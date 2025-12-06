// src/pages/Signup.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

  async function handleSignup(e){
    e.preventDefault()
    setErr('')

    if(!name.trim() || !email.trim() || password.length < 6){
      setErr('Please enter valid name, email and password (min 6 chars).')
      return
    }

    setLoading(true)
    try{
      const res = await fetch(`${BASE}/api/auth/signup`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password })
      })
      const data = await res.json()
      if(!res.ok){
        setErr(data.message || 'Signup failed')
        setLoading(false)
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch(err){
      setErr('Network error — try again')
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="auth-card">
        <h3 className="auth-title">Create your account</h3>
        <p className="auth-sub">Join HubCredo — simple signup to get started.</p>

        {err && <div className="error">{err}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-row">
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />
          </div>
          <div className="form-row">
            <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" />
          </div>
          <div className="form-row">
            <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (min 6 chars)" type="password" />
          </div>

          <div className="form-row">
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Create account'}</button>
          </div>
        </form>

        <div className="link-row">
          Already have an account? <span className="link-button" onClick={()=>navigate('/login')}>Login</span>
        </div>
      </div>
    </div>
  )
}
