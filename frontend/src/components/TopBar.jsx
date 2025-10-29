import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import Modal from './ui/Modal'
import SignUpForm from './ui/SignUpForm'
import LoginForm from './ui/LoginForm'
// Import Link from react-router-dom to handle navigation to the profile/dashboard
import { Link } from 'react-router-dom' 

function UtilityNav(){
  return (
    <nav className="d-none d-md-flex gap-3">
      <a href="#about" className="nav-link">About</a>
      <a href="#how" className="nav-link">How it Works</a>
      <a href="#pricing" className="nav-link">Pricing</a>
      <a href="#faq" className="nav-link">FAQ</a>
      <a href="#contact" className="nav-link">Contact</a>
    </nav>
  )
}

export default function TopBar() {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState('nonprofit')
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const auth = useAuth()

  // Determine the user's role for the Profile link
  const userRole = auth.user?.role || 'user'; // Assuming 'role' is stored on the user object

  return (
    <header className="bg-white shadow-sm">
      <div className="container d-flex align-items-center justify-content-between py-3">
        {/* LEFT SIDE: Stays the same */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/" className="text-decoration-none text-dark">
            <div className="h5 mb-0">Trident</div>
          </Link>
          <UtilityNav />
        </div>

        {/* RIGHT SIDE: Modified for Profile, Logout, and User Name */}
        <div className="d-flex align-items-center gap-2">
          {auth && auth.isAuthenticated ? (
            // === LOGGED IN STATE ===
            <div className="d-flex align-items-center gap-3">
              
              {/* 1. Display User Name */}
              <span className="text-dark">
                Hi, <strong className="fw-semibold">{auth.user?.name || auth.user?.email}</strong>
              </span>

              {/* 2. Profile Button/Link */}
              {/* Using a Link to navigate to the user's specific dashboard/profile route */}
              <Link
                to={`/dashboard/${userRole}`} // e.g., /dashboard/nonprofit
                className="btn btn-primary btn-sm"
              >
                Profile
              </Link>

              {/* 3. Logout Button */}
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => auth.logout()}
              >
                Logout
              </button>
            </div>
          ) : (
            // === LOGGED OUT STATE (Existing functionality) ===
            <>
              <button 
                type="button" 
                className="btn btn-link text-muted me-2" 
                onClick={() => { setMode('login'); setOpen(true) }}
              >
                Sign In
              </button>

              <div className="dropdown" id='signup-dropdown'>
                <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Sign Up</button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><button className="dropdown-item" onClick={() => { setRole('nonprofit'); setMode('signup'); setOpen(true) }}>Nonprofit</button></li>
                  <li><button className="dropdown-item" onClick={() => { setRole('researcher'); setMode('signup'); setOpen(true) }}>Researcher</button></li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        {mode === 'signup' ? (
          <SignUpForm role={role} onClose={() => setOpen(false)} />
        ) : (
          <LoginForm onClose={() => setOpen(false)} onSuccess={(data)=>{ /* you can store token or user here */ }} />
        )}
      </Modal>
    </header>
  )
}