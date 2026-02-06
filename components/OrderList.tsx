
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, User, Image as ImageIcon } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { updateOrderStatus } from '../firebase';

interface OrderListProps {
  orders: Order[];
  title: string;
  isOwner: boolean;
}

const OrderList: React.FC<OrderListProps> = ({ orders, title, isOwner }) => {
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case OrderStatus.CHECKING: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case OrderStatus.CONFIRMED: return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return <Clock className="w-4 h-4" />;
      case OrderStatus.CHECKING: return <RefreshCw className="w-4 h-4 animate-spin-slow" />;
      case OrderStatus.CONFIRMED: return <CheckCircle2 className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      alert("Xatolik yuz berdi!");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-orbitron font-bold text-white">{title}</h2>
        <div className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-slate-400 text-sm">
          Jami: {orders.length} ta
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl">
          <AlertCircle className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">Hozircha hech qanday buyurtmalar mavjud emas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              whileHover={{ scale: 1.01 }}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
            >
              {/* Background Glow */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-600/5 blur-3xl group-hover:bg-blue-600/10 transition-colors"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-blue-500">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">{order.designType} - {order.game}</h3>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleString('uz-UZ')}
                    </p>
                    {isOwner && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                        <User className="w-3 h-3" />
                        {order.userName} ({order.userEmail})
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-widest">To'lov summasi</p>
                    <p className="text-2xl font-orbitron font-bold text-blue-500">{order.totalPrice.toLocaleString()} so'm</p>
                  </div>
                  
                  {isOwner && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStatusChange(order.id, OrderStatus.CHECKING)}
                        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold transition-all"
                      >
                        Tekshirildi
                      </button>
                      <button 
                        onClick={() => handleStatusChange(order.id, OrderStatus.CONFIRMED)}
                        className="px-4 py-2 bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/30 rounded-lg text-xs font-bold transition-all"
                      >
                        Tastiqlash
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {order.message && (
                <div className="mt-6 p-4 bg-slate-950/50 rounded-xl border border-slate-800 text-sm text-slate-400 italic">
                  "{order.message}"
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OrderList;
