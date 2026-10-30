import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import AdminPanel from './AdminPanel';
import Login from './Login';
import Layout from './Layout';
import { 
  FleetPage, AirportTransferPage, TeamPage, AboutPage, 
  BlogPage, BlogPostPage, FAQPage, ContactPage, PartnersPage,
  CheckoutPage
} from './Pages'; 

const COMPANY_NAME = 'Geolitoch Enterprises';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop',
];

const INITIAL_LISTINGS = [
  { id: '1', type: 'car', title: 'Cadillac Escalade', price: 300000, detail: '7 Seats · 4 Doors · Automatic · Petrol', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop', status: 'available' },
  { id: '2', type: 'car', title: 'Lexus RX350', price: 290000, detail: '5 Seats · 4 Doors · Automatic · Petrol', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000&auto=format&fit=crop', status: 'available' },
  { id: '3', type: 'car', title: 'Toyota Prado', price: 160000, detail: '7 Seats · 4 Doors · Automatic · Petrol', image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1000&auto=format&fit=crop', status: 'available' },
  { id: '4', type: 'car', title: 'Mercedes G63', price: 450000, detail: '5 Seats · 4 Doors · Automatic · Petrol', image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1000&auto=format&fit=crop', status: 'available' },
  { id: '5', type: 'car', title: 'Range Rover', price: 380000, detail: '5 Seats · 4 Doors · Automatic · Petrol', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=1000&auto=format&fit=crop', status: 'available' },
  { id: '6', type: 'car', title: 'Toyota Hilux', price: 200000, detail: '5 Seats · 4 Doors · Automatic · Diesel', image: 'https://images.unsplash.com/photo-1620589912598-0c2a3b1c1c1c?q=80&w=1000&auto=format&fit=crop', status: 'available' },
  { id: '7', type: 'house', title: 'Modern Penthouse', price: 1250000, detail: '3 Bed · 2 Bath · 1450 Sqft', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop', status: 'available' },
  { id: '8', type: 'house', title: 'Cozy Suburban Home', price: 389000, detail: '4 Bed · 2.5 Bath · 2100 Sqft', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop', status: 'available' },
  { id: '9', type: 'house', title: 'Luxury Beach Villa', price: 2500000, detail: '5 Bed · 4 Bath · 3500 Sqft', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop', status: 'available' },
];

function HomePage({ listings, setListings }: any) {
  const navigate = useNavigate();
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', phone: '', start: '', end: '' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [bookingTab, setBookingTab] = useState<'daily' | 'booking' | 'interstate'>('daily');
  const [bookingType, setBookingType] = useState<'12hours' | 'airport'>('12hours');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.start || !form.end) return alert('Please fill all fields');
    
    setListings(listings.map((l: any) => l.id === selectedListing.id ? { ...l, status: 'booked' } : l));
    setSelectedListing(null);
    setForm({ name: '', phone: '', start: '', end: '' });
    
    navigate('/checkout');
  };

  const handleSearchCars = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' });
  };

  const availableCars = listings.filter((l: any) => l.type === 'car' && l.status === 'available');
  const availableHouses = listings.filter((l: any) => l.type === 'house' && l.status === 'available');

  return (
    <div>
      <section className="hero-section">
        <div className="hero-slideshow">
          {HERO_IMAGES.map((img, index) => (
            <div 
              key={index} 
              className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">● GEOLITOCH PREMIER FLEET</span>
            <h2>Luxury <br/><span className="italic-gold">Rental</span><br/> in Lagos</h2>
            <p>Premium SUVs, Executive sedans & Chauffeur experiences across Lagos. Airport pickups, Corporate travel & Interstate journeys.</p>
          </div>

          <div className="booking-widget">
            <div className="widget-tabs">
              <button className={bookingTab === 'daily' ? 'active' : ''} onClick={() => setBookingTab('daily')}>
                <span className="tab-title">Daily Booking</span>
                <span className="tab-sub">12hrs / Airport</span>
              </button>
              <button className={bookingTab === 'booking' ? 'active' : ''} onClick={() => setBookingTab('booking')}>
                <span className="tab-title">Booking</span>
                <span className="tab-sub">1 Day+</span>
              </button>
              <button className={bookingTab === 'interstate' ? 'active' : ''} onClick={() => setBookingTab('interstate')}>
                <span className="tab-title">Inter State</span>
                <span className="tab-sub">Out of Lagos</span>
              </button>
            </div>

            <form className="widget-form" onSubmit={handleSearchCars}>
              <div className="widget-row">
                <button 
                  type="button" 
                  className={`widget-type-btn ${bookingType === '12hours' ? 'active' : ''}`}
                  onClick={() => setBookingType('12hours')}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  12 Hours
                </button>
                <button 
                  type="button" 
                  className={`widget-type-btn ${bookingType === 'airport' ? 'active' : ''}`}
                  onClick={() => setBookingType('airport')}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                  Airport
                </button>
              </div>

              <div className="widget-row">
                <div className="widget-input-group">
                  <label>PICK UP LOCATION</label>
                  <input type="text" placeholder="Enter pick up address" />
                </div>
                <div className="widget-input-group">
                  <label>DROP OFF LOCATION</label>
                  <input type="text" placeholder="Enter drop off address" />
                </div>
              </div>

              <div className="widget-row">
                <div className="widget-input-group">
                  <label>PICK UP DATE</label>
                  <input type="date" />
                </div>
                <div className="widget-input-group">
                  <label>PICK UP TIME</label>
                  <select>
                    <option>Select time</option>
                    <option>08:00 AM</option>
                    <option>12:00 PM</option>
                    <option>04:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="widget-checkbox">
                <span>AUTO DROP-OFF (+12 HOURS)</span>
                <span>—</span>
              </div>

              <button type="submit" className="widget-search-btn">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                SEARCH AVAILABLE CARS
              </button>
            </form>
          </div>
        </div>
      </section>

      <div id="fleet">
        <div className="trust-bar">
          <div className="trust-track">
            <span className="trust-item"><i>✈</i> AIRPORT PICKUPS 24/7</span>
            <span className="trust-item"><i>🛣</i> INTERSTATE TRIPS</span>
            <span className="trust-item"><i>🕒</i> AVAILABLE ROUND THE CLOCK</span>
            <span className="trust-item"><i>★</i> 5-STAR RATED SERVICE</span>
            <span className="trust-item"><i>🚘</i> 50+ PREMIUM VEHICLES</span>
            <span className="trust-item"><i>📍</i> LAGOS SPECIALISTS</span>
            <span className="trust-item"><i>✈</i> AIRPORT PICKUPS 24/7</span>
            <span className="trust-item"><i>🛣</i> INTERSTATE TRIPS</span>
            <span className="trust-item"><i>🕒</i> AVAILABLE ROUND THE CLOCK</span>
            <span className="trust-item"><i>★</i> 5-STAR RATED SERVICE</span>
            <span className="trust-item"><i>🚘</i> 50+ PREMIUM VEHICLES</span>
            <span className="trust-item"><i>📍</i> LAGOS SPECIALISTS</span>
          </div>
        </div>

        <div className="store-container">
          <div className="section-heading">
            <span className="subtitle">— OUR FLEET</span>
            <h2>Premium <span className="italic-gold">Vehicles</span></h2>
            <p>Handpicked luxury vehicles maintained to exacting standards. Every car is an experience in itself.</p>
          </div>

          <div className="grid">
            {availableCars.map((listing: any) => (
              <div key={listing.id} className="premium-card">
                <div className="card-image-wrapper">
                  <span className="badge car">SUV</span>
                  <img src={listing.image} alt={listing.title} className="card-img" />
                  <span className="rating">★ 4.9</span>
                </div>
                <div className="card-content">
                  <h3>{listing.title}</h3>
                  <div className="specs-row">
                    <span><i className="icon">👤</i> 5 Seats</span>
                    <span><i className="icon">🚪</i> 4 Doors</span>
                    <span><i className="icon">⚙️</i> Auto</span>
                  </div>
                  <div className="card-footer">
                    <div className="price-box">
                      <span className="price-label">FROM</span>
                      <span className="price-value">₦{listing.price.toLocaleString()}</span>
                      <span className="price-period">/12hrs</span>
                    </div>
                    <button className="btn-book" onClick={() => setSelectedListing(listing)}>
                      BOOK NOW →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="properties" style={{ background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <div className="trust-bar house-trust">
          <div className="trust-track">
            <span className="trust-item"><i>🏠</i> LUXURY APARTMENTS</span>
            <span className="trust-item"><i>🔑</i> SHORT-LET & LONG-TERM</span>
            <span className="trust-item"><i>🌊</i> OCEAN VIEW PENTHOUSES</span>
            <span className="trust-item"><i>🛡️</i> 24/7 SECURITY ESTATES</span>
            <span className="trust-item"><i>📍</i> PRIME LOCATIONS</span>
            <span className="trust-item"><i>🤝</i> VERIFIED PROPERTIES</span>
            <span className="trust-item"><i>🏠</i> LUXURY APARTMENTS</span>
            <span className="trust-item"><i>🔑</i> SHORT-LET & LONG-TERM</span>
            <span className="trust-item"><i>🌊</i> OCEAN VIEW PENTHOUSES</span>
            <span className="trust-item"><i>🛡️</i> 24/7 SECURITY ESTATES</span>
            <span className="trust-item"><i>📍</i> PRIME LOCATIONS</span>
            <span className="trust-item"><i>🤝</i> VERIFIED PROPERTIES</span>
          </div>
        </div>

        <div className="store-container">
          <div className="section-heading">
            <span className="subtitle">— REAL ESTATE</span>
            <h2>Premium <span className="italic-gold">Properties</span></h2>
            <p>Discover our exclusive collection of luxury homes, penthouses, and short-lets across Lagos's most prestigious neighborhoods.</p>
          </div>

          <div className="grid houses-grid">
            {availableHouses.map((listing: any) => (
              <div key={listing.id} className="premium-card">
                <div className="card-image-wrapper">
                  <span className="badge house">HOUSE</span>
                  <img src={listing.image} alt={listing.title} className="card-img" />
                  <span className="rating">★ 4.9</span>
                </div>
                <div className="card-content">
                  <h3>{listing.title}</h3>
                  <div className="specs-row">
                    <span><i className="icon">🛏</i> 3 Bed</span>
                    <span><i className="icon">🛁</i> 2 Bath</span>
                    <span><i className="icon">📐</i> 1450 Sqf</span>
                  </div>
                  <div className="card-footer">
                    <div className="price-box">
                      <span className="price-label">FROM</span>
                      <span className="price-value">₦{listing.price.toLocaleString()}</span>
                      <span className="price-period">/night</span>
                    </div>
                    <button className="btn-book" onClick={() => setSelectedListing(listing)}>
                      BOOK NOW →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedListing && (
        <div className="modal-backdrop" onClick={() => setSelectedListing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Book: {selectedListing.title}</h3>
            <p className="modal-company">{COMPANY_NAME}</p>
            <p className="modal-price">₦{selectedListing.price.toLocaleString()}</p>
            <form onSubmit={submitBooking}>
              <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <div className="date-row">
                <input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} required />
                <input type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-book">Confirm & Pay</button>
                <button type="button" className="btn-secondary" onClick={() => setSelectedListing(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('geolitoch_auth') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  const [listings, setListings] = useState(INITIAL_LISTINGS);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage listings={listings} setListings={setListings} />} />
          <Route path="/fleet" element={<FleetPage listings={listings} />} />
          <Route path="/airport-transfer" element={<AirportTransferPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/fleet-partners" element={<PartnersPage />} />
          
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel listings={listings} setListings={setListings} />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;