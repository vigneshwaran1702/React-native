import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
}) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
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
      if (!email.trim() || !password.trim()) return;
      success = await register({
        name: name.trim() || 'User',
        email: email.trim(),
        password,
      });
    } else {
      if (!identifier.trim() || !password.trim()) return;
      success = await login(identifier.trim(), password);
    }

    if (success) {
      onClose();
      setName('');
      setEmail('');
      setIdentifier('');
      setPassword('');
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        padding: '16px',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#131b2a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '430px',
          padding: '30px 28px 26px',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.65)',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '22px',
          }}
        >
          <h2
            style={{
              fontSize: '21px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.3px',
              margin: 0,
            }}
          >
            {isRegister ? 'Create Account' : 'Sign In'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              lineHeight: 1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            ✕
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {isRegister ? (
            <>
              {/* Full Name */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.6px',
                    color: '#64748b',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  FULL NAME
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 15px',
                    borderRadius: '10px',
                    background: '#0d131f',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.background = '#101726';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#1e293b';
                    e.currentTarget.style.background = '#0d131f';
                  }}
                />
              </div>

              {/* Email Address */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.6px',
                    color: '#64748b',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 15px',
                    borderRadius: '10px',
                    background: '#0d131f',
                    border: '1px solid #1e293b',
                    color: '#f8fafc',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.background = '#101726';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#1e293b';
                    e.currentTarget.style.background = '#0d131f';
                  }}
                />
              </div>
            </>
          ) : (
            /* Login Identifier */
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  color: '#64748b',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}
              >
                EMAIL OR USERNAME
              </label>
              <input
                type="text"
                required
                placeholder="Enter email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px 15px',
                  borderRadius: '10px',
                  background: '#0d131f',
                  border: '1px solid #1e293b',
                  color: '#f8fafc',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#6366f1';
                  e.currentTarget.style.background = '#101726';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#1e293b';
                  e.currentTarget.style.background = '#0d131f';
                }}
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.6px',
                color: '#64748b',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 15px',
                borderRadius: '10px',
                background: '#0d131f',
                border: '1px solid #1e293b',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.background = '#101726';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#1e293b';
                e.currentTarget.style.background = '#0d131f';
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '14px',
              borderRadius: '10px',
              background: '#5b61f4',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '15px',
              marginTop: '6px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'background 0.2s, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.background = '#4e54e8';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.currentTarget.style.background = '#5b61f4';
            }}
          >
            {isLoading
              ? 'Processing...'
              : isRegister
              ? 'Create Account'
              : 'Sign In'}
          </button>

          {/* Footer toggle */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '8px',
              fontSize: '13px',
              color: '#94a3b8',
            }}
          >
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                clearError();
              }}
              style={{
                color: '#38bdf8',
                fontWeight: 700,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0 4px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
