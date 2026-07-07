import React, { useState, useContext } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { BoardContext } from '../../context/BoardContext';
import { AuthContext } from '../../context/AuthContext';
import { Plus } from 'lucide-react';

const Column = ({ column }) => {
  const { createTask } = useContext(BoardContext);
  const { user } = useContext(AuthContext);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      createTask(column.id, newTaskTitle, '');
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div style={{
      width: '300px',
      minWidth: '300px',
      backgroundColor: 'var(--hover-bg)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{column.title}</h3>
        <span style={{ backgroundColor: 'var(--border-color)', padding: '0.125rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '500' }}>
          {column.tasks?.length || 0}
        </span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flexGrow: 1,
              minHeight: '100px',
              transition: 'background-color 0.2s',
              backgroundColor: snapshot.isDraggingOver ? 'var(--border-color)' : 'transparent',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {column.tasks?.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {user.role !== 'EMPLOYEE' && (
        isAdding ? (
          <form onSubmit={handleAddTask} style={{ marginTop: '0.5rem' }}>
            <input
              autoFocus
              className="input-field"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              style={{ marginBottom: '0.5rem', backgroundColor: 'var(--surface-color)' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Add</button>
              <button type="button" onClick={() => setIsAdding(false)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Cancel</button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-md)',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Plus size={16} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Add Task</span>
          </button>
        )
      )}
    </div>
  );
};

export default Column;
