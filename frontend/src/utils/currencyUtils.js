// Currency configuration based on country
export const currencyConfig = {
  IN: {
    symbol: '₹',
    name: 'Indian Rupee',
    code: 'INR',
    exchangeRate: 1, // Base rate for India
    priceMultiplier: 1
  },
  NG: {
    symbol: '₦',
    name: 'Nigerian Naira',
    code: 'NGN',
    exchangeRate: 0.12, // Approximate INR to NGN rate
    priceMultiplier: 8.33 // 1 INR ≈ 8.33 NGN
  },
  GH: {
    symbol: '₵',
    name: 'Ghanaian Cedi',
    code: 'GHS',
    exchangeRate: 0.014, // Approximate INR to GHS rate
    priceMultiplier: 71.43 // 1 INR ≈ 71.43 GHS
  },
  SG: {
    symbol: 'S$',
    name: 'Singapore Dollar',
    code: 'SGD',
    exchangeRate: 0.016, // Approximate INR to SGD rate
    priceMultiplier: 62.5 // 1 INR ≈ 62.5 SGD
  }
};

// Default to India if location is not available
export const getCurrencyConfig = (countryCode = 'IN') => {
  return currencyConfig[countryCode] || currencyConfig.IN;
};

// Convert price from base currency (INR) to target currency
export const convertPrice = (priceInINR, countryCode = 'IN') => {
  const config = getCurrencyConfig(countryCode);
  return Math.round(priceInINR * config.priceMultiplier);
};

// Format price with currency symbol
export const formatPrice = (price, countryCode = 'IN') => {
  const config = getCurrencyConfig(countryCode);
  return `${config.symbol}${price}`;
};

// Get location-based price data
export const getLocationBasedPrices = (basePrices, countryCode = 'IN') => {
  const config = getCurrencyConfig(countryCode);
  
  return Object.keys(basePrices).reduce((acc, cropKey) => {
    const crop = basePrices[cropKey];
    
    // Convert all price values
    const convertedCrop = {
      ...crop,
      currentPrice: convertPrice(crop.currentPrice, countryCode),
      predictedPrice: convertPrice(crop.predictedPrice, countryCode),
      historicalData: crop.historicalData.map(data => ({
        ...data,
        price: convertPrice(data.price, countryCode)
      }))
    };
    
    acc[cropKey] = convertedCrop;
    return acc;
  }, {});
};

// Get country name from country code
export const getCountryName = (countryCode = 'IN') => {
  const config = getCurrencyConfig(countryCode);
  return config.name;
};

// Get currency symbol
export const getCurrencySymbol = (countryCode = 'IN') => {
  const config = getCurrencyConfig(countryCode);
  return config.symbol;
}; 