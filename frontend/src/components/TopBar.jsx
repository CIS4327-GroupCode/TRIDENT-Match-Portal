import React, { useState } from 'react'
import Modal from './ui/Modal'
import { useNavigate } from 'react-router-dom'
import SignUpForm from './ui/SignUpForm'

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
  const navigate = useNavigate()

  return (
    <header className="bg-white shadow-sm">
  <div className="container d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center gap-3">
          <div className="h5 mb-0">Trident</div>
          <UtilityNav />
        </div>
        <div className="d-flex align-items-center gap-2">
          <a href="#signin" className="text-muted">Sign In</a>
          <div className="dropdown">
            <button className="btn btn-outline-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Sign Up</button>
            <ul className="dropdown-menu dropdown-menu-end">
            <li><button className="dropdown-item" onClick={() => { navigate('/signup/nonprofit') }}> Nonprofit </button></li>

              <li><button className="dropdown-item" onClick={() => { setRole('researcher'); setOpen(true) }}>Researcher</button></li>
            </ul>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <SignUpForm role={role} onClose={() => setOpen(false)} />
      </Modal>
    </header>
  )
}
