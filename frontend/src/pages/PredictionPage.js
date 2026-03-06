import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Sparkles } from 'lucide-react';
import {
  getLocationBasedPrices,
  getCountryName,
  formatPrice
} from '../utils/currencyUtils';

const PredictionPage = ({ userLocation }) => {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [timeframe, setTimeframe] = useState('3months');
  const [countryCode, setCountryCode] = useState('IN');

  const basePrices = {
    wheat: {
      currentPrice: 45, predictedPrice: 52, trend: 'up', confidence: 85,
      factors: ['Good monsoon forecast', 'Increased demand', 'Export opportunities'],
      historicalData: [
        { month: 'Jan', price: 42 }, { month: 'Feb', price: 44 }, { month: 'Mar', price: 45 },
        { month: 'Apr', price: 47 }, { month: 'May', price: 49 }, { month: 'Jun', price: 52 }
      ]
    },
    rice: {
      currentPrice: 38, predictedPrice: 41, trend: 'up', confidence: 78,
      factors: ['Stable production', 'Government support', 'Market stability'],
      historicalData: [
        { month: 'Jan', price: 36 }, { month: 'Feb', price: 37 }, { month: 'Mar', price: 38 },
        { month: 'Apr', price: 39 }, { month: 'May', price: 40 }, { month: 'Jun', price: 41 }
      ]
    },
    corn: {
      currentPrice: 28, predictedPrice: 25, trend: 'down', confidence: 72,
      factors: ['Oversupply', 'Reduced demand', 'Weather conditions'],
      historicalData: [
        { month: 'Jan', price: 30 }, { month: 'Feb', price: 29 }, { month: 'Mar', price: 28 },
        { month: 'Apr', price: 27 }, { month: 'May', price: 26 }, { month: 'Jun', price: 25 }
      ]
    }
  };

  const mockPredictions = getLocationBasedPrices(basePrices, countryCode);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        if (userLocation && userLocation.country) {
          setCountryCode(userLocation.country);
          return;
        }
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code) setCountryCode(data.country_code);
      } catch (error) {
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
    { value: '1month', label: '1M' },
    { value: '3months', label: '3M' },
    { value: '6months', label: '6M' },
    { value: '1year', label: '1Y' }
  ];

  const currentPrediction = mockPredictions[selectedCrop];
  const countryName = getCountryName(countryCode);

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
            <span className="font-bold uppercase tracking-[0.2em] text-[10px]">Market Intelligence</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Price Predictions Map</h1>
        </div>

        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center shadow-inner self-start">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all ${timeframe === tf.value ? 'bg-white text-emerald-600 shadow-sm font-black' : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Commodities</h3>
            <div className="space-y-3">
              {crops.map((crop) => (
                <button
                  key={crop.value}
                  onClick={() => setSelectedCrop(crop.value)}
                  className={`w-full flex items-center justify-between p-5 rounded-[1.75rem] border-2 transition-all duration-300 ${selectedCrop === crop.value
                    ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100 scale-[1.02]'
                    : 'border-slate-50 bg-white hover:border-slate-200'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{crop.icon}</span>
                    <span className={`text-lg font-black ${selectedCrop === crop.value ? 'text-emerald-900' : 'text-slate-700'}`}>{crop.label}</span>
                  </div>
                  {selectedCrop === crop.value && <Sparkles size={16} className="text-emerald-500 animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/40 transition-all duration-700"></div>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Localization Node</p>
            <h4 className="text-2xl font-black mb-1">{countryName}</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Financial data normalized to regional parity and verified by local exchanges.</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
            <div className="p-10 sm:p-14 space-y-12">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Market Projection</h2>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">Harvest Forecast</p>
                </div>
                <div className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-black text-[11px] tracking-widest shadow-sm ${currentPrediction.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                  {currentPrediction.trend === 'up' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  <span>{currentPrediction.trend === 'up' ? 'BULLISH MARKET' : 'BEARISH MARKET'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-50 shadow-inner">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Spot</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-5xl font-black text-slate-800">{formatPrice(currentPrediction.currentPrice, countryCode)}</p>
                    <span className="text-lg font-bold text-slate-400">/kg</span>
                  </div>
                </div>

                <div className="space-y-3 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 relative">
                  <div className="absolute -top-3 right-8 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-emerald-200">Confidence: {currentPrediction.confidence}%</div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">6M Prediction</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-6xl font-black text-emerald-600 tracking-tighter">{formatPrice(currentPrediction.predictedPrice, countryCode)}</p>
                    <span className="text-lg font-bold text-slate-400">/kg</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <BarChart3 size={16} className="text-emerald-500" /> Price Orbit Analytics
                  </h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-400">History</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-400">Future</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between h-56 gap-4">
                  {currentPrediction.historicalData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                      <div className="relative w-full flex items-end justify-center">
                        <div
                          className={`w-full max-w-[48px] rounded-2xl transition-all duration-1000 group-hover:scale-x-110 shadow-sm ${i === 5 ? 'bg-gradient-to-t from-emerald-700 to-emerald-500' : 'bg-slate-100 group-hover:bg-slate-200'
                            }`}
                          style={{ height: `${(data.price / Math.max(...currentPrediction.historicalData.map(d => d.price))) * 100}%` }}
                        />
                        <div className="absolute -top-8 scale-0 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap text-[11px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-2xl">
                          {formatPrice(data.price, countryCode)}
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 tracking-widest">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-xl shadow-slate-200/40 space-y-8">
              <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-[0.2em]">Catalyst Factors</h3>
              <div className="space-y-4">
                {currentPrediction.factors.map((f, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50/50 rounded-2xl hover:bg-emerald-50 hover:translate-x-1 transition-all group cursor-default">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-600 transition-transform duration-500 group-hover:rotate-[360deg]">
                      <Sparkles size={16} />
                    </div>
                    <span className="text-sm font-black text-slate-600">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-600 rounded-[3rem] p-10 text-white space-y-8 shadow-3xl shadow-emerald-900/20 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="font-black uppercase text-[10px] tracking-[0.2em] opacity-80">Autonomous Logic</h3>
                <div className="flex space-x-5">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
                    <Sparkles className="text-white" />
                  </div>
                  <p className="text-sm font-bold leading-relaxed opacity-90">
                    Proprietary models suggest a
                    <span className="text-white font-black mx-1 underline underline-offset-4 decoration-emerald-200">
                      {currentPrediction.trend === 'up' ? 'HOLD' : 'LIQUIDATE'}
                    </span>
                    position for {selectedCrop} based on regional volatility and export surges.
                  </p>
                </div>
              </div>
              <button className="w-full bg-white text-emerald-600 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all">
                Export Strategic Brief
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;