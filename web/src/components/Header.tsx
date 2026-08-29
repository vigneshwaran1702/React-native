import React from 'react';
import { useAuthStore } from '../store/authStore';

interface HeaderProps {
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.name ? user.name.split(' ')[0] : 'Guest';

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid var(--card-border)'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            {getGreeting()}, {displayName} 👋
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Priority-driven task flow and deadline manager
        </p>
      </div>

      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--card)',
                color: 'var(--text-muted)',
                border: '1px solid var(--card-border)',
                fontSize: '13px',
                fontWeight: 600
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
};
