import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';

const COMPANY_NAME = 'Geolitoch Enterprises';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showCustomerAuth, setShowCustomerAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', password: '' });

  const handleCustomerAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signup') {
      if (!customerForm.name || !customerForm.email || !customerForm.password) return alert('Please fill all fields');
      alert(`Account created successfully for ${customerForm.name}! You are now logged in.`);
    } else {
      if (!customerForm.email || !customerForm.password) return alert('Please fill all fields');
      alert(`Welcome back, ${customerForm.email}! You are now logged in.`);
    }
    setShowCustomerAuth(false);
    setCustomerForm({ name: '', email: '', password: '' });
  };

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-container">
          
          {/* TOP ROW: Logo & Hamburger */}
          <div className="header-top-row">
            <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
              <img src="/logo.png" alt="Geolitoch Logo" className="animated-logo" />
              <div>
                <h1>Geolitoch</h1>
                <p>ENTERPRISES</p>
              </div>
            </Link>
            
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12"></path>
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18"></path>
                )}
              </svg>
            </button>
          </div>

          {/* MIDDLE ROW: Navigation (Hidden on mobile until clicked) */}
          <nav className={`header-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/fleet" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Fleet</Link>
            <Link to="/airport-transfer" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Airport Transfer</Link>
            <Link to="/team" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Our Team</Link>
            <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/blog" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            <Link to="/faq" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <Link to="/fleet-partners" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Fleet Partners</Link>
          </nav>

          {/* BOTTOM ROW: Action Buttons */}
          <div className="header-actions">
            <button onClick={() => setShowCustomerAuth(true)} className="sign-in-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span className="hide-on-mobile">Customer Sign In</span>
            </button>
            <Link to="/fleet" className="phone-btn">BOOK NOW</Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="site-footer" id="contact">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>GEOLITOCH ENTERPRISES</h3>
            <p>Luxury Car & Home Rental</p>
          </div>
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.1rem' }}>Quick Links</h4>
            <Link to="/fleet" className="footer-link">Our Fleet</Link>
            <Link to="/airport-transfer" className="footer-link">Airport Transfer</Link>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/contact" className="footer-link">Contact Us</Link>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <a href="tel:08038872570" style={{ display: 'block', marginBottom: '8px' }}>📞 0803 887 2570</a>
            <a href="tel:08033999629" style={{ display: 'block', marginBottom: '8px' }}>📞 0803 399 9629</a>
            <a href="mailto:geolitoch@gmail.com" style={{ display: 'block', marginTop: '8px', fontSize: '0.95rem' }}>✉️ geolitoch@gmail.com</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Geolitoch Enterprises. All rights reserved.</p>
        </div>
      </footer>

      <a href="https://wa.me/2348038872570" target="_blank" rel="noreferrer" className="whatsapp-float">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {showCustomerAuth && (
        <div className="modal-backdrop" onClick={() => setShowCustomerAuth(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{authMode === 'login' ? 'Customer Sign In' : 'Create an Account'}</h3>
            <p className="modal-company">{COMPANY_NAME}</p>
            <form onSubmit={handleCustomerAuth} style={{ marginTop: '20px' }}>
              {authMode === 'signup' && (
                <input placeholder="Full Name" value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} required />
              )}
              <input type="email" placeholder="Email Address" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} required />
              <input type="password" placeholder="Password" value={customerForm.password} onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })} required />
              <div className="modal-actions">
                <button type="submit" className="btn-book">{authMode === 'login' ? 'Sign In' : 'Sign Up'}</button>
                <button type="button" className="btn-secondary" onClick={() => setShowCustomerAuth(false)}>Cancel</button>
              </div>
            </form>
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
              {authMode === 'login' ? (
                <p>Don't have an account? <span style={{ color: 'var(--red)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setAuthMode('signup')}>Sign Up</span></p>
              ) : (
                <p>Already have an account? <span style={{ color: 'var(--red)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setAuthMode('login')}>Sign In</span></p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}