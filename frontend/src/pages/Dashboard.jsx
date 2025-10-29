import React from 'react'
import { useAuth } from '../auth/AuthContext'

// Example dashboard components for each role
function NonprofitDashboard({ user }) {
  return (
    <div>
      <h2>Welcome Nonprofit!</h2>
      <p>Name: {user.profile?.name || user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add more nonprofit-specific content here */}
    </div>
  )
}

function ResearcherDashboard({ user }) {
  return (
    <div>
      <h2>Welcome Researcher!</h2>
      <p>Name: {user.profile?.name || user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add more researcher-specific content here */}
    </div>
  )
}

function AdminDashboard({ user }) {
  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Add more admin-specific content here */}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()

  // Fallback to localStorage if context is not populated
  let currentUser = user
  if (!currentUser) {
    try {
      const rawUser = localStorage.getItem('trident_user')
      if (rawUser) currentUser = JSON.parse(rawUser)
    } catch (e) {
      currentUser = null
    }
  }

  if (!currentUser) {
    return <div className="alert alert-warning">You must be logged in to view the dashboard.</div>
  }

  switch (currentUser.role) {
    case 'nonprofit':
      return <NonprofitDashboard user={currentUser} />
    case 'researcher':
      return <ResearcherDashboard user={currentUser} />
    case 'admin':
      return <AdminDashboard user={currentUser} />
    default:
      return <div className="alert alert-info">Unknown role: {currentUser.role}</div>
  }
}