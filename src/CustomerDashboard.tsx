import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import './CustomerDashboard.css';

interface Booking {
  id: string | number;
  customer_email: string;
  customer_name: string;
  car_name: string;
  amount: number;
  status: string;
  booking_date: string;
}

const CustomerDashboard = () => {
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'profile' | 'password'>('dashboard');
  
  // Data state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Profile Form state
  const [profileName, setProfileName] = useState(localStorage.getItem('customer_name') || '');
  const [profileEmail, setProfileEmail] = useState(localStorage.getItem('customer_email') || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const userName = localStorage.getItem('customer_name') || 'Customer';
  const userEmail = localStorage.getItem('customer_email') || '';

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_email', userEmail)
        .order('booking_date', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else if (data) {
        setBookings(data);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [userEmail]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    // Update localStorage
    localStorage.setItem('customer_name', profileName);
    localStorage.setItem('customer_email', profileEmail);
    
    // Simulate API call delay
    setTimeout(() => {
      alert('Profile updated successfully!');
      setIsUpdatingProfile(false);
      window.location.reload(); // Refresh to update the sidebar name
    }, 1000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    setIsUpdatingPassword(true);
    
    // Simulate API call delay
    setTimeout(() => {
      alert('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setIsUpdatingPassword(false);
    }, 1000);
  };

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status.toLowerCase() === 'pending').length;
  const completedBookings = bookings.filter(b => b.status.toLowerCase() === 'completed' || b.status.toLowerCase() === 'confirmed').length;
  const memberSince = new Date().getFullYear();

  return (
    <div className="customer-dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="sidebar-avatar" style={{ color: 'var(--navy)' }}>{userName.charAt(0).toUpperCase()}</div>
          <h3 style={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>{userName.toUpperCase()}</h3>
          <p style={{ wordBreak: 'break-all' }}>{userEmail}</p>
          <span className="member-badge">★ MEMBER</span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Dashboard
          </button>
          
          <button 
            className={`sidebar-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            My Bookings
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Edit Profile
          </button>

          <button 
            className={`sidebar-nav-item ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Change Password
          </button>

          <button className="sidebar-nav-item" onClick={() => navigate('/fleet')}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>
            Book a Car
          </button>

          <button className="sidebar-nav-item sign-out" onClick={() => { localStorage.clear(); navigate('/'); }}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            SIGN OUT
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          
          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <>
              <span className="greeting">Good morning, {userName.toUpperCase()} 👋</span>
              <h2 className="page-title">Dashboard</h2>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon orange">📋</div>
                  <span className="stat-label">Total Bookings</span>
                  <span className="stat-value">{loading ? '...' : totalBookings}</span>
                </div>
                <div className="stat-card">
                  <div className="stat-icon red">⏱</div>
                  <span className="stat-label">Pending</span>
                  <span className="stat-value">{loading ? '...' : pendingBookings}</span>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green">✅</div>
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">{loading ? '...' : completedBookings}</span>
                </div>
                <div className="stat-card">
                  <div className="stat-icon blue">⭐</div>
                  <span className="stat-label">Member Since</span>
                  <span className="stat-value">{memberSince}</span>
                </div>
              </div>

              <div className="recent-box">
                <div className="recent-header">
                  <h3>Recent Bookings</h3>
                  <a href="/fleet" className="view-all">VIEW ALL →</a>
                </div>
                
                {loading ? (
                  <div className="empty-state"><p>Loading...</p></div>
                ) : bookings.length === 0 ? (
                  <div className="empty-state">
                    <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="1.5" fill="none" style={{ marginBottom: '16px' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <p>You have no bookings yet.</p>
                    <button onClick={() => navigate('/fleet')}>BROWSE FLEET</button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                      <thead>
                        <tr style={{ background: '#1e293b', textAlign: 'left' }}>
                          <th style={{ padding: '16px', color: '#94a3b8', fontSize: '0.8rem' }}>Vehicle</th>
                          <th style={{ padding: '16px', color: '#94a3b8', fontSize: '0.8rem' }}>Date</th>
                          <th style={{ padding: '16px', color: '#94a3b8', fontSize: '0.8rem' }}>Status</th>
                          <th style={{ padding: '16px', color: '#94a3b8', fontSize: '0.8rem' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 3).map((booking) => (
                          <tr key={booking.id} style={{ borderBottom: '1px solid #1e293b' }}>
                            <td style={{ padding: '16px', fontWeight: 600 }}>{booking.car_name}</td>
                            <td style={{ padding: '16px', color: '#94a3b8' }}>{new Date(booking.booking_date).toLocaleDateString()}</td>
                            <td style={{ padding: '16px' }}><span style={{ color: '#4ade80', background: 'rgba(22, 163, 74, 0.15)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{booking.status}</span></td>
                            <td style={{ padding: '16px', fontWeight: 600 }}>₦{booking.amount?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 2. ALL BOOKINGS VIEW */}
          {activeTab === 'bookings' && (
            <>
              <h2 className="page-title">My Bookings</h2>
              <div className="recent-box">
                {loading ? (
                   <div className="empty-state"><p>Loading...</p></div>
                ) : bookings.length === 0 ? (
                  <div className="empty-state"><p>No bookings found.</p></div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                    <thead>
                      <tr style={{ background: '#1e293b', textAlign: 'left' }}>
                        <th style={{ padding: '16px', color: '#94a3b8' }}>Vehicle</th>
                        <th style={{ padding: '16px', color: '#94a3b8' }}>Date</th>
                        <th style={{ padding: '16px', color: '#94a3b8' }}>Status</th>
                        <th style={{ padding: '16px', color: '#94a3b8' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} style={{ borderBottom: '1px solid #1e293b' }}>
                          <td style={{ padding: '16px', fontWeight: 600 }}>{booking.car_name}</td>
                          <td style={{ padding: '16px', color: '#94a3b8' }}>{new Date(booking.booking_date).toLocaleDateString()}</td>
                          <td style={{ padding: '16px' }}><span style={{ color: '#4ade80', background: 'rgba(22, 163, 74, 0.15)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{booking.status}</span></td>
                          <td style={{ padding: '16px', fontWeight: 600 }}>₦{booking.amount?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* 3. EDIT PROFILE VIEW */}
          {activeTab === 'profile' && (
            <>
              <h2 className="page-title">Edit Profile</h2>
              <div className="recent-box" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Full Name</label>
                    <input 
                      type="text" 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      required 
                      style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Email Address</label>
                    <input 
                      type="email" 
                      value={profileEmail} 
                      onChange={(e) => setProfileEmail(e.target.value)} 
                      required 
                      style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem' }} 
                    />
                  </div>
                  <button type="submit" className="btn-book" style={{ padding: '14px', marginTop: '10px' }} disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* 4. CHANGE PASSWORD VIEW */}
          {activeTab === 'password' && (
            <>
              <h2 className="page-title">Change Password</h2>
              <div className="recent-box" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {passwordError && <div style={{ color: '#fca5a5', background: 'rgba(225, 29, 44, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>{passwordError}</div>}

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>New Password</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      required 
                      placeholder="Enter new password"
                      style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required 
                      placeholder="Confirm new password"
                      style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '1rem' }} 
                    />
                  </div>
                  <button type="submit" className="btn-book" style={{ padding: '14px', marginTop: '10px' }} disabled={isUpdatingPassword}>
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;