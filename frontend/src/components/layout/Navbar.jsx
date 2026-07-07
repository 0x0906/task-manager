import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Layout, Shield, Sun, Moon, Monitor } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  if (!user) return null;

  return (
    <nav style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--primary-color)', fontWeight: '600', fontSize: '1.25rem' }}>
          <Layout size={24} />
          <span>TaskManager</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user.role === 'ADMIN' && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s', paddingRight: '1rem', borderRight: '1px solid var(--border-color)' }} onMouseOver={e => e.currentTarget.style.color='var(--primary-color)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
              <Shield size={18} />
              <span style={{ fontSize: '0.875rem' }}>Admin Panel</span>
            </Link>
          )}
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Welcome, {user.username} ({user.role})</span>
          
          <button onClick={cycleTheme} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', transition: 'color 0.2s', padding: '0 1rem', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }} title={`Current theme: ${theme}. Click to change.`} onMouseOver={e => e.currentTarget.style.color='var(--primary-color)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
            {theme === 'light' && <Sun size={18} />}
            {theme === 'dark' && <Moon size={18} />}
            {theme === 'system' && <Monitor size={18} />}
          </button>

          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--primary-color)'} onMouseOut={e => e.currentTarget.style.color='var(--text-secondary)'}>
            <LogOut size={18} />
            <span style={{ fontSize: '0.875rem' }}>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
