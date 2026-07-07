import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Users, Shield, Loader, Folder, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newManagerUsername, setNewManagerUsername] = useState('');
  const [newManagerPassword, setNewManagerPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [usersRes, boardsRes] = await Promise.all([
        axiosClient.get('/auth/users'),
        axiosClient.get('/boards')
      ]);
      setUsers(usersRes.data);
      setBoards(boardsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateManager = async (e) => {
    e.preventDefault();
    if (!newManagerUsername || !newManagerPassword) return;
    setCreating(true);
    setError('');
    
    try {
      await axiosClient.post('/auth/register-manager', {
        username: newManagerUsername,
        password: newManagerPassword
      });
      setNewManagerUsername('');
      setNewManagerPassword('');
      fetchData();
    } catch (err) {
      setError(err.response?.data || 'Failed to create manager');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading users...</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
        
        <div style={{ flex: 1, backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Users size={24} color="var(--primary-color)" />
            All Users
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {users.map(u => (
              <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontWeight: '500' }}>{u.username}</span>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '1rem', 
                  backgroundColor: u.role === 'ADMIN' ? 'var(--badge-danger-bg)' : u.role === 'MANAGER' ? 'var(--badge-info-bg)' : 'var(--badge-neutral-bg)',
                  color: u.role === 'ADMIN' ? 'var(--badge-danger-text)' : u.role === 'MANAGER' ? 'var(--badge-info-text)' : 'var(--badge-neutral-text)',
                  fontWeight: '600'
                }}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: '400px', backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Shield size={24} color="var(--primary-color)" />
            Create Manager
          </h2>
          <form onSubmit={handleCreateManager} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && <div style={{ color: 'var(--badge-danger-text)', fontSize: '0.875rem' }}>{error}</div>}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Username</label>
              <input type="text" className="input-field" value={newManagerUsername} onChange={e => setNewManagerUsername(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" className="input-field" value={newManagerPassword} onChange={e => setNewManagerPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={creating} style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              {creating ? <Loader size={18} className="animate-spin" /> : 'Create Manager Account'}
            </button>
          </form>
        </div>

      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <Folder size={24} color="var(--primary-color)" />
          Manager Project Statistics
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Manager</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Project Title</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Members</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Created At</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: '600' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {boards.map(board => (
                <tr key={board.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: '500' }}>{board.owner?.username}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{board.title}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '1rem', 
                      backgroundColor: board.status === 'ON_GOING' ? 'var(--badge-success-bg)' : board.status === 'CANCELLED' ? 'var(--badge-danger-bg)' : 'var(--badge-info-bg)',
                      color: board.status === 'ON_GOING' ? 'var(--badge-success-text)' : board.status === 'CANCELLED' ? 'var(--badge-danger-text)' : 'var(--badge-info-text)',
                      fontWeight: '600'
                    }}>{board.status?.replace('_', ' ')}</span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>{board.memberCount || 1}</td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem' }}>{board.createdAt ? new Date(board.createdAt).toLocaleString() : 'N/A'}</td>
                  <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem' }}>{board.updatedAt ? new Date(board.updatedAt).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
              {boards.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
