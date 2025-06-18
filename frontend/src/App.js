import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user location on app load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
          // Default to a central location if geolocation fails
          setUserLocation({ lat: 20.5937, lng: 78.9629 }); // India center
        }
      );
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage userLocation={userLocation} />} />
          <Route path="/dashboard/*" element={<Dashboard userLocation={userLocation} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 