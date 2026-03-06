import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Users, MapPin, Phone, Star, Search, Sparkles, MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';

const BuyersPage = ({ userLocation }) => {
  const [buyers, setBuyers] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

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
      description: 'Leading supermarket chain with 50+ stores across the region. High volume procurement.',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'
    },
    {
      id: 2,
      name: 'Organic Foods Ltd.',
      category: 'organic',
      type: 'Organic Specialist',
      location: { lat: 20.5937 - 0.01, lng: 78.9629 - 0.01 },
      distance: 5.8,
      rating: 4.8,
      phone: '+91 98765 43211',
      email: 'info@organicfoods.com',
      address: '456 Green Avenue, Eco District',
      crops: ['organic vegetables', 'fruits', 'grains'],
      description: 'Global exporter specialized in certified organic produce and fair trade.',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800'
    },
    {
      id: 3,
      name: 'Grain Traders',
      category: 'wholesale',
      type: 'Bulk Distribution',
      location: { lat: 20.5937 + 0.02, lng: 78.9629 + 0.02 },
      distance: 7.1,
      rating: 4.2,
      phone: '+91 98765 43212',
      email: 'sales@graintraders.com',
      address: '789 Trade Center, Market Area',
      crops: ['wheat', 'rice', 'corn', 'pulses'],
      description: 'Massive scale grain storage and distribution network across Asia.',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setBuyers(mockBuyers);
      setFilteredBuyers(mockBuyers);
      setLoading(false);
    }, 600);
  }, []);

  useEffect(() => {
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
  }, [searchTerm, selectedCategory, buyers]);

  const categories = [
    { value: 'all', label: 'All Partners' },
    { value: 'retail', label: 'Retail' },
    { value: 'wholesale', label: 'Wholesale' },
    { value: 'restaurant', label: 'Hospitality' },
    { value: 'organic', label: 'Organic' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Scanning Procurement Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-emerald-600">
            <Users className="w-5 h-5" />
            <span className="font-black uppercase tracking-[0.2em] text-[10px]">Verified Network</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">Trade Partnerships</h1>
          <p className="text-slate-500 font-medium max-w-xl">Direct access to distributors, exporters, and retail giants seeking fresh produce and grain.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by crop or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] w-full sm:w-80 shadow-premium focus:outline-none focus:ring-4 ring-emerald-500/5 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] focus:outline-none transition-all font-black text-xs uppercase tracking-widest cursor-pointer shadow-xl appearance-none"
          >
            {categories.map(c => <option key={c.value} value={c.value} className="bg-white text-slate-800">{c.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Buyer Feed */}
        <div className="lg:col-span-8 space-y-8">
          {filteredBuyers.map((buyer) => (
            <div key={buyer.id} className="bg-white rounded-[3rem] p-8 sm:p-10 border border-slate-100 flex flex-col md:flex-row gap-10 hover:shadow-premium transition-all duration-500 group relative">
              {/* Image Section */}
              <div className="w-full md:w-64 h-64 rounded-[2.5rem] overflow-hidden shrink-0 shadow-2xl shadow-slate-200">
                <img src={buyer.image} alt={buyer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{buyer.category}</span>
                      <div className="flex items-center text-orange-500 bg-orange-50 px-3 py-1 rounded-xl">
                        <Star size={12} className="fill-current" />
                        <span className="ml-1.5 text-[10px] font-black">{buyer.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{buyer.name}</h3>
                    <div className="flex items-center text-slate-400 text-xs font-black uppercase tracking-widest">
                      <ShieldCheck size={14} className="mr-2 text-emerald-500" />
                      <span>{buyer.type}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"{buyer.description}"</p>

                <div className="flex flex-wrap gap-2.5">
                  {buyer.crops.map((crop, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                      {crop}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between pt-6 border-t border-slate-50 gap-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-slate-400">
                      <MapPin size={16} className="text-orange-500" />
                      <span className="text-xs font-black tracking-widest">{buyer.distance} KM</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Phone size={16} className="text-emerald-500" />
                      <span className="text-xs font-black tracking-widest">VERIFIED</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95">
                      <MessageSquare size={20} />
                    </button>
                    <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 shadow-xl transition-all flex items-center group active:scale-95">
                      <span>Open Channel</span>
                      <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Integration */}
        <div className="lg:col-span-4 sticky top-10">
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-premium space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <MapPin className="text-emerald-500" />
                Nearby Hubs
              </h2>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Live Updates</span>
            </div>

            <div className="rounded-[2.5rem] overflow-hidden h-[500px] border border-slate-100 shadow-inner">
              <MapContainer
                center={userLocation || [20.5937, 78.9629]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredBuyers.map(buyer => (
                  <Marker key={buyer.id} position={[buyer.location.lat, buyer.location.lng]}>
                    <Popup className="premium-popup">
                      <div className="p-3 font-sans space-y-2">
                        <p className="font-black text-slate-800 text-sm">{buyer.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{buyer.type}</p>
                        <button className="w-full mt-2 bg-emerald-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Connect</button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Sparkles size={14} className="text-white" />
                </div>
                <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Pro Insight</p>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                Demand for organic pulses is currently surging in your sector. Reach out to Organic Foods Ltd for priority bids.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyersPage;