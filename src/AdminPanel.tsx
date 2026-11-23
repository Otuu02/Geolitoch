import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

const hashPassword = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
};

export default function AdminPanel({ listings }: any) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'car' | 'house'>('all');
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // <--- CHANGED TO 4 ITEMS PER PAGE

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.detail) {
      alert("Please fill in all fields.");
      return;
    }
    
    const defaultImage = formData.type === 'car' 
      ? 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop';

    if (isEditing) {
      const { error } = await supabase
        .from('listings')
        .update({
          type: formData.type,
          title: formData.title,
          price: parseFloat(formData.price),
          detail: formData.detail,
          image: formData.image || defaultImage
        })
        .eq('id', formData.id);

      if (error) {
        alert("Error updating: " + error.message);
      } else {
        alert("Listing updated successfully!");
        window.location.reload(); 
      }
    } else {
      const { error } = await supabase
        .from('listings')
        .insert([{
          type: formData.type,
          title: formData.title,
          price: parseFloat(formData.price),
          detail: formData.detail,
          image: formData.image || defaultImage,
          status: 'available'
        }]);

      if (error) {
        alert("Error uploading: " + error.message);
      } else {
        alert("Listing uploaded successfully!");
        window.location.reload(); 
      }
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

  // --- DELETE ---
  const deleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this listing?')) return;
    
    const { error } = await supabase.from('listings').delete().eq('id', id);
    
    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      window.location.reload();
    }
  };

  // --- UPDATE STATUS ---
  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('listings').update({ status: newStatus }).eq('id', id);
    
    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      window.location.reload();
    }
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredListings = listings.filter((l: any) => {
    if (activeTab === 'all') return true;
    return l.type === activeTab;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

  // Change page
  const paginateNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const paginatePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle tab change (reset page to 1)
  const handleTabChange = (tab: 'all' | 'car' | 'house') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* HEADER */}
      <header style={{ background: 'var(--navy)', padding: '15px 20px', color: '#fff', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/logo.png" alt="Geolitoch Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div>
            <h1 style={{ fontSize: '1.2rem', margin: 0 }}>Geolitoch</h1>
            <p style={{ fontSize: '0.7rem', margin: 0, letterSpacing: '1px', color: 'var(--gold)' }}>ENTERPRISES</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>Admin Dashboard</div>
          <button onClick={openSettings} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Reset Password</button>
          <button onClick={handleLogout} style={{ background: '#dc2626', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 15px' }}>
        
        {/* METRICS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid var(--navy)' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Total Inventory</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--navy)' }}>{totalListings}</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Available</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--navy)' }}>{availableCount}</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Active Bookings/Sales</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--navy)' }}>{bookedCount}</div>
          </div>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid var(--navy)' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Est. Revenue</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--navy)' }}>₦{estRevenue.toLocaleString()}</div>
          </div>
        </div>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: FORM AND SETTINGS */}
          <div>
            <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--navy)', borderBottom: '2px solid var(--gold)', paddingBottom: '10px', marginBottom: '20px', display: 'inline-block' }}>
                {isEditing ? 'Edit Product' : 'Upload New Product'}
              </h3>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>Category</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                    <option value="car">Car (Rental / Sales)</option>
                    <option value="house">House (Airbnb / Sale)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>Upload Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px dashed #cbd5e1', background: '#f8fafc' }} />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginTop: '10px' }} />
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>Product Title</label>
                  <input placeholder="e.g. 2023 Range Rover" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>Price (₦)</label>
                  <input placeholder="e.g. 450000" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>Full Description / Specs</label>
                  <input placeholder="e.g. 5 Seats · Automatic · Lagos" value={formData.detail} onChange={(e) => setFormData({ ...formData, detail: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn-book" style={{ flex: 1, padding: '14px' }}>
                    {isEditing ? 'Save Changes' : 'Publish to Website'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '14px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* INTERACTIVE SETTINGS PANEL */}
            <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '25px' }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '15px' }}>Quick Admin Settings</h4>
              
              <button onClick={openSettings} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Username</span>
                <span style={{ color: 'var(--navy)', fontWeight: 'bold', fontSize: '0.9rem' }}>{currentUser} ✎</span>
              </button>

              <button onClick={openSettings} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #e2e8f0', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Contact Email</span>
                <span style={{ color: 'var(--navy)', fontWeight: 'bold', fontSize: '0.9rem' }}>{currentEmail} ✎</span>
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>System Status</span>
                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.9rem' }}>● Online & Synced</span>
              </div>

              <button onClick={openSettings} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px 0', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Database Mode</span>
                <span style={{ color: 'var(--navy)', fontWeight: 'bold', fontSize: '0.9rem' }}>Supabase Cloud ✎</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: INVENTORY LIST */}
          <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--navy)', margin: 0 }}>Manage Inventory</h3>
              <div style={{ display: 'flex', gap: '5px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                <button onClick={() => handleTabChange('all')} style={{ padding: '6px 12px', border: 'none', background: activeTab === 'all' ? '#fff' : 'transparent', boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeTab === 'all' ? 'bold' : 'normal', fontSize: '0.85rem' }}>All</button>
                <button onClick={() => handleTabChange('car')} style={{ padding: '6px 12px', border: 'none', background: activeTab === 'car' ? '#fff' : 'transparent', boxShadow: activeTab === 'car' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeTab === 'car' ? 'bold' : 'normal', fontSize: '0.85rem' }}>Cars</button>
                <button onClick={() => handleTabChange('house')} style={{ padding: '6px 12px', border: 'none', background: activeTab === 'house' ? '#fff' : 'transparent', boxShadow: activeTab === 'house' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: activeTab === 'house' ? 'bold' : 'normal', fontSize: '0.85rem' }}>Houses</button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No items found.</div>
              )}
              
              {currentItems.map((l: any) => (
                <div key={l.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc' }}>
                  
                  {/* Top: Image & Title */}
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <img src={l.image} alt={l.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--navy)', lineHeight: 1.3, marginBottom: '4px' }}>{l.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{l.detail}</span>
                    </div>
                  </div>

                  {/* Bottom: Price, Status, Actions */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--navy)' }}>₦{l.price.toLocaleString()}</span>
                      <span style={{ 
                        fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px',
                        background: l.status === 'available' ? '#dcfce7' : l.status === 'booked' ? '#fef3c7' : '#f1f5f9',
                        color: l.status === 'available' ? '#166534' : l.status === 'booked' ? '#92400e' : '#475569'
                      }}>
                        {l.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                      {/* Status Toggle Buttons */}
                      {l.status !== 'available' && (
                        <button onClick={() => updateStatus(l.id, 'available')} style={{ padding: '6px 10px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Mark Available</button>
                      )}
                      {l.status === 'available' && (
                        <button onClick={() => updateStatus(l.id, 'booked')} style={{ padding: '6px 10px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Mark Booked</button>
                      )}
                      {l.type === 'car' && l.status !== 'maintenance' && (
                        <button onClick={() => updateStatus(l.id, 'maintenance')} style={{ padding: '6px 10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Maintenance</button>
                      )}
                      {l.type === 'house' && l.status !== 'sold' && (
                        <button onClick={() => updateStatus(l.id, 'sold')} style={{ padding: '6px 10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Mark Sold</button>
                      )}
                      
                      {/* Icon Buttons */}
                      <button onClick={() => startEdit(l)} style={{ padding: '6px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button onClick={() => deleteListing(l.id)} style={{ padding: '6px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  onClick={paginatePrev} 
                  disabled={currentPage === 1}
                  style={{ padding: '8px 16px', background: currentPage === 1 ? '#e2e8f0' : '#fff', color: currentPage === 1 ? '#94a3b8' : 'var(--navy)', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                  ← Prev
                </button>
                
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Page {currentPage} of {totalPages}
                </span>

                <button 
                  onClick={paginateNext} 
                  disabled={currentPage === totalPages}
                  style={{ padding: '8px 16px', background: currentPage === totalPages ? '#e2e8f0' : '#fff', color: currentPage === totalPages ? '#94a3b8' : 'var(--navy)', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                  Next →
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ADMIN SETTINGS MODAL */}
      {showReset && (
        <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal" style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '5px' }}>Reset Password</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>Geolitoch Security</p>
            
            <form onSubmit={handleUpdateCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>Username</label>
                <input type="text" placeholder="New Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>Email Address</label>
                <input type="email" placeholder="New Email Address" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>New Password</label>
                <input type="password" placeholder="Leave blank to keep current" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' }}>Confirm New Password</label>
                <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              
              {resetError && <div style={{ color: '#dc2626', fontSize: '0.85rem' }}>{resetError}</div>}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-book" style={{ flex: 1, padding: '12px' }}>Save Settings</button>
                <button type="button" onClick={() => setShowReset(false)} style={{ flex: 1, padding: '12px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}