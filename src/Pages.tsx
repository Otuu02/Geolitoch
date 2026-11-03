import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from './supabase';
import { usePaystackPayment } from 'react-paystack';

// A reusable wrapper for pages
const PageLayout = ({ title, subtitle, children }: any) => (
  <div className="store-container" style={{ minHeight: '60vh', paddingTop: '120px', paddingBottom: '80px' }}>
    <div className="section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
      <span className="subtitle">— {subtitle}</span>
      <h2>{title}</h2>
    </div>
    <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
      {children}
    </div>
  </div>
);

// Shared Data for Blog Posts
const BLOG_POSTS = [
  {
    id: 'luxury-suvs-lagos',
    title: 'Top 5 Luxury SUVs to Rent in Lagos for a Weekend Getaway',
    date: 'Oct 24, 2026',
    author: 'Geolitoch Team',
    excerpt: 'Planning a trip to the coast or an upscale event? Here are our top picks from our premium fleet to ensure you travel in ultimate comfort.',
    content: 'Lagos is a city of energy and style, and when you are traveling for a weekend getaway or a high-profile corporate event, your mode of transportation sets the tone. In this article, we break down the top 5 luxury SUVs in our fleet, including the Cadillac Escalade, Mercedes G63, and the Range Rover. We discuss their comfort levels, luggage capacity, and why they are perfect for navigating both the city streets and off-road retreats.',
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'corporate-shuttles',
    title: 'Why Corporate Clients Choose Geolitoch for Staff Shuttles',
    date: 'Oct 18, 2026',
    author: 'Operations Team',
    excerpt: 'Reliability and safety are paramount. Learn how our trained drivers, GPS tracking, and HSE compliance make us the top choice for oil & gas firms.',
    content: 'In the corporate world, especially within the oil and gas sector, logistics can make or break an operation. Geolitoch Enterprises has built a reputation for absolute reliability. Our staff shuttles are equipped with real-time GPS tracking, our drivers undergo rigorous safety training, and we maintain strict compliance with HSE standards. This article explores how our B2B transport solutions save companies time and mitigate risk.',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'luxury-shortlets-lagos',
    title: 'The Rise of Luxury Short-Lets in Lagos',
    date: 'Oct 10, 2026',
    author: 'Real Estate Team',
    excerpt: 'Discover why more travelers are opting for premium penthouses and ocean-view apartments over traditional hotels for long stays.',
    content: 'The hospitality landscape in Lagos is shifting. High-net-worth travelers and expatriates are increasingly choosing luxury short-lets over traditional 5-star hotels. Why? Privacy, space, and the feeling of a "home away from home." From modern penthouses in Ikoyi to beachfront villas, we explore this growing trend and how Geolitoch Enterprises is positioned at the forefront of it.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop'
  }
];

// === FLEET PAGE ===
export const FleetPage = ({ listings = [] }: any) => {
  const availableCars = (listings || []).filter((l: any) => l.type === 'car' && l.status === 'available');

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px', background: '#f8fafc' }}>
      <div className="store-container" style={{ paddingTop: '0' }}>
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="subtitle">— OUR FLEET</span>
          <h2>Premium <span className="italic-gold">Vehicles</span></h2>
          <p style={{ margin: '0 auto', color: '#64748b' }}>Browse our entire collection of premium cars available for rent or purchase.</p>
        </div>

        <div className="grid">
          {availableCars.length === 0 ? (
            <div style={{ textAlign: 'center', width: '100%', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ color: 'var(--navy)', marginBottom: '10px' }}>No vehicles found</h3>
              <p style={{ color: '#64748b' }}>There are currently no cars available in the fleet.</p>
            </div>
          ) : (
            availableCars.map((listing: any) => (
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
                      <span className="price-value">₦{listing.price.toLocaleString()}</span>
                      <span className="price-period">/12hrs</span>
                    </div>
                    {/* UPDATED: Routes to Booking Details Page */}
                    <Link 
                      to={`/booking-details?car=${encodeURIComponent(listing.title)}&price=${listing.price}`} 
                      className="btn-book" 
                      style={{ textDecoration: 'none' }}
                    >
                      BOOK NOW →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// === TEAM PAGE ===
export const TeamPage = () => {
  const team = [
    {
      name: 'Reginald Nwachukwu',
      role: 'Managing Director & Chief Executive Officer (MD/CEO)',
      image: '/team/Reginald.jpeg', 
    },
    {
      name: 'Stella Osinachi Amadi',
      role: 'Head of Finance & Administration',
      image: '/team/Stella.jpeg', 
    }
  ];

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px', background: '#f8fafc' }}>
      <div className="store-container" style={{ paddingTop: '0' }}>
        
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="subtitle">— MEET THE TEAM</span>
          <h2>The People Behind <span className="italic-gold">Geolitoch</span></h2>
          <p style={{ margin: '0 auto', color: '#64748b', maxWidth: '600px' }}>
            We are a dedicated team of professionals committed to providing you with the best luxury rental experience in Lagos.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {team.map((member, index) => (
            <div key={index} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', textAlign: 'center' }}>
              <img 
                src={member.image} 
                alt={member.name} 
                style={{ width: '100%', height: '350px', objectFit: 'cover', objectPosition: 'top', borderBottom: '3px solid var(--gold)' }} 
              />
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '8px' }}>
                  {member.name}
                </h3>
                <p style={{ color: 'var(--red)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', lineHeight: '1.4' }}>
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// === ABOUT PAGE ===
export const AboutPage = () => {
  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px', background: '#f8fafc' }}>
      <div className="store-container" style={{ paddingTop: '0' }}>
        
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="subtitle">— COMPANY PROFILE</span>
          <h2>About <span className="italic-gold">Geolitoch Enterprises</span></h2>
        </div>

        <div style={{ display: 'grid', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '20px', borderBottom: '2px solid var(--gold)', paddingBottom: '10px', display: 'inline-block' }}>
              1. Who We Are
            </h3>
            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8 }}>
              Geolitoch Enterprises is a fully registered Nigerian company specializing in car hire, transport logistics, and vehicle leasing services for corporate organizations, oil and gas firms, and private clients. We are committed to providing safe, efficient, and reliable mobility solutions tailored to meet our clients’ operational and executive needs.
            </p>
            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, marginTop: '16px' }}>
              Our operations are guided by principles of excellence, integrity, and customer satisfaction, ensuring that every journey reflects our promise of comfort, punctuality, and professionalism.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            
            <div style={{ background: 'var(--navy)', padding: '40px', borderRadius: '12px', color: '#fff' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '20px' }}>
                2. Our Vision
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.8 }}>
                To be the most trusted and preferred car hire and logistics service provider in Nigeria’s corporate and energy sectors.
              </p>
            </div>
            
            <div style={{ background: 'var(--navy)', padding: '40px', borderRadius: '12px', color: '#fff' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '20px' }}>
                3. Our Mission
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.8 }}>
                To deliver high-quality transport solutions that combine safety, comfort, and efficiency while upholding international best practices and client satisfaction.
              </p>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '20px', borderBottom: '2px solid var(--gold)', paddingBottom: '10px', display: 'inline-block' }}>
              4. Our Core Services
            </h3>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {[
                'Executive car hire and corporate transport',
                '4x4 utility vehicles for field operations',
                'Staff shuttle and logistics management',
                'Airport pick-up and drop-off',
                'Long-term vehicle leasing'
              ].map((service, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '1.05rem' }}>
                  <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>✓</span> {service}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '20px', borderBottom: '2px solid var(--gold)', paddingBottom: '10px', display: 'inline-block' }}>
              5. Our Strengths & Commitments
            </h3>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {[
                'Fleet of well-maintained, fully insured vehicles',
                'Trained, courteous, and safety-conscious drivers',
                '24/7 operational support and GPS tracking',
                'Full compliance with HSE (Health, Safety, and Environment) standards',
                'Flexible and competitive pricing'
              ].map((strength, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '1.05rem' }}>
                  <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>✓</span> {strength}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

// === BLOG PAGE ===
export const BlogPage = () => {
  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px', background: '#f8fafc' }}>
      <div className="store-container" style={{ paddingTop: '0' }}>
        
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="subtitle">— NEWS & UPDATES</span>
          <h2>Our <span className="italic-gold">Blog</span></h2>
          <p style={{ margin: '0 auto', color: '#64748b', maxWidth: '600px' }}>
            Insights, travel tips, and news from the Geolitoch team. Stay updated with our latest fleet additions and corporate services.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px' 
        }}>
          {BLOG_POSTS.map((post, index) => (
            <div key={index} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <img 
                src={post.image} 
                alt={post.title} 
                style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
              />
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '12px', lineHeight: '1.3' }}>
                  {post.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                  {post.excerpt}
                </p>
                
                <Link 
                  to={`/blog/${post.id}`}
                  style={{ 
                    display: 'inline-block',
                    background: 'transparent', 
                    color: 'var(--navy)', 
                    border: '1px solid var(--navy)', 
                    padding: '10px 16px', 
                    width: 'fit-content', 
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: '0.2s' 
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--navy)'; }}
                >
                  Read Article →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

// === INDIVIDUAL BLOG POST PAGE ===
export const BlogPostPage = () => {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div style={{ paddingTop: '120px', paddingBottom: '80px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--navy)' }}>Article Not Found</h2>
        <Link to="/blog" style={{ color: 'var(--red)', textDecoration: 'none', marginTop: '20px', display: 'inline-block' }}>← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px', background: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        
        <Link to="/blog" style={{ color: 'var(--navy)', textDecoration: 'none', fontWeight: '600', display: 'inline-block', marginBottom: '30px' }}>
          ← Back to All Articles
        </Link>

        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
          
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.9rem', color: '#64748b', marginBottom: '16px' }}>
              <span>{post.date}</span>
              <span>•</span>
              <span>By {post.author}</span>
            </div>
            
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: 'var(--navy)', marginBottom: '24px', lineHeight: '1.2' }}>
              {post.title}
            </h1>
            
            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '24px' }}>
              {post.content}
            </p>
            
            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8 }}>
              For more information on our services or to book a vehicle, please contact our team today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// === AIRPORT TRANSFER PAGE ===
export const AirportTransferPage = () => (
  <div style={{ paddingTop: '80px', paddingBottom: '80px', background: '#f8fafc' }}>
    <div className="store-container" style={{ paddingTop: '0' }}>
      
      <div className="section-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="subtitle">— PREMIUM SERVICES</span>
        <h2>Airport <span className="italic-gold">Transfer</span></h2>
        <p style={{ margin: '0 auto', color: '#64748b', maxWidth: '600px' }}>
          Arrive in style and comfort. Our professional drivers track your flight and ensure you are picked up right on time, every time.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Information Column */}
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '20px' }}>
            Seamless Transfers
          </h3>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '24px' }}>
            Book a premium chauffeur for your airport pickup and drop-off. Whether you are traveling for business or leisure, we guarantee a stress-free journey to and from Murtala Muhammed International Airport.
          </p>
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              'Real-time flight tracking (we wait for you if your flight is delayed)',
              'Meet & Greet service at the arrivals hall',
              'Complimentary bottled water and Wi-Fi on board',
              'Spacious luxury vehicles for you and your luggage',
              'Professional, uniformed, and vetted chauffeurs'
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#475569', fontSize: '1rem' }}>
                <span style={{ color: 'var(--red)', fontWeight: 'bold', marginTop: '2px' }}>✓</span> 
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Booking Card Column */}
        <div style={{ background: 'var(--navy)', padding: '40px', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 30px rgba(10,28,58,0.15)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '10px' }}>
            Book Your Transfer
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '30px' }}>
            Call our 24/7 dispatch team directly to schedule your airport pickup or drop-off.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%', color: 'var(--gold)' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Call Dispatch 24/7</p>
                <a href="tel:08038872570" style={{ display: 'block', color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.05rem' }}>0803 887 2570</a>
                <a href="tel:08033999629" style={{ display: 'block', color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.05rem' }}>0803 399 9629</a>
              </div>
            </div>
          </div>

          <a href="tel:08038872570" className="btn-book" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '16px', background: 'var(--gold)', color: 'var(--navy)', fontWeight: 'bold' }}>
            Call to Book Now
          </a>
        </div>

      </div>
    </div>
  </div>
);

// === FAQ PAGE ===
export const FAQPage = () => (
  <PageLayout title="Frequently Asked Questions" subtitle="Support">
    <div style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem' }}>
      <h4 style={{ color: 'var(--navy)', marginTop: '20px', fontSize: '1.2rem', marginBottom: '8px' }}>Do you require a deposit?</h4>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>Yes, a refundable security deposit is required for all car rentals. The amount depends on the vehicle type.</p>
      
      <h4 style={{ color: 'var(--navy)', fontSize: '1.2rem', marginBottom: '8px' }}>What documents do I need to rent a car?</h4>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>You will need a valid driver's license and a form of ID (Passport or National ID). International driving permits are also accepted.</p>
      
      <h4 style={{ color: 'var(--navy)', fontSize: '1.2rem', marginBottom: '8px' }}>Do you offer airport pickups?</h4>
      <p style={{ color: '#64748b' }}>Yes! We offer 24/7 airport transfer services. Just provide your flight details when booking.</p>
    </div>
  </PageLayout>
);

// === CONTACT PAGE ===
export const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}. Your message has been sent to Geolitoch Enterprises. We will contact you shortly.`);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px', background: '#f8fafc' }}>
      <div className="store-container" style={{ paddingTop: '0' }}>
        
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="subtitle">— GET IN TOUCH</span>
          <h2>Contact <span className="italic-gold">Us</span></h2>
          <p style={{ margin: '0 auto', color: '#64748b', maxWidth: '600px' }}>
            Have a question or need a quote? Reach out to our team and we will get back to you as soon as possible.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Contact Details (Left Column) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Phone */}
            <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '50%', color: 'var(--red)' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.2rem', marginBottom: '8px' }}>Call Us</h4>
                <a href="tel:08038872570" style={{ display: 'block', color: 'var(--red)', fontWeight: 'bold', textDecoration: 'none', marginBottom: '4px' }}>0803 887 2570</a>
                <a href="tel:08033999629" style={{ display: 'block', color: 'var(--red)', fontWeight: 'bold', textDecoration: 'none' }}>0803 399 9629</a>
              </div>
            </div>

            {/* Email */}
            <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '50%', color: '#2563eb' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.2rem', marginBottom: '8px' }}>Email Us</h4>
                <a href="mailto:geolitoch@gmail.com" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>
                  geolitoch@gmail.com
                </a>
              </div>
            </div>

            {/* Location/WhatsApp */}
            <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '50%', color: '#10b981' }}>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.2rem', marginBottom: '8px' }}>Location</h4>
                <p style={{ color: '#64748b', marginBottom: '4px' }}>Lagos, Nigeria</p>
                <a href="https://wa.me/2348038872570" target="_blank" rel="noreferrer" style={{ color: '#10b981', fontWeight: 'bold', textDecoration: 'none' }}>Chat on WhatsApp</a>
              </div>
            </div>

          </div>

          {/* Contact Form (Right Column) */}
          <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '20px' }}>
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Your name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Your email address"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Message</label>
                <textarea 
                  placeholder="How can we help you?"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                ></textarea>
              </div>

              <button type="submit" className="btn-book" style={{ padding: '16px', fontSize: '1rem', marginTop: '10px' }}>
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

// === B2B PARTNERS PAGE ===
export const PartnersPage = () => (
  <div style={{ paddingTop: '80px', paddingBottom: '80px', background: '#f8fafc' }}>
    <div className="store-container" style={{ paddingTop: '0' }}>
      
      <div className="section-heading" style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="subtitle">— B2B PARTNERSHIPS</span>
        <h2>Fleet <span className="italic-gold">Partners</span></h2>
        <p style={{ margin: '0 auto', color: '#64748b', maxWidth: '600px' }}>
          We provide reliable, long-term mobility solutions for businesses, oil & gas firms, and corporate organizations across Nigeria.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Information Column */}
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '20px' }}>
            Why Partner With Us?
          </h3>
          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '24px' }}>
            Interested in partnering with Geolitoch Enterprises? We offer corporate rates and long-term leasing options for businesses, hotels, and corporate clients. 
          </p>
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              'Dedicated account managers for corporate clients',
              'Custom transport solutions for staff and executives',
              'Fully insured, HSE-compliant vehicles and drivers',
              'Flexible billing and invoicing options',
              'Priority 24/7 support for all partner fleets'
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#475569', fontSize: '1rem' }}>
                <span style={{ color: 'var(--red)', fontWeight: 'bold', marginTop: '2px' }}>✓</span> 
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Card Column */}
        <div style={{ background: 'var(--navy)', padding: '40px', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 30px rgba(10,28,58,0.15)' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '10px' }}>
            Let's Discuss
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '30px' }}>
            Contact our B2B team to request a quote or discuss a custom fleet solution for your company.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%', color: 'var(--gold)' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Call Corporate Sales</p>
                <a href="tel:08038872570" style={{ display: 'block', color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.05rem' }}>0803 887 2570</a>
                <a href="tel:08033999629" style={{ display: 'block', color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.05rem' }}>0803 399 9629</a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%', color: 'var(--gold)' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email Us</p>
                <a href="mailto:geolitoch@gmail.com" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.05rem' }}>geolitoch@gmail.com</a>
              </div>
            </div>
          </div>

          <a href="mailto:geolitoch@gmail.com" className="btn-book" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '16px', background: 'var(--gold)', color: 'var(--navy)', fontWeight: 'bold' }}>
            Request a Corporate Quote
          </a>
        </div>

      </div>
    </div>
  </div>
);

// === BOOKING DETAILS PAGE ===
export const BookingDetailsPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const params = new URLSearchParams(window.location.search);
  const carTitle = params.get('car') || 'Vehicle Rental';
  const carPrice = params.get('price') || '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `*NEW BOOKING DETAILS - GEOLITOCH* 🚘\n\n*Customer Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n\n*Vehicle Requested:* ${carTitle}\n*Price:* ₦${Number(carPrice).toLocaleString()}\n\n_Please confirm this booking._`;
    
    window.open(`https://wa.me/2348038872570?text=${encodeURIComponent(message)}`, '_blank');

    localStorage.setItem('customer_name', formData.name);
    localStorage.setItem('customer_email', formData.email);
    localStorage.setItem('customer_phone', formData.phone);

    window.location.href = `/checkout?car=${encodeURIComponent(carTitle)}&price=${carPrice}`;
  };

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', background: '#f8fafc', minHeight: '80vh' }}>
      <div className="store-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="subtitle">— STEP 1 OF 2</span>
          <h2>Enter Your <span className="italic-gold">Details</span></h2>
          <p style={{ margin: '0 auto', color: '#64748b' }}>
            You are booking the <strong>{carTitle}</strong>. Please provide your details so our team can contact you.
          </p>
        </div>

        <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Full Name *</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Phone Number *</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Email Address *</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
            </div>

            <button type="submit" className="btn-book" style={{ padding: '18px', fontSize: '1rem', marginTop: '10px' }}>
              PROCEED TO PAYMENT →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// === CHECKOUT / PAYMENT PAGE ===
export const CheckoutPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const customerName = localStorage.getItem('customer_name') || 'Guest';
  const customerEmail = localStorage.getItem('customer_email') || 'guest@geolitoch.com';
  const customerPhone = localStorage.getItem('customer_phone') || 'N/A';

  const params = new URLSearchParams(window.location.search);
  const carTitle = params.get('car') || 'Vehicle Rental';
  const carPrice = parseFloat(params.get('price') || '0');
  const totalAmount = carPrice + 50000;

  const config = {
    reference: (new Date()).getTime().toString(),
    email: customerEmail,
    amount: totalAmount * 100,
    publicKey: 'pk_live_7a358ea26ea5861b2ee0da1ceb5f38ff5d7ca9f5',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference: any) => {
    const { error } = await supabase.from('bookings').insert([{
      customer_email: customerEmail,
      customer_name: customerName, 
      customer_phone: customerPhone,
      car_name: carTitle,
      amount: totalAmount,
      status: 'confirmed',
      booking_date: new Date().toISOString(),
      payment_reference: reference.reference
    }]);

    if (error) {
      console.error(error);
      alert("Error saving booking: " + error.message);
    } else {
      setIsSuccess(true);
    }
  };

  const onClose = () => alert('Payment window closed.');

  if (isSuccess) {
    return (
      <div style={{ paddingTop: '120px', paddingBottom: '100px', textAlign: 'center', background: '#f8fafc', minHeight: '80vh' }}>
        <div style={{ background: '#fff', padding: '50px', borderRadius: '12px', maxWidth: '500px', margin: '0 auto', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--navy)', fontSize: '2rem', marginBottom: '10px' }}>Payment Successful!</h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>Thank you, {customerName}. Your booking for the <strong>{carTitle}</strong> is confirmed.</p>
          <Link to="/dashboard" className="btn-book" style={{ display: 'inline-block', textDecoration: 'none', padding: '14px 32px' }}>Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', background: '#f8fafc', minHeight: '80vh' }}>
      <div className="store-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="subtitle">— STEP 2 OF 2</span>
          <h2>Complete <span className="italic-gold">Payment</span></h2>
        </div>

        <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          
          <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ color: 'var(--navy)', marginBottom: '15px' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}>
              <span>{carTitle}</span>
              <span>₦{carPrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#475569' }}>
              <span>Security Deposit</span>
              <span>₦50,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--navy)' }}>
              <span>Total</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={() => initializePayment({ onSuccess, onClose })}
            className="btn-book" 
            style={{ padding: '18px', fontSize: '1rem', width: '100%', cursor: 'pointer' }}
          >
            Pay ₦{totalAmount.toLocaleString()} with Paystack
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '15px' }}>
            Secure 256-bit SSL encrypted payment.
          </p>
        </div>
      </div>
    </div>
  );
};