
import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const Portfolio: React.FC = () => {
  const images = [
    { url: 'https://picsum.photos/800/450?random=1', title: 'Minecraft Survival Banner' },
    { url: 'https://picsum.photos/800/450?random=2', title: 'PUBG Mobile Gameplay Preview' },
    { url: 'https://picsum.photos/800/450?random=3', title: 'CS:GO Pro Team Avatar' },
    { url: 'https://picsum.photos/800/450?random=4', title: 'Roblox Obby Thumbnail' },
    { url: 'https://picsum.photos/800/450?random=5', title: 'Valorant Highlight Banner' },
    { url: 'https://picsum.photos/800/450?random=6', title: 'Standoff 2 Case Opening Preview' },
  ];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-orbitron font-bold text-white">Portfolio</h2>
          <p className="text-slate-400">Biz tomondan tayyorlangan so'nggi dizaynlar</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 text-sm">
          <Lock className="w-4 h-4" />
          Rasmlarni ko'chirish taqiqlangan
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-xl"
            onContextMenu={handleContextMenu}
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <h3 className="text-white font-bold text-lg">{img.title}</h3>
              </div>
            </div>
            
            {/* Security overlays */}
            <div className="absolute inset-0 z-10 pointer-events-auto bg-transparent"></div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-blue-600/10 border border-blue-500/20 rounded-3xl text-center">
        <h3 className="text-2xl font-bold text-white mb-2">O'zingizga mos dizayn xohlaysizmi?</h3>
        <p className="text-blue-200/70 mb-6">Hoziroq buyurtma bering va kanalingizni bezating!</p>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30">
          Xizmatlardan foydalanish
        </button>
      </div>
    </motion.div>
  );
};

export default Portfolio;
