import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import Modal from './ui/Modal'
import SignUpForm from './ui/SignUpForm'
import LoginForm from './ui/LoginForm'

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

  return (
    <header className="bg-white shadow-sm">
  <div className="container d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center gap-3">
          <div className="h5 mb-0">Trident</div>
          <UtilityNav />
        </div>
        <div className="d-flex align-items-center gap-2">
          {auth && auth.isAuthenticated ? (
            <>
              <span className="me-2 text-muted">Hi, {auth.user?.name || auth.user?.email}</span>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => auth.logout()}>Logout</button>
            </>
          ) : (
            <button type="button" className="btn btn-link text-muted me-2" onClick={() => { setMode('login'); setOpen(true) }}>Sign In</button>
          )}

          <div className="dropdown" id='signup-dropdown'>
            <button className="btn btn-outline-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Sign Up</button>
            <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => { setRole('nonprofit'); setMode('signup'); setOpen(true) }}>Nonprofit</button></li>
                <li><button className="dropdown-item" onClick={() => { setRole('researcher'); setMode('signup'); setOpen(true) }}>Researcher</button></li>
              </ul>
          </div>
          
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
