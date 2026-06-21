

import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

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
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
