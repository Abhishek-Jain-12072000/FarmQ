import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Leaf, Users, MessageCircle, TrendingUp, Sparkles, ChevronRight, Globe } from 'lucide-react';

const LandingPage = ({ userLocation }) => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState('Detecting location...');

  useEffect(() => {
    if (userLocation) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`)
        .then(response => response.json())
        .then(data => {
          const parts = data.display_name.split(',');
          const location = parts[0] + (parts[1] ? ', ' + parts[1] : '');
          setCurrentLocation(location);
        })
        .catch(() => {
          setCurrentLocation('Location detected');
        });
    }
  }, [userLocation]);

  const features = [
    {
      icon: Leaf,
      title: 'Local Marketplace',
      desc: 'Direct trade between farmers and verified buyers.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      desc: 'Expert agricultural advice available 24/7.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    },
    {
      icon: TrendingUp,
      title: 'Price Predictions',
      desc: 'Advanced market analytics and price forecasting.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-['Outfit'] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">FarmQ</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 shadow-sm">
            <MapPin size={14} className="text-emerald-500" />
            <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{currentLocation}</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
          >
            Launch Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full">
              <Sparkles size={16} />
              <span className="text-xs font-black uppercase tracking-widest leading-none">The Future Of Farming</span>
            </div>

            <h1 className="text-6xl sm:text-8xl font-black text-slate-800 leading-[0.9] tracking-tighter">
              Connecting <br />
              <span className="text-emerald-600 italic">Agriculture</span> <br />
              Worldwide.
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed max-w-lg">
              FarmQ integrates modern technology with traditional farming to empower agribusinesses with innovative tools and data-driven insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="group flex items-center justify-center space-x-3 bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-200 active:scale-95"
              >
                <span>Get Started Now</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center space-x-4 px-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div className="text-xs">
                  <p className="font-black text-slate-800">5k+ Farmers</p>
                  <p className="text-slate-400">Already joined us</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-[4rem] rotate-3 scale-95 opacity-50 blur-2xl animate-pulse"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-[4rem] p-4 shadow-2xl overflow-hidden group">
              <img
                src="/farmer-image.png"
                alt="Smart Farming"
                className="w-full h-[600px] object-cover rounded-[3.5rem] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-10 left-10 p-8 glass-morphism rounded-[2.5rem] max-w-xs space-y-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Real-time Data</p>
                <p className="text-lg font-black text-slate-800 leading-tight">Monitor your crop health with AI vision.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features list */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white border border-slate-50 p-10 rounded-[3rem] hover:shadow-2xl transition-all group hover:-translate-y-2">
              <div className={`w-16 h-16 ${f.bg} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}>
                <f.icon className={`w-8 h-8 ${f.color}`} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-20 mt-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
              <Leaf className="text-slate-600 w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-800">FarmQ</span>
          </div>
          <p className="text-sm font-bold text-slate-400">© 2024 FarmQ Inc. All rights reserved.</p>
          <div className="flex space-x-6 text-sm font-black text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;