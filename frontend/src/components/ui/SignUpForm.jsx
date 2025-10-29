import React, { useState, useContext } from 'react'
import { AuthContext } from '../../auth/AuthContext'

export default function SignUpForm({ role = 'nonprofit', onClose = () => {} }){
  const { loginAndRedirect } = useContext(AuthContext)
  const [formRole, setFormRole] = useState(role)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function submit(e){
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // basic client-side validation
    if(!email || !password || !name) {
      setError('Name, email and password are required.')
      return
    }

    setLoading(true)
    try{
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password, // server should hash into password_hash
        role: formRole,
        mfa_enabled: !!mfaEnabled
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok) {
        loginAndRedirect({user:data.user, token:data.token});
        setSuccess('Account created successfully! Redirecting...')
        setTimeout(() => onClose(), 900)
      } else {
        const msg = data && data.error ? data.error : `Registration failed (${res.status})`
        setError(msg)
      }
      setLoading(false)
    }catch(err){
      console.error(err)
      setError('Network error while registering. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0">Sign up</h5>
        <small className="text-muted">Role:</small>
      </div>

      <div className="btn-group mb-3" role="group" aria-label="Role">
        <button type="button" onClick={() => setFormRole('nonprofit')} className={`btn ${formRole==='nonprofit'?'btn-primary':'btn-outline-secondary'}`}>Nonprofit</button>
        <button type="button" onClick={() => setFormRole('researcher')} className={`btn ${formRole==='researcher'?'btn-primary':'btn-outline-secondary'}`}>Researcher</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} />
          <div className="form-text">Password should be at least 8 characters.</div>
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="mfaEnabled" checked={mfaEnabled} onChange={e=>setMfaEnabled(e.target.checked)} />
          <label className="form-check-label" htmlFor="mfaEnabled">Enable multi-factor authentication (MFA)</label>
        </div>

        <div className="d-flex justify-content-end">
          <button type="button" onClick={onClose} className="btn btn-secondary me-2" disabled={loading}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading? 'Creating...' : 'Create account'}</button>
        </div>
      </form>
    </div>
  )
}
