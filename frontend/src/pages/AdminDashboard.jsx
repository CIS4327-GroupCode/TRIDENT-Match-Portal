import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [userFilters, setUserFilters] = useState({ role: '', status: '', search: '' });
  const [projectFilters, setProjectFilters] = useState({ status: '', search: '' });
  
  // Pagination
  const [userPage, setUserPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'projects') fetchProjects();
    if (activeTab === 'milestones') fetchMilestones();
    if (activeTab === 'organizations') fetchOrganizations();
  }, [activeTab, userFilters, projectFilters, userPage, projectPage]);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setStats(data.stats);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch dashboard stats');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: userPage,
        limit: 20,
        ...userFilters,
        includeSuspended: 'true'
      });
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: projectPage,
        limit: 20,
        ...projectFilters
      });
      const res = await fetch(`/api/admin/projects?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProjects(data.projects);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/milestones?limit=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMilestones(data.milestones);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch milestones');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/organizations?limit=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOrganizations(data.organizations);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    if (!confirm('Approve this user account?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchUsers();
        fetchDashboardStats();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  const suspendUser = async (userId, userName) => {
    const reason = prompt(`Suspend user "${userName}"?\n\nEnter reason (optional):`);
    if (reason === null) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchUsers();
        fetchDashboardStats();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to suspend user');
    }
  };

  const unsuspendUser = async (userId) => {
    if (!confirm('Unsuspend this user account?')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/unsuspend`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchUsers();
        fetchDashboardStats();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to unsuspend user');
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!confirm(`PERMANENTLY DELETE user "${userName}"?\n\nThis action CANNOT be undone!`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/permanent`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ confirmation: 'DELETE' })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchUsers();
        fetchDashboardStats();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const deleteProject = async (projectId, projectTitle) => {
    const reason = prompt(`Delete project "${projectTitle}"?\n\nEnter reason (optional):`);
    if (reason === null) return;
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchProjects();
        fetchDashboardStats();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const updateProjectStatus = async (projectId, currentStatus) => {
    const newStatus = prompt(
      `Change project status from "${currentStatus}"?\n\nEnter new status:\n- draft\n- open\n- in_progress\n- completed\n- cancelled`
    );
    if (!newStatus) return;
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus.toLowerCase() })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchProjects();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to update project status');
    }
  };

  const deleteMilestone = async (milestoneId, milestoneName) => {
    const reason = prompt(`Delete milestone "${milestoneName}"?\n\nEnter reason (optional):`);
    if (reason === null) return;
    try {
      const res = await fetch(`/api/admin/milestones/${milestoneId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchMilestones();
        fetchDashboardStats();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to delete milestone');
    }
  };

  const deleteOrganization = async (orgId, orgName) => {
    if (!confirm(`PERMANENTLY DELETE organization "${orgName}" and ALL associated projects?\n\nThis action CANNOT be undone!`)) return;
    try {
      const res = await fetch(`/api/admin/organizations/${orgId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ confirmation: 'DELETE' })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchOrganizations();
        fetchDashboardStats();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to delete organization');
    }
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">
        <i className="bi bi-shield-check me-2"></i>
        Admin Dashboard
      </h1>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-bar-chart me-1"></i> Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-1"></i> Users
            {stats?.pending_approval > 0 && (
              <span className="badge bg-danger ms-2">{stats.pending_approval}</span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <i className="bi bi-folder me-1"></i> Projects
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'milestones' ? 'active' : ''}`}
            onClick={() => setActiveTab('milestones')}
          >
            <i className="bi bi-flag me-1"></i> Milestones
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'organizations' ? 'active' : ''}`}
            onClick={() => setActiveTab('organizations')}
          >
            <i className="bi bi-building me-1"></i> Organizations
          </button>
        </li>
      </ul>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h6 className="card-title">Total Users</h6>
                <h2 className="mb-0">{stats.total_users}</h2>
                <small>
                  {stats.nonprofit_users} nonprofits, {stats.researcher_users} researchers
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-dark">
              <div className="card-body">
                <h6 className="card-title">Pending Approval</h6>
                <h2 className="mb-0">{stats.pending_approval}</h2>
                <small>New accounts awaiting review</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-danger text-white">
              <div className="card-body">
                <h6 className="card-title">Suspended</h6>
                <h2 className="mb-0">{stats.suspended_users}</h2>
                <small>Accounts currently suspended</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h6 className="card-title">Organizations</h6>
                <h2 className="mb-0">{stats.total_organizations}</h2>
                <small>Registered nonprofits</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Projects</h6>
                <h2 className="mb-2">{stats.total_projects}</h2>
                <div className="small">
                  <div><span className="badge bg-success">{stats.open_projects} open</span></div>
                  <div className="mt-1"><span className="badge bg-secondary">{stats.draft_projects} drafts</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Milestones</h6>
                <h2 className="mb-2">{stats.total_milestones}</h2>
                <div className="small">
                  <div><span className="badge bg-info">{stats.active_milestones} in progress</span></div>
                  <div className="mt-1"><span className="badge bg-success">{stats.completed_milestones} completed</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          {/* Filters */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or email..."
                    value={userFilters.search}
                    onChange={(e) => setUserFilters({...userFilters, search: e.target.value})}
                  />
                </div>
                <div className="col-md-2">
                  <select 
                    className="form-select"
                    value={userFilters.role}
                    onChange={(e) => setUserFilters({...userFilters, role: e.target.value})}
                  >
                    <option value="">All Roles</option>
                    <option value="nonprofit">Nonprofit</option>
                    <option value="researcher">Researcher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <select 
                    className="form-select"
                    value={userFilters.status}
                    onChange={(e) => setUserFilters({...userFilters, status: e.target.value})}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Affiliation</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="8" className="text-center py-4">Loading...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan="8" className="text-center py-4">No users found</td></tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className={user.deleted_at ? 'table-danger' : ''}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td><span className={`badge bg-${user.role === 'admin' ? 'danger' : user.role === 'nonprofit' ? 'primary' : 'info'}`}>{user.role}</span></td>
                        <td>
                          {user.deleted_at ? (
                            <span className="badge bg-danger">Suspended</span>
                          ) : (
                            <span className={`badge bg-${user.account_status === 'active' ? 'success' : user.account_status === 'pending' ? 'warning' : 'secondary'}`}>
                              {user.account_status}
                            </span>
                          )}
                        </td>
                        <td>{user.researcherProfile?.affiliation || '-'}</td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {user.account_status === 'pending' && (
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => approveUser(user.id)}
                                title="Approve"
                              >
                                <i className="bi bi-check-circle"></i>
                              </button>
                            )}
                            {!user.deleted_at && user.role !== 'admin' && (
                              <button 
                                className="btn btn-warning btn-sm"
                                onClick={() => suspendUser(user.id, user.name)}
                                title="Suspend"
                              >
                                <i className="bi bi-pause-circle"></i>
                              </button>
                            )}
                            {user.deleted_at && (
                              <button 
                                className="btn btn-info btn-sm"
                                onClick={() => unsuspendUser(user.id)}
                                title="Unsuspend"
                              >
                                <i className="bi bi-play-circle"></i>
                              </button>
                            )}
                            {user.role !== 'admin' && (
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteUser(user.id, user.name)}
                                title="Delete Permanently"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          {/* Filters */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search projects..."
                    value={projectFilters.search}
                    onChange={(e) => setProjectFilters({...projectFilters, search: e.target.value})}
                  />
                </div>
                <div className="col-md-3">
                  <select 
                    className="form-select"
                    value={projectFilters.status}
                    onChange={(e) => setProjectFilters({...projectFilters, status: e.target.value})}
                  >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="card">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Organization</th>
                    <th>Status</th>
                    <th>Budget</th>
                    <th>Timeline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                  ) : projects.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-4">No projects found</td></tr>
                  ) : (
                    projects.map(project => (
                      <tr key={project.project_id}>
                        <td>{project.project_id}</td>
                        <td>{project.title}</td>
                        <td>{project.organization?.name || '-'}</td>
                        <td>
                          <span className={`badge bg-${
                            project.status === 'open' ? 'success' : 
                            project.status === 'in_progress' ? 'info' : 
                            project.status === 'completed' ? 'primary' : 
                            'secondary'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td>${project.budget_min?.toLocaleString() || 'N/A'}</td>
                        <td>{project.timeline || 'N/A'}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => updateProjectStatus(project.project_id, project.status)}
                              title="Change Status"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteProject(project.project_id, project.title)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Project</th>
                  <th>Organization</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                ) : milestones.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-4">No milestones found</td></tr>
                ) : (
                  milestones.map(milestone => (
                    <tr key={milestone.id}>
                      <td>{milestone.id}</td>
                      <td>{milestone.name}</td>
                      <td>{milestone.project?.title || '-'}</td>
                      <td>{milestone.project?.organization?.name || '-'}</td>
                      <td>{new Date(milestone.due_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge bg-${
                          milestone.status === 'completed' ? 'success' : 
                          milestone.status === 'in_progress' ? 'info' : 
                          milestone.status === 'cancelled' ? 'danger' : 
                          'secondary'
                        }`}>
                          {milestone.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteMilestone(milestone.id, milestone.name)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Organizations Tab */}
      {activeTab === 'organizations' && (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>EIN</th>
                  <th>Contacts</th>
                  <th>Focus Areas</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                ) : organizations.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4">No organizations found</td></tr>
                ) : (
                  organizations.map(org => (
                    <tr key={org.id}>
                      <td>{org.id}</td>
                      <td>{org.name}</td>
                      <td>{org.EIN}</td>
                      <td>{org.contacts || '-'}</td>
                      <td>{org.focus_tags || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteOrganization(org.id, org.name)}
                          title="Delete Organization & All Projects"
                        >
                          <i className="bi bi-trash"></i> Delete All
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
