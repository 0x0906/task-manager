import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { BoardContext } from '../../context/BoardContext';
import { AuthContext } from '../../context/AuthContext';
import Column from './Column';
import ActivityLogPanel from './ActivityLogPanel';
import { Plus, Trash2, Users, X, ArrowLeft, Activity } from 'lucide-react';

const Board = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBoard, currentBoard, addColumn, moveTask, deleteBoard, addMember, updateBoardStatus } = useContext(BoardContext);
  const { user } = useContext(AuthContext);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [newMemberUsername, setNewMemberUsername] = useState('');

  useEffect(() => {
    if (id) {
      fetchBoard(id).catch(() => navigate('/'));
    }
  }, [id, fetchBoard, navigate]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    moveTask(draggableId, destination.droppableId, destination.index).then(() => {
        fetchBoard(currentBoard.id);
    });
  };

  const handleAddColumn = (e) => {
    e.preventDefault();
    if (newColumnTitle.trim() && currentBoard) {
      addColumn(currentBoard.id, newColumnTitle);
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMemberUsername.trim() && currentBoard) {
      addMember(currentBoard.id, newMemberUsername);
      setNewMemberUsername('');
    }
  };

  const handleDeleteBoard = () => {
    deleteBoard(currentBoard.id);
    navigate('/');
  };

  if (!currentBoard) return <div className="container" style={{ paddingTop: '2rem' }}>Loading board...</div>;

  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1rem', backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/')} style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--hover-bg)' }} title="Back to Dashboard">
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{currentBoard.title}</h2>
          
          <select 
            value={currentBoard.status || 'ON_GOING'} 
            onChange={(e) => updateBoardStatus(currentBoard.id, e.target.value)}
            disabled={user.role === 'EMPLOYEE' && currentBoard.owner?.username !== user.username}
            className="input-field" 
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', height: 'auto', backgroundColor: currentBoard.status === 'ON_GOING' ? 'var(--badge-success-bg)' : currentBoard.status === 'CANCELLED' ? 'var(--badge-danger-bg)' : 'var(--badge-info-bg)', color: currentBoard.status === 'ON_GOING' ? 'var(--badge-success-text)' : currentBoard.status === 'CANCELLED' ? 'var(--badge-danger-text)' : 'var(--badge-info-text)', fontWeight: '600', border: 'none' }}
          >
            <option value="ON_GOING">On Going</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setIsActivityLogOpen(true)} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor='var(--surface-color)'} title="View Activity Log">
            <Activity size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Activity</span>
          </button>
          <button onClick={() => setIsMembersModalOpen(true)} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='var(--hover-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor='var(--surface-color)'} title="Manage members">
            <Users size={18} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Members ({currentBoard.members?.length || 0})</span>
          </button>
          {(user.role === 'ADMIN' || user.role === 'MANAGER' || currentBoard.owner?.username === user.username) && (
            <button onClick={handleDeleteBoard} style={{ padding: '0.5rem', color: 'var(--badge-danger-text)', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='var(--badge-danger-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor='transparent'} title="Delete current board">
              <Trash2 size={18} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Delete</span>
            </button>
          )}
        </div>
      </div>

      <div style={{ flexGrow: 1, padding: '1.5rem', overflowX: 'auto', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          {currentBoard.columns?.map(column => (
            <Column key={column.id} column={column} />
          ))}
        </DragDropContext>

        {isAddingColumn ? (
          <form onSubmit={handleAddColumn} style={{ width: '300px', minWidth: '300px', backgroundColor: 'var(--hover-bg)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
            <input autoFocus className="input-field" value={newColumnTitle} onChange={(e) => setNewColumnTitle(e.target.value)} placeholder="Column title" style={{ marginBottom: '0.5rem', backgroundColor: 'var(--surface-color)' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Add List</button>
              <button type="button" onClick={() => setIsAddingColumn(false)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Cancel</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setIsAddingColumn(true)} style={{ width: '300px', minWidth: '300px', backgroundColor: 'var(--hover-bg)', borderRadius: 'var(--radius-lg)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}>
            <Plus size={20} />
            <span style={{ fontWeight: '500' }}>Add another list</span>
          </button>
        )}
      </div>

      {isMembersModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '400px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={20} /> Board Members</h3>
              <button onClick={() => setIsMembersModalOpen(false)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            
            <div style={{ marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '500' }}>{currentBoard.owner?.username}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--badge-success-text)', fontWeight: '600' }}>Owner</span>
              </div>
              {currentBoard.members?.map(m => (
                <div key={m.id} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{m.username}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.role}</span>
                </div>
              ))}
            </div>

            {(user.role === 'ADMIN' || user.role === 'MANAGER' || currentBoard.owner?.username === user.username) && (
              <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="input-field" placeholder="Username to add" value={newMemberUsername} onChange={e => setNewMemberUsername(e.target.value)} style={{ flex: 1 }} />
                <button type="submit" className="btn-primary">Add</button>
              </form>
            )}
          </div>
        </div>
      )}

      {isActivityLogOpen && (
        <ActivityLogPanel boardId={currentBoard.id} onClose={() => setIsActivityLogOpen(false)} />
      )}
    </div>
  );
};

export default Board;
