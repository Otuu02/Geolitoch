import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  
  const defaultUser = 'admin';
  const defaultHash = hashPassword('admin123');
  
  const storedUser = localStorage.getItem('geolitoch_user') || defaultUser;
  const storedHash = localStorage.getItem('geolitoch_pass') || defaultHash;
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.toLowerCase() === storedUser.toLowerCase() && hashPassword(password) === storedHash) {
      localStorage.setItem('geolitoch_auth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="premium-login-wrapper">
      
      {/* LEFT SIDE: BRANDING & IMAGE */}
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
          <h2>Manage your fleet & properties with ease.</h2>
          <p>The official control panel for Geolitoch Enterprises administrators.</p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please enter your admin credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="premium-form">
            <div className="premium-input-group">
              <label>Username</label>
              <input 
                type="text" 
                placeholder="Enter admin username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                autoFocus
                required
              />
            </div>
            
            <div className="premium-input-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
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