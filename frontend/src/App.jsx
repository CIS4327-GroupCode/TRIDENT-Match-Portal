import React, { useEffect, useState } from 'react'

export default function App() {
  const [status, setStatus] = useState('loading')
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setStatus(d.status))
      .catch(() => setStatus('down'))

    fetch('/api/users')
      .then(r => r.json())
      .then(d => setUsers(d))
      .catch(() => setUsers([]))
  }, [])

  return (
    <div className="container">
      <h1>Trident Match Portal</h1>
      <p>Backend status: {status}</p>
      <h2>Users</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} — {u.email}</li>
        ))}
      </ul>
    </div>
  )
}
