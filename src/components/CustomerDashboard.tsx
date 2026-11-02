import { useState } from 'react';
import './CustomerDashboard.css';

type TabType = 'bookings' | 'profile' | 'payments';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('bookings');

  const handleLogout = () => {
    localStorage.removeItem('customer_auth');
    window.location.href = '/customer-login';
  };

  return (
    <div className="customer-dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">L</div>
          <div>
            <h1>LuxeStay</h1>
            <p>Customer Portal</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i>📅</i> My Bookings
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i>👤</i> Profile Settings
          </button>
          <button 
            className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <i>💳</i> Payment Methods
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <span>↪</span> Logout (giftotuuobinna1995)
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <h2>Welcome back, Gift 👋</h2>
          <div className="topbar-actions">
            <button className="btn-primary">Book New Stay</button>
          </div>
        </header>

        <div className="dashboard-content">
          {activeTab === 'bookings' && (
            <div className="tab-pane fade-in">
              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-title">Upcoming Trips</span>
                  <span className="metric-value">1</span>
                </div>
                <div className="metric-card">
                  <span className="metric-title">Total Nights Booked</span>
                  <span className="metric-value">14</span>
                </div>
              </div>

              <div className="admin-box mt-24">
                <h3>Recent Bookings</h3>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Luxury Villa in Lekki</strong></td>
                        <td>Nov 15 - Nov 20, 2026</td>
                        <td><span className="status booked">Confirmed</span></td>
                        <td>$1,500</td>
                        <td><button className="btn-small grey">View Receipt</button></td>
                      </tr>
                      <tr>
                        <td><strong>Executive SUV Rental</strong></td>
                        <td>Oct 01 - Oct 05, 2026</td>
                        <td><span className="status available">Completed</span></td>
                        <td>$450</td>
                        <td><button className="btn-small grey">View Receipt</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="tab-pane fade-in">
               <div className="admin-box">
                <h3>Profile Information</h3>
                <div className="add-form-vertical max-w-md">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue="Gift Otubu" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue="giftotuuobinna1995@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" defaultValue="+234 800 000 0000" />
                  </div>
                  <button className="btn-book" style={{ marginTop: '10px' }}>Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="tab-pane fade-in">
              <div className="admin-box">
                <h3>Saved Payment Methods</h3>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>You have no saved payment methods.</p>
                <button className="btn-secondary">+ Add New Card</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;