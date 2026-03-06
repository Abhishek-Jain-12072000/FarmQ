import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf,
  Users,
  MessageCircle,
  Bug,
  TrendingUp,
  MapPin,
  Menu,
  X,
  Home,
  Sparkles,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';
import { getCountryName } from '../utils/currencyUtils';
import CropsPage from './CropsPage';
import BuyersPage from './BuyersPage';
import ChatPage from './ChatPage';
import DiseasePage from './DiseasePage';
import PredictionPage from './PredictionPage';

const Dashboard = ({ userLocation }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [countryCode, setCountryCode] = useState('IN');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const detectLocation = async () => {
      try {
        if (userLocation && userLocation.country) {
          setCountryCode(userLocation.country);
          return;
        }
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code) {
          setCountryCode(data.country_code);
        }
      } catch (error) {
        setCountryCode('IN');
      }
    };
    detectLocation();
  }, [userLocation]);

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Home', color: 'emerald' },
    { path: '/dashboard/crops', icon: Leaf, label: 'Crops', color: 'emerald' },
    { path: '/dashboard/buyers', icon: Users, label: 'Buyers', color: 'emerald' },
    { path: '/dashboard/chat', icon: MessageCircle, label: 'AI Chat', color: 'emerald' },
    { path: '/dashboard/disease', icon: Bug, label: 'Diagnostics', color: 'orange' },
    { path: '/dashboard/prediction', icon: TrendingUp, label: 'Predictions', color: 'emerald' }
  ];

  const currentPath = location.pathname;

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-[40] flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
            <Leaf className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">FarmQ</span>
        </div>
        <button
          className="p-2.5 bg-slate-50 rounded-xl text-slate-600 border border-slate-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[110] w-[300px] bg-white border-r border-slate-100 transition-all duration-500 ease-in-out transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-8 pb-10">
            <div className="flex items-center justify-between lg:justify-start lg:space-x-4 mb-10">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-100">
                  <Leaf className="text-white w-7 h-7" />
                </div>
                <span className="text-2xl font-black text-slate-800 tracking-tighter">FarmQ</span>
              </div>
              <button className="lg:hidden p-2 text-slate-400" onClick={() => setSidebarOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                const isOrange = item.color === 'orange';

                return (
                  <button
                    key={item.path}
                    className={`w-full flex items-center group space-x-4 px-5 py-4 rounded-[1.25rem] font-bold transition-all duration-300 ${isActive
                      ? (isOrange ? 'bg-orange-500 text-white shadow-2xl shadow-orange-100' : 'bg-emerald-600 text-white shadow-2xl shadow-emerald-100')
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                      }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon size={22} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                    <span className="text-[15px]">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-8 pt-0">
            {/* Location Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-6 group cursor-pointer hover:border-emerald-200 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <MapPin size={18} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Your Location</p>
                  <p className="text-sm font-black text-slate-700 truncate">{getCountryName(countryCode)}</p>
                </div>
              </div>
            </div>

            {/* Logout/User Placeholder Removed */}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[300px] pt-20 lg:pt-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-24 items-center justify-between px-10 bg-white/50 backdrop-blur-sm sticky top-0 z-[30]">
          <div className="flex items-center bg-white border border-slate-100 px-5 py-2.5 rounded-2xl w-96 shadow-sm focus-within:ring-2 ring-emerald-500/10 ring-offset-0 transition-all">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input type="text" placeholder="Global agricultural search..." className="bg-transparent border-none text-sm font-bold text-slate-600 placeholder:text-slate-300 focus:outline-none w-full" />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-black text-slate-700">English</span>
              <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                <img src="https://flagcdn.com/w40/in.png" className="w-full h-full object-cover" alt="IN" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-10 max-w-[1600px] mx-auto animate-fade-in">
          <Routes>
            <Route path="/" element={<DashboardHome countryCode={countryCode} />} />
            <Route path="/crops" element={<CropsPage userLocation={userLocation} />} />
            <Route path="/buyers" element={<BuyersPage userLocation={userLocation} />} />
            <Route path="/chat" element={<ChatPage userLocation={userLocation} />} />
            <Route path="/disease" element={<DiseasePage userLocation={userLocation} />} />
            <Route path="/prediction" element={<PredictionPage userLocation={userLocation} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const DashboardHome = ({ countryCode }) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Global Markets',
      icon: Leaf,
      description: 'Trade produce worldwide',
      path: '/dashboard/crops',
      color: 'emerald'
    },
    {
      title: 'Expert AI',
      icon: MessageCircle,
      description: '24/7 farming advice',
      path: '/dashboard/chat',
      color: 'emerald'
    },
    {
      title: 'Botany DNA',
      icon: Bug,
      description: 'Scan crop pathology',
      path: '/dashboard/disease',
      color: 'orange'
    },
    {
      title: 'Yield Predict',
      icon: TrendingUp,
      description: 'Market trend analytics',
      path: '/dashboard/prediction',
      color: 'emerald'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Dynamic Welcome */}
      <section className="relative h-[300px] sm:h-[400px] rounded-[3rem] overflow-hidden group shadow-3xl">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600"
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
          alt="Farmland"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-transparent"></div>

        <div className="relative h-full flex flex-col justify-center px-10 sm:px-16 space-y-6 max-w-2xl">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">Active Harvesting Season</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tighter">
            Unlock Your <br />
            <span className="text-emerald-400">Farm's Potential.</span>
          </h1>
          <p className="text-emerald-100/70 text-lg font-medium leading-relaxed max-w-md hidden sm:block">
            Analyze soil health, trade with international buyers, and predict next season's yields with professional-grade AI tools.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('/dashboard/chat')}
              className="bg-emerald-600 text-white px-8 py-4 rounded-[2rem] font-black hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-950/40 active:scale-95"
            >
              Consult Assistant
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Board */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Ecosystem Portals</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Jump into specialized modules</p>
            </div>
            <button className="text-emerald-600 font-bold text-sm flex items-center group">
              <span>System Health</span>
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {actions.map((action, idx) => (
              <div
                key={idx}
                onClick={() => navigate(action.path)}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-start space-y-6 cursor-pointer hover:shadow-premium hover:border-emerald-100 transition-all duration-500 group relative overflow-hidden active:scale-95"
              >
                {/* Background Pattern */}
                <div className={`absolute -bottom-10 -right-10 w-40 h-40 ${action.color === 'emerald' ? 'bg-emerald-50' : 'bg-orange-50'} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                <div className={`w-16 h-16 ${action.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'} rounded-[1.75rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-sm relative z-10`}>
                  <action.icon className="w-8 h-8" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-xl font-black text-slate-800 mb-1.5">{action.title}</h3>
                  <p className="text-sm text-slate-400 font-bold leading-relaxed">{action.description}</p>
                </div>

                <div className="pt-2 relative z-10">
                  <div className={`flex items-center space-x-2 text-[11px] font-black uppercase tracking-widest ${action.color === 'emerald' ? 'text-emerald-600' : 'text-orange-600'}`}>
                    <span>Enter Module</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-4 space-y-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Live Intelligence</h2>

          {/* Weather/Market Widget */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={80} />
            </div>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Market Outlook</p>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">Rice (Basmati)</span>
                <span className="font-black text-emerald-400">+12.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">Wheat (Fresh)</span>
                <span className="font-black text-orange-400">-3.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold">Sorghum</span>
                <span className="font-black text-emerald-400">+5.8%</span>
              </div>
            </div>
            <button className="w-full mt-10 py-4 bg-emerald-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-950/40 hover:bg-emerald-500 transition-all">
              Deep Analytics
            </button>
          </div>

          {/* Community Widget */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Users className="text-emerald-600" />
              </div>
              <h4 className="text-lg font-black text-slate-800 leading-tight">Farmer Connect</h4>
            </div>
            <p className="text-sm text-slate-400 font-bold leading-relaxed mb-6">
              Join 1,200+ local agribusinesses discussing regional logistics.
            </p>
            <div className="flex -space-x-3 mb-8">
              {[12, 14, 16, 18].map(n => (
                <div key={n} className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-100 overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${n}`} className="w-full h-full object-cover" alt="farmer" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-emerald-100 border-[3px] border-white flex items-center justify-center text-[10px] font-black text-emerald-600">
                +40
              </div>
            </div>
            <button className="w-full py-4 bg-slate-50 text-slate-600 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all">
              Join Discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;