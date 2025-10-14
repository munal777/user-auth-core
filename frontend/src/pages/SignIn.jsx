import { useState } from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Handle sign in logic here
    console.log('Sign in with:', email);
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in logic here
    console.log('Sign in with Google');
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Left Side - Decorative */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0047AB 0%, #1C75BC 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }} />
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '6px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '3px'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '80px',
          height: '80px',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          transform: 'rotate(45deg)'
        }} />
        
        {/* Wavy decorative lines */}
        <svg style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '200px',
          height: '200px',
          opacity: 0.3
        }} viewBox="0 0 200 200">
          <path d="M 20 100 Q 60 80, 100 100 T 180 100" 
                stroke="rgba(255, 255, 255, 0.4)" 
                strokeWidth="2" 
                fill="none"/>
          <path d="M 20 120 Q 60 100, 100 120 T 180 120" 
                stroke="rgba(255, 255, 255, 0.3)" 
                strokeWidth="2" 
                fill="none"/>
          <path d="M 20 140 Q 60 120, 100 140 T 180 140" 
                stroke="rgba(255, 255, 255, 0.2)" 
                strokeWidth="2" 
                fill="none"/>
        </svg>

        {/* Content */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '700', 
            color: '#FFFFFF',
            marginBottom: '20px',
            letterSpacing: '-1px'
          }}>
            Welcome back!
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.6'
          }}>
            Sign in to access your BookMyTest account and manage your test bookings.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{
        flex: 1,
        background: '#FFFFFF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '420px',
          padding: '40px'
        }}>
          {/* Logo/Brand */}
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: '#0A1F44',
              marginBottom: '8px'
            }}>
              BookMyTest
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#6B7280'
            }}>
              Sign in to your account
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            style={{
              width: '100%',
              padding: '14px',
              border: '1.5px solid #E5E7EB',
              borderRadius: '8px',
              background: '#FFFFFF',
              color: '#0A1F44',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '24px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8F9FA';
              e.currentTarget.style.borderColor = '#0047AB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
              <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
              <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
              <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '24px 0',
            gap: '12px'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            <span style={{ fontSize: '14px', color: '#6B7280' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '12px',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                color: '#991B1B',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#0A1F44',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#0A1F44',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#0047AB'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#0A1F44',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '15px',
                  color: '#0A1F44',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#0047AB'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              />
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginBottom: '24px'
            }}>
              <a href="#" style={{ 
                fontSize: '14px', 
                color: '#0047AB',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: '#0047AB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '20px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#003A8C';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#0047AB';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Sign In
            </button>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#6B7280' }}>
                Don't have an account?{' '}
              </span>
              <Link 
                to="/signup" 
                style={{ 
                  fontSize: '14px', 
                  color: '#0047AB',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
