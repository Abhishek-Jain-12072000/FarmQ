import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  Users, 
  MessageCircle, 
  Bug, 
  TrendingUp, 
  MapPin, 
  Menu, 
  X,
  Home
} from 'lucide-react';
import { formatPrice, getCountryName } from '../utils/currencyUtils';
import CropsPage from './CropsPage';
import BuyersPage from './BuyersPage';
import ChatPage from './ChatPage';
import DiseasePage from './DiseasePage';
import PredictionPage from './PredictionPage';
import './Dashboard.css';

const Dashboard = ({ userLocation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [countryCode, setCountryCode] = useState('IN');
  const navigate = useNavigate();
  const location = useLocation();

  // Detect user location on component mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get location from props first
        if (userLocation && userLocation.country) {
          setCountryCode(userLocation.country);
          return;
        }

        // Fallback: Use browser geolocation or IP-based detection
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country_code) {
          setCountryCode(data.country_code);
        }
      } catch (error) {
        console.log('Could not detect location, using default (India)');
        setCountryCode('IN');
      }
    };

    detectLocation();
  }, [userLocation]);

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Home', color: 'var(--primary-green)' },
    { path: '/dashboard/crops', icon: Leaf, label: 'Crops', color: 'var(--primary-green)' },
    { path: '/dashboard/buyers', icon: Users, label: 'Buyers', color: 'var(--primary-brown)' },
    { path: '/dashboard/chat', icon: MessageCircle, label: 'Chat', color: 'var(--golden-yellow)' },
    { path: '/dashboard/disease', icon: Bug, label: 'Disease', color: 'var(--rustic-orange)' },
    { path: '/dashboard/prediction', icon: TrendingUp, label: 'Prediction', color: 'var(--secondary-green)' }
  ];

  const currentPath = location.pathname;

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Leaf className="logo-icon" />
            <span>Farmq</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
                style={{ '--accent-color': item.color }}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="location-info">
            <MapPin className="location-icon" />
            <span>{getCountryName(countryCode)}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<DashboardHome userLocation={userLocation} countryCode={countryCode} />} />
            <Route path="/crops" element={<CropsPage userLocation={userLocation} />} />
            <Route path="/buyers" element={<BuyersPage userLocation={userLocation} />} />
            <Route path="/chat" element={<ChatPage userLocation={userLocation} />} />
            <Route path="/disease" element={<DiseasePage userLocation={userLocation} />} />
            <Route path="/prediction" element={<PredictionPage userLocation={userLocation} />} />
          </Routes>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ userLocation, countryCode }) => {
  const navigate = useNavigate();

  const handleQuickAction = (path) => {
    navigate(path);
  };

  // Hero background image
  const heroBg =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';

  // Stat badges
  const stats = [

  ];

  // Quick filter tags
  const tags = [
    'AgriTech',
    'Eco-Friendly',
    'Precision Farming',
    'Sustainable Farming',
    'Soil Health',
    'Natural Fertilizers',
  ];

  return (
    <div className="dashboard-home page-transition home-hero-bg">
      {/* Hero Section - OUTSIDE content-wrapper for full width */}
      <div
        className="hero-section hero-fullwidth"
        style={{
          backgroundImage: `linear-gradient(rgba(20,40,20,0.55),rgba(20,40,20,0.55)), url(${heroBg})`,
        }}
      >
        <div className="hero-center-wrapper">
          <div className="hero-glass fade-in">
            {/* Stat Badges */}
            <div className="hero-stats creative-stats">
              {stats.map((stat, i) => (
                <div className="stat-badge glass-badge" key={i} style={{ top: i === 0 ? '-2.5rem' : '0', left: i === 0 ? '-2.5rem' : '2.5rem', position: 'relative', zIndex: 2 }}>
                  <span className="stat-badge-icon">{stat.icon}</span> {stat.label}
                </div>
              ))}
            </div>
            <h1 className="hero-title creative-title">
               <br />
              <span className="highlight">Sustainable Agriculture</span>
              <br />
            </h1>
            <p className="hero-subtitle">
              Join us in revolutionizing agriculture through innovative technology and sustainable practices.<br />
              We are committed to enhancing crop yield, conserving resources, and supporting farmers worldwide.
            </p>
            <button className="cta-btn glass-btn" onClick={() => handleQuickAction('/dashboard/crops')}>
              Our Solutions
            </button>
            {/* Quick Filter Tags */}
            <div className="hero-tags creative-tags">
              {tags.map((tag, i) => (
                <span className="hero-tag glass-tag" key={i} style={{ marginTop: i % 2 === 0 ? '0' : '0.5em' }}>{tag}</span>
              ))}
            </div>
            <div className="scroll-down">
              <span className="scroll-down-icon">↓</span> Scroll Down
            </div>
          </div>
        </div>
      </div>
      {/* The rest of the content stays in the wrapper for centering */}
      <div className="dashboard-content-wrapper">
        <div className="connect-section fade-in">
          <div className="connect-content">
            <span className="connect-label">Connect With Us</span>
            <h2 className="connect-title">Pioneers Of Sustainable Farming Solutions</h2>
            <p className="connect-desc">
              Our journey began with a vision to transform the way we produce food by integrating modern technology with traditional farming values. Today, we are proud to empower farmers and agribusinesses worldwide with innovative tools, data-driven insights, and sustainable methods.
            </p>
            <button className="readmore-btn" onClick={() => handleQuickAction('/dashboard/prediction')}>
              Read More
            </button>
          </div>
        </div>
        <div className="quick-actions beautiful-quick-actions fade-in">
          <h2>Quick Actions</h2>
          <div className="action-grid beautiful-action-grid">
            <button className="action-card card" onClick={() => handleQuickAction('/dashboard/crops')}>
              <Leaf className="action-icon" />
              <h3>Browse Crops</h3>
              <p>View available crops in your area</p>
            </button>
            <button className="action-card card" onClick={() => handleQuickAction('/dashboard/chat')}>
              <MessageCircle className="action-icon" />
              <h3>Ask AI</h3>
              <p>Get farming advice from our AI</p>
            </button>
            <button className="action-card card" onClick={() => handleQuickAction('/dashboard/disease')}>
              <Bug className="action-icon" />
              <h3>Disease Check</h3>
              <p>Identify plant diseases</p>
            </button>
            <button className="action-card card" onClick={() => handleQuickAction('/dashboard/prediction')}>
              <TrendingUp className="action-icon" />
              <h3>Market Predictions</h3>
              <p>View price forecasts</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 