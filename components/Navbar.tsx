
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  User as UserIcon, 
  Palette, 
  Home, 
  Briefcase, 
  ShoppingCart, 
  ListOrdered,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  isOwner: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (view: any) => void;
  activeView: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, isOwner, onLogin, onLogout, onNavigate, activeView }) => {
  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-2 bg-blue-600 rounded-lg group-hover:rotate-12 transition-transform">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <span className="font-orbitron font-bold text-xl tracking-tighter">ELBEK<span className="text-blue-500">DESIGN</span></span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavItem active={activeView === 'home'} onClick={() => onNavigate('home')} icon={<Home className="w-4 h-4" />} label="Asosiy" />
          <NavItem active={activeView === 'portfolio'} onClick={() => onNavigate('portfolio')} icon={<Briefcase className="w-4 h-4" />} label="Portfolio" />
          <NavItem active={activeView === 'order'} onClick={() => onNavigate('order')} icon={<ShoppingCart className="w-4 h-4" />} label="Buyurtma" />
          {user && (
            <NavItem active={activeView === 'my-orders'} onClick={() => onNavigate('my-orders')} icon={<ListOrdered className="w-4 h-4" />} label="Buyurtmalarim" />
          )}
          {isOwner && (
            <NavItem active={activeView === 'all-orders'} onClick={() => onNavigate('all-orders')} icon={<ShieldCheck className="w-4 h-4" />} label="Barcha Buyurtmalar" />
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">{user.displayName}</p>
                {isOwner && <p className="text-[10px] text-yellow-500 uppercase font-black tracking-widest">Owner</p>}
              </div>
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-400 transition-colors"
                title="Chiqish"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <UserIcon className="w-4 h-4" />
              Kirish
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all ${
      active ? 'text-blue-400 bg-blue-500/10 font-bold' : 'text-slate-400 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

export default Navbar;
