
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Percent, 
  Youtube, 
  Phone as PhoneIcon, 
  Send as TelegramIcon,
  Gamepad2,
  AlertCircle,
  // Added Loader2 to fix compilation error on line 385
  Loader2
} from 'lucide-react';
import { UserProfile, GAMES_LIST, DESIGN_PRICES, OrderStatus } from '../types';
import { createOrder } from '../firebase';

interface OrderFormProps {
  user: UserProfile;
  onComplete: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'Erkak' | 'Ayol'>('Erkak');
  const [phone, setPhone] = useState('');
  const [tgHandle, setTgHandle] = useState('@');
  const [designType, setDesignType] = useState<'Banner' | 'Avatar' | 'Preview'>('Preview');
  const [selectedGame, setSelectedGame] = useState('');
  const [message, setMessage] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Phone mask handling
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('+998')) value = '+998';
    
    // Remove non-numeric after +998
    const digits = value.slice(4).replace(/\D/g, '').slice(0, 9);
    
    // Formatting: 123.45.67
    let formatted = '+998';
    if (digits.length > 0) formatted += digits.substring(0, 3);
    if (digits.length >= 4) formatted += '.' + digits.substring(3, 5);
    if (digits.length >= 6) formatted += '.' + digits.substring(5, 7);
    if (digits.length >= 8) formatted += '.' + digits.substring(7, 9);
    
    setPhone(formatted);
  };

  // Telegram Handle handling
  const handleTgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('@')) value = '@' + value.replace('@', '');
    setTgHandle(value);
  };

  // Price Calculation
  const basePrice = DESIGN_PRICES[designType];
  const isPromoValid = promoCode.trim() === 'Artishok_uz';
  const discount = isPromoValid ? 0.25 : 0;
  const totalPrice = basePrice * (1 - discount);

  const nextStep = () => {
    if (step === 1 && (!firstName || phone.length < 13 || tgHandle.length < 2)) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }
    if (step === 2 && !selectedGame) {
      alert("Iltimos, o'yinni tanlang!");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!agreed) {
      alert("Iltimos, shartlarga rozilik bildiring!");
      return;
    }

    setLoading(true);
    const orderData = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      userPhoto: user.photoURL,
      firstName,
      lastName,
      gender,
      phone,
      telegramHandle: tgHandle,
      designType,
      game: selectedGame,
      message,
      totalPrice,
      promoCode,
      status: OrderStatus.PENDING,
      createdAt: Date.now()
    };

    try {
      await createOrder(orderData);
      
      // Send to Telegram Bot
      const botToken = '7264338255:AAGE9iqGXeergNWkF5b7U43NQvGCwC5mi8w';
      const chatId = '7714287797';
      const tgMessage = `
🎨 YANGI BUYURTMA!
👤 Mijoz: ${firstName} ${lastName} (${gender})
📧 Email: ${user.email}
📞 Tel: ${phone}
✈️ Telegram: ${tgHandle}
🛠 Tur: ${designType}
🎮 O'yin: ${selectedGame}
💬 Xabar: ${message || 'Yo\'q'}
💰 Summa: ${totalPrice.toLocaleString()} so'm
🎟 Promo: ${promoCode || 'Yo\'q'}
📅 Sana: ${new Date().toLocaleString()}
      `;
      
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: tgMessage })
      });

      alert("Buyurtmangiz muvaffaqiyatli yuborildi!");
      onComplete();
    } catch (err) {
      alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-500/10 p-3 rounded-2xl">
            <Youtube className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <h2 className="text-3xl font-orbitron font-bold text-white">YOUTUBE KANALGA DIZAYN BUYURTMA BERISH</h2>
        <div className="mt-6 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'w-12 bg-blue-500' : 'w-6 bg-slate-800'}`}></div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Shaxsiy ma'lumotlar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Ism *</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Elbek"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Familiya (ixtiyoriy)</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Design"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Jinsingiz</label>
                <div className="flex gap-4">
                  {['Erkak', 'Ayol'].map(g => (
                    <button 
                      key={g}
                      onClick={() => setGender(g as any)}
                      className={`flex-1 py-3 rounded-xl border transition-all ${gender === g ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Telefon raqam *</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="+998 00.00.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Telegram Nik-name *</label>
                  <div className="relative">
                    <TelegramIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={tgHandle}
                      onChange={handleTgChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">Dizayn va O'yin turi</h3>
              <div>
                <label className="block text-slate-400 text-sm mb-3">Dizayn turi</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(Object.keys(DESIGN_PRICES) as Array<keyof typeof DESIGN_PRICES>).map(type => (
                    <button 
                      key={type}
                      onClick={() => setDesignType(type)}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${designType === type ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                    >
                      <span className="font-bold">{type}</span>
                      <span className="text-xs opacity-70">{DESIGN_PRICES[type].toLocaleString()} so'm</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">O'yinni tanlang *</label>
                <div className="relative">
                  <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select 
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                  >
                    <option value="">O'yinni tanlang...</option>
                    {GAMES_LIST.map(game => <option key={game} value={game}>{game}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Qo'shimcha habar (ixtiyoriy, max 1000)</label>
                <textarea 
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Dizayn haqida fikringiz..."
                />
                <p className="text-right text-[10px] text-slate-600 mt-1">{message.length}/1000</p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">To'lov ma'lumotlari</h3>
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400">Karta raqami:</span>
                  <span className="text-blue-400 font-orbitron font-bold">4073-4200-8456-9577</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">Summa:</span>
                  <span className="text-white font-bold">{basePrice.toLocaleString()} so'm</span>
                </div>
                {isPromoValid && (
                  <div className="flex items-center justify-between mb-2 text-green-500">
                    <span className="text-sm italic">Chegirma (25%):</span>
                    <span className="text-sm font-bold">-{ (basePrice * 0.25).toLocaleString() } so'm</span>
                  </div>
                )}
                <div className="h-px bg-slate-800 my-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">Jami:</span>
                  <span className="text-2xl font-orbitron font-bold text-blue-500">{totalPrice.toLocaleString()} so'm</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Promokodingiz bo'lsa yozing</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="PROMOKOD"
                  />
                  {promoCode === 'Artishok_uz' ? (
                    <div className="flex items-center gap-1 px-4 text-green-500 bg-green-500/10 rounded-xl border border-green-500/20">
                      <Check className="w-4 h-4" />
                      Faol
                    </div>
                  ) : promoCode.length > 0 && (
                    <div className="flex items-center gap-1 px-4 text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
                      <AlertCircle className="w-4 h-4" />
                      Xato
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setPromoCode('')}
                  className="mt-2 text-xs text-slate-500 hover:text-white transition-colors underline"
                >
                  Mening Promokodim Yo'q
                </button>
              </div>

              <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <input 
                  type="checkbox" 
                  id="agreed"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="agreed" className="text-sm text-slate-400 leading-tight cursor-pointer">
                  To'lovni amalga oshirdim va dizayn shartlariga roziman. Yolg'on ma'lumot uchun javobgarlikni bo'ynimga olaman.
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Orqaga
            </button>
          )}
          <button 
            disabled={loading}
            onClick={step === 3 ? handleSubmit : nextStep}
            className="flex-grow px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-not-allowed rounded-2xl text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {step === 3 ? "To'lov qildim (Yuborish)" : "Keyingisi"}
                {step < 3 && <ArrowRight className="w-5 h-5" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
