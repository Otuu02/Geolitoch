import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Get user info from localStorage
  const userName = localStorage.getItem('customer_name') || 'OTUU OBINNA G';
  const userEmail = localStorage.getItem('customer_email') || 'giftotuuobinna1995@gmail.com';

  const handleLogout = () => {
    localStorage.removeItem('customer_auth');
    localStorage.removeItem('customer_name');
    localStorage.removeItem('customer_email');
    navigate('/');
  };

  return (
    <div className="customer-dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="sidebar-avatar">O</div>
          <h3>{userName.toUpperCase()}</h3>
          <p>{userEmail}</p>
          <span className="member-badge">MEMBER</span>
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

          <button className="sidebar-nav-item">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Edit Profile
          </button>

          <button className="sidebar-nav-item">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Change Password
          </button>

          <button className="sidebar-nav-item" onClick={() => navigate('/fleet')}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>
            Book a Car
          </button>

          <button className="sidebar-nav-item sign-out" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            SIGN OUT
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        
        {/* TOP BAR */}
        <header className="dashboard-topbar">
          <h1>Dashboard</h1>
          
          <div className="profile-dropdown-container">
            <button 
              className="profile-dropdown-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                O
              </div>
              {userName.toUpperCase()}
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu-dark">
                <div className="dropdown-header">
                  <h4>{userName.toUpperCase()}</h4>
                  <p>{userEmail}</p>
                </div>
                <button className="dropdown-item-dark" onClick={() => { setActiveTab('dashboard'); setIsDropdownOpen(false); }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                  Dashboard
                </button>
                <button className="dropdown-item-dark">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  My Profile
                </button>
                <button className="dropdown-item-dark" onClick={() => { setActiveTab('bookings'); setIsDropdownOpen(false); }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  My Bookings
                </button>
                <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }}></div>
                <button className="dropdown-item-dark sign-out" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* DASHBOARD PAGE CONTENT */}
        <div className="dashboard-content">
          <h2 className="page-title">Dashboard</h2>

          {/* STATS CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon orange">📋</div>
              <span className="stat-label">Total Bookings</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">⏱</div>
              <span className="stat-label">Pending</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <span className="stat-label">Completed</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">⭐</div>
              <span className="stat-label">Member Since</span>
              <span className="stat-value">2026</span>
            </div>
          </div>

          {/* RECENT BOOKINGS / MAIN CONTENT AREA */}
          <div className="recent-box">
            <div className="recent-header">
              <h3>Recent Bookings</h3>
            </div>
            
            {/* Empty State View */}
            {activeTab === 'dashboard' && (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="1.5" fill="none" style={{ marginBottom: '16px' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="10" y1="14" x2="14" y2="18"></line><line x1="14" y1="14" x2="10" y2="18"></line></svg>
                <p>You have no bookings yet.</p>
                <button onClick={() => navigate('/fleet')}>BROWSE FLEET</button>
              </div>
            )}

            {/* Bookings View (When tab is clicked) */}
            {activeTab === 'bookings' && (
              <div className="table-responsive">
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', color: '#1e293b' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                      <th style={{ padding: '16px', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Property/Vehicle</th>
                      <th style={{ padding: '16px', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Date</th>
                      <th style={{ padding: '16px', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '16px', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px', fontWeight: 600 }}>Luxury Villa in Lekki</td>
                      <td style={{ padding: '16px', color: '#64748b' }}>Nov 15 - Nov 20, 2026</td>
                      <td style={{ padding: '16px' }}><span style={{ color: '#d97706', background: '#fef3c7', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Confirmed</span></td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>₦1,500,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;