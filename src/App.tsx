import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminPanel from './AdminPanel';
import Login from './Login';
import Layout from './Layout';
import CustomerDashboard from './CustomerDashboard';
import { supabase } from './supabase'; 
import { 
  FleetPage, AirportTransferPage, TeamPage, AboutPage, 
  BlogPage, BlogPostPage, FAQPage, ContactPage, PartnersPage,
  CheckoutPage, BookingDetailsPage // <-- ADDED BookingDetailsPage HERE
} from './Pages'; 

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop',
];

// Define Listing Type to satisfy TypeScript
interface Listing {
  id: string | number;
  title: string;
  price: number;
  detail: string;
  image: string;
  type: 'car' | 'house';
  status: 'available' | 'booked' | 'maintenance' | 'sold';
  created_at?: string;
}

function HomePage({ listings }: { listings: Listing[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // --- BOOKING WIDGET STATE ---
  const [bookingTab, setBookingTab] = useState<'daily' | 'booking' | 'interstate'>('daily');
  const [bookingType, setBookingType] = useState<'12hours' | 'airport'>('12hours');

  const [formData, setFormData] = useState({
    car: '',
    pickupState: '',
    dropoffState: '',
    pickupCity: '',
    dropoffCity: '',
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    totalDays: '',
    totalEscort: '0',
    name: '',
    phone: '',
    email: '',
    areaOfUse: ''
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.name && bookingTab !== 'daily') {
      return alert('Please provide your name.');
    }
    if (!formData.phone && bookingTab !== 'daily') {
      return alert('Please provide your phone number.');
    }
    if (!formData.pickupDate) {
      return alert('Please select a pick up date.');
    }

    // Format Message for WhatsApp
    let message = `*NEW BOOKING REQUEST - GEOLITOCH* 🚘\n\n`;
    message += `*Booking Type:* ${bookingTab.toUpperCase()} (${bookingType === '12hours' ? '12 Hours' : 'Airport'})\n`;
    
    if (bookingTab === 'booking' || bookingTab === 'interstate') {
      message += `*Vehicle:* ${formData.car || 'Any Available'}\n`;
    }

    message += `\n*--- TRIP DETAILS ---*\n`;
    if (formData.pickupState) message += `*Pickup State:* ${formData.pickupState}\n`;
    if (formData.dropoffState) message += `*Dropoff State:* ${formData.dropoffState}\n`;
    if (formData.pickupCity) message += `*Pickup City:* ${formData.pickupCity}\n`;
    if (formData.dropoffCity) message += `*Dropoff City:* ${formData.dropoffCity}\n`;
    if (formData.pickupLocation) message += `*Pickup Address:* ${formData.pickupLocation}\n`;
    if (formData.dropoffLocation) message += `*Dropoff Address:* ${formData.dropoffLocation}\n`;

    message += `\n*--- SCHEDULE ---*\n`;
    message += `*Pickup Date:* ${formData.pickupDate}\n`;
    message += `*Pickup Time:* ${formData.pickupTime}\n`;
    
    if (bookingTab === 'booking' || bookingTab === 'interstate') {
      message += `*Return Date:* ${formData.returnDate}\n`;
      message += `*Return Time:* ${formData.returnTime}\n`;
      message += `*Total Days:* ${formData.totalDays}\n`;
      message += `*Total Escort:* ${formData.totalEscort}\n`;
      message += `*Area of Use:* ${formData.areaOfUse}\n`;
    }

    if (bookingTab !== 'daily') {
      message += `\n*--- CUSTOMER DETAILS ---*\n`;
      message += `*Name:* ${formData.name}\n`;
      message += `*Phone:* ${formData.phone}\n`;
      if (formData.email) message += `*Email:* ${formData.email}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '2348038872570'; 
    
    // Open WhatsApp (Only for the custom multi-day/interstate booking widget)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const availableCars = listings.filter((l: Listing) => l.type === 'car' && l.status === 'available');
  const availableHouses = listings.filter((l: Listing) => l.type === 'house' && l.status === 'available');

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

          {/* NEW BOOKING WIDGET */}
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

            <form className="widget-form" onSubmit={handleSubmit} style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
              
              {/* TAB 1: DAILY BOOKING */}
              {bookingTab === 'daily' && (
                <>
                  <div className="widget-row">
                    <button type="button" className={`widget-type-btn ${bookingType === '12hours' ? 'active' : ''}`} onClick={() => setBookingType('12hours')}>
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 12 Hours
                    </button>
                    <button type="button" className={`widget-type-btn ${bookingType === 'airport' ? 'active' : ''}`} onClick={() => setBookingType('airport')}>
                      <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg> Airport
                    </button>
                  </div>
                  <div className="widget-row">
                    <div className="widget-input-group">
                      <label>PICK UP LOCATION</label>
                      <input type="text" name="pickupLocation" placeholder="Enter pick up address" value={formData.pickupLocation} onChange={handleInputChange} />
                    </div>
                    <div className="widget-input-group">
                      <label>DROP OFF LOCATION</label>
                      <input type="text" name="dropoffLocation" placeholder="Enter drop off address" value={formData.dropoffLocation} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="widget-row">
                    <div className="widget-input-group">
                      <label>PICK UP DATE *</label>
                      <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleInputChange} required />
                    </div>
                    <div className="widget-input-group">
                      <label>PICK UP TIME *</label>
                      <select name="pickupTime" value={formData.pickupTime} onChange={handleInputChange} required>
                        <option value="">Select time</option>
                        <option value="06:00 AM">06:00 AM</option>
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="widget-checkbox">
                    <span>AUTO DROP-OFF (+12 HOURS)</span>
                    <span>—</span>
                  </div>
                </>
              )}

              {/* TAB 2 & 3: MULTI-DAY BOOKING & INTERSTATE */}
              {(bookingTab === 'booking' || bookingTab === 'interstate') && (
                <>
                  <div className="widget-input-group">
                    <label>SELECT CAR *</label>
                    <select name="car" value={formData.car} onChange={handleInputChange} required>
                      <option value="">Choose a vehicle</option>
                      {availableCars.map(car => (
                        <option key={car.id} value={car.title}>{car.title}</option>
                      ))}
                      <option value="Any Available">Any Available Vehicle</option>
                    </select>
                  </div>

                  <div className="widget-row">
                    <div className="widget-input-group">
                      <label>PICKUP STATE *</label>
                      <select name="pickupState" value={formData.pickupState} onChange={handleInputChange} required>
                        <option value="">Select state</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja (FCT)</option>
                        <option value="Ogun">Ogun</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Enugu">Enugu</option>
                      </select>
                    </div>
                    <div className="widget-input-group">
                      <label>DROPOFF STATE *</label>
                      <select name="dropoffState" value={formData.dropoffState} onChange={handleInputChange} required>
                        <option value="">Select state</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja (FCT)</option>
                        <option value="Ogun">Ogun</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Enugu">Enugu</option>
                      </select>
                    </div>
                  </div>

                  <div className="widget-row">
                    <div className="widget-input-group">
                      <label>PICKUP CITY</label>
                      <input type="text" name="pickupCity" placeholder="e.g. Ikeja" value={formData.pickupCity} onChange={handleInputChange} />
                    </div>
                    <div className="widget-input-group">
                      <label>DROPOFF CITY</label>
                      <input type="text" name="dropoffCity" placeholder="e.g. Ibadan" value={formData.dropoffCity} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="widget-input-group">
                    <label>PICKUP LOCATION *</label>
                    <input type="text" name="pickupLocation" placeholder="Full pickup address" value={formData.pickupLocation} onChange={handleInputChange} required />
                  </div>

                  <div className="widget-input-group">
                    <label>DROPOFF LOCATION *</label>
                    <input type="text" name="dropoffLocation" placeholder="Full dropoff address" value={formData.dropoffLocation} onChange={handleInputChange} required />
                  </div>

                  <div className="widget-row">
                    <div className="widget-input-group">
                      <label>PICK UP DATE *</label>
                      <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleInputChange} required />
                    </div>
                    <div className="widget-input-group">
                      <label>PICK UP TIME *</label>
                      <select name="pickupTime" value={formData.pickupTime} onChange={handleInputChange} required>
                        <option value="">Select time</option>
                        <option value="06:00 AM">06:00 AM</option>
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="widget-row">
                    <div className="widget-input-group">
                      <label>RETURN DATE</label>
                      <input type="date" name="returnDate" value={formData.returnDate} onChange={handleInputChange} />
                    </div>
                    <div className="widget-input-group">
                      <label>RETURN TIME</label>
                      <select name="returnTime" value={formData.returnTime} onChange={handleInputChange}>
                        <option value="">Select time</option>
                        <option value="06:00 AM">06:00 AM</option>
                        <option value="08:00 AM">08:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="widget-row">
                    <div className="widget-input-group">
                      <label>TOTAL DAYS *</label>
                      <input type="number" name="totalDays" placeholder="e.g. 3" value={formData.totalDays} onChange={handleInputChange} required />
                    </div>
                    <div className="widget-input-group">
                      <label>TOTAL ESCORT</label>
                      <input type="number" name="totalEscort" value={formData.totalEscort} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="widget-input-group">
                    <label>YOUR NAME *</label>
                    <input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="widget-row">
                    <div className="widget-input-group">
                      <label>PHONE *</label>
                      <input type="tel" name="phone" placeholder="+234..." value={formData.phone} onChange={handleInputChange} required />
                    </div>
                    <div className="widget-input-group">
                      <label>EMAIL</label>
                      <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="widget-input-group">
                    <label>AREA OF USE</label>
                    <input type="text" name="areaOfUse" placeholder="e.g. Highway, City roads, Mixed" value={formData.areaOfUse} onChange={handleInputChange} />
                  </div>
                </>
              )}

              {/* DYNAMIC SUBMIT BUTTON */}
              <button type="submit" className="widget-search-btn" style={{ marginTop: '20px', width: '100%' }}>
                {bookingTab === 'daily' ? (
                  <>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    SEARCH AVAILABLE CARS
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    SUBMIT BOOKING REQUEST
                  </>
                )}
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
            {availableCars.length === 0 && (
              <p style={{ textAlign: 'center', width: '100%', color: '#64748b', padding: '40px' }}>No vehicles available right now.</p>
            )}
            {availableCars.map((listing: Listing) => (
              <div key={listing.id} className="premium-card">
                <div className="card-image-wrapper">
                  <span className="badge car">SUV</span>
                  <img src={listing.image} alt={listing.title} className="card-img" />
                  <span className="rating">★ 4.9</span>
                </div>
                <div className="card-content">
                  <h3>{listing.title}</h3>
                  <div className="specs-row" style={{ padding: '12px 0', display: 'block', minHeight: 'auto' }}>
                    <span style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '8px', fontWeight: 500, lineHeight: 1.4 }}>
                      <i className="icon" style={{ marginTop: '2px' }}>📋</i> 
                      {listing.detail}
                    </span>
                  </div>
                  <div className="card-footer">
                    <div className="price-box">
                      <span className="price-label">FROM</span>
                      <span className="price-value">₦{listing.price?.toLocaleString()}</span>
                      <span className="price-period">/12hrs</span>
                    </div>
                    {/* UPDATED: Routes to Booking Details Form first */}
                    <button 
                      className="btn-book" 
                      onClick={() => window.location.href = `/booking-details?car=${encodeURIComponent(listing.title)}&price=${listing.price}`}
                    >
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
            {availableHouses.length === 0 && (
              <p style={{ textAlign: 'center', width: '100%', color: '#64748b', padding: '40px' }}>No properties available right now.</p>
            )}
            {availableHouses.map((listing: Listing) => (
              <div key={listing.id} className="premium-card">
                <div className="card-image-wrapper">
                  <span className="badge house">HOUSE</span>
                  <img src={listing.image} alt={listing.title} className="card-img" />
                  <span className="rating">★ 4.9</span>
                </div>
                <div className="card-content">
                  <h3>{listing.title}</h3>
                  <div className="specs-row" style={{ padding: '12px 0', display: 'block', minHeight: 'auto' }}>
                    <span style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '8px', fontWeight: 500, lineHeight: 1.4 }}>
                      <i className="icon" style={{ marginTop: '2px' }}>🏠</i> 
                      {listing.detail}
                    </span>
                  </div>
                  <div className="card-footer">
                    <div className="price-box">
                      <span className="price-label">FROM</span>
                      <span className="price-value">₦{listing.price?.toLocaleString()}</span>
                      <span className="price-period">/night</span>
                    </div>
                    {/* UPDATED: Routes to Booking Details Form first */}
                    <button 
                      className="btn-book" 
                      onClick={() => window.location.href = `/booking-details?car=${encodeURIComponent(listing.title)}&price=${listing.price}`}
                    >
                      BOOK NOW →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ADMIN PROTECTED ROUTE
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('geolitoch_auth') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// CUSTOMER PROTECTED ROUTE
function CustomerProtectedRoute({ children }: { children: React.ReactNode }) {
  const isCustomerAuthenticated = localStorage.getItem('customer_auth') === 'true';
  return isCustomerAuthenticated ? <>{children}</> : <Navigate to="/customer-login" replace />;
}

function App() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching listings:', error);
      } else {
        setListings((data as Listing[]) || []);
      }
    }
    fetchListings();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage listings={listings} />} />
          <Route path="/fleet" element={<FleetPage listings={listings} />} />
          <Route path="/airport-transfer" element={<AirportTransferPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/fleet-partners" element={<PartnersPage />} />
          
          {/* ADDED THE BOOKING DETAILS ROUTE HERE */}
          <Route path="/booking-details" element={<BookingDetailsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* ADMIN LOGIN */}
        <Route path="/login" element={<Login />} />
        
        {/* ADMIN DASHBOARD */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel listings={listings} />
          </ProtectedRoute>
        } />

        {/* CUSTOMER LOGIN */}
        <Route path="/customer-login" element={<Login />} /> 
        
        {/* CUSTOMER DASHBOARD */}
        <Route path="/dashboard" element={
          <CustomerProtectedRoute>
            <CustomerDashboard />
          </CustomerProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;