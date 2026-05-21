import React, { useState } from 'react';
import { Car, Property, Expense } from '../types';
import { PlusCircle, Info, FileText, BadgeDollarSign, MapPin, Sparkles, Check } from 'lucide-react';

interface AddTabProps {
  onAddCar: (car: Car) => void;
  onAddProperty: (property: Property) => void;
  onAddExpense: (expense: Expense) => void;
}

export default function AddTab({ onAddCar, onAddProperty, onAddExpense }: AddTabProps) {
  const [activeForm, setActiveForm] = useState<'car' | 'property' | 'expense'>('car');
  const [successMessage, setSuccessMessage] = useState('');

  // Car form states
  const [carModel, setCarModel] = useState('');
  const [carPrice, setCarPrice] = useState('');
  const [carStatus, setCarStatus] = useState<'available' | 'reserved' | 'sold'>('available');

  // Property form states
  const [propType, setPropType] = useState<'apartment' | 'villa' | 'building'>('apartment');
  const [propLocation, setPropLocation] = useState('');
  const [propArea, setPropArea] = useState('');
  const [propPrice, setPropPrice] = useState('');
  const [propStatus, setPropStatus] = useState<'available' | 'sold'>('available');

  // Expense form states
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carModel.trim() || !carPrice || isNaN(Number(carPrice))) {
      alert('الرجاء التأكد من كتابة اسم الطراز وسعر صحيح');
      return;
    }

    const item: Car = {
      id: Date.now().toString(),
      model: carModel,
      price: Number(carPrice),
      status: carStatus,
    };

    onAddCar(item);
    showNotification(`تم بنجاح قيد السيارة "${carModel}" في مخزن الصالة المالي.`);
    setCarModel('');
    setCarPrice('');
    setCarStatus('available');
  };

  const handlePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propLocation.trim() || !propArea || isNaN(Number(propArea)) || !propPrice || isNaN(Number(propPrice))) {
      alert('الرجاء التأكد من تعبئة العنوان والمساحة والقيمة بالشكل الصحيح');
      return;
    }

    const item: Property = {
      id: Date.now().toString(),
      type: propType,
      location: propLocation,
      area: Number(propArea),
      price: Number(propPrice),
      status: propStatus,
    };

    onAddProperty(item);
    showNotification(`تم إدراج الوحدة العقارية بـ "${propLocation}" في المحفظة الاستثمارية.`);
    setPropLocation('');
    setPropArea('');
    setPropPrice('');
    setPropStatus('available');
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || isNaN(Number(expAmount)) || !expDesc.trim()) {
      alert('الرجاء كتابة قيمة مصروف صحيحة مع شرح مفصل للمستلم والسبب');
      return;
    }

    const item: Expense = {
      date: new Date().toISOString().split('T')[0],
      amount: Number(expAmount),
      description: expDesc,
    };

    onAddExpense(item);
    showNotification(`تم تسجيل المصروف بقيمة ${Number(expAmount).toLocaleString()} ج.م وتثبيت الحساب.`);
    setExpAmount('');
    setExpDesc('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-right" dir="rtl">
      
      {/* 1. Header Details */}
      <div className="space-y-1">
        <h3 className="text-xl font-black text-white flex items-center justify-start gap-2.5">
          <PlusCircle className="w-5 h-5 text-amber-500 shrink-0" />
          إدراج أصـل أو مصروف مالي جديد
        </h3>
        <p className="text-xs text-neutral-400">
          املأ الحقول بدقة لتسجيل ومزامنة البيانات في قاعدة بيانات المجموعة الـ Hive والمحلية.
        </p>
      </div>

      {/* 2. Success Alert Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-start gap-2.5 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* 3. Sub-tab Toggles */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-900 border border-neutral-800 rounded-xl p-1.5">
        <button
          onClick={() => { setActiveForm('car'); setSuccessMessage(''); }}
          className={`py-3 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
            activeForm === 'car'
              ? 'bg-gradient-to-l from-red-850 to-red-950 text-white border border-amber-500/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          سيارة جديدة
        </button>
        <button
          onClick={() => { setActiveForm('property'); setSuccessMessage(''); }}
          className={`py-3 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
            activeForm === 'property'
              ? 'bg-gradient-to-l from-red-850 to-red-950 text-white border border-amber-500/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          عقار استثماري
        </button>
        <button
          onClick={() => { setActiveForm('expense'); setSuccessMessage(''); }}
          className={`py-3 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
            activeForm === 'expense'
              ? 'bg-gradient-to-l from-red-850 to-red-950 text-white border border-amber-500/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          مصروف مالي
        </button>
      </div>

      {/* 4. Dynamic Live Forms */}
      <div className="backdrop-blur-md bg-stone-900/30 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        
        {/* CAR FORM */}
        {activeForm === 'car' && (
          <form onSubmit={handleCarSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-400">طراز ومواصفات السيارة المسجلة</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="مثال: مرسيدس G-Class G63 AMG موديل 2024"
                  className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl pr-4 pl-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-400">القيمة التقديرية (بالجنيه المصري)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={carPrice}
                  onChange={(e) => setCarPrice(e.target.value.replace(/\D/g, ''))}
                  placeholder="مثال: 18500000"
                  className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl pr-4 pl-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-500/25 font-mono"
                />
              </div>
              <span className="text-[10px] text-neutral-500">اكتب الأرقام بدون فواصل لإتمام العملية بأمان</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-400">حالة التوافر فور الإدراج</label>
              <select
                value={carStatus}
                onChange={(e) => setCarStatus(e.target.value as any)}
                className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="available">متاحة ومفتوحة للبيع</option>
                <option value="reserved">محجوزة مسبقاً</option>
                <option value="sold">مباعة (سجل مالي قديم)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 text-white font-extrabold py-3 px-4 rounded-xl border border-amber-500/25 shadow-lg shadow-red-950/20 hover:shadow-red-950/40 cursor-pointer text-sm leading-6 transition-all"
            >
              قيد وحفظ السيارة بالمعرض
            </button>
          </form>
        )}

        {/* PROPERTY FORM */}
        {activeForm === 'property' && (
          <form onSubmit={handlePropertySubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-400">تصنيف الوحدة العقارية</label>
                <select
                  value={propType}
                  onChange={(e) => setPropType(e.target.value as any)}
                  className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-pointer"
                >
                  <option value="apartment">شقة راقية</option>
                  <option value="villa">فيلا مستقلة فاخرة</option>
                  <option value="building">برج / مبنى استثماري</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-400">المساحة الإجمالية (م²)</label>
                <input
                  type="text"
                  required
                  value={propArea}
                  onChange={(e) => setPropArea(e.target.value.replace(/\D/g, ''))}
                  placeholder="مثال: 450"
                  className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl pr-4 pl-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-500/25 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-400">العنوان والموقع التفصيلي</label>
              <input
                type="text"
                required
                value={propLocation}
                onChange={(e) => setPropLocation(e.target.value)}
                placeholder="مثال: التجمع الخامس، النرجس فيلاز، رقم قيد الحساب"
                className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl pr-4 pl-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-400">القيمة التقديرية للاستثمار (ج.م)</label>
              <input
                type="text"
                required
                value={propPrice}
                onChange={(e) => setPropPrice(e.target.value.replace(/\D/g, ''))}
                placeholder="مثال: 25000000"
                className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl pr-4 pl-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-500/25 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-400">حالة التعاقد فور الإدراج</label>
              <select
                value={propStatus}
                onChange={(e) => setPropStatus(e.target.value as any)}
                className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="available">متاحة وحرة للتعاقد</option>
                <option value="sold">تم بيعها بالكامل ومغلقة</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 text-white font-extrabold py-3 px-4 rounded-xl border border-amber-500/25 shadow-lg shadow-red-950/20 hover:shadow-red-950/40 cursor-pointer text-sm leading-6 transition-all"
            >
              إدراج الوحدة في المحفظة العقارية
            </button>
          </form>
        )}

        {/* EXPENSE FORM */}
        {activeForm === 'expense' && (
          <form onSubmit={handleExpenseSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-400">قيمة المصروف الإداري (ج.م)</label>
              <input
                type="text"
                required
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="مثال: 12500"
                className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl pr-4 pl-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-500/25 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-400">شرح وتفاصيل جهة الصرف والسبب</label>
              <textarea
                required
                rows={4}
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
                placeholder="أدخل وصفاً تفصيلياً للفواتير أو الرواتب أو حملة الدعاية المدفوعة والسبب..."
                className="w-full text-right bg-black border border-neutral-800 focus:border-amber-500/80 rounded-xl pr-4 pl-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 text-white font-extrabold py-3 px-4 rounded-xl border border-amber-500/25 shadow-lg shadow-red-950/20 hover:shadow-red-950/40 cursor-pointer text-sm leading-6 transition-all"
            >
              قيد المصروف وتحديث الخزينة
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
