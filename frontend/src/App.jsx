

import './App.css'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/UserDashboard'
import Landing from './pages/Landing'


function RoleBasedDashboard() {
  const [role, setRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    async function loadMe() {
      try {
        const res = await fetch('http://localhost:5000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to fetch user')
        const data = await res.json()
        setRole((data?.role || '').toLowerCase())
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setRole(null)
      }
    }

    loadMe()
  }, [])

  if (role === null) return <div className="app-main">Loading...</div>

  if (role === 'user') return <Navigate to="/user-dashboard" replace />
  return <Dashboard />
}

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <nav>
          <Link to="/login">Login</Link>
          {' | '}
          <Link to="/signup">Signup</Link>
          {' | '}
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<RoleBasedDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
