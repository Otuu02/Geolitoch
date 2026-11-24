import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const hashPassword = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isCustomerLogin = location.pathname.includes('customer');

  // Master fallback password
  const defaultUser = 'admin';
  const defaultHash = hashPassword('geolitoch2026'); 
  
  const storedUser = localStorage.getItem('geolitoch_user') || defaultUser;
  const storedHash = localStorage.getItem('geolitoch_pass') || defaultHash;
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Eye toggle state
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isCustomerLogin) {
      // === CUSTOMER LOGIN ===
      if (username && password) {
        const formattedEmail = username.includes('@') ? username : `${username}@gmail.com`;
        const displayName = username.includes('@') ? username.split('@')[0] : username;

        // CHANGED TO SESSION STORAGE
        sessionStorage.setItem('customer_auth', 'true');
        localStorage.setItem('customer_name', displayName);
        localStorage.setItem('customer_email', formattedEmail);
        
        window.location.href = '/dashboard'; 
      } else {
        setError('Please enter your details.');
      }
    } else {
      // === ADMIN LOGIN ===
      
      // GUARANTEED MASTER PASSWORD OVERRIDE
      const isMasterLogin = username.toLowerCase() === 'admin' && password === 'geolitoch2026';
      
      // Standard saved login
      const isStandardLogin = username.toLowerCase() === storedUser.toLowerCase() && hashPassword(password) === storedHash;

      if (isMasterLogin || isStandardLogin) {
        // CHANGED TO SESSION STORAGE
        sessionStorage.setItem('geolitoch_auth', 'true');
        navigate('/admin'); 
      } else {
        setError('Invalid admin username or password.');
      }
    }
  };

  return (
    <div className="premium-login-wrapper">
      <div className="login-left">
        <div className="login-left-overlay"></div>
        <div className="login-left-content">
          <div className="login-brand">
            <span className="logo-icon">G</span>
            <div>
              <h1>Geolitoch</h1>
              <p>ENTERPRISES</p>
            </div>
          </div>
          <h2>{isCustomerLogin ? 'Welcome back to Geolitoch.' : 'Manage your fleet & properties with ease.'}</h2>
          <p>{isCustomerLogin ? 'Log in to view your bookings and manage your profile.' : 'The official control panel for Geolitoch Enterprises administrators.'}</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h2>{isCustomerLogin ? 'Customer Sign In' : 'Admin Login'}</h2>
            <p>{isCustomerLogin ? 'Enter your email and password to access your dashboard.' : 'Please enter your admin credentials to continue.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="premium-form">
            <div className="premium-input-group">
              <label>{isCustomerLogin ? 'Email Address' : 'Admin Username'}</label>
              <input 
                type={isCustomerLogin ? "email" : "text"} 
                placeholder={isCustomerLogin ? "e.g. customer@gmail.com" : "Enter admin username"} 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                autoFocus
                required
              />
            </div>
            
            <div className="premium-input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={{ width: '100%', paddingRight: '45px' }} // Extra padding so text doesn't hide behind eye
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            {error && <div className="premium-error">{error}</div>}

            <button type="submit" className="premium-btn">
              Sign In
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </form>

          <div className="login-footer">
            <p>© {new Date().getFullYear()} Geolitoch Enterprises.</p>
          </div>
        </div>
      </div>
    </div>
  );
}