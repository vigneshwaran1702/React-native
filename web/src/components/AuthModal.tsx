import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const clearError = useAuthStore((state) => state.clearError);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    let success = false;
    if (isRegister) {
      if (!username.trim() || !email.trim() || !password.trim()) return;
      success = await register({
        username: username.trim(),
        name: name.trim() || username.trim(),
        email: email.trim(),
        password,
      });
    } else {
      if (!identifier.trim() || !password.trim()) return;
      success = await login(identifier.trim(), password);
    }

    if (success) {
      onClose();
      // Clear fields
      setUsername('');
      setName('');
      setEmail('');
      setIdentifier('');
      setPassword('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: '18px' }}>✕</button>
        </div>

        {error && (
          <div style={{ background: 'var(--overdue-bg)', border: '1px solid var(--overdue)', color: 'var(--overdue)', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isRegister ? (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
                  USERNAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--text)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--text)',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--text)',
                    outline: 'none'
                  }}
                />
              </div>
            </>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
                USERNAME OR EMAIL *
              </label>
              <input
                type="text"
                required
                placeholder="Enter your username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  color: 'var(--text)',
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '6px' }}>
              PASSWORD *
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Enter your password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text)',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '12px',
              borderRadius: '10px',
              background: 'var(--primary)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              marginTop: '8px'
            }}
          >
            {isLoading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                clearError();
              }}
              style={{ color: 'var(--accent)', fontWeight: 700 }}
            >
              {isRegister ? 'Sign In' : 'Register now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
