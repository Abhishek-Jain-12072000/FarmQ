import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Leaf, Users, MessageCircle, TrendingUp, Phone } from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ userLocation }) => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState('Detecting location...');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userLocation) {
      // Reverse geocoding to get location name
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`)
        .then(response => response.json())
        .then(data => {
          const location = data.display_name.split(',')[0] + ', ' + data.display_name.split(',')[1];
          setCurrentLocation(location);
        })
        .catch(() => {
          setCurrentLocation('Location detected');
        });
    }
  }, [userLocation]);

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="landing-page page-transition">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <Leaf className="hero-icon" />
                Farmq
              </h1>
              <p className="hero-subtitle">
                Connecting farmers to buyers with AI-powered insights
              </p>
              <p className="hero-description">
                Get real-time crop advice, connect with buyers, and optimize your farming practices 
                with our intelligent platform designed for modern agriculture.
              </p>
              
              <div className="location-info">
                <MapPin className="location-icon" />
                <span>{currentLocation}</span>
              </div>

              <button 
                className="btn btn-primary hero-btn"
                onClick={handleGetStarted}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Getting Started...
                  </>
                ) : (
                  'Get Started'
                )}
              </button>
            </div>
            
            <div className="hero-visual">
              <div className="floating-cards">
                <div className="floating-card card-1">
                  <Leaf className="card-icon" />
                  <h3>Smart Farming</h3>
                  <p>AI-powered crop advice</p>
                </div>
                <div className="floating-card card-2">
                  <Users className="card-icon" />
                  <h3>Market Connect</h3>
                  <p>Direct buyer access</p>
                </div>
                <div className="floating-card card-3">
                  <TrendingUp className="card-icon" />
                  <h3>Better Yields</h3>
                  <p>Optimized practices</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Farmq?</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <MessageCircle />
              </div>
              <h3>AI Chatbot Support</h3>
              <p>Get instant answers to your farming questions with our intelligent chatbot available 24/7.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <Phone />
              </div>
              <h3>Call Support</h3>
              <p>For farmers without smartphones, we provide dedicated call support for personalized assistance.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <MapPin />
              </div>
              <h3>Local Market Access</h3>
              <p>Connect with buyers in your geographical area and get the best prices for your produce.</p>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <TrendingUp />
              </div>
              <h3>Seasonal Insights</h3>
              <p>Receive timely advice about planting seasons, weather conditions, and market trends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Farmq. Empowering farmers with technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 