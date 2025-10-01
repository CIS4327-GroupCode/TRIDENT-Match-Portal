import React, { useState } from 'react'

export default function SignUpForm({ role = 'nonprofit', onClose = () => {} }){
  const [formRole, setFormRole] = useState(role)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  function submit(e){
    e.preventDefault()
    // basic client-side validation
    if(!email || !password) return alert('Please enter email and password')
    // TODO: call backend /api/auth/register
    alert(`Signing up ${formRole}: ${email}`)
    onClose()
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0">Sign up</h5>
        <small className="text-muted">Role:</small>
      </div>
      <div className="btn-group mb-3" role="group">
        <button type="button" onClick={() => setFormRole('nonprofit')} className={`btn ${formRole==='nonprofit'?'btn-primary':'btn-outline-secondary'}`}>Nonprofit</button>
        <button type="button" onClick={() => setFormRole('researcher')} className={`btn ${formRole==='researcher'?'btn-primary':'btn-outline-secondary'}`}>Researcher</button>
      </div>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="d-flex justify-content-end">
          <button type="button" onClick={onClose} className="btn btn-secondary me-2">Cancel</button>
          <button type="submit" className="btn btn-primary">Create account</button>
        </div>
      </form>
    </div>
  )
}
