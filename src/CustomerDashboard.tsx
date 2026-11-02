import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [userName, setUserName] = useState('Gift');

  const handleLogout = () => {
    localStorage.removeItem('customer_auth');
    navigate('/');
  };

  return (
    <div className="app" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* TOP NAVIGATION HEADER */}
      <header className="customer-header-wrapper">
        <div className="customer-header-content">
          
          {/* Logo */}
          <div className="customer-logo-area" onClick={() => navigate('/')}>
            <div className="logo-icon" style={{ background: 'var(--navy)', color: 'white' }}>G</div>
            <h1>GEOLITOCH</h1>
          </div>

          {/* Profile Dropdown */}
          <div className="customer-profile-dropdown">
            <button 
              className="profile-trigger" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Hi, {userName}
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginLeft: '5px' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { setActiveTab('profile'); setIsDropdownOpen(false); }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  My Account
                </button>
                
                <button className="dropdown-item" onClick={() => { setActiveTab('orders'); setIsDropdownOpen(false); }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  Orders
                </button>

                <button className="dropdown-item">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  Inbox
                </button>

                <div className="dropdown-divider"></div>

                <button className="dropdown-item logout" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="dashboard-content-wrapper">
        
        <div className="welcome-banner">
          <h2>Welcome back, {userName} 👋</h2>
          <p>Manage your bookings, view your order history, and update your profile settings.</p>
        </div>

        {/* TABS */}
        <div className="admin-tabs" style={{ marginBottom: '24px', display: 'inline-flex', background: '#fff', padding: '4px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
            style={{ padding: '10px 20px', border: 'none', background: activeTab === 'orders' ? 'var(--navy)' : 'transparent', color: activeTab === 'orders' ? 'white' : '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            My Orders
          </button>
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
            style={{ padding: '10px 20px', border: 'none', background: activeTab === 'profile' ? 'var(--navy)' : 'transparent', color: activeTab === 'profile' ? 'white' : '#64748b', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            Profile Settings
          </button>
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="admin-box fade-in" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--navy)' }}>Order History</h3>
            <div className="table-responsive">
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>Toyota Prado (SUV)</td>
                    <td style={{ padding: '16px', color: '#64748b' }}>Oct 01 - Oct 05, 2026</td>
                    <td style={{ padding: '16px' }}><span style={{ color: '#16a34a', background: '#dcfce7', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Completed</span></td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>₦450,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="admin-box fade-in" style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--navy)' }}>Profile Information</h3>
            <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Full Name</label>
                <input type="text" defaultValue="Gift Otubu" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Email Address</label>
                <input type="email" defaultValue="giftotuuobinna1995@example.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
              </div>
              <button className="btn-book" style={{ padding: '14px', marginTop: '10px' }}>Save Changes</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default CustomerDashboard;