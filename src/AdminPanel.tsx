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

export default function AdminPanel({ listings, setListings }: any) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'car' | 'house'>('all');
  
  // State for the form
  const [formData, setFormData] = useState({
    id: '', type: 'car', title: '', price: '', detail: '', image: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // State for Reset Password
  const [showReset, setShowReset] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  
  const currentUser = localStorage.getItem('geolitoch_user') || 'admin';
  const currentEmail = localStorage.getItem('geolitoch_email') || 'admin@geolitoch.com';

  // --- LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('geolitoch_auth');
    navigate('/login');
  };

  // --- OPEN SETTINGS MODAL ---
  const openSettings = () => {
    setNewUsername(currentUser);
    setNewEmail(currentEmail);
    setShowReset(true);
  };

  // --- UPDATE CREDENTIALS ---
  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (!newUsername || !newEmail) return setResetError('Username and Email are required.');
    if (newPassword && newPassword.length < 6) return setResetError('Password must be at least 6 characters.');
    if (newPassword && newPassword !== confirmPassword) return setResetError('Passwords do not match.');

    localStorage.setItem('geolitoch_user', newUsername);
    localStorage.setItem('geolitoch_email', newEmail);
    
    if (newPassword) {
      localStorage.setItem('geolitoch_pass', hashPassword(newPassword));
    }

    alert('Settings updated successfully! Please login again.');
    setShowReset(false);
    handleLogout();
  };

  // --- METRICS LOGIC ---
  const totalListings = listings.length;
  const availableCount = listings.filter((l: any) => l.status === 'available').length;
  const bookedCount = listings.filter((l: any) => l.status === 'booked').length;
  const estRevenue = listings
    .filter((l: any) => l.status === 'booked')
    .reduce((sum: number, l: any) => sum + l.price, 0);

  // --- HANDLE IMAGE UPLOAD ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- SUBMIT FORM ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.detail) {
      alert("Please fill in all fields.");
      return;
    }
    
    const defaultImage = formData.type === 'car' 
      ? 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop';

    if (isEditing) {
      setListings(listings.map((l: any) => 
        l.id === formData.id 
          ? { ...l, type: formData.type, title: formData.title, price: parseFloat(formData.price), detail: formData.detail, image: formData.image || defaultImage } 
          : l
      ));
      alert("Listing updated successfully!");
    } else {
      const newItem = {
        id: Date.now().toString(),
        type: formData.type,
        title: formData.title,
        price: parseFloat(formData.price),
        detail: formData.detail,
        image: formData.image || defaultImage,
        status: 'available',
      };
      setListings([newItem, ...listings]);
      alert("Listing uploaded successfully!");
    }
    
    setFormData({ id: '', type: 'car', title: '', price: '', detail: '', image: '' });
    setIsEditing(false);
  };

  // --- PREPARE EDIT ---
  const startEdit = (item: any) => {
    setFormData({
      id: item.id, type: item.type, title: item.title, price: item.price.toString(), detail: item.detail, image: item.image
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setFormData({ id: '', type: 'car', title: '', price: '', detail: '', image: '' });
    setIsEditing(false);
  };

  const deleteListing = (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this listing?')) return;
    setListings(listings.filter((l: any) => l.id !== id));
  };

  const updateStatus = (id: string, newStatus: string) => {
    setListings(listings.map((l: any) => l.id === id ? { ...l, status: newStatus } : l));
  };

  const filteredListings = listings.filter((l: any) => {
    if (activeTab === 'all') return true;
    return l.type === activeTab;
  });

  return (
    <div className="admin-layout">
      
      {/* FIXED DEDICATED ADMIN HEADER */}
      <header className="admin-header-bar">
        <div className="admin-header-content">
          <div className="admin-brand">
            <span className="logo-icon">G</span>
            <div>
              <h1>Geolitoch</h1>
              <p>ENTERPRISES</p>
            </div>
          </div>
          
          <div className="header-right-actions">
            <div className="admin-badge">Admin Dashboard</div>
            
            <button 
              onClick={openSettings} 
              className="header-action-btn reset"
            >
              Reset Password
            </button>

            <button 
              onClick={handleLogout} 
              className="header-action-btn logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        
        {/* METRICS */}
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-title">Total Inventory</span>
            <span className="metric-value">{totalListings}</span>
          </div>
          <div className="metric-card green">
            <span className="metric-title">Available</span>
            <span className="metric-value">{availableCount}</span>
          </div>
          <div className="metric-card orange">
            <span className="metric-title">Active Bookings/Sales</span>
            <span className="metric-value">{bookedCount}</span>
          </div>
          <div className="metric-card">
            <span className="metric-title">Est. Revenue (Active)</span>
            <span className="metric-value">₦{estRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div className="admin-main-grid">
          
          {/* LEFT COLUMN: FORM AND SETTINGS */}
          <div>
            <div className="admin-box add-box">
              <h3>{isEditing ? 'Edit Product' : 'Upload New Product'}</h3>
              <form className="add-form-vertical" onSubmit={handleSubmit}>
                
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="car">Car (Rental / Sales)</option>
                    <option value="house">House (Airbnb / Sale)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Upload Image (From Computer)</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} />
                  )}
                </div>

                <div className="form-group">
                  <label>Product Title</label>
                  <input placeholder="e.g. 2023 Range Rover" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Price (₦)</label>
                  <input placeholder="e.g. 450000" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Full Description / Specs</label>
                  <input placeholder="e.g. 5 Seats · Automatic · Lagos" value={formData.detail} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '14px' }}>
                    {isEditing ? 'Save Changes' : 'Publish to Website'}
                  </button>
                  {isEditing && (
                    <button type="button" className="btn-secondary" onClick={cancelEdit} style={{ flex: 1, padding: '14px' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* INTERACTIVE SETTINGS PANEL */}
            <div className="settings-panel">
              <h4>Quick Admin Settings</h4>
              
              <button 
                className="settings-row clickable"
                onClick={openSettings}
                title="Click to change Username"
              >
                <span>Username</span>
                <p>{currentUser} ✎</p>
              </button>

              <button 
                className="settings-row clickable"
                onClick={openSettings}
                title="Click to change Email"
              >
                <span>Contact Email</span>
                <p>{currentEmail} ✎</p>
              </button>

              <div className="settings-row">
                <span>System Status</span>
                <p style={{ color: '#16a34a' }}>● Online & Synced</p>
              </div>

              <button 
                className="settings-row clickable" 
                style={{ borderBottom: 'none' }}
                onClick={openSettings}
                title="Click to change Settings"
              >
                <span>Database Mode</span>
                <p>Local Storage ✎</p>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: INVENTORY TABLE */}
          <div className="admin-box table-box">
            <div className="table-header-row">
              <h3>Manage Inventory</h3>
              <div className="admin-tabs">
                <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All Items</button>
                <button className={activeTab === 'car' ? 'active' : ''} onClick={() => setActiveTab('car')}>Cars</button>
                <button className={activeTab === 'house' ? 'active' : ''} onClick={() => setActiveTab('house')}>Houses</button>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Details</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                    <th>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>No items found.</td></tr>
                  )}
                  {filteredListings.map((l: any) => (
                    <tr key={l.id}>
                      <td>
                        <img src={l.image} alt={l.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--navy)' }}>{l.title}</strong><br/>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{l.detail}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>₦{l.price.toLocaleString()}</td>
                      <td>
                        <span className={`status ${l.status}`}>{l.status.toUpperCase()}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {l.status !== 'available' && (
                            <button className="btn-small green" onClick={() => updateStatus(l.id, 'available')}>Mark Available</button>
                          )}
                          {l.status === 'available' && (
                            <button className="btn-small orange" onClick={() => updateStatus(l.id, 'booked')}>Mark Booked</button>
                          )}
                          {l.type === 'car' && l.status !== 'maintenance' && (
                            <button className="btn-small grey" onClick={() => updateStatus(l.id, 'maintenance')}>Maintenance</button>
                          )}
                          {l.type === 'house' && l.status !== 'sold' && (
                            <button className="btn-small grey" onClick={() => updateStatus(l.id, 'sold')}>Mark Sold</button>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="manage-buttons">
                          <button className="btn-icon edit" onClick={() => startEdit(l)} title="Edit Item">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button className="btn-icon delete" onClick={() => deleteListing(l.id)} title="Delete Item">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* ADMIN SETTINGS MODAL */}
      {showReset && (
        <div className="modal-backdrop">
          <div className="modal" style={{ maxWidth: '450px' }}>
            <h3>Reset Password</h3>
            <p className="modal-company">Geolitoch Security</p>
            
            <form onSubmit={handleUpdateCredentials}>
              
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  placeholder="New Username" 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="New Email Address" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>New Password (Leave blank to keep current)</label>
                <input 
                  type="password" 
                  placeholder="New Password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
              
              {resetError && <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '10px' }}>{resetError}</div>}

              <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="btn-book" style={{ padding: '12px' }}>Save Settings</button>
                <button type="button" className="btn-secondary" onClick={() => setShowReset(false)} style={{ padding: '12px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}