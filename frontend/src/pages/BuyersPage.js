import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Users, MapPin, Phone, Mail, Building, Search, Filter, Star } from 'lucide-react';
import './BuyersPage.css';

const BuyersPage = ({ userLocation }) => {
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock buyers data
  const mockBuyers = [
    {
      id: 1,
      name: 'Fresh Market Co.',
      category: 'retail',
      type: 'Supermarket Chain',
      location: { lat: 20.5937 + 0.01, lng: 78.9629 + 0.01 },
      distance: 3.2,
      rating: 4.5,
      phone: '+91 98765 43210',
      email: 'contact@freshmarket.com',
      address: '123 Main Street, City Center',
      crops: ['wheat', 'rice', 'vegetables', 'fruits'],
      description: 'Leading supermarket chain with 50+ stores across the region',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
    },
    {
      id: 2,
      name: 'Organic Foods Ltd.',
      category: 'organic',
      type: 'Organic Food Company',
      location: { lat: 20.5937 - 0.01, lng: 78.9629 - 0.01 },
      distance: 5.8,
      rating: 4.8,
      phone: '+91 98765 43211',
      email: 'info@organicfoods.com',
      address: '456 Green Avenue, Eco District',
      crops: ['organic vegetables', 'fruits', 'grains'],
      description: 'Specialized in organic and natural food products',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
    },
    {
      id: 3,
      name: 'Grain Traders Association',
      category: 'wholesale',
      type: 'Wholesale Market',
      location: { lat: 20.5937 + 0.02, lng: 78.9629 + 0.02 },
      distance: 7.1,
      rating: 4.2,
      phone: '+91 98765 43212',
      email: 'sales@graintraders.com',
      address: '789 Trade Center, Market Area',
      crops: ['wheat', 'rice', 'corn', 'pulses'],
      description: 'Large-scale grain trading and distribution',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    },
    {
      id: 4,
      name: 'Local Restaurant Group',
      category: 'restaurant',
      type: 'Restaurant Chain',
      location: { lat: 20.5937 - 0.02, lng: 78.9629 - 0.02 },
      distance: 4.5,
      rating: 4.6,
      phone: '+91 98765 43213',
      email: 'procurement@localrestaurant.com',
      address: '321 Food Street, Downtown',
      crops: ['vegetables', 'fruits', 'herbs', 'spices'],
      description: 'Premium restaurant chain sourcing fresh local produce',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
    },
    {
      id: 5,
      name: 'Export Quality Foods',
      category: 'export',
      type: 'Export Company',
      location: { lat: 20.5937 + 0.03, lng: 78.9629 + 0.03 },
      distance: 12.3,
      rating: 4.7,
      phone: '+91 98765 43214',
      email: 'exports@qualityfoods.com',
      address: '654 Export Zone, Industrial Area',
      crops: ['basmati rice', 'spices', 'organic products'],
      description: 'International food export company with global reach',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'
    },
    {
      id: 6,
      name: 'Community Co-op',
      category: 'cooperative',
      type: 'Farmer Cooperative',
      location: { lat: 20.5937 - 0.03, lng: 78.9629 - 0.03 },
      distance: 2.1,
      rating: 4.4,
      phone: '+91 98765 43215',
      email: 'coop@community.com',
      address: '987 Village Road, Rural Area',
      crops: ['all crops', 'dairy', 'poultry'],
      description: 'Community-based cooperative supporting local farmers',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBuyers(mockBuyers);
      setFilteredBuyers(mockBuyers);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterBuyers();
  }, [searchTerm, selectedCategory, buyers]);

  const filterBuyers = () => {
    let filtered = buyers;

    if (searchTerm) {
      filtered = filtered.filter(buyer =>
        buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        buyer.crops.some(crop => crop.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(buyer => buyer.category === selectedCategory);
    }

    setFilteredBuyers(filtered);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'organic', label: 'Organic' },
    { value: 'export', label: 'Export' },
    { value: 'cooperative', label: 'Cooperative' }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="star filled" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="star half" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="buyers-page page-transition">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading buyers in your area...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="buyers-page page-transition">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <Users className="page-icon" />
            Buyers Directory
          </h1>
          <p className="page-subtitle">Connect with buyers and distributors in your area</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search buyers, types, or crops..."
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

        <div className="buyers-content">
          {/* Map Section */}
          <div className="map-section">
            <h2 className="section-title">
              <MapPin className="section-icon" />
              Buyer Locations
            </h2>
            <div className="map-container">
              <MapContainer
                center={userLocation || [20.5937, 78.9629]}
                zoom={10}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredBuyers.map(buyer => (
                  <Marker key={buyer.id} position={[buyer.location.lat, buyer.location.lng]}>
                    <Popup>
                      <div className="map-popup">
                        <h3>{buyer.name}</h3>
                        <p>{buyer.type}</p>
                        <p>Distance: {buyer.distance}km</p>
                        <p>Rating: {buyer.rating}/5</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Buyers List */}
          <div className="buyers-list-section">
            <h2 className="section-title">
              <Building className="section-icon" />
              Available Buyers ({filteredBuyers.length})
            </h2>
            
            {filteredBuyers.length === 0 ? (
              <div className="no-results">
                <Users className="no-results-icon" />
                <h3>No buyers found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="buyers-grid">
                {filteredBuyers.map(buyer => (
                  <div key={buyer.id} className="buyer-card card">
                    <div className="buyer-image">
                      <img src={buyer.image} alt={buyer.name} />
                      <div className="buyer-category">{buyer.category}</div>
                      <div className="buyer-rating">
                        {renderStars(buyer.rating)}
                        <span className="rating-text">{buyer.rating}</span>
                      </div>
                    </div>
                    
                    <div className="buyer-content">
                      <h3 className="buyer-name">{buyer.name}</h3>
                      <p className="buyer-type">{buyer.type}</p>
                      <p className="buyer-description">{buyer.description}</p>
                      
                      <div className="buyer-details">
                        <div className="detail-item">
                          <MapPin className="detail-icon" />
                          <span>{buyer.distance}km away</span>
                        </div>
                        <div className="detail-item">
                          <Phone className="detail-icon" />
                          <span>{buyer.phone}</span>
                        </div>
                        <div className="detail-item">
                          <Mail className="detail-icon" />
                          <span>{buyer.email}</span>
                        </div>
                      </div>
                      
                      <div className="buyer-crops">
                        <h4>Interested in:</h4>
                        <div className="crop-tags">
                          {buyer.crops.map((crop, index) => (
                            <span key={index} className="crop-tag">{crop}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="buyer-actions">
                        <button className="btn btn-secondary">
                          <Phone className="btn-icon" />
                          Call Now
                        </button>
                        <button className="btn btn-primary">
                          <Mail className="btn-icon" />
                          Send Inquiry
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyersPage; 