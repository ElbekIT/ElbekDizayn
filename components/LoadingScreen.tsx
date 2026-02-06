
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Send, MousePointer2, Layout } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative mb-12">
        {/* Kid Designer Simulation */}
        <motion.div 
          className="w-32 h-32 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            animate={{ 
              x: [0, 40, -40, 0],
              y: [0, -20, 20, 0]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-0 left-0 text-cyan-400"
          >
            <MousePointer2 className="w-10 h-10" />
          </motion.div>
          
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 flex items-center justify-center text-blue-500"
          >
            <Layout className="w-20 h-20" />
          </motion.div>
          
          <div className="absolute -bottom-4 -right-4 bg-slate-900 p-2 rounded-lg border border-slate-700">
            <span className="text-xs font-bold text-slate-400">Ps</span>
          </div>
        </motion.div>

        {/* Telegram Transfer Animation */}
        <motion.div 
          className="absolute top-1/2 left-full ml-8 flex items-center gap-4"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-transparent"></div>
          <motion.div 
            animate={{ 
              x: [0, 50, 0],
              y: [0, -10, 0]
            }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-sky-400"
          >
            <Send className="w-8 h-8" />
          </motion.div>
        </motion.div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-orbitron font-bold text-white mb-4">Elbek Design Yuklanmoqda...</h2>
        <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>
        <motion.p 
          className="mt-4 text-slate-500 text-sm italic"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Dizaynlar tayyorlanmoqda...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;
