import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardContext } from '../../context/BoardContext';
import { AuthContext } from '../../context/AuthContext';
import { Folder, Plus, X, Users, Calendar, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { boards, fetchBoards, createBoard } = useContext(BoardContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      createBoard(newBoardTitle);
      setNewBoardTitle('');
      setIsCreatingBoard(false);
    }
  };

  const statusColors = {
    ON_GOING: { bg: 'var(--badge-success-bg)', text: 'var(--badge-success-text)', label: 'On Going' },
    CANCELLED: { bg: 'var(--badge-danger-bg)', text: 'var(--badge-danger-text)', label: 'Cancelled' },
    COMPLETED: { bg: 'var(--badge-info-bg)', text: 'var(--badge-info-text)', label: 'Completed' },
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-primary)' }}>Projects Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.username}!</p>
        </div>
        {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && (
          <button onClick={() => setIsCreatingBoard(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {boards.map(board => (
          <div
            key={board.id}
            onClick={() => navigate(`/board/${board.id}`)}
            style={{
              backgroundColor: 'var(--surface-color)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <h3 style={{ flex: 1, fontSize: '1.25rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                <Folder size={20} color="var(--primary-color)" style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{board.title}</span>
              </h3>
              {board.status && statusColors[board.status] && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '1rem', 
                  backgroundColor: statusColors[board.status].bg, 
                  color: statusColors[board.status].text,
                  flexShrink: 0
                }}>
                  {statusColors[board.status].label}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} />
                <span>{board.memberCount || 1} Members</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} />
                <span>Created: {new Date(board.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>Owner: {board.owner?.username}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {boards.length === 0 && !isCreatingBoard && (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
          <Folder size={48} color="var(--text-secondary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Projects Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {user?.role === 'EMPLOYEE' ? 'You have not been assigned to any projects.' : 'Get started by creating your first project.'}
          </p>
          {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && (
            <button onClick={() => setIsCreatingBoard(true)} className="btn-primary">Create Project</button>
          )}
        </div>
      )}

      {isCreatingBoard && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '400px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Create New Project</h3>
              <button onClick={() => setIsCreatingBoard(false)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateBoard} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Project Title</label>
                <input autoFocus type="text" className="input-field" value={newBoardTitle} onChange={e => setNewBoardTitle(e.target.value)} required placeholder="e.g. Website Redesign" />
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
