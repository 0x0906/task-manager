import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { X, Activity, Clock } from 'lucide-react';

const ActivityLogPanel = ({ boardId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosClient.get(`/boards/${boardId}/logs`);
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch activity logs', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (boardId) fetchLogs();
  }, [boardId]);

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow-lg)', zIndex: 1200, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)', transform: 'translateX(0)', transition: 'transform 0.3s ease-in-out' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--primary-color)" />
          Activity Log
        </h3>
        <button onClick={onClose} style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}>
          <X size={20} />
        </button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading activities...</div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>No activity recorded yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--badge-info-bg)', color: 'var(--badge-info-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '0.875rem', flexShrink: 0 }}>
                  {log.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: '600' }}>{log.username}</span> {log.actionText}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <Clock size={12} />
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogPanel;
