
import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logout, db } from './firebase';
import { ref, onValue } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Gamepad2, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Image as ImageIcon,
  CheckCircle2,
  Phone,
  Send,
  Loader2,
  Home,
  Briefcase
} from 'lucide-react';
import { Order, OrderStatus, UserProfile } from './types';
import LoadingScreen from './components/LoadingScreen';
import Portfolio from './components/Portfolio';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import Navbar from './components/Navbar';

const OWNER_EMAIL = 'qoriyevagavharoy@gmail.com';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<'home' | 'portfolio' | 'order' | 'my-orders' | 'all-orders'>('home');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
        setIsOwner(firebaseUser.email === OWNER_EMAIL);
      } else {
        setUser(null);
        setIsOwner(false);
      }
      
      // Artificial delay for the cool custom loading screen
      setTimeout(() => setLoading(false), 3000);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderArray = Object.values(data) as Order[];
        setOrders(orderArray.sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      alert("Kirishda xatolik yuz berdi.");
    }
  };

  const handleViewChange = (newView: typeof view) => {
    if ((newView === 'order' || newView === 'my-orders') && !user) {
      alert("Davom etish uchun avval ro'yhatdan o'ting!");
      handleLogin();
      return;
    }
    setView(newView);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={user} 
        isOwner={isOwner} 
        onLogin={handleLogin} 
        onLogout={logout} 
        onNavigate={handleViewChange} 
        activeView={view} 
      />

      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="max-w-4xl mx-auto">
                <motion.h1 
                  className="text-5xl md:text-7xl font-orbitron font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
                >
                  Elbek Design
                </motion.h1>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                  YouTube kanalingiz uchun eng zo'r bannerlar, avatar va prevyular. 
                  Sifatli dizayn bilan obunachilaringizni jalb qiling!
                </p>
                
                <div className="flex flex-wrap justify-center gap-6">
                  <button 
                    onClick={() => handleViewChange('order')}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Buyurtma berish
                  </button>
                  <button 
                    onClick={() => handleViewChange('portfolio')}
                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full font-bold text-lg flex items-center gap-2 transition-all border border-slate-700"
                  >
                    <Briefcase className="w-6 h-6" />
                    Portfolio
                  </button>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: <Palette className="w-10 h-10 text-cyan-400" />, title: "Unique Art", desc: "Har bir buyurtma uchun maxsus yondashuv" },
                    { icon: <Gamepad2 className="w-10 h-10 text-blue-400" />, title: "Gaming Focus", desc: "100 dan ortiq o'yinlar uchun dizaynlar" },
                    { icon: <Send className="w-10 h-10 text-purple-400" />, title: "Fast Delivery", desc: "Telegram orqali tezkor topshirish" }
                  ].map((feat, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm"
                    >
                      <div className="mb-4 flex justify-center">{feat.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
                      <p className="text-slate-500">{feat.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'portfolio' && <Portfolio />}
          
          {view === 'order' && user && (
            <OrderForm 
              user={user} 
              onComplete={() => setView('my-orders')} 
            />
          )}

          {view === 'my-orders' && user && (
            <OrderList 
              orders={orders.filter(o => o.userId === user.uid)} 
              title="Mening Buyurtmalarim" 
              isOwner={false}
            />
          )}

          {view === 'all-orders' && isOwner && (
            <OrderList 
              orders={orders} 
              title="Barcha Foydalanuvchilar Buyurtmalari" 
              isOwner={true}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 border-t border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500">© 2024 Elbek Design. Barcha huquqlar himoyalangan.</p>
          <div className="mt-4 flex justify-center gap-4 text-slate-400">
            <span className="hover:text-blue-400 cursor-pointer">Instagram</span>
            <span className="hover:text-blue-400 cursor-pointer">Telegram</span>
            <span className="hover:text-blue-400 cursor-pointer">YouTube</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
