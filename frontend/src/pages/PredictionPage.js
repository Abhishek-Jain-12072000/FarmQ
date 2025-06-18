import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, MapPin } from 'lucide-react';
import { 
  getLocationBasedPrices, 
  getCurrencySymbol, 
  getCountryName,
  formatPrice 
} from '../utils/currencyUtils';
import './PredictionPage.css';

const PredictionPage = ({ userLocation }) => {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [timeframe, setTimeframe] = useState('3months');
  const [countryCode, setCountryCode] = useState('IN');

  // Base prices in INR (Indian Rupees)
  const basePrices = {
    wheat: {
      currentPrice: 45,
      predictedPrice: 52,
      trend: 'up',
      confidence: 85,
      factors: ['Good monsoon forecast', 'Increased demand', 'Export opportunities'],
      historicalData: [
        { month: 'Jan', price: 42 },
        { month: 'Feb', price: 44 },
        { month: 'Mar', price: 45 },
        { month: 'Apr', price: 47 },
        { month: 'May', price: 49 },
        { month: 'Jun', price: 52 }
      ]
    },
    rice: {
      currentPrice: 38,
      predictedPrice: 41,
      trend: 'up',
      confidence: 78,
      factors: ['Stable production', 'Government support', 'Market stability'],
      historicalData: [
        { month: 'Jan', price: 36 },
        { month: 'Feb', price: 37 },
        { month: 'Mar', price: 38 },
        { month: 'Apr', price: 39 },
        { month: 'May', price: 40 },
        { month: 'Jun', price: 41 }
      ]
    },
    corn: {
      currentPrice: 28,
      predictedPrice: 25,
      trend: 'down',
      confidence: 72,
      factors: ['Oversupply', 'Reduced demand', 'Weather conditions'],
      historicalData: [
        { month: 'Jan', price: 30 },
        { month: 'Feb', price: 29 },
        { month: 'Mar', price: 28 },
        { month: 'Apr', price: 27 },
        { month: 'May', price: 26 },
        { month: 'Jun', price: 25 }
      ]
    }
  };

  // Get location-based prices
  const mockPredictions = getLocationBasedPrices(basePrices, countryCode);

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

  const crops = [
    { value: 'wheat', label: 'Wheat', icon: '🌾' },
    { value: 'rice', label: 'Rice', icon: '🍚' },
    { value: 'corn', label: 'Corn', icon: '🌽' }
  ];

  const timeframes = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' }
  ];

  const currentPrediction = mockPredictions[selectedCrop];
  const currencySymbol = getCurrencySymbol(countryCode);
  const countryName = getCountryName(countryCode);

  return (
    <div className="prediction-page page-transition">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <TrendingUp className="title-icon" />
            Market Predictions
          </h1>
          <p className="page-subtitle">
            AI-powered price forecasts and market insights for informed farming decisions
          </p>
          
          {/* Location Display */}
          <div className="location-display">
            <MapPin className="location-icon" />
            <span>Prices in {countryName} ({currencySymbol})</span>
          </div>
        </div>

        {/* Controls */}
        <div className="prediction-controls">
          <div className="control-group">
            <label>Crop Type</label>
            <div className="crop-selector">
              {crops.map((crop) => (
                <button
                  key={crop.value}
                  className={`crop-option ${selectedCrop === crop.value ? 'active' : ''}`}
                  onClick={() => setSelectedCrop(crop.value)}
                >
                  <span className="crop-icon">{crop.icon}</span>
                  <span>{crop.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Timeframe</label>
            <div className="timeframe-selector">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  className={`timeframe-option ${timeframe === tf.value ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf.value)}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prediction Card */}
        <div className="prediction-card card">
          <div className="prediction-header">
            <div className="crop-info">
              <span className="crop-icon-large">
                {crops.find(c => c.value === selectedCrop)?.icon}
              </span>
              <div>
                <h2>{crops.find(c => c.value === selectedCrop)?.label} Price Prediction</h2>
                <p className="location-info">
                  <Calendar className="icon" />
                  {timeframes.find(tf => tf.value === timeframe)?.label} forecast
                </p>
              </div>
            </div>
            <div className="confidence-badge">
              <BarChart3 className="icon" />
              {currentPrediction.confidence}% confidence
            </div>
          </div>

          <div className="prediction-stats">
            <div className="stat-item">
              <div className="stat-label">Current Price</div>
              <div className="stat-value current">
                <DollarSign className="icon" />
                {formatPrice(currentPrediction.currentPrice, countryCode)}/kg
              </div>
            </div>

            <div className="trend-arrow">
              {currentPrediction.trend === 'up' ? (
                <TrendingUp className="trend-icon up" />
              ) : (
                <TrendingDown className="trend-icon down" />
              )}
            </div>

            <div className="stat-item">
              <div className="stat-label">Predicted Price</div>
              <div className={`stat-value predicted ${currentPrediction.trend}`}>
                <DollarSign className="icon" />
                {formatPrice(currentPrediction.predictedPrice, countryCode)}/kg
              </div>
            </div>
          </div>

          <div className="price-change">
            <span className={`change-amount ${currentPrediction.trend}`}>
              {currentPrediction.trend === 'up' ? '+' : '-'}{formatPrice(Math.abs(currentPrediction.predictedPrice - currentPrediction.currentPrice), countryCode)}/kg
            </span>
            <span className="change-percentage">
              ({Math.round(((currentPrediction.predictedPrice - currentPrediction.currentPrice) / currentPrediction.currentPrice) * 100)}%)
            </span>
          </div>
        </div>

        {/* Market Factors */}
        <div className="market-factors card">
          <h3>Key Market Factors</h3>
          <div className="factors-list">
            {currentPrediction.factors.map((factor, index) => (
              <div key={index} className="factor-item">
                <div className="factor-icon">📊</div>
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Chart */}
        <div className="historical-chart card">
          <h3>Price Trend (Last 6 Months)</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {currentPrediction.historicalData.map((data, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="chart-bar">
                    <div 
                      className="bar-fill"
                      style={{ 
                        height: `${(data.price / Math.max(...currentPrediction.historicalData.map(d => d.price))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="bar-label">{data.month}</div>
                  <div className="bar-value">{formatPrice(data.price, countryCode)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations card">
          <h3>AI Recommendations</h3>
          <div className="recommendation-content">
            <div className="recommendation-item">
              <div className="recommendation-icon">💡</div>
              <div>
                <h4>Timing</h4>
                <p>Consider selling in {currentPrediction.trend === 'up' ? '2-3 months' : 'immediately'} for optimal returns.</p>
              </div>
            </div>
            <div className="recommendation-item">
              <div className="recommendation-icon">📈</div>
              <div>
                <h4>Strategy</h4>
                <p>{currentPrediction.trend === 'up' ? 'Hold your produce for better prices' : 'Consider alternative crops or early harvest'}.</p>
              </div>
            </div>
            <div className="recommendation-item">
              <div className="recommendation-icon">🌱</div>
              <div>
                <h4>Production</h4>
                <p>Focus on quality and sustainable farming practices to maximize market value.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPage; 