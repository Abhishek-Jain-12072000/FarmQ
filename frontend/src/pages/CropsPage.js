import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Leaf, MapPin, Search, Package, MessageSquare, ChevronRight, Sparkles, Filter } from 'lucide-react';
import { formatPrice } from '../utils/currencyUtils';

const CropsPage = ({ userLocation }) => {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [countryCode, setCountryCode] = useState('IN');

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
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
      description: 'High-quality organic wheat, perfect for premium bread and local logistics.'
    },
    {
      id: 2,
      name: 'Tomatoes',
      category: 'vegetables',
      price: 25,
      quantity: 200,
      unit: 'kg',
      distance: 5.2,
      location: { lat: 20.5937 + 0.01, lng: 78.9629 + 0.01 },
      farmer: 'Priya Sharma',
      image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800',
      description: 'Ripe, field-grown tomatoes with zero pesticide residues.'
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
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
      description: 'Extra-long grain premium basmati harvested with sustainability in mind.'
    }
  ];

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

  useEffect(() => {
    const locationBasedCrops = baseCrops.map(crop => ({
      ...crop,
      price: Math.round(crop.price * (countryCode === 'IN' ? 1 : 1.2)) // Simplified for demo
    }));

    setTimeout(() => {
      setCrops(locationBasedCrops);
      setFilteredCrops(locationBasedCrops);
      setLoading(false);
    }, 600);
  }, [countryCode]);

  useEffect(() => {
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
  }, [searchTerm, selectedCategory, crops]);

  const categories = [
    { value: 'all', label: 'All Produce' },
    { value: 'grains', label: 'Grains' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'pulses', label: 'Pulses' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Scanning Global Exchange...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-emerald-600">
            <Leaf className="w-5 h-5" />
            <span className="font-black uppercase tracking-[0.2em] text-[10px]">Supply Chain</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">Harvest Market</h1>
          <p className="text-slate-500 font-medium max-w-xl">Browse top-quality produce directly from digital farms and coordinate direct procurement.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by variety or farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] w-full sm:w-80 shadow-premium focus:outline-none focus:ring-4 ring-emerald-500/5 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white z-10 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-12 pr-8 py-4 bg-slate-900 text-white rounded-[1.5rem] focus:outline-none font-black text-xs uppercase tracking-widest cursor-pointer shadow-xl appearance-none"
            >
              {categories.map(c => <option key={c.value} value={c.value} className="bg-white text-slate-800">{c.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Marketplace Grid */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCrops.map((crop) => (
              <div key={crop.id} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-premium transition-all duration-500 group relative">
                <div className="relative h-64 overflow-hidden">
                  <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-6 left-6 flex items-center bg-white/90 backdrop-blur px-4 py-2 rounded-2xl border border-white/50 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                    <Sparkles size={12} className="text-emerald-500 mr-2" />
                    {crop.category}
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{crop.name}</h3>
                      <div className="flex items-center text-slate-400 text-xs font-bold font-sans">
                        <MapPin size={14} className="mr-1.5 text-orange-500" />
                        <span>{crop.distance} KM • {crop.farmer}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"{crop.description}"</p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Price per {crop.unit}</p>
                      <p className="text-3xl font-black text-emerald-600">{formatPrice(crop.price, countryCode)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-3.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-sm border border-slate-100">
                        <MessageSquare size={18} />
                      </button>
                      <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-xl transition-all flex items-center group active:scale-95">
                        <span>Buy</span>
                        <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCrops.length === 0 && (
            <div className="bg-slate-50/50 rounded-[3rem] p-24 text-center space-y-6 border-4 border-dashed border-slate-100 animate-pulse">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Search className="text-slate-200" size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800">Supply Interrupted</h3>
                <p className="text-slate-400 font-bold text-sm">No produce found matching your current filters.</p>
              </div>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                Reset Parameters
              </button>
            </div>
          )}
        </div>

        {/* Tactical Intel Portal */}
        <div className="lg:col-span-4 space-y-10 sticky top-10">
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-premium space-y-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10">
              <MapPin size={120} />
            </div>

            <div className="flex items-center justify-between relative z-10">
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <MapPin className="text-emerald-500" />
                Harvest Nodes
              </h2>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Active Radius</span>
            </div>

            <div className="rounded-[2.5rem] overflow-hidden h-[450px] border border-slate-100 shadow-inner relative z-10">
              <MapContainer
                center={userLocation || [20.5937, 78.9629]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredCrops.map((crop) => (
                  <Marker key={crop.id} position={[crop.location.lat, crop.location.lng]}>
                    <Popup>
                      <div className="p-3 font-sans space-y-2">
                        <p className="font-black text-slate-800 text-sm italic">"{crop.name}"</p>
                        <div className="h-px bg-slate-100"></div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available at hub</p>
                        <p className="font-black text-emerald-600 text-base">{formatPrice(crop.price, countryCode)}/kg</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2rem] flex items-center space-x-5 relative z-10 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-emerald-600 opacity-10 blur-2xl animate-pulse"></div>
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center shrink-0 relative z-10">
                <Package className="text-emerald-400 w-6 h-6" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Stock Intel</p>
                <p className="text-xs font-bold text-slate-200 leading-snug">
                  Over {filteredCrops.length} verified supply nodes ready for immediate off-take within your zone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropsPage;