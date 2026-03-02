import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Leaf, MapPin, Filter, Search, Package, Clock, User } from 'lucide-react';
import { formatPrice, getLocationBasedPrices } from '../utils/currencyUtils';
import './CropsPage.css';

const CropsPage = ({ userLocation }) => {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [countryCode, setCountryCode] = useState('IN');

  // Base crop data with prices in INR
  const baseCrops = [
    {
      id: 1,
      name: 'Organic Wheat',
      category: 'grains',
      price: 45,
      quantity: 500,
      unit: 'kg',
      distance: 2.5,
      location: { lat: 20.5937, lng: 78.9629 },
      farmer: 'Rajesh Kumar',
      harvestDate: '2024-03-15',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      description: 'High-quality organic wheat, perfect for bread making'
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      price: 25,
      quantity: 200,
      unit: 'kg',
      distance: 5.2,
      location: { lat: 20.5937 + 0.01, lng: 78.9629 + 0.01 },
      farmer: 'Priya Sharma',
      harvestDate: '2024-03-10',
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
      description: 'Ripe, red tomatoes grown without pesticides'
    },
    {
      id: 3,
      name: 'Basmati Rice',
      category: 'grains',
      price: 60,
      quantity: 300,
      unit: 'kg',
      distance: 8.7,
      location: { lat: 20.5937 - 0.01, lng: 78.9629 - 0.01 },
      farmer: 'Amit Patel',
      harvestDate: '2024-03-12',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      description: 'Premium basmati rice with long grains'
    },
    {
      id: 4,
      name: 'Sweet Corn',
      category: 'vegetables',
      price: 30,
      quantity: 150,
      unit: 'kg',
      distance: 3.1,
      location: { lat: 20.5937 + 0.02, lng: 78.9629 - 0.02 },
      farmer: 'Sita Devi',
      harvestDate: '2024-03-08',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      description: 'Fresh sweet corn, perfect for cooking'
    },
    {
      id: 5,
      name: 'Potatoes',
      category: 'vegetables',
      price: 20,
      quantity: 400,
      unit: 'kg',
      distance: 6.8,
      location: { lat: 20.5937 - 0.02, lng: 78.9629 + 0.02 },
      farmer: 'Mohan Singh',
      harvestDate: '2024-03-05',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
      description: 'Fresh potatoes, great for various dishes'
    },
    {
      id: 6,
      name: 'Lentils',
      category: 'pulses',
      price: 80,
      quantity: 100,
      unit: 'kg',
      distance: 4.3,
      location: { lat: 20.5937 + 0.03, lng: 78.9629 + 0.03 },
      farmer: 'Kavita Verma',
      harvestDate: '2024-03-14',
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
      description: 'Organic lentils, rich in protein'
    }
  ];

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

  useEffect(() => {
    // Convert prices based on location
    const locationBasedCrops = baseCrops.map(crop => ({
      ...crop,
      price: Math.round(crop.price * (countryCode === 'IN' ? 1 :
        countryCode === 'NG' ? 8.33 :
          countryCode === 'GH' ? 71.43 :
            countryCode === 'SG' ? 62.5 : 1))
    }));

    // Simulate API call
    setTimeout(() => {
      setCrops(locationBasedCrops);
      setFilteredCrops(locationBasedCrops);
      setLoading(false);
    }, 1000);
  }, [countryCode]);

  useEffect(() => {
    filterCrops();
  }, [searchTerm, selectedCategory, crops]);

  const filterCrops = () => {
    let filtered = crops;

    if (searchTerm) {
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crop.farmer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(crop => crop.category === selectedCategory);
    }

    setFilteredCrops(filtered);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'grains', label: 'Grains' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'pulses', label: 'Pulses' }
  ];

  if (loading) {
    return (
      <div className="crops-page page-transition">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading crops in your area...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crops-page page-transition">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Leaf className="page-icon" />
            Available Crops
          </h1>
          <p className="page-subtitle">Discover fresh produce from local farmers in your area</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search crops or farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filter">
            <Filter className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="crops-content">
          {/* Map Section */}
          <div className="map-section">
            <h2 className="section-title">
              <MapPin className="section-icon" />
              Crop Locations
            </h2>
            <div className="map-container">
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={10}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredCrops.map((crop) => (
                  <Marker key={crop.id} position={[crop.location.lat, crop.location.lng]}>
                    <Popup>
                      <div className="map-popup">
                        <h3>{crop.name}</h3>
                        <p>Price: {formatPrice(crop.price, countryCode)}/{crop.unit}</p>
                        <p>Farmer: {crop.farmer}</p>
                        <p>Distance: {crop.distance} km</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Crops List */}
          <div className="crops-list">
            <h2 className="section-title">
              <Package className="section-icon" />
              Available Crops ({filteredCrops.length})
            </h2>

            <div className="crops-grid">
              {filteredCrops.map((crop) => (
                <div key={crop.id} className="crop-card card">
                  <div className="crop-image">
                    <img src={crop.image} alt={crop.name} />
                    <div className="crop-category">{crop.category}</div>
                  </div>

                  <div className="crop-details">
                    <h3 className="crop-name">{crop.name}</h3>
                    <p className="crop-description">{crop.description}</p>

                    <div className="crop-info">
                      <div className="info-item">
                        <Package className="info-icon" />
                        <span>{crop.quantity} {crop.unit} available</span>
                      </div>
                      <div className="info-item">
                        <MapPin className="info-icon" />
                        <span>{crop.distance} km away</span>
                      </div>
                    </div>
                    {/* <div className="crop-info">
                      <div className="info-item">
                        <User className="info-icon" />
                        <span>{crop.farmer}</span>
                      </div>
                      <div className="info-item">
                        <Clock className="info-icon" />
                        <span>Harvested: {new Date(crop.harvestDate).toLocaleDateString()}</span>
                      </div>
                    </div> */}

                    <div className="crop-price">
                      <span className="price-amount">{formatPrice(crop.price, countryCode)}/{crop.unit}</span>
                      <button className="contact-btn">Contact Farmer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCrops.length === 0 && (
              <div className="no-results">
                <Leaf className="no-results-icon" />
                <h3>No crops found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropsPage; 