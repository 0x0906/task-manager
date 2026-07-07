import React, { useContext, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Calendar, User, Tag, X } from 'lucide-react';
import { BoardContext } from '../../context/BoardContext';
import { AuthContext } from '../../context/AuthContext';

const TaskCard = ({ task, index }) => {
  const { deleteTask, updateTask, currentBoard } = useContext(BoardContext);
  const { user } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title || '');
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedPriority, setEditedPriority] = useState(task.priority || 'LOW');
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || '');
  const [editedAssignee, setEditedAssignee] = useState(task.assignee?.username || '');

  const handleUpdate = (e) => {
    e.preventDefault();
    updateTask(task.id, {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
      dueDate: editedDueDate,
      assigneeUsername: editedAssignee
    });
    setIsEditModalOpen(false);
  };

  const priorityColors = {
    LOW: { bg: 'var(--badge-success-bg)', text: 'var(--badge-success-text)' },
    MEDIUM: { bg: 'var(--badge-warning-bg)', text: 'var(--badge-warning-text)' },
    HIGH: { bg: 'var(--badge-danger-bg)', text: 'var(--badge-danger-text)' }
  };

  return (
    <>
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            padding: '1rem',
            marginBottom: '0.5rem',
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: snapshot.isDragging ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            transition: 'box-shadow 0.2s, transform 0.1s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
            <h4 onClick={() => setIsEditModalOpen(true)} style={{ flex: 1, fontSize: '0.875rem', fontWeight: '500', margin: 0, cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{task.title}</h4>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
              {user.role !== 'EMPLOYEE' && (
                <button onClick={() => deleteTask(task.id)} style={{ color: 'var(--text-secondary)', padding: '0.125rem' }} title="Delete task">
                  <Trash2 size={16} />
                </button>
              )}
              <div {...provided.dragHandleProps} style={{ color: 'var(--text-secondary)', cursor: 'grab', padding: '0.125rem' }}>
                <GripVertical size={16} />
              </div>
            </div>
          </div>
          {task.description && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{task.description}</p>
          )}
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {task.priority && (
              <span style={{ fontSize: '0.65rem', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', backgroundColor: priorityColors[task.priority]?.bg, color: priorityColors[task.priority]?.text, fontWeight: '600' }}>
                {task.priority}
              </span>
            )}
            {task.dueDate && (
              <span style={{ fontSize: '0.65rem', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', backgroundColor: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={10} /> {task.dueDate}
              </span>
            )}
            {task.assignee && (
              <span style={{ fontSize: '0.65rem', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', backgroundColor: 'var(--badge-info-bg)', color: 'var(--badge-info-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <User size={10} /> {task.assignee.username}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
    {isEditModalOpen && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
        <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '400px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{user.role === 'EMPLOYEE' ? 'Task Details' : 'Edit Task'}</h3>
            <button onClick={() => setIsEditModalOpen(false)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
          </div>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Title</label>
              <input type="text" className="input-field" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} required disabled={user.role === 'EMPLOYEE'} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Description</label>
              <textarea className="input-field" value={editedDescription} onChange={e => setEditedDescription(e.target.value)} rows={3} disabled={user.role === 'EMPLOYEE'}></textarea>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Priority</label>
              <select className="input-field" value={editedPriority} onChange={e => setEditedPriority(e.target.value)} disabled={user.role === 'EMPLOYEE'}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Due Date</label>
              <input type="date" className="input-field" value={editedDueDate} onChange={e => setEditedDueDate(e.target.value)} disabled={user.role === 'EMPLOYEE'} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Assign To</label>
              <select className="input-field" value={editedAssignee} onChange={e => setEditedAssignee(e.target.value)} disabled={user.role === 'EMPLOYEE'}>
                <option value="">Unassigned</option>
                {currentBoard?.owner && user.role !== 'EMPLOYEE' && (
                  <option value={currentBoard.owner.username}>{currentBoard.owner.username} (Owner)</option>
                )}
                {currentBoard?.members?.filter(m => user.role !== 'EMPLOYEE' || m.role === 'EMPLOYEE').map(m => (
                  <option key={m.id} value={m.username}>{m.username}</option>
                ))}
              </select>
            </div>
            {user.role !== 'EMPLOYEE' && (
              <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Save Changes</button>
            )}
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default TaskCard;
