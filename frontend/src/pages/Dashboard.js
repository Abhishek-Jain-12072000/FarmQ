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

  return (
    <div className="dashboard-home page-transition">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-center-wrapper">
          <div className="hero-glass fade-in">
            <h1 className="hero-title">
              Precision <br />
              <span className="highlight">Sustainable Farming</span>
            </h1>
            <p className="hero-subtitle">
              Empowering farmers with AI-driven insights and sustainable practices to revolutionize global agriculture.
            </p>
            <button className="btn btn-primary" onClick={() => handleQuickAction('/dashboard/crops')}>
              Explore Solutions
              <TrendingUp size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Areas */}
      <div className="dashboard-content-wrapper">
        <section className="connect-section fade-in">
          <div className="connect-content">
            <span className="connect-label">Our Mission</span>
            <h2 className="connect-title">Pioneers Of Sustainable Farming Solutions</h2>
            <p className="connect-desc">
              We integrate modern technology with traditional farming values to empower agribusinesses worldwide with innovative tools and data-driven insights.
            </p>
            <button className="readmore-btn" onClick={() => handleQuickAction('/dashboard/prediction')}>
              Learn More
            </button>
          </div>
        </section>

        <section className="quick-actions fade-in">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <div className="action-card" onClick={() => handleQuickAction('/dashboard/crops')}>
              <Leaf className="action-icon" />
              <h3>Browse Crops</h3>
              <p>View available produce in your area</p>
            </div>
            <div className="action-card" onClick={() => handleQuickAction('/dashboard/chat')}>
              <MessageCircle className="action-icon" />
              <h3>Ask AI</h3>
              <p>Get instant farming advice</p>
            </div>
            <div className="action-card" onClick={() => handleQuickAction('/dashboard/disease')}>
              <Bug className="action-icon" />
              <h3>Disease Check</h3>
              <p>Identify and treat plant issues</p>
            </div>
            <div className="action-card" onClick={() => handleQuickAction('/dashboard/prediction')}>
              <TrendingUp className="action-icon" />
              <h3>Predictions</h3>
              <p>Forecast market trends</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 